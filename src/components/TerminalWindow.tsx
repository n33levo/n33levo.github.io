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
    "modified-sir.txt": "file",
    "ocr-digitizer.txt": "file",
    "recsys.txt": "file", 
    "stock-llm.txt": "file",
  },
  "Applications/": {
    _items: 1,
    "chai chat.app": "application",
  },
  "achievements.txt": "file",
  "experience.txt": "file",
  "education.txt": "file",
  "skills.txt": "file",
  "socials/": {
    _items: 4,
    "email": "link",
    "github": "link",
    "instagram": "link",
    "linkedin": "link",
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

  const renderDirectory = (dir: any, path: string, isLast: boolean[] = [], isRoot = false) => {
    const entries = Object.keys(dir).filter(key => key !== '_items').sort();
    return entries.map((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const currentPath = `${path}/${entry}`;
      const isDirectory = typeof dir[entry] === 'object';

      // Build the prefix for tree lines
      let prefix = '';
      if (isRoot) {
        prefix = isLastEntry ? '└── ' : '├── ';
      } else {
        // Build the indentation based on the hierarchy - more spaces for deeper indentation
        for (let i = 0; i < isLast.length; i++) {
          prefix += isLast[i] ? '      ' : '│     ';
        }
        prefix += isLastEntry ? '└── ' : '├── ';
      }

      return (
        <div key={currentPath}>
          <div className="flex items-center">
            <span className="text-terminal-cyan">{prefix}</span>
            <span className={`${isDirectory ? 'text-terminal-cyan' : ''}`}>{entry}</span>
          </div>
          {isDirectory && (
            <div>
              {renderDirectory(dir[entry], currentPath, [...isLast, isLastEntry], false)}
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

    // Handle greeting commands
    if (['hi', 'hello', 'hey', 'hiya', 'howdy', 'greetings'].includes(lowerCmd)) {
      output = (
        <div className="space-y-2">
          <div className="text-terminal-yellow">hmm, that's not really a command, please see help, but I am redirecting you to chai just in case</div>
        </div>
      );
      // Auto-open chai chat after showing the message
      setTimeout(() => {
        onCommandExecute?.("chat");
      }, 1000);
    }
    // Handle full commands
    else if (trimmedCmd === 'open -a "chai chat"' || trimmedCmd === "open -a chai chat") {
      output = (
        <div className="space-y-2">
          <div className="text-primary">💬 Chat application opened!</div>
          <div className="text-muted-foreground">A new chat window has been launched. Get yourself a cup of chai and talk with it.</div>
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
            <div><span className="text-terminal-cyan">pwd</span> — View directory structure</div>
            <div><span className="text-terminal-cyan">cat about.txt</span> — About me</div>
            <div><span className="text-terminal-cyan">cd projects</span> — View projects</div>
            <div><span className="text-terminal-cyan">cat experience.txt</span> — Work experience</div>
            <div><span className="text-terminal-cyan">cat skills.txt</span> — Technical skills</div>
            <div><span className="text-terminal-cyan">cat education.txt</span> — Education</div>
            <div><span className="text-terminal-cyan">cat achievements.txt</span> — Awards & achievements</div>
            <div><span className="text-terminal-cyan">whereis socials</span> — View social links</div>
            <div><span className="text-terminal-cyan">open -a "chai chat"</span> — Open chat application</div>
            <div><span className="text-terminal-cyan">clear</span> — Clear terminal</div>
          </div>
        );
        break;
      case "pwd":
        output = (
          <div className="space-y-1">
            <div className="text-terminal-green">~ / neel / portfolio</div>
            <div className="text-sm mt-2 font-mono">
              <div>.</div>
              <div>├── <span className="text-terminal-cyan">Applications/</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>└── chai chat.app</span></div>
              <div>├── about.txt</div>
              <div>├── achievements.txt</div>
              <div>├── education.txt</div>
              <div>├── experience.txt</div>
              <div>├── <span className="text-terminal-cyan">projects/</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── modified-sir</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── ocr-digitizer</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── reccomendation-engine</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>└── stock-analysis-llm</span></div>
              <div>├── skills.txt</div>
              <div>└── <span className="text-terminal-cyan">socials/</span></div>
              <div><span style={{paddingLeft: '50px'}}>├── email</span></div>
              <div><span style={{paddingLeft: '50px'}}>├── github</span></div>
              <div><span style={{paddingLeft: '50px'}}>├── instagram</span></div>
              <div><span style={{paddingLeft: '50px'}}>└── linkedin</span></div>
            </div>
          </div>
        );
        break;

      case "cat about.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Sohail (Neel) Sarkar</div>
            <div>Applied Mathematics & Computer Science student at the University of Toronto (Expected May 2026).</div>
            <div>Passionate about AI/ML, quantitative analysis, and building scalable systems. Classically trained guitarist (Trinity College London).</div>
            <div className="mt-2">Currently working with EO Ventures (NYC) and PSP Investments (Montreal) on AI and quantitative projects.</div>
          </div>
        );
        break;
      case "cd projects":
        output = (
          <div className="space-y-3">
            <div className="text-primary font-semibold">Projects</div>
            <div>
              <div className="text-terminal-cyan">stock-llm.txt</div>
              <div className="text-muted-foreground ml-4">Fine-Tuned Stock Analysis LLM (Bayesian-LoRA, PyTorch, PEFT, BitsAndBytes 4-bit).</div>
              <div className="text-muted-foreground ml-4">Trained on market reports, earnings transcripts, SEC filings.</div>
              <div className="text-muted-foreground ml-4">Implemented gated Bayesian rank selection to adapt per layer and reduce memory overhead.</div>
            </div>
            <div>
              <div className="text-terminal-cyan">recsys.txt</div>
              <div className="text-muted-foreground ml-4">Movie recommendation engine (PyTorch + Neo4j); matrix-factorization embeddings from watch/rating/review data.</div>
              <div className="text-muted-foreground ml-4">Scraping via bs4/Selenium; Dockerized; Phase 2 on AWS ECS + Kubernetes; Ruby on Rails UI.</div>
            </div>
            <div>
              <div className="text-terminal-cyan">ocr-digitizer.txt</div>
              <div className="text-muted-foreground ml-4">OCR automation with TensorFlow/Keras (C# via TensorFlow.NET); PostgreSQL storage; Pandas/Excel pipelines.</div>
              <div className="text-muted-foreground ml-4">Licensed to law & supply-chain firms; ~$35,000 total sales.</div>
            </div>
            <div>
              <div className="text-terminal-cyan">modified-sir.txt</div>
              <div className="text-muted-foreground ml-4">Modified SIR with Exposed/Vaccinated compartments, non-constant population, age stratification, risk factors.</div>
              <div className="text-muted-foreground ml-4">Real-time COVID-19 data; MLE/Bayesian inference; Kalman/Particle filters; collaboration with Dr. Tom Crawford.</div>
            </div>
          </div>
        );
        break;
      case "cat experience.txt":
        output = (
          <div className="space-y-3">
            <div className="text-primary font-semibold">Experience</div>
            <div>
              <div className="text-terminal-cyan font-semibold">Sigma Squared — Boston, MA</div>
              <div className="text-muted-foreground">Applied AI/Econometrics Intern — June 2025 – Present</div>
              <div className="ml-4 mt-1 text-sm">- Working on data platforms with EO Ventures and ML systems at Sigma Squared.</div>
              <div className="ml-4 text-sm">- Engineering agentic EDA-to-ETL pipeline, ensembling CatBoost with TabPFN for SWE-error prediction.</div>
              <div className="ml-4 text-sm">- Built platform-integrated, fully autonomous, prompt-triggered Agentic SDK with MCP wrapping.</div>
              <div className="ml-4 text-sm">- Co-authoring proprietary research in econometric-based performance clustering and calibration.</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">PSP Investments — Montréal, QC</div>
              <div className="text-muted-foreground">Quantitative NLP Intern — May – July 2025</div>
              <div className="ml-4 mt-1 text-sm">- Architected alpha-signal research ETL pipeline answering 3,000+ analyst questions per batch.</div>
              <div className="ml-4 text-sm">- Reinforced processing with claimification-based cross-referencing, achieving 100% factual accuracy.</div>
              <div className="ml-4 text-sm">- Contributed layers in neural retriever, cutting batch inference time from 20 min → 3 min.</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">University of Toronto — Toronto, ON</div>
              <div className="text-muted-foreground">MLOps Intern — January – April 2025</div>
              <div className="ml-4 mt-1 text-sm">- Deployed tri-campus RAG chatbot framework; automated CI/CD for indexing, evals, and releases.</div>
              <div className="ml-4 text-sm">- Delivered a distributed, hierarchical retrieval system supporting multi-tenant chat interfaces.</div>
              <div className="ml-4 text-sm">- Exposed library GPU cluster via REST control plane for LLM fine-tuning with job scheduling and telemetry.</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">E.J. Pratt Institute — Toronto, ON</div>
              <div className="text-muted-foreground">Software Engineering Intern — Sept – Dec 2024</div>
              <div className="ml-4 mt-1 text-sm">- Developed version-controlled scheduling system with Random Forest allocator using performance metrics.</div>
              <div className="ml-4 text-sm">- Shipped OAuth-secured ticketing system for IT desk backed by MongoDB persistence and Redis sessions.</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">Virtual Data Science Fellow - JP Morgan Chase</div>
              <div className="text-muted-foreground">Remote — May 2022–Aug 2022</div>
              <div className="ml-4 mt-1 text-sm">- Risk analytics dashboard with Python, Spark, scikit-learn; XGBoost for vol forecasting; Kafka streaming; D3.js visualizations.</div>
              <div className="ml-4 text-sm">- Real-time feeds + Perspective for trader-facing live graphs.</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">IT Help Desk, University of Toronto — Toronto, ON</div>
              <div className="text-muted-foreground">Tier 1 IT Advisor — Sept 2022–Aug 2024</div>
              <div className="ml-4 mt-1 text-sm">- Account management with Microsoft Entra ID; Win/Linux/Mac/AV/VoIP support; ServiceNow ticketing & docs.</div>
            </div>
          </div>
        );
        break;
      case "cat skills.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Technical Skills</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Languages */}
              <div>
                <div className="text-terminal-cyan">Languages:</div>
                <div className="text-sm ml-2">
                  Go, Python, Rust, Ruby on Rails, Julia, C/C++, SQL, Java, TypeScript, JavaScript
                </div>
              </div>

              {/* AI / ML */}
              <div>
                <div className="text-terminal-cyan">AI / ML:</div>
                <div className="text-sm ml-2">
                  PyTorch, CUDA, TensorFlow, Keras, Hugging Face, vLLM, Triton, LangGraph / LlamaIndex, Agent SDKs
                </div>
              </div>

              {/* Databases */}
              <div>
                <div className="text-terminal-cyan">Databases:</div>
                <div className="text-sm ml-2">
                  Neo4j, Pinecone, Postgres, MySQL, MongoDB
                </div>
              </div>

              {/* Frameworks & Platforms */}
              <div>
                <div className="text-terminal-cyan">Frameworks & Platforms:</div>
                <div className="text-sm ml-2">
                  FastAPI, FastMCP, Flask, Streamlit, Docker, Kubernetes, AWS EC2
                </div>
              </div>

              {/* Dev Tools */}
              <div>
                <div className="text-terminal-cyan">Dev Tools:</div>
                <div className="text-sm ml-2">
                  VSCode, Cursor, Git, Kafka, Spark
                </div>
              </div>

              {/* Other */}
              <div>
                <div className="text-terminal-cyan">Other:</div>
                <div className="text-sm ml-2">
                  LaTeX, Power BI, VBA, ServiceNow
                </div>
              </div>
            </div>
          </div>
    );

        break;
      case "whereis socials":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Social Links</div>
            <div><span className="text-terminal-cyan">Email:</span> <a href="mailto:sohail.sarkar@utoronto.ca" className="underline hover:text-primary">sohail.sarkar@utoronto.ca</a></div>
            <div><span className="text-terminal-cyan">GitHub:</span> <a href="https://github.com/n33levo" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">github.com/n33levo</a></div>
            <div><span className="text-terminal-cyan">Instagram:</span> <a href="https://www.instagram.com/s0hail.sarkar/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">@s0hail.sarkar</a></div>
            <div><span className="text-terminal-cyan">LinkedIn:</span> <a href="https://www.linkedin.com/in/sohail-sarkar-06ab10300/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">linkedin.com/in/sohailsarkar</a></div>
          </div>
        );
        break;
      case "cat education.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Education</div>
            <div>
              <div className="text-terminal-cyan font-semibold">University of Toronto — Toronto, ON</div>
              <div className="text-muted-foreground">B.Sc. Applied Mathematics (Honours); Minor Computer Science — Expected April 2027</div>
            </div>
            <div>
              <div className="text-terminal-cyan font-semibold">Trinity College — Toronto, ON</div>
              <div className="text-muted-foreground">ACTL Classical Guitar — June 2021</div>
            </div>
          </div>
        );
        break;
      case "cat achievements.txt":
        output = (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Awards & Achievements</div>
            <div>- International Scholar ($100,000)</div>
            <div>- MRN Scholarship</div>
            <div>- INMC Perfect Score ($1,000)</div>
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
              <div><span className="text-primary"> AI:</span> hi</div>
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
