import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import ChatWindow from "@/components/ChatWindow";

const Chai = () => {
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
          <h1 className="text-3xl font-bold text-primary">Neel&apos;s LLM Rep</h1>
          <p className="text-sm text-muted-foreground">
            A dedicated space for recruiters to ask questions to and about Neel.
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
            title="ai rep"
            initialMessage="Hi — I'm Neel's AI representative. Ask me anything about his experience, impact, or fit for your team and I'll share the most relevant details."
            endpoint="https://neel-chatbot-backend-production.up.railway.app/recruiter/stream"
            sessionPrefix="ai-rep"
            placeholder="Ask about Neel's background, impact, or availability..."
            sendLabel="Ask"
            streamingDelayMs={15}
          />
        </div>
      </main>
    </div>
  );
};

export default Chai;
