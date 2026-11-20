import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { API_BASE, chatEndpoint, safeUrl, type ChatEvent, type Proposal, type Source } from "@/lib/chat";
import { readSSE } from "@/lib/sse";

interface Message {
  id: string; text: string; sender: "user" | "ai";
  error?: string; sources?: Source[]; proposal?: Proposal;
  booking?: "pending" | "confirming" | "booked"; bookingError?: string; meetingUrl?: string;
}
interface ChatWindowProps {
  onClose?: () => void; onMinimize?: () => void; onMaximize?: () => void;
  title?: string; initialMessage?: string; endpoint?: string; sessionPrefix?: string;
  placeholder?: string; sendLabel?: string;
}

export default function ChatWindow({ onClose, onMinimize, onMaximize, title = "chai",
  initialMessage = "Hi, I'm Chai, an AI companion on Neel's site. We can talk about ideas, his work, or whatever you're curious about.",
  endpoint = chatEndpoint("chai"), sessionPrefix = "chai", placeholder = "Type a message…", sendLabel = "Send",
}: ChatWindowProps) {
  const greeting = (): Message => ({ id: crypto.randomUUID(), text: initialMessage, sender: "ai" });
  const storageKey = `portfolio-chat-v3:${sessionPrefix}`;
  const [saved] = useState(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (value && typeof value.sessionId === "string" && Array.isArray(value.messages)) return value as { sessionId: string; messages: Message[] };
    } catch { /* Storage can be unavailable in private browsers. */ }
    return { sessionId: crypto.randomUUID(), messages: [greeting()] };
  });
  const sessionId = useRef(saved.sessionId);
  const [messages, setMessages] = useState<Message[]>(saved.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Thinking…");
  const controller = useRef<AbortController | null>(null);
  const pending = useRef(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => {
    if (isLoading) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify({ sessionId: sessionId.current, messages: messages.slice(-60) })); }
    catch { /* Chat still works if storage is full or disabled. */ }
  }, [messages, isLoading, storageKey]);

  const update = (id: string, patch: Partial<Message>) => setMessages(current => current.map(m => m.id === id ? { ...m, ...patch } : m));

  async function send() {
    const text = input.trim();
    if (!text || pending.current) return;
    pending.current = true;
    const id = crypto.randomUUID();
    setMessages(current => [...current, { id: crypto.randomUUID(), text, sender: "user" }, { id, text: "", sender: "ai" }]);
    setInput(""); setIsLoading(true); setStatus("Thinking…");
    const abort = new AbortController(); controller.current = abort;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; abort.abort(); }, 95000);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId.current }), signal: abort.signal });
      await readSSE<ChatEvent>(response, event => {
        if (event.error) throw new Error(event.error);
        if (event.content) setMessages(current => current.map(m => m.id === id ? { ...m, text: m.text + event.content } : m));
        if (event.status) setStatus(event.status);
        if (event.sources) update(id, { sources: event.sources });
        if (event.proposal) update(id, { proposal: event.proposal, booking: "pending" });
      }, abort.signal);
    } catch (error) {
      const reason = abort.signal.aborted ? (timedOut ? "The response timed out. Please retry." : "Response stopped.") : error instanceof Error ? error.message : "Couldn't connect to the chat server. Please retry.";
      update(id, { error: reason });
      if (!abort.signal.aborted || timedOut) setInput(current => current || text);
    } finally {
      clearTimeout(timeout); controller.current = null; pending.current = false; setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  async function confirm(message: Message) {
    if (!message.proposal || pending.current) return;
    pending.current = true;
    setIsLoading(true); setStatus("Confirming meeting…");
    update(message.id, { booking: "confirming", bookingError: undefined });
    const abort = new AbortController(); controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 35000);
    try {
      const response = await fetch(`${API_BASE}/actions/confirm`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: message.proposal.id, session_id: sessionId.current }), signal: abort.signal });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.detail || "Confirmation failed. Retry this proposal.");
      update(message.id, { booking: "booked", meetingUrl: safeUrl(data.meet_link || data.html_link) });
    } catch (error) {
      update(message.id, { booking: "pending", bookingError: error instanceof Error && error.name !== "AbortError" ? error.message : "Confirmation is unverified. Retry this proposal; duplicate invites are prevented." });
    } finally {
      clearTimeout(timeout); pending.current = false; controller.current = null; setIsLoading(false);
    }
  }

  return <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
    <div className="bg-muted px-4 py-2 flex items-center justify-between gap-2 border-b border-border">
      <div className="flex items-center gap-2">
        {[[onClose, "Close", "bg-destructive"], [onMinimize, "Minimize", "bg-terminal-yellow"], [onMaximize, "Maximize", "bg-terminal-green"]].map(([handler, label, color]) =>
          <button key={label as string} onClick={handler as (() => void) | undefined} aria-label={label as string} title={label as string} className={`w-3 h-3 rounded-full ${color}`} />)}
        <span className="text-sm text-muted-foreground ml-2">{title}</span>
      </div>
      <button disabled={isLoading} className="text-sm underline disabled:opacity-50" onClick={() => { sessionId.current = crypto.randomUUID(); setMessages([greeting()]); setInput(""); }}>New chat</button>
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4" role="log" aria-label="Conversation">
      {messages.map(message => <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[92%] min-w-0 px-3 py-2 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
          {message.sender === "user" ? <p className="text-base whitespace-pre-wrap break-words">{message.text}</p> :
            <div className="prose prose-sm dark:prose-invert max-w-none text-base break-words prose-p:my-2 prose-headings:my-3 prose-a:text-primary prose-pre:overflow-x-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
                a: ({ href, children }) => <a href={href ? safeUrl(href) : undefined} target="_blank" rel="noopener noreferrer">{children}</a>,
                img: ({ alt }) => <span>{alt}</span>,
                table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
              }}>{message.text}</ReactMarkdown>
            </div>}
          {message.error && <p role="alert" className="text-sm mt-2 text-destructive">{message.error}</p>}
          {!!message.sources?.length && <div className="mt-3 flex flex-wrap gap-2" aria-label="Sources">{message.sources.filter(s => safeUrl(s.url)).map(source => <a key={source.url} href={safeUrl(source.url)} target="_blank" rel="noopener noreferrer" className="text-sm underline text-primary">{source.title}</a>)}</div>}
          {message.proposal && <div className="mt-3 border border-border p-3 rounded space-y-2">
            <p className="font-semibold">{message.proposal.meeting_type}</p>
            <p>{message.proposal.attendee_name} · {message.proposal.attendee_email}</p>
            <p>{new Date(message.proposal.start_time).toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" })} (Toronto) · 15 minutes</p>
            {message.booking === "booked" ? <p>Meeting booked. {message.meetingUrl && <a href={message.meetingUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">Open meeting</a>}</p> : <>
              <p className="text-sm text-muted-foreground">Confirming sends a calendar invitation to this email.</p>
              <Button disabled={isLoading} onClick={() => confirm(message)}>{message.booking === "confirming" ? "Confirming…" : "Confirm meeting"}</Button>
            </>}
            {message.bookingError && <p role="alert" className="text-sm text-destructive">{message.bookingError}</p>}
          </div>}
        </div>
      </div>)}
      {isLoading && <p role="status" className="text-sm text-muted-foreground">{status}</p>}
      <div ref={messagesEnd} />
    </div>
    <form className="p-4 border-t border-border flex gap-2 items-end" onSubmit={e => { e.preventDefault(); void send(); }}>
      <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} maxLength={6000} aria-label="Message" rows={2}
        placeholder={placeholder} className="flex-1 min-w-0 px-3 py-2 border border-border rounded-md bg-background text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} />
      {isLoading ? <Button type="button" variant="outline" onClick={() => controller.current?.abort()}>Stop</Button> : <Button type="submit" disabled={!input.trim()}>{sendLabel}</Button>}
    </form>
  </div>;
}
