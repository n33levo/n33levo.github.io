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
        "transition-all duration-300 mx-auto w-full",
        isMaximized ? "max-w-5xl h-[min(90vh,850px)]" : "max-w-3xl h-[min(80vh,720px)]",
        isMinimized && "minimized-window"
      ),
    [isMaximized, isMinimized]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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

      <main className="flex-1 px-4 py-6">
        <div className={chatWrapperClass} data-chat-window>
          <ChatWindow
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
          />
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-border text-center text-xs text-muted-foreground bg-card/50">
        Tip: Minimize to keep Chai handy while you browse other sections.
      </footer>
    </div>
  );
};

export default Chai;
