import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CommandOutput {
  command: string;
  output: string | JSX.Element;
  timestamp: Date;
}

interface TerminalWindowProps {
  onCommandExecute?: (command: string) => void;
  commandToExecute?: string;
  onCommandExecuted?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const directoryStructure = {
  "about.txt": "file",
  "projects/": {
    _items: 4,
    "project1.md": "file",
    "project2.md": "file", 
    "project3.md": "file",
    "project4.md": "file",
  },
  "research/": {
    _items: 2,
    "paper1.pdf": "file",
    "paper2.pdf": "file",
  },
  "achievements.txt": "file",
  "experience.txt": "file",
  "education.txt": "file",
  "skills.txt": "file",
  "certificates.txt": "file",
  "socials/": {
    _items: 3,
    "github": "link",
    "linkedin": "link",
    "email": "link",
  },
};

const TerminalWindow = ({ onCommandExecute, commandToExecute, onCommandExecuted, onClose, onMinimize, onMaximize }: TerminalWindowProps) => {
  const [input, setInput] = useState("");
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    setHistory([
      {
        command: "",
        output: (
          <div className="space-y-2">
            <div className="text-primary text-2xl font-bold mb-2">Welcome to n33l's Portfolio</div>
            <div className="text-muted-foreground">Type 'help' to see available commands</div>
            <div className="text-muted-foreground">Or click commands on the left ←</div>
          </div>
        ),
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Handle command execution from parent component
  useEffect(() => {
    if (commandToExecute) {
      executeCommand(commandToExecute);
      onCommandExecuted?.();
    }
  }, [commandToExecute, onCommandExecuted]);

  const renderDirectory = (dir: any, path: string, isLast: boolean[] = []) => {
    const entries = Object.keys(dir).filter(key => key !== '_items');
    return entries.map((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const currentPath = `${path}/${entry}`;
      const isDirectory = typeof dir[entry] === 'object';
      const isExpanded = expandedDirs.has(currentPath);
      const prefix = isLast.map(l => (l ? '    ' : '│   ')).join('') + (isLastEntry ? '└── ' : '├── ');

      const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedDirs(prev => {
          const newSet = new Set(prev);
          if (newSet.has(currentPath)) {
            newSet.delete(currentPath);
          } else {
            newSet.add(currentPath);
          }
          return newSet;
        });
      };

      return (
        <div key={currentPath}>
          <div className="flex items-center">
            <span className="text-terminal-cyan">{prefix}</span>
            {isDirectory ? (
              <span
                className="ml-1 text-terminal-cyan cursor-pointer hover:underline"
                onClick={toggleExpand}
              >
                {entry}
              </span>
            ) : (
              <span className="ml-1">{entry}</span>
            )}
            {isDirectory && (
              <span className="ml-2 text-muted-foreground">({dir[entry]._items} items)</span>
            )}
          </div>
          {isDirectory && isExpanded && (
            <div className="ml-2">
              {renderDirectory(dir[entry], currentPath, [...isLast, isLastEntry])}
            </div>
          )}
        </div>
      );
    });
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const lowerCmd = trimmedCmd.toLowerCase();
    let output: string | JSX.Element = "";

    // Handle full commands
    if (trimmedCmd === "open -a chaichat") {
      output = (
        <div className="space-y-2">
          <div className="text-primary">💬 Chat application opened!</div>
          <div className="text-muted-foreground">A new chat window has been launched. You can now interact with chai.</div>
          <div className="text-terminal-cyan">The chat window is now available on the right panel.</div>
        </div>
      );
      onCommandExecute?.("chat");
    } else {

    // Handle other commands
    switch (lowerCmd) {
      case "help":
        output = (
          <div className="space-y-1">
            <div className="text-primary font-semibold mb-2">Available Commands:</div>
            <div><span className="text-terminal-cyan">pwd</span> - View directory structure</div>
            <div><span className="text-terminal-cyan">whoami</span> - Who am I?</div>
            <div><span className="text-terminal-cyan">cat about.txt</span> - About me</div>
            <div><span className="text-terminal-cyan">cd projects</span> - View projects</div>
            <div><span className="text-terminal-cyan">cd experience</span> - Work experience</div>
            <div><span className="text-terminal-cyan">cat skills.txt</span> - Technical skills</div>
            <div><span className="text-terminal-cyan">cat contact.txt</span> - Get in touch</div>
            <div><span className="text-terminal-cyan">whereis socials</span> - View social links</div>
            <div><span className="text-terminal-cyan">open -a chaichat</span> - Open chat application</div>
            <div><span className="text-terminal-cyan">clear</span> - Clear terminal</div>
          </div>
        );
        break;
      case "pwd":
        output = (
          <div className="space-y-1">
            <div className="text-terminal-green">~ / neel / portfolio</div>
            <div className="text-muted-foreground text-sm mt-2">Directory structure:</div>
            <div className="ml-2 space-y-1 text-sm">
              {renderDirectory(directoryStructure, "/neel/portfolio")}
            </div>
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="space-y-2">
            <div className="text-primary text-xl font-bold">Sohail (Neel) Sarkar</div>
            <div className="text-muted-foreground">Applied Math & CS Student @ U of T • AI/ML Engineer • Quant Developer</div>
          </div>
        );
        break;
      case "cat about.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">About Me</div>
            <div>Applied Mathematics and Computer Science student at the University of Toronto (Expected May 2026).</div>
            <div>Passionate about AI/ML, quantitative analysis, and building scalable solutions. Also a classically trained guitarist from Trinity College London.</div>
            <div className="mt-2">Currently working at EO Ventures (NYC) and PSP Investments (Montreal) on cutting-edge AI and quantitative projects.</div>
          </div>
        );
        break;
      case "cd projects":
        output = (
          <div className="space-y-3">
            <div className="text-primary font-semibold">Recent Projects</div>
            <div>
              <div className="text-terminal-cyan">→ Fine-Tuned Stock Analysis LLM</div>
              <div className="text-muted-foreground ml-4">Llama 3.1 8B with Bayesian-LoRA, trained on market reports and SEC filings</div>
            </div>
            <div>
              <div className="text-terminal-cyan">→ Recommendation Engine</div>
              <div className="text-muted-foreground ml-4">PyTorch + Neo4j movie recommender with AWS ECS deployment and Rails interface</div>
            </div>
            <div>
              <div className="text-terminal-cyan">→ Campus-Scale RAG Pipeline</div>
              <div className="text-muted-foreground ml-4">U of T chatbot processing 200K+ SharePoint pages with 97.8% CRAG score</div>
            </div>
            <div>
              <div className="text-terminal-cyan">→ AI-Crypto Trading Bot</div>
              <div className="text-muted-foreground ml-4">Real-time Solana DEX arbitrage with LangChain agents and 24/7 monitoring</div>
            </div>
          </div>
        );
        break;
      case "cd experience":
        output = (
          <div className="space-y-3">
            <div className="text-primary font-semibold">Experience</div>
            <div>
              <div className="text-terminal-cyan font-semibold">Data Science Intern - EO Ventures</div>
              <div className="text-muted-foreground">NYC, New York • June 2025 - Present</div>
              <div className="ml-4 mt-1 text-sm">Equity modeling with AI & applied economics, Agentic AI SDK development</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">Quantitative NLP Intern - PSP Investments</div>
              <div className="text-muted-foreground">Montreal, QC • May 2025 - Present</div>
              <div className="ml-4 mt-1 text-sm">Global Alpha team, processing 500+ financial research questions with LLM pipeline</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">Associate DevOps Engineer - U of T Robarts Library</div>
              <div className="text-muted-foreground">Toronto, ON • Jan 2025 - Apr 2025</div>
              <div className="ml-4 mt-1 text-sm">Deployed campus-scale RAG chatbot, fine-tuned Llama-3 8B with qLoRA</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">Virtual Data Science Fellow - JP Morgan Chase</div>
              <div className="text-muted-foreground">Remote • May 2022 - Aug 2022</div>
              <div className="ml-4 mt-1 text-sm">Risk analytics dashboard with XGBoost, Apache Spark, and real-time data feeds</div>
            </div>
          </div>
        );
        break;
      case "cat skills.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Technical Skills</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-terminal-cyan">Languages:</div>
                <div className="text-sm ml-2">Python, Go, Rust, Julia, C/C++, SQL, JavaScript, Solidity</div>
              </div>
              <div>
                <div className="text-terminal-cyan">AI/ML:</div>
                <div className="text-sm ml-2">PyTorch, TensorFlow, Langchain, Hugging Face, vLLM</div>
              </div>
              <div>
                <div className="text-terminal-cyan">Databases:</div>
                <div className="text-sm ml-2">Neo4j, Pinecone, PostgreSQL, MongoDB, MySQL</div>
              </div>
              <div>
                <div className="text-terminal-cyan">Dev Tools:</div>
                <div className="text-sm ml-2">Docker, Kubernetes, AWS EC2, FastAPI, Kafka, Spark</div>
              </div>
            </div>
          </div>
        );
        break;
      case "cat contact.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Get In Touch</div>
            <div><span className="text-terminal-cyan">Email:</span> sohail.sarkar@utoronto.ca</div>
            <div><span className="text-terminal-cyan">Phone:</span> +1 (437) 329-3448</div>
            <div><span className="text-terminal-cyan">Location:</span> Toronto, ON, Canada</div>
            <div className="mt-3 text-muted-foreground">Open to opportunities in AI/ML, quantitative finance, and full-stack development!</div>
          </div>
        );
        break;
      case "whereis socials":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Social Links</div>
            <div><span className="text-terminal-cyan">GitHub:</span> <a href="https://github.com/n33levo" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">github.com/n33levo</a></div>
            <div><span className="text-terminal-cyan">LinkedIn:</span> <a href="https://www.linkedin.com/in/sohailsarkar/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">linkedin.com/in/sohailsarkar</a></div>
            <div><span className="text-terminal-cyan">Twitter:</span> <a href="https://twitter.com/n33levo" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">@n33levo</a></div>
            <div><span className="text-terminal-cyan">Email:</span> <a href="mailto:sohail.sarkar@utoronto.ca" className="underline hover:text-primary">sohail.sarkar@utoronto.ca</a></div>
          </div>
        );
        break;
      case "clear":
        // Keep the welcome message but clear everything else
        setHistory([
          {
            command: "",
            output: (
              <div className="space-y-2">
                <div className="text-primary text-2xl font-bold mb-2">Welcome to n33l's Portfolio</div>
                <div className="text-muted-foreground">Type 'help' to see available commands</div>
                <div className="text-muted-foreground">Or click commands on the left ←</div>
              </div>
            ),
            timestamp: new Date(),
          },
        ]);
        setInput("");
        setHistoryIndex(-1);
        return;
      default:
        if (trimmedCmd.startsWith("chat ")) {
          const message = cmd.substring(5);
          output = (
            <div className="space-y-2">
              <div><span className="text-muted-foreground">You:</span> {message}</div>
              <div><span className="text-primary">🤖 AI:</span> hi</div>
            </div>
          );
        } else if (trimmedCmd === "") {
          return;
        } else {
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }
    }

    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const commands = history.filter((h) => h.command).map((h) => h.command);
      if (commands.length > 0 && historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const commands = history.filter((h) => h.command).map((h) => h.command);
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commands[commands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
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
            onClick={() => onMaximize?.()}
            className="w-3 h-3 rounded-full bg-terminal-green hover:bg-green-500 transition-colors cursor-pointer"
            title="Maximize"
          />
        </div>
        <div className="text-sm text-muted-foreground ml-4">visitor@n33lsterminal ~ %</div>
      </div>

      {/* Terminal Output */}
      <div ref={outputRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2">
                <span className="terminal-prompt">$</span>
                <span className="text-foreground">{item.command}</span>
              </div>
            )}
            <div className="ml-4 text-foreground">{item.output}</div>
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center gap-2">
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground cursor-blink"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;
