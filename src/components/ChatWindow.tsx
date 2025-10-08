import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatWindow = ({ onClose, onMinimize, onMaximize }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey, I'm Chai ☕ — your chat buddy living on Neel's site. I vibe with Dostoevsky, Kafka, Nietzsche, Freud, and Marx — Neel's favorites. We can talk about anything… even Neel himself, if you're curious.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToAPI = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://neel-chatbot-backend-production.up.railway.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId.current
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message to API:', error);
      return "Sorry, I'm having trouble connecting to the server. Please check your internet connection.";
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      const newMessage: Message = {
        id: Date.now(),
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInput("");
      setIsLoading(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
      }

      try {
        const aiResponse = await sendMessageToAPI(userMessage);
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-terminal-yellow hover:bg-yellow-500 transition-colors cursor-pointer"
              title="Minimize"
            />
            <button
              onClick={onMaximize}
              className="w-3 h-3 rounded-full bg-terminal-green hover:bg-green-500 transition-colors cursor-pointer"
              title="Maximize"
            />
          </div>
          <div className="text-sm text-muted-foreground ml-4 font-medium">
            chai
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
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
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
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
            onClick={handleSend} 
            className="px-4 py-2 h-10 flex-shrink-0"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
