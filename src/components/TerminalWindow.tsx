import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CommandOutput {
  command: string;
  output: string | JSX.Element;
  timestamp: Date;
}

// TypewriterEffect component for animated text
const TypewriterEffect = ({ children, delay = 50, onComplete, scrollToBottom, onStart }: { 
  children: React.ReactNode; 
  delay?: number; 
  onComplete?: () => void;
  scrollToBottom?: () => void;
  onStart?: () => void;
}) => {
  const [displayedContent, setDisplayedContent] = useState<React.ReactNode>('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    onStart?.(); // Notify that animation is starting
    
    if (typeof children === 'string') {
      let index = 0;
      const timer = setInterval(() => {
        if (index < children.length) {
          setDisplayedContent(children.slice(0, index + 1));
          scrollToBottom?.(); // Scroll with each character
          index++;
        } else {
          clearInterval(timer);
          setIsComplete(true);
          onComplete?.();
          scrollToBottom?.();
        }
      }, delay);
      return () => clearInterval(timer);
    } else {
      // For JSX content, show immediately after a short delay
      const timer = setTimeout(() => {
        setDisplayedContent(children);
        setIsComplete(true);
        onComplete?.();
        scrollToBottom?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [children, delay, onComplete]);

  return <>{displayedContent}</>;
};

// ImageLoader component with loading delay
const ImageLoader = ({ src, alt, className, delay = 200, onLoad, scrollToBottom }: {
  src: string;
  alt: string;
  className: string;
  delay?: number;
  onLoad?: () => void;
  scrollToBottom?: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      onLoad?.();
      scrollToBottom?.();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, onLoad]);
  
  if (!isLoaded) {
    return <div className={`${className} bg-muted animate-pulse flex items-center justify-center`}>
      <span className="text-xs text-muted-foreground">Loading...</span>
    </div>;
  }
  
  return <img src={src} alt={alt} className={className} />;
};

// SkillItem component with hover animations
const SkillItem = ({ skill, className = "" }: { skill: string; className?: string }) => {
  return (
    <span 
      className={`inline-block px-2 py-1 m-1 text-sm bg-muted rounded transition-all duration-200 cursor-default
                 hover:scale-110 hover:bg-terminal-cyan hover:text-background hover:shadow-lg 
                 hover:animate-pulse transform-gpu ${className}`}
    >
      {skill}
    </span>
  );
};

// AnimatedTerminalOutput component for step-by-step rendering
const AnimatedTerminalOutput = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    // Parse the children into renderable steps
    if (React.isValidElement(children)) {
      const extractSteps = (element: React.ReactElement): React.ReactNode[] => {
        if (element.type === 'div' && element.props.className?.includes('space-y')) {
          // Handle container divs by extracting their children
          const childArray = React.Children.toArray(element.props.children);
          return childArray;
        }
        return [element];
      };
      
      const extractedSteps = extractSteps(children);
      setSteps(extractedSteps);
    } else {
      setSteps([children]);
    }
  }, [children]);
  
  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300); // Delay between each step
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);
  
  return (
    <div className="space-y-2">
      {steps.slice(0, currentStep).map((step, index) => (
        <div key={index}>
          {step}
        </div>
      ))}
    </div>
  );
};

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
  "activities.txt": "file",
  "education.txt": "file",
  "skills/": {
    _items: 6,
    "languages": "folder",
    "ai_ml": "folder", 
    "databases": "folder",
    "frameworks": "folder",
    "devtools": "folder",
    "other": "folder",
  },
  "archives/": {
    _items: 2,
    "old_experience.txt": "file",
  },
  "socials/": {
    _items: 4,
    "email": "link",
    "github": "link",
    "instagram": "link",
    "linkedin": "link",
  },
};

const WgetProgressAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    const steps = [
      { delay: 300, nextStep: 1 },    // Show initial lines
      { delay: 500, nextStep: 2 },    // Show connecting
      { delay: 400, nextStep: 3 },    // Show HTTP response
      { delay: 300, nextStep: 4 },    // Show saving to
      { delay: 100, nextStep: 5 },    // Start progress bar
    ];

    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(steps[step].nextStep);
      }, steps[step].delay);
      return () => clearTimeout(timer);
    }

    // Animate progress bar
    if (step === 5) {
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            setTimeout(() => {
              setShowFinalMessage(true);
            }, 200);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(progressTimer);
    }
  }, [step]);

  const generateProgressBar = (progress: number) => {
    const barLength = 40;
    const filledLength = Math.floor((progress / 100) * barLength);
    const filled = '='.repeat(filledLength);
    const arrow = progress < 100 ? '>' : '';
    const empty = ' '.repeat(barLength - filledLength - (arrow ? 1 : 0));
    return `${progress.toFixed(0)}%[${filled}${arrow}${empty}]`;
  };

  return (
    <div className="space-y-1 font-mono text-sm">
      {step >= 1 && (
        <>
          <div>--2025-10-08 12:34:56--  https://n33levo.github.io/resume.pdf</div>
          <div>Resolving n33levo.github.io... 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153</div>
        </>
      )}
      {step >= 2 && (
        <div>Connecting to n33levo.github.io|185.199.108.153|:443... connected.</div>
      )}
      {step >= 3 && (
        <>
          <div>HTTP request sent, awaiting response... 200 OK</div>
          <div>Length: 892KB [application/pdf]</div>
        </>
      )}
      {step >= 4 && (
        <>
          <div>Saving to: 'neel_sarkar_resume.pdf'</div>
          <div></div>
        </>
      )}
      {step >= 5 && (
        <div className="text-terminal-cyan">
          {generateProgressBar(progress)} 892KB  --.--KB/s    in 0.1s
        </div>
      )}
      {showFinalMessage && (
        <>
          <div></div>
          <div>'sohail_sarkar_resume.pdf' saved</div>
          <div></div>
          <div className="text-primary"> Resume downloaded successfully!</div>
        </>
      )}
    </div>
  );
};

const TerminalWindow = ({ onCommandExecute, commandToExecute, onCommandExecuted, onClose, onMinimize, onMaximize }: TerminalWindowProps) => {
  const [input, setInput] = useState("");
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  // State to track if user has manually scrolled up
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper function to scroll to bottom smoothly
  const scrollToBottom = (smooth = false) => {
    if (outputRef.current && !userScrolledUp) {
      if (smooth) {
        outputRef.current.scrollTo({
          top: outputRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }
  };

  // Check if user is near the bottom of the scroll area
  const isNearBottom = () => {
    if (!outputRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
    return scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
  };

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (outputRef.current && !isAnimating) {
      setUserScrolledUp(!isNearBottom());
    }
  };

  // Functions to track animation state
  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    // Reset user scroll state if they're near bottom
    if (isNearBottom()) {
      setUserScrolledUp(false);
    }
  };

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
      // Scroll to bottom when new content is added (only if user hasn't scrolled up)
      scrollToBottom();
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
            <div><span className="text-terminal-cyan">cat activities.txt</span> — Activities & leadership</div>
            <div><span className="text-terminal-cyan">cat education.txt</span> — Education</div>
            <div><span className="text-terminal-cyan">cat achievements.txt</span> — Awards & achievements</div>
            <div><span className="text-terminal-cyan">ls ./skills/</span> — Technical skills</div>
            <div><span className="text-terminal-cyan">whereis socials</span> — View social links</div>
            <div><span className="text-terminal-cyan">wget resume</span> — Download resume</div>
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
              <div>├── activities.txt</div>
              <div>├── <span className="text-terminal-cyan">archives/</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>└── old_experience.txt</span></div>
              <div>├── education.txt</div>
              <div>├── experience.txt</div>
              <div>├── <span className="text-terminal-cyan">projects/</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── modified-sir</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── ocr-digitizer</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── reccomendation-engine</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>└── stock-analysis-llm</span></div>
              <div>├── <span className="text-terminal-cyan">skills/</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── ai_ml</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── databases</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── devtools</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── frameworks</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>├── languages</span></div>
              <div>│<span style={{paddingLeft: '50px'}}>└── other</span></div>
              <div>└── <span className="text-terminal-cyan">socials/</span></div>
              <div><span style={{paddingLeft: '57px'}}>├── email</span></div>
              <div><span style={{paddingLeft: '57px'}}>├── github</span></div>
              <div><span style={{paddingLeft: '57px'}}>├── instagram</span></div>
              <div><span style={{paddingLeft: '57px'}}>└── linkedin</span></div>
            </div>
          </div>
        );
        break;

      case "cat about.txt":
        output = (
          <AnimatedTerminalOutput>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 mb-4">
                <ImageLoader 
                  src="/profilepicture.png .png" 
                  alt="Sohail (Neel) Sarkar" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  delay={200}
                />
                <div>
                  <TypewriterEffect delay={30}>
                    <div className="text-primary font-semibold">Sohail (Neel) Sarkar</div>
                    <div className="text-sm text-muted-foreground">Profile Picture</div>
                  </TypewriterEffect>
                </div>
              </div>
              <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                <div>I am an Applied Maths student at the <a href="https://www.utoronto.ca/" target="_blank" rel="noopener noreferrer" className="text-terminal-green underline hover:text-primary">University of Toronto</a> — I wanted to study pure math, but somewhere between proofs and pragmatism, I sold my soul to the compiler.</div>
              </TypewriterEffect>
              <TypewriterEffect delay={30} scrollToBottom={scrollToBottom}>
                <div className="mt-3 mb-2 text-primary font-semibold">A bit about me:</div>
              </TypewriterEffect>
              <div className="space-y-1">
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div>▸ Currently the Applied AI Resident Scientist(Intern) at <a href="https://sigmasquared.io/" target="_blank" rel="noopener noreferrer" className="text-terminal-green underline hover:text-primary">Sigma Squared</a>, under <a href="https://www.eoventures.com/" target="_blank" rel="noopener noreferrer" className="text-terminal-green underline hover:text-primary">EO Ventures</a>.</div>
                </TypewriterEffect>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div>▸ Into NLP, proofs, automation, modelling, compression and optimization</div>
                </TypewriterEffect>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div>▸ Classically trained guitarist — Bach wrote better counterpoint than most coders write loops.</div>
                </TypewriterEffect>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div>▸ Avid reader of Camus, Dostoevsky, and Ruskin Bond</div>
                </TypewriterEffect>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div>▸ Proud dog brother to <button onClick={() => executeCommand('ls ./snowyandpluto/')} className="text-terminal-cyan underline hover:text-primary cursor-pointer">Snowy and Pluto</button>, who debug my life better than I do</div>
                </TypewriterEffect>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom} onComplete={() => {
                  setTimeout(() => scrollToBottom(), 100);
                }}>
                  <div>▸ Perpetually caffeinated, occasionally philosophical</div>
                </TypewriterEffect>
              </div>
            </div>
          </AnimatedTerminalOutput>
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
          <AnimatedTerminalOutput>
            <div className="space-y-3">
              <TypewriterEffect delay={30} scrollToBottom={scrollToBottom}>
                <div className="text-primary font-semibold">Experience</div>
              </TypewriterEffect>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/sigmasquared_logo.png" 
                  alt="Sigma Squared Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Applied AI/Econometrics Intern, Sigma Squared</div>
                    <div className="text-muted-foreground">Boston, MA — June 2025 – Present</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Working on data platforms with EO Ventures and ML systems at Sigma Squared.</div>
                    <div className="ml-4 text-sm">- Engineering agentic EDA-to-ETL pipeline, ensembling CatBoost with TabPFN for SWE-error prediction.</div>
                    <div className="ml-4 text-sm">- Built platform-integrated, fully autonomous, prompt-triggered Agentic SDK with MCP wrapping.</div>
                    <div className="ml-4 text-sm">- Co-authoring proprietary research in econometric-based performance clustering and calibration.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/psp_investments_logo.png" 
                  alt="PSP Investments Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Data Science Intern, PSP Investments</div>
                    <div className="text-muted-foreground">Montréal, QC — May – July 2025</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Architected alpha-signal research ETL pipeline answering 3,000+ analyst questions per batch.</div>
                    <div className="ml-4 text-sm">- Reinforced processing with claimification-based cross-referencing, achieving 100% factual accuracy.</div>
                    <div className="ml-4 text-sm">- Contributed layers in neural retriever, cutting batch inference time from 20 min → 3 min.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/university_of_toronto_logo.png" 
                  alt="University of Toronto Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">MLOps Intern, University of Toronto</div>
                    <div className="text-muted-foreground">Toronto, ON — January – April 2025</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Deployed tri-campus RAG chatbot framework; automated CI/CD for indexing, evals, and releases.</div>
                    <div className="ml-4 text-sm">- Delivered a distributed, hierarchical retrieval system supporting multi-tenant chat interfaces.</div>
                    <div className="ml-4 text-sm">- Exposed library GPU cluster via REST control plane for LLM fine-tuning with job scheduling and telemetry.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/ejpratt_logo.png" 
                  alt="E.J. Pratt Institute Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Software Engineering Intern, E.J. Pratt Institute</div>
                    <div className="text-muted-foreground">Toronto, ON — Sept – Dec 2024</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Developed version-controlled scheduling system with Random Forest allocator using performance metrics.</div>
                    <div className="ml-4 text-sm">- Shipped OAuth-secured ticketing system for IT desk backed by MongoDB persistence and Redis sessions.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <TypewriterEffect delay={30} onComplete={() => {
                setTimeout(() => scrollToBottom(), 100);
              }}>
                <div className="mt-4 p-3 border-l-4 border-terminal-yellow bg-muted/30 rounded-r">
                  <div className="text-terminal-yellow font-semibold">📁 More Experiences Available</div>
                  <div className="text-sm mt-1">
                    Check out my <button onClick={() => executeCommand('cat archives/old_experience.txt')} className="text-terminal-cyan underline hover:text-primary cursor-pointer">archived experiences</button> for additional work history and non-internship roles.
                  </div>
                </div>
              </TypewriterEffect>
            </div>
          </AnimatedTerminalOutput>
        );
        break;
      
      case "cat activities.txt":
        output = (
          <AnimatedTerminalOutput>
            <div className="space-y-3">
              <TypewriterEffect delay={30} scrollToBottom={scrollToBottom}>
                <div className="text-primary font-semibold">Activities & Leadership</div>
              </TypewriterEffect>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/knox_college_logo.png" 
                  alt="Knox College Association Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                  scrollToBottom={scrollToBottom}
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">President, Knox College Association</div>
                    <div className="text-muted-foreground">Toronto, ON — Sep 2022 – Apr 2023</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Ran and got elected for two consecutive terms; managed a $45,000 annual fund and strategically grew it by $15,000+ through low-risk trading strategies.</div>
                    <div className="ml-4 text-sm">- Oversaw events, budgeting, and cross-college initiatives.</div>
                    <div className="ml-4 text-sm">- Hosted a $10,000 dinner party, theme: Masquerade Ball.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/ekalavya_academy_logo.png" 
                  alt="Ekalavya Academy Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                  scrollToBottom={scrollToBottom}
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Teaching Assistant, Ekalavya Academy</div>
                    <div className="text-muted-foreground">Siliguri, WB — May 2019 – Feb 2021</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                    <div className="ml-4 mt-1 text-sm">- Used the .py package MANIM to create animations specific to calculus, linear algebra, and geometry.</div>
                    <div className="ml-4 text-sm">- Set up a network among terminals using A* and Ford-Fulkerson to optimize the network.</div>
                    <div className="ml-4 text-sm">- Learned how to make Ethernet cables.</div>
                  </TypewriterEffect>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
        );
        break;
        
      case "cat archives/old_experience.txt":
        output = (
          <AnimatedTerminalOutput>
            <div className="border border-terminal-cyan rounded-md p-4 bg-card/50 space-y-3">
              <TypewriterEffect delay={30}>
                <div className="text-primary font-semibold">📁 Archived Experiences</div>
                <div className="text-sm text-muted-foreground">Non-internship roles and older experiences</div>
              </TypewriterEffect>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/jpmorgan.png" 
                  alt="JP Morgan Chase Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Virtual Data Science Fellow, JP Morgan Chase</div>
                    <div className="text-muted-foreground">Remote — May 2022–Aug 2022</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20}>
                    <div className="ml-4 mt-1 text-sm">- Risk analytics dashboard with Python, Spark, scikit-learn; XGBoost for vol forecasting; Kafka streaming; D3.js visualizations.</div>
                    <div className="ml-4 text-sm">- Real-time feeds + Perspective for trader-facing live graphs.</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/ithelpdesk.png" 
                  alt="University of Toronto IT Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Tier 1 IT Advisor, University of Toronto IT Help Desk</div>
                    <div className="text-muted-foreground">Toronto, ON — Sept 2022–Aug 2024</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20}>
                    <div className="ml-4 mt-1 text-sm">- Account management with Microsoft Entra ID; Win/Linux/Mac/AV/VoIP support; ServiceNow ticketing & docs.</div>
                  </TypewriterEffect>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
        );
        break;
        
      case "ls ./skills/":
        output = (
          <AnimatedTerminalOutput>
            <div className="border border-terminal-cyan rounded-md p-4 bg-card/50 space-y-4">
              <TypewriterEffect delay={30} scrollToBottom={scrollToBottom}>
                <div className="text-primary font-semibold">./skills/</div>
              </TypewriterEffect>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  {/* AI/ML */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">ai_ml/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="Agent SDKs" />
                      <SkillItem skill="CUDA" />
                      <SkillItem skill="Hugging Face" />
                      <SkillItem skill="Keras" />
                      <SkillItem skill="LangGraph" />
                      <SkillItem skill="LlamaIndex" />
                      <SkillItem skill="PyTorch" />
                      <SkillItem skill="TensorFlow" />
                      <SkillItem skill="Triton" />
                      <SkillItem skill="vLLM" />
                    </div>
                  </div>

                  {/* Databases */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">databases/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="MongoDB" />
                      <SkillItem skill="MySQL" />
                      <SkillItem skill="Neo4j" />
                      <SkillItem skill="Pinecone" />
                      <SkillItem skill="Postgres" />
                    </div>
                  </div>

                  {/* DevTools */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">devtools/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="Cursor" />
                      <SkillItem skill="Git" />
                      <SkillItem skill="Kafka" />
                      <SkillItem skill="Spark" />
                      <SkillItem skill="VSCode" />
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  {/* Frameworks */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">frameworks/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="AWS EC2" />
                      <SkillItem skill="Docker" />
                      <SkillItem skill="FastAPI" />
                      <SkillItem skill="FastMCP" />
                      <SkillItem skill="Flask" />
                      <SkillItem skill="Kubernetes" />
                      <SkillItem skill="Streamlit" />
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">languages/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="C/C++" />
                      <SkillItem skill="Go" />
                      <SkillItem skill="Java" />
                      <SkillItem skill="JavaScript" />
                      <SkillItem skill="Julia" />
                      <SkillItem skill="Python" />
                      <SkillItem skill="Ruby on Rails" />
                      <SkillItem skill="Rust" />
                      <SkillItem skill="SQL" />
                      <SkillItem skill="TypeScript" />
                    </div>
                  </div>

                  {/* Other */}
                  <div>
                    <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                      <div className="text-terminal-cyan font-semibold mb-2">other/</div>
                    </TypewriterEffect>
                    <div className="ml-4 flex flex-wrap">
                      <SkillItem skill="LaTeX" />
                      <SkillItem skill="Power BI" />
                      <SkillItem skill="ServiceNow" />
                      <SkillItem skill="VBA" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
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
          <AnimatedTerminalOutput>
            <div className="space-y-3">
              <TypewriterEffect delay={30} scrollToBottom={scrollToBottom}>
                <div className="text-primary font-semibold">Education</div>
              </TypewriterEffect>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/university_of_toronto_logo.png" 
                  alt="University of Toronto Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                  scrollToBottom={scrollToBottom}
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">University of Toronto — Toronto, ON</div>
                    <div className="text-muted-foreground">B.Sc. Applied Mathematics (Honours); Minor Computer Science — Expected April 2027</div>
                  </TypewriterEffect>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ImageLoader 
                  src="/trinity_college_london_logo.png" 
                  alt="Trinity College Logo" 
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                  scrollToBottom={scrollToBottom}
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Trinity College — Toronto, ON</div>
                    <div className="text-muted-foreground">ACTL Classical Guitar — June 2021</div>
                  </TypewriterEffect>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
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

      case "wget resume":
        output = <WgetProgressAnimation />;
        break;

      case "ls ./snowyandpluto/":
        output = (
          <AnimatedTerminalOutput>
            <div className="border border-terminal-cyan rounded-md p-4 bg-card/50 space-y-4">
              <TypewriterEffect delay={40}>
                <div className="text-primary font-semibold mb-3">./snowyandpluto/</div>
              </TypewriterEffect>
              
              {/* Together picture - rectangular like profile */}
              <div className="flex items-center space-x-3 mb-4">
                <ImageLoader 
                  src="/snowyandpluto.png" 
                  alt="Snowy and Pluto Together" 
                  className="w-32 h-24 rounded object-cover border-2 border-primary"
                  delay={300}
                />
                <div>
                  <TypewriterEffect delay={25}>
                    <div className="text-terminal-cyan font-semibold">snowyandpluto.png</div>
                    <div className="text-sm text-muted-foreground">The dynamic duo</div>
                  </TypewriterEffect>
                </div>
              </div>

              {/* Individual profiles in terminal ls format */}
              <div className="grid grid-cols-1 gap-4">
                {/* Snowy */}
                <div className="flex items-start space-x-4">
                  <ImageLoader 
                    src="/snowy.png" 
                    alt="Snowy" 
                    className="w-24 h-24 rounded-full object-cover border border-terminal-cyan"
                    delay={400}
                  />
                  <div className="flex-1">
                    <TypewriterEffect delay={25}>
                      <div className="text-terminal-cyan font-semibold mb-1">snowy.png</div>
                    </TypewriterEffect>
                    <TypewriterEffect delay={20}>
                      <div className="text-sm">
                        Snowy has been like a brother to me since I was in grade 6, he has been with me through thick and thin. 
                        He would sleep in the bed with me where I was sandwiched between him and my guitar and my physics textbook 
                        on my pillow because I fell asleep studying.
                      </div>
                    </TypewriterEffect>
                  </div>
                </div>

                {/* Pluto */}
                <div className="flex items-start space-x-4">
                  <ImageLoader 
                    src="/pluto.png" 
                    alt="Pluto" 
                    className="w-24 h-24 rounded-full object-cover border border-terminal-cyan"
                    delay={500}
                  />
                  <div className="flex-1">
                    <TypewriterEffect delay={25}>
                      <div className="text-terminal-cyan font-semibold mb-1">pluto.png</div>
                    </TypewriterEffect>
                    <TypewriterEffect delay={20}>
                      <div className="text-sm">
                        Pluto was adopted into our family during COVID-19, he's the chillest dog to ever exist, never bites, 
                        is always playful, he is always hungry and possibly the most active labrador retriever on planet earth. 
                        He will also nudge you to give him a snack anytime. 
                      </div>
                    </TypewriterEffect>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
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
    
    // Force scroll to bottom after command execution - minimal delay for simple commands
    setTimeout(() => scrollToBottom(), 50);
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
      <div ref={outputRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm" onScroll={handleScroll}>
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
