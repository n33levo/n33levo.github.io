export interface HighlightItem {
  text: string;
  actionLabel?: string;
  actionType?: "command";
  actionValue?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  dates: string;
  bullets: string[];
  logoSrc: string;
  logoAlt: string;
}

export interface EducationItem {
  institution: string;
  location: string;
  details: string;
  logoSrc: string;
  logoAlt: string;
}

export interface ProjectItem {
  id: string;
  filename: string;
  description: string[];
}

export interface SocialLink {
  label: string;
  value: string;
  href: string;
  type?: "email" | "external";
}

export const aboutContent = {
  name: "Sohail (Neel) Sarkar",
  profileImage: {
    src: "/profilepicture.png .png",
    alt: "Sohail (Neel) Sarkar",
  },
  intro:
    "I am an Applied Maths student at the University of Toronto — I wanted to study pure math, but somewhere between proofs and pragmatism, I sold my soul to the compiler.",
  preludeHeading: "A bit about me:",
  highlights: [
    {
      text: "▸ Currently the Applied AI Resident Scientist(Intern) at Sigma Squared, under EO Ventures.",
    },
    {
      text: "▸ Into NLP, proofs, automation, modelling, compression and optimization",
    },
    {
      text: "▸ Classically trained guitarist — Bach wrote better counterpoint than most coders write loops.",
    },
    {
      text: "▸ Avid reader of Camus, Dostoevsky, and Ruskin Bond",
    },
    {
      text: "▸ Proud dog brother to Snowy and Pluto, who debug my life better than I do",
      actionLabel: "Snowy and Pluto",
      actionType: "command",
      actionValue: "ls ./snowyandpluto/",
    },
    {
      text: "▸ Perpetually caffeinated, occasionally philosophical",
    },
  ] satisfies HighlightItem[],
};

export const experiences: ExperienceItem[] = [
  {
    role: "Applied AI/Econometrics Intern",
    organization: "Sigma Squared",
    location: "Boston, MA",
    dates: "June 2025 – Present",
    logoSrc: "/sigmasquared_logo.png",
    logoAlt: "Sigma Squared Logo",
    bullets: [
      "Working on data platforms with EO Ventures and ML systems at Sigma Squared.",
      "Engineering agentic EDA-to-ETL pipeline, ensembling CatBoost with TabPFN for SWE-error prediction.",
      "Built platform-integrated, fully autonomous, prompt-triggered Agentic SDK with MCP wrapping.",
      "Co-authoring proprietary research in econometric-based performance clustering and calibration.",
    ],
  },
  {
    role: "Data Science Intern",
    organization: "PSP Investments",
    location: "Montréal, QC",
    dates: "May – July 2025",
    logoSrc: "/psp_investments_logo.png",
    logoAlt: "PSP Investments Logo",
    bullets: [
      "Architected alpha-signal research ETL pipeline answering 3,000+ analyst questions per batch.",
      "Reinforced processing with claimification-based cross-referencing, achieving 100% factual accuracy.",
      "Contributed layers in neural retriever, cutting batch inference time from 20 min → 3 min.",
    ],
  },
  {
    role: "MLOps Intern",
    organization: "University of Toronto",
    location: "Toronto, ON",
    dates: "January – April 2025",
    logoSrc: "/university_of_toronto_logo.png",
    logoAlt: "University of Toronto Logo",
    bullets: [
      "Deployed tri-campus RAG chatbot framework; automated CI/CD for indexing, evals, and releases.",
      "Delivered a distributed, hierarchical retrieval system supporting multi-tenant chat interfaces.",
      "Exposed library GPU cluster via REST control plane for LLM fine-tuning with job scheduling and telemetry.",
    ],
  },
  {
    role: "Software Engineering Intern",
    organization: "E.J. Pratt Institute",
    location: "Toronto, ON",
    dates: "Sept – Dec 2024",
    logoSrc: "/ejpratt_logo.png",
    logoAlt: "E.J. Pratt Institute Logo",
    bullets: [
      "Developed version-controlled scheduling system with Random Forest allocator using performance metrics.",
      "Shipped OAuth-secured ticketing system for IT desk backed by MongoDB persistence and Redis sessions.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    institution: "University of Toronto",
    location: "Toronto, ON",
    details:
      "B.Sc. Applied Mathematics (Honours); Minor Computer Science — Expected April 2027",
    logoSrc: "/university_of_toronto_logo.png",
    logoAlt: "University of Toronto Logo",
  },
  {
    institution: "Trinity College",
    location: "Toronto, ON",
    details: "ACTL Classical Guitar — June 2021",
    logoSrc: "/trinity_college_london_logo.png",
    logoAlt: "Trinity College Logo",
  },
];

export const projects: ProjectItem[] = [
  {
    id: "stock-llm",
    filename: "stock-llm.txt",
    description: [
      "Fine-Tuned Stock Analysis LLM (Bayesian-LoRA, PyTorch, PEFT, BitsAndBytes 4-bit).",
      "Trained on market reports, earnings transcripts, SEC filings.",
      "Implemented gated Bayesian rank selection to adapt per layer and reduce memory overhead.",
    ],
  },
  {
    id: "recsys",
    filename: "recsys.txt",
    description: [
      "Movie recommendation engine (PyTorch + Neo4j); matrix-factorization embeddings from watch/rating/review data.",
      "Scraping via bs4/Selenium; Dockerized; Phase 2 on AWS ECS + Kubernetes; Ruby on Rails UI.",
    ],
  },
  {
    id: "ocr-digitizer",
    filename: "ocr-digitizer.txt",
    description: [
      "OCR automation with TensorFlow/Keras (C# via TensorFlow.NET); PostgreSQL storage; Pandas/Excel pipelines.",
      "Licensed to law & supply-chain firms; ~$35,000 total sales.",
    ],
  },
  {
    id: "modified-sir",
    filename: "modified-sir.txt",
    description: [
      "Modified SIR with Exposed/Vaccinated compartments, non-constant population, age stratification, risk factors.",
      "Real-time COVID-19 data; MLE/Bayesian inference; Kalman/Particle filters; collaboration with Dr. Tom Crawford.",
    ],
  },
];

export const socials: SocialLink[] = [
  {
    label: "Email",
    value: "sohail.sarkar@utoronto.ca",
    href: "mailto:sohail.sarkar@utoronto.ca",
    type: "email",
  },
  {
    label: "GitHub",
    value: "github.com/n33levo",
    href: "https://github.com/n33levo",
    type: "external",
  },
  {
    label: "Instagram",
    value: "@s0hail.sarkar",
    href: "https://www.instagram.com/s0hail.sarkar/",
    type: "external",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sohailsarkar",
    href: "https://www.linkedin.com/in/sohail-sarkar-06ab10300/",
    type: "external",
  },
];

