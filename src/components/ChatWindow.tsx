import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE, chatEndpoint, safeUrl, type ChatEvent, type Proposal, type Source } from "@/lib/chat";
import { readSSE } from "@/lib/sse";

interface Message {
  id: string; text: string; sender: "user" | "ai";
  timestamp?: string; isStreaming?: boolean;
  error?: string; sources?: Source[]; proposal?: Proposal;
  booking?: "pending" | "confirming" | "booked"; bookingError?: string; meetingUrl?: string;
}
interface ChatWindowProps {
  onClose?: () => void; onMinimize?: () => void; onMaximize?: () => void;
  title?: string; initialMessage?: string; endpoint?: string; sessionPrefix?: string;
  placeholder?: string; sendLabel?: string; streamingDelayMs?: number;
}

export default function ChatWindow({ onClose, onMinimize, onMaximize, title = "chai",
  initialMessage = "Hey, I'm Chai ☕ — your chat buddy living on Neel's site. I vibe with Dostoevsky, Kafka, Nietzsche, Freud, and Marx — Neel's favorites. We can talk about anything.",
  endpoint = chatEndpoint("chai"), sessionPrefix = "session", placeholder = "Type a message...", sendLabel = "Send", streamingDelayMs = 20,
}: ChatWindowProps) {
  const greeting = (): Message => ({ id: crypto.randomUUID(), text: initialMessage, sender: "ai", timestamp: new Date().toISOString() });
  const storageKey = `portfolio-chat-restored:${sessionPrefix}`;
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
  const [status, setStatus] = useState("Streaming...");
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
    setMessages(current => [...current, { id: crypto.randomUUID(), text, sender: "user", timestamp: new Date().toISOString() }, { id, text: "", sender: "ai", isStreaming: true }]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "40px";
    setIsLoading(true); setStatus("Streaming...");
    const abort = new AbortController(); controller.current = abort;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; abort.abort(); }, 95000);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId.current }), signal: abort.signal });
      await readSSE<ChatEvent>(response, async event => {
        if (event.error) throw new Error(event.error);
        if (event.content) {
          setStatus("Streaming...");
          setMessages(current => current.map(m => m.id === id ? { ...m, text: m.text + event.content } : m));
          // Preserve the original Chai / AI Rep reveal cadence without changing provider streaming.
          await new Promise<void>(resolve => {
            const finish = () => { clearTimeout(timer); abort.signal.removeEventListener("abort", finish); resolve(); };
            const timer = setTimeout(finish, streamingDelayMs);
            abort.signal.addEventListener("abort", finish, { once: true });
          });
        }
        if (event.status) setStatus(event.status);
        if (event.sources) update(id, { sources: event.sources });
        if (event.proposal) update(id, { proposal: event.proposal, booking: "pending" });
      }, abort.signal);
    } catch (error) {
      const reason = abort.signal.aborted ? (timedOut ? "The response timed out. Please retry." : "Response stopped.") : error instanceof Error ? error.message : "Couldn't connect to the chat server. Please retry.";
      update(id, { error: reason });
    } finally {
      update(id, { timestamp: new Date().toISOString(), isStreaming: false });
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

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Window Header with Functional Buttons */}
      <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-destructive hover:bg-red-600 transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-terminal-yellow hover:bg-yellow-500 transition-colors cursor-pointer"
              title="Minimize"
              aria-label="Minimize"
            />
            <button
              onClick={onMaximize}
              className="w-3 h-3 rounded-full bg-terminal-green hover:bg-green-500 transition-colors cursor-pointer"
              title="Maximize"
              aria-label="Maximize"
            />
          </div>
          <div className="text-sm text-muted-foreground ml-4 font-medium">
            {title}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3" role="log" aria-label="Conversation">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.text}</div>
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
              {message.timestamp && (
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground"></div>
                <span className="text-sm">{status}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message"
            maxLength={6000}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }}
            placeholder={placeholder}
            rows={1}
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
            style={{
              height: '40px',
              minHeight: '40px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '40px';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <Button
            onClick={send}
            className="px-4 py-2 h-10 flex-shrink-0"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? "..." : sendLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
