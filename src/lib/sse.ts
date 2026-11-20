/** Parse fetch SSE without assuming transport chunks align with events or UTF-8 characters. */
export async function readSSE<T extends { done?: boolean }>(response: Response, onEvent: (event: T) => void, signal?: AbortSignal): Promise<void> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === "string" ? body.detail : `Chat request failed (${response.status}). Please retry.`);
  }
  if (!response.body) throw new Error("The server did not return a stream.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;
  const parse = (frame: string) => {
    const data = frame.split(/\r?\n/).filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
    if (!data) return;
    const event = JSON.parse(data) as T;
    onEvent(event);
    if (event.done) completed = true;
  };
  try {
    while (!completed) {
      signal?.throwIfAborted();
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let separator: RegExpExecArray | null;
      while ((separator = /\r?\n\r?\n/.exec(buffer))) {
        parse(buffer.slice(0, separator.index));
        buffer = buffer.slice(separator.index + separator[0].length);
        if (completed) break;
      }
      if (done) {
        if (buffer.trim() && !completed) parse(buffer);
        break;
      }
    }
    if (!completed) throw new Error("The response was interrupted. Please retry your question.");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
