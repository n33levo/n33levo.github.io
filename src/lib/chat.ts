export const API_BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8000" : "https://chatbot-backend-production-55e2.up.railway.app")).replace(/\/$/, "");
export const chatEndpoint = (persona: "chai" | "recruiter") => `${API_BASE}/${persona === "chai" ? "chat" : "recruiter"}/stream`;

export interface Source { title: string; url: string }
export interface Proposal {
  id: string; attendee_name: string; attendee_email: string;
  start_time: string; end_time: string; meeting_type: string; timezone: string;
}
export interface ChatEvent {
  type?: string; content?: string; status?: string; error?: string; done?: boolean;
  sources?: Source[]; proposal?: Proposal;
}

export function safeUrl(url: string): string | undefined {
  try { const value = new URL(url); return ["https:", "http:"].includes(value.protocol) ? value.href : undefined; }
  catch { return undefined; }
}
