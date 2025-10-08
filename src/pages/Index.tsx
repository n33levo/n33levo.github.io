import { useState, useRef, useEffect } from "react";
import TerminalWindow from "@/components/TerminalWindow";
import CommandMenu from "@/components/CommandMenu";
import ChatWindow from "@/components/ChatWindow";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [commandToExecute, setCommandToExecute] = useState<string>("");
  
  // Store previous state for restoration
  const [previousState, setPreviousState] = useState<{
    showChat: boolean;
    isMinimized: boolean;
    isTerminalMinimized: boolean;
  } | null>(null);

  // Play bounce sound effect
  const playBounceSound = () => {
    // Create a simple bounce sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleCommandSelect = (command: string) => {
    // Set the command to execute, which will trigger the terminal to run it
    setCommandToExecute(command);
  };

  const handleCommandExecute = (command: string) => {
    if (command === "chat") {
      setShowChat(true);
    }
  };

  const handleChatClose = () => {
    // Add closing animation
    const chatWindow = document.querySelector('[data-chat-window]');
    if (chatWindow) {
      chatWindow.classList.add('window-slide-out');
      setTimeout(() => {
        setShowChat(false);
        setIsMinimized(false);
        setIsMaximized(false);
      }, 300);
    } else {
      setShowChat(false);
      setIsMinimized(false);
      setIsMaximized(false);
    }
  };

  const handleChatMinimize = () => {
    if (!isMinimized) {
      // Start minimize animation
      const chatWindow = document.querySelector('[data-chat-window]');
      if (chatWindow) {
        chatWindow.classList.add('minimize-animation-chat');
        // Set minimized state immediately but keep window visible during animation
        setIsMinimized(true);
        // Clean up animation class after animation completes
        setTimeout(() => {
          chatWindow.classList.remove('minimize-animation-chat');
        }, 400);
      } else {
        setIsMinimized(true);
      }
    } else {
      // Restore from minimized state
      const chatWindow = document.querySelector('[data-chat-window]');
      if (chatWindow) {
        chatWindow.classList.add('restore-animation-chat');
        // Restore state immediately but keep animation visible
        setIsMinimized(false);
        // Clean up animation class after animation completes
        setTimeout(() => {
          chatWindow.classList.remove('restore-animation-chat');
        }, 400);
      } else {
        setIsMinimized(false);
      }
    }
  };

  const handleChatMaximize = () => {
    if (!isMaximized) {
      // Store current state before maximizing
      setPreviousState({
        showChat,
        isMinimized,
        isTerminalMinimized
      });
      // Start maximization animation
      const chatWindow = document.querySelector('[data-chat-window]');
      if (chatWindow) {
        chatWindow.classList.add('maximize-animation');
        // Set maximized state immediately
        setIsMaximized(true);
        // Clean up animation class after animation completes
        setTimeout(() => {
          chatWindow.classList.remove('maximize-animation');
        }, 600);
      } else {
        setIsMaximized(true);
      }
    } else {
      // Start restore animation
      const chatWindow = document.querySelector('[data-chat-window]');
      if (chatWindow) {
        chatWindow.classList.add('restore-maximize-animation');
        // Set maximized state immediately
        setIsMaximized(false);
        // Clean up animation class after animation completes
        setTimeout(() => {
          chatWindow.classList.remove('restore-maximize-animation');
          // Restore previous state
          if (previousState) {
            setShowChat(previousState.showChat);
            setIsMinimized(previousState.isMinimized);
            setIsTerminalMinimized(previousState.isTerminalMinimized);
            setPreviousState(null);
          }
        }, 600);
      } else {
        setIsMaximized(false);
        // Restore previous state
        if (previousState) {
          setShowChat(previousState.showChat);
          setIsMinimized(previousState.isMinimized);
          setIsTerminalMinimized(previousState.isTerminalMinimized);
          setPreviousState(null);
        }
      }
    }
  };

  // Terminal window button handlers
  const handleTerminalClose = () => {
    playBounceSound();
  };

  const handleTerminalMinimize = () => {
    if (!isTerminalMinimized) {
      // Start minimize animation
      const terminalWindow = document.querySelector('[data-terminal-window]');
      if (terminalWindow) {
        // Use different animation class based on whether chat is open
        const animationClass = showChat ? 'minimize-animation-terminal-with-chat' : 'minimize-animation-terminal-without-chat';
        terminalWindow.classList.add(animationClass);
        // Set minimized state immediately but keep window visible during animation
        setIsTerminalMinimized(true);
        // Clean up animation class after animation completes
        setTimeout(() => {
          terminalWindow.classList.remove(animationClass);
        }, 400);
      } else {
        setIsTerminalMinimized(true);
      }
    } else {
      // Restore from minimized state
      const terminalWindow = document.querySelector('[data-terminal-window]');
      if (terminalWindow) {
        const animationClass = showChat ? 'restore-animation-terminal-with-chat' : 'restore-animation-terminal-without-chat';
        terminalWindow.classList.add(animationClass);
        // Restore state immediately but keep animation visible
        setIsTerminalMinimized(false);
        // Clean up animation class after animation completes
        setTimeout(() => {
          terminalWindow.classList.remove(animationClass);
        }, 400);
      } else {
        setIsTerminalMinimized(false);
      }
    }
  };

  const handleTerminalMaximize = () => {
    if (!isTerminalMaximized) {
      // Store current state before maximizing
      setPreviousState({
        showChat,
        isMinimized,
        isTerminalMinimized
      });
      // Start maximization animation
      const terminalWindow = document.querySelector('[data-terminal-window]');
      if (terminalWindow) {
        terminalWindow.classList.add('maximize-animation-terminal');
        // Set maximized state immediately
        setIsTerminalMaximized(true);
        // Clean up animation class after animation completes
        setTimeout(() => {
          terminalWindow.classList.remove('maximize-animation-terminal');
        }, 600);
      } else {
        setIsTerminalMaximized(true);
      }
    } else {
      // Start restore animation
      const terminalWindow = document.querySelector('[data-terminal-window]');
      if (terminalWindow) {
        terminalWindow.classList.add('restore-maximize-animation-terminal');
        // Set maximized state immediately
        setIsTerminalMaximized(false);
        // Clean up animation class after animation completes
        setTimeout(() => {
          terminalWindow.classList.remove('restore-maximize-animation-terminal');
          // Restore previous state
          if (previousState) {
            setShowChat(previousState.showChat);
            setIsMinimized(previousState.isMinimized);
            setIsTerminalMinimized(previousState.isTerminalMinimized);
            setPreviousState(null);
          }
        }, 600);
      } else {
        setIsTerminalMaximized(false);
        // Restore previous state
        if (previousState) {
          setShowChat(previousState.showChat);
          setIsMinimized(previousState.isMinimized);
          setIsTerminalMinimized(previousState.isTerminalMinimized);
          setPreviousState(null);
        }
      }
    }
  };

  // Command window button handlers
  const handleCommandClose = () => {
    playBounceSound();
  };

  const handleCommandMinimize = () => {
    playBounceSound();
  };

  const handleCommandMaximize = () => {
    playBounceSound();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center relative">
        <div className="absolute top-0 right-0 z-50">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2 typing-animation cursor-blink">
          Neel's Terminal
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Sohail (Neel) Sarkar • Applied Math & CS @ U of T • Applied AI @ Sigma Squared
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
        <div className={`grid gap-6 h-full smooth-transition ${
          isMaximized || isTerminalMaximized 
            ? "grid-cols-1" 
            : showChat 
              ? "grid-cols-1 lg:grid-cols-4" 
              : "grid-cols-1 lg:grid-cols-3"
        }`}>
          {/* Command Menu */}
          <div className={`h-full min-h-[500px] smooth-transition ${
            isMaximized || isTerminalMaximized ? "hidden" : "block"
          }`}>
            <CommandMenu 
              onCommandSelect={handleCommandSelect}
              onClose={handleCommandClose}
              onMinimize={handleCommandMinimize}
              onMaximize={handleCommandMaximize}
            />
          </div>

          {/* Terminal Window */}
          <div 
            data-terminal-window
            className={`h-full min-h-[500px] smooth-transition ${
              isTerminalMaximized 
                ? "lg:col-span-1" 
                : isMaximized
                  ? "hidden"
                  : showChat 
                    ? "lg:col-span-2" 
                    : "lg:col-span-2"
            } ${isTerminalMinimized ? "minimized-window" : ""}`}
          >
            <TerminalWindow 
              onCommandExecute={handleCommandExecute} 
              commandToExecute={commandToExecute}
              onCommandExecuted={() => setCommandToExecute("")}
              onClose={handleTerminalClose}
              onMinimize={handleTerminalMinimize}
              onMaximize={handleTerminalMaximize}
            />
          </div>

          {/* Chat Window - New functional window */}
          {showChat && (
            <div 
              data-chat-window
              className={`h-full min-h-[500px] smooth-transition ${
                isMaximized 
                  ? "lg:col-span-1" 
                  : isTerminalMaximized
                    ? "hidden"
                    : "lg:col-span-1"
              } ${isMinimized ? "minimized-window" : ""}`}
            >
              <ChatWindow
                onClose={handleChatClose}
                onMinimize={handleChatMinimize}
                onMaximize={handleChatMaximize}
              />
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>Built with <span role="img" aria-label="love">❤️</span> by Neel</p>
      </footer>
    </div>
  );
};

export default Index;
