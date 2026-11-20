import React, { useState, useEffect, useRef } from "react";
import { PortfolioSection } from "@/components/PortfolioSection";
import { projects } from "@/data/profile";

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
      <span className="text-[8px] text-muted-foreground opacity-60">Loading...</span>
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
    _items: projects.length,
    ...Object.fromEntries(projects.map(project => [project.id + ".txt", "file"])),
  },
  "Applications/": {
    _items: 1,
    "chai chat.app": "application",
  },
  "achievements.txt": "file",
  "experience.txt": "file",
  "research.txt": "file",
  "publications.txt": "file",
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

const WgetProgressAnimation = ({ scrollToBottom, key }: { scrollToBottom?: (smooth?: boolean, force?: boolean) => void; key?: string }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const downloadTriggeredRef = useRef(false);

  const downloadResume = () => {
    if (downloadTriggeredRef.current) return; // Prevent multiple downloads
    downloadTriggeredRef.current = true;

    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'sohail_sarkar_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset state when component is re-mounted or key changes
  useEffect(() => {
    setProgress(0);
    setStep(0);
    setShowFinalMessage(false);
    downloadTriggeredRef.current = false;
  }, [key]);

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
        scrollToBottom?.(false, true); // Force scroll after each step
      }, steps[step].delay);
      return () => clearTimeout(timer);
    }

    // Animate progress bar
    if (step === 5) {
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            // Only trigger completion once
            if (!downloadTriggeredRef.current) {
              setTimeout(() => {
                setShowFinalMessage(true);
                downloadResume(); // Trigger actual download
                scrollToBottom?.(false, true); // Force scroll at completion
              }, 200);
            }
            return 100;
          }
          scrollToBottom?.(false, true); // Force scroll during progress updates
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(progressTimer);
    }
  }, [step, scrollToBottom]);

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
          <div>Preparing resume.pdf</div>
          <div>Resume updated November 2026</div>
        </>
      )}
      {step >= 2 && (
        <div>Preparing your download…</div>
      )}
      {step >= 3 && (
        <>
          <div>Opening the resume file…</div>
          <div>Format: PDF</div>
        </>
      )}
      {step >= 4 && (
        <>
          <div>Saving to: 'sohail_sarkar_resume.pdf'</div>
          <div></div>
        </>
      )}
      {step >= 5 && (
        <div className="text-terminal-cyan">
          {generateProgressBar(progress)}
        </div>
      )}
      {showFinalMessage && (
        <>
          <div></div>
          <div>'sohail_sarkar_resume.pdf' saved</div>
          <div></div>
          <div className="text-primary"> Resume download requested.</div>
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
  const scrollToBottom = (smooth = false, force = false) => {
    if (outputRef.current && (!userScrolledUp || force)) {
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

  // Force scroll to bottom (ignores userScrolledUp state)
  const forceScrollToBottom = (smooth = false) => {
    scrollToBottom(smooth, true);
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

    // Reset scroll state when executing commands to ensure scrolling works
    setUserScrolledUp(false);

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
            <div><span className="text-terminal-cyan">cat research.txt</span> — Research</div>
            <div><span className="text-terminal-cyan">cat publications.txt</span> — Preprints</div>
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
            <div className="text-terminal-green text-sm">~ / neel / portfolio</div>
            <div className="text-xs mt-1 font-mono leading-tight">
              <div>.</div>
              <div>├── <span className="text-terminal-cyan">Applications/</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>└── chai chat.app</span></div>
              <div>├── about.txt</div>
              <div>├── achievements.txt</div>
              <div>├── activities.txt</div>
              <div>├── <span className="text-terminal-cyan">archives/</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── old_experience.txt</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>└── old_projects.txt</span></div>
              <div>├── education.txt</div>
              <div>├── experience.txt</div>
              <div>├── research.txt</div>
              <div>├── publications.txt</div>
              <div>├── <span className="text-terminal-cyan">projects/</span></div>
              <div>├── <span className="text-terminal-cyan">skills/</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── ai_ml</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── databases</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── devtools</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── frameworks</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>├── languages</span></div>
              <div>│<span style={{paddingLeft: '30px'}}>└── other</span></div>
              <div>└── <span className="text-terminal-cyan">socials/</span></div>
            </div>
            <div className="text-muted-foreground text-xs mt-2 italic">
              Tip: Use <span className="text-terminal-cyan">cat archives/old_projects.txt</span> to view archived projects
            </div>
          </div>
        );
        break;

      case "cat about.txt":
        output = <PortfolioSection section="about" onCommand={executeCommand} />;
        break;
      case "cd projects":
        output = <PortfolioSection section="projects" onCommand={executeCommand} />;
        break;
      case "cat experience.txt":
        output = <PortfolioSection section="experience" onCommand={executeCommand} />;
        break;
      case "cat research.txt":
        output = <PortfolioSection section="research" />;
        break;
      case "cat publications.txt":
        output = <PortfolioSection section="publications" />;
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
                <div className="text-sm text-muted-foreground">Non-internship experiences</div>
              </TypewriterEffect>

              <div className="flex items-start space-x-3">
                <ImageLoader
                  src="/jpmorgan.png"
                  alt="JP Morgan Chase Logo"
                  className="w-12 h-12 rounded object-contain bg-white p-1"
                />
                <div className="flex-1">
                  <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                    <div className="text-terminal-cyan font-semibold">Virtual Data Science Fellow, JP Morgan Chase @ Forage</div>
                    <div className="text-muted-foreground">Remote — May 2022–Aug 2022</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20}>
                    <div className="ml-4 mt-1 text-sm">- Collaborated with a team of 5 to architect and implement a risk analytics dashboard using Python, Apache Spark, and sci-kit-learn. Leveraged an XGBoost model for market volatility forecasting, integrated Apache Kafka for real-time data streaming, and developed visualizations with D3.js to support data-driven trading strategies.</div>
                    <div className="ml-4 text-sm">- Interfaced with real-time financial data feeds and a fixed client-side web application, utilizing Perspective to generate live, visually strategic graphs that display market data for traders.</div>
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
                    <div className="text-muted-foreground">Toronto, ON — Sept 2022–Present</div>
                  </TypewriterEffect>
                  <TypewriterEffect delay={20}>
                    <div className="ml-4 mt-1 text-sm">- Managed accounts for a diverse user base utilizing the UofT database and Microsoft Entra ID. Provided technical and software support for Win, Linux, Mac, AV devices, and VoIP systems. Managed tickets & documentation on ServiceNow. .</div>
                  </TypewriterEffect>
                </div>
              </div>
            </div>
          </AnimatedTerminalOutput>
        );
        break;

      case "cat archives/old_projects.txt":
        output = (
          <AnimatedTerminalOutput>
            <div className="border border-terminal-cyan rounded-md p-4 bg-card/50 space-y-6">
              <TypewriterEffect delay={30}>
                <div className="text-primary font-semibold">📁 Archived Projects</div>
                <div className="text-sm text-muted-foreground">Personal projects from my earlier work</div>
              </TypewriterEffect>

              <div>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div className="text-terminal-cyan font-semibold">Fine-Tuned Stock Analysis LLM — Nov 2024</div>
                </TypewriterEffect>
                <div className="ml-4 flex flex-wrap mb-3">
                  <SkillItem skill="QLoRA" />
                  <SkillItem skill="PyTorch" />
                  <SkillItem skill="bitsandbytes" />
                  <SkillItem skill="PEFT" />
                  <SkillItem skill="CUDA" />
                </div>
                <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                  <div className="text-muted-foreground ml-4">→ Trained Llama-3.1-8B on market reports, earnings-call transcripts, and SEC filings using a QLoRA setup (4-bit via bitsandbytes) with LoRA adapters optimized via PEFT on an NVIDIA RTX 3090 (CUDA).</div>
                  <div className="text-muted-foreground ml-4">→ Implemented Bayesian rank-gating to adjust LoRA rank per layer, maintaining performance while reducing memory and compute overhead.</div>
                </TypewriterEffect>
              </div>

              <div>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div className="text-terminal-cyan font-semibold">Recommendation Engine — Mar 2024</div>
                </TypewriterEffect>
                <div className="ml-4 flex flex-wrap mb-3">
                  <SkillItem skill="Neo4j" />
                  <SkillItem skill="PyTorch" />
                  <SkillItem skill="FastAPI" />
                  <SkillItem skill="Dagster" />
                  <SkillItem skill="AWS EKS (Kubernetes)" />
                  <SkillItem skill="Docker" />
                </div>
                <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                  <div className="text-muted-foreground ml-4">→ Built a hybrid recommender: implicit-feedback ALS on watch history combined with content/graph signals from a Neo4j knowledge graph (genre, director, actors, keywords), fused with a learned re-ranker.</div>
                  <div className="text-muted-foreground ml-4">→ Containerized a FastAPI inference service and Dagster training/refresh pipelines; deployed on AWS EKS (Kubernetes) with autoscaled endpoints (Docker) for scalable and low-latency recommendation delivery.</div>
                </TypewriterEffect>
              </div>

              <div>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div className="text-terminal-cyan font-semibold">OCR Digitizer Automation — May 2023</div>
                </TypewriterEffect>
                <div className="ml-4 flex flex-wrap mb-3">
                  <SkillItem skill="TensorFlow.NET" />
                  <SkillItem skill="C#" />
                  <SkillItem skill="WPF" />
                  <SkillItem skill="Keras.NET" />
                  <SkillItem skill="PostgreSQL" />
                  <SkillItem skill="Pandas/Excel" />
                </div>
                <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                  <div className="text-muted-foreground ml-4">→ Developed a Windows desktop app with a CRNN-style OCR (CNN → BiLSTM → CTC) and beam-search decoding, plus layout segmentation and post-processing (normalization, de-duplication, schema validation); wrote normalized records to PostgreSQL and exported QA/exception reports via Pandas/Excel.</div>
                  <div className="text-muted-foreground ml-4">→ Licensed as on-premise/per-seat software; generated <span className="text-terminal-green">USD 35,000</span> in sales by licensing to legal and supply-chain firms around North-Bengal.</div>
                </TypewriterEffect>
              </div>

              <div>
                <TypewriterEffect delay={25} scrollToBottom={scrollToBottom}>
                  <div className="text-terminal-cyan font-semibold">Modified SIR — Feb 2022</div>
                </TypewriterEffect>
                <div className="ml-4 flex flex-wrap mb-3">
                  <SkillItem skill="immunology" />
                  <SkillItem skill="PDEs" />
                  <SkillItem skill="SciPy" />
                  <SkillItem skill="Pandas" />
                  <SkillItem skill="PyMC3" />
                  <SkillItem skill="FilterPy" />
                </div>
                <TypewriterEffect delay={20} scrollToBottom={scrollToBottom}>
                  <div className="text-muted-foreground ml-4">→ Extended the classical SIR model into an age-stratified SEIRV framework incorporating Exposed and Vaccinated compartments, non-constant population dynamics, and heterogeneous risk groups. Solved the coupled ODEs in SciPy and performed Bayesian parameter inference in PyMC3.</div>
                  <div className="text-muted-foreground ml-4">→ Applied Unscented and Particle Filters (FilterPy) to perform sequential Bayesian updates of transmission parameters and compartment values (S, E, I, R, V) over time using static COVID-19 datasets.</div>
                </TypewriterEffect>
              </div>
            </div>
          </AnimatedTerminalOutput>
        );
        break;

      case "ls ./skills/":
        output = <PortfolioSection section="skills" onCommand={executeCommand} />;
        break;
      case "whereis socials":
        output = <PortfolioSection section="socials" onCommand={executeCommand} />;
        break;
      case "cat education.txt":
        output = <PortfolioSection section="education" onCommand={executeCommand} />;
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
        output = <WgetProgressAnimation scrollToBottom={scrollToBottom} key={Date.now().toString()} />;
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
        if (lowerCmd === "chat" || lowerCmd.startsWith("chat ")) {
          onCommandExecute?.("chat");
          output = <div className="text-primary">Chai is open. Send your message in the chat window.</div>;
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
    setTimeout(() => scrollToBottom(false, true), 50);
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
