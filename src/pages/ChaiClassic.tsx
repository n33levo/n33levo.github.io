import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import ChatWindow from "@/components/ChatWindow";

const CHAI_GREETING =
  "Hey, I'm Chai ☕ — your chat buddy living on Neel's site. I vibe with Dostoevsky, Kafka, Nietzsche, Freud, and Marx — Neel's favorites. We can talk about anything… even Neel himself, if you're curious.";

const ChaiClassic = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      const next = !prev;
      if (next) {
        setIsMaximized(false);
      }
      return next;
    });
  }, []);

  const handleMaximize = useCallback(() => {
    setIsMaximized((prev) => {
      const next = !prev;
      if (next) {
        setIsMinimized(false);
      }
      return next;
    });
  }, []);

  const chatWrapperClass = useMemo(
    () =>
      clsx(
        "transition-all duration-300 mx-auto w-full max-w-4xl",
        isMaximized ? "max-w-5xl" : "max-w-4xl",
        isMinimized && "minimized-window"
      ),
    [isMaximized, isMinimized]
  );

  const chatWrapperStyle = useMemo(() => {
    if (isMinimized) {
      return undefined;
    }

    return {
      height: isMaximized ? "min(90vh, 840px)" : "min(calc(100vh - 220px), 720px)",
      maxHeight: isMaximized ? "840px" : "720px",
    };
  }, [isMaximized, isMinimized]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <header className="px-5 py-6 border-b border-border bg-card/50">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back
        </button>
        <div className="mt-4 space-y-1 text-center">
          <h1 className="text-3xl font-bold text-primary">Chai Chat</h1>
          <p className="text-sm text-muted-foreground">
            A dedicated space for Neel&apos;s conversational agent. Stay as long as you like.
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 flex items-center justify-center overflow-hidden">
        <div
          className={chatWrapperClass}
          data-chat-window
          style={chatWrapperStyle}
        >
          <ChatWindow
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            title="chai"
            initialMessage={CHAI_GREETING}
            endpoint="https://neel-chatbot-backend-production.up.railway.app/chat/stream"
            sessionPrefix="chai"
            placeholder="Type a message..."
            sendLabel="Send"
            streamingDelayMs={20}
          />
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
        Tip: Minimize to keep Chai handy while you browse other sections.
      </footer>
    </div>
  );
};

export default ChaiClassic;

