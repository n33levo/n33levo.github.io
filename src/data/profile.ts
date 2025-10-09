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
      "Currently engineering an agentic EDA(Exploratory Data Analysis)-to-ETL pipeline, ensembling CatBoost with TabPFN for success-factors behavior prediction.",
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
      "Reinforced processing with claimification-based cross-referencing for all answers, achieving 100% factual accuracy.",
      "Contributed layers in the neural retriever, cutting batch inference time from 20 min to 3 min.",
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
      "Shipped an OAuth-secured ticketing system for IT desk at E.J. Pratt. Used MongoDB and Redis for persistent storage and session management.",
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
    location: "London, England",
    details: "ACTL Classical Guitar — June 2021",
    logoSrc: "/trinity_college_london_logo.png",
    logoAlt: "Trinity College Logo",
  },
];

export const projects: ProjectItem[] = [
  {
    id: "stock-llm",
    filename: "Fine-Tuned Stock Analysis LLM — Nov 2024",
    description: [
      "Trained Llama-3.1-8B on market reports, earnings-call transcripts, and SEC filings using a QLoRA setup (4-bit via bitsandbytes) with LoRA adapters optimized via PEFT on an NVIDIA RTX 3090 (CUDA GPU)",
      "Implemented Bayesian rank-gating to adjust LoRA rank per layer, maintaining performance while reducing memory and compute overhead.",
    ],
  },
  {
    id: "recsys",
    filename: "Recommendation Engine — Mar 2024",
    description: [
      "Built a hybrid recommender: implicit-feedback ALS on watch history combined with content/graph signals from a Neo4j knowledge graph (genre, director, actors, keywords), fused with a learned re-ranker.",
      "Containerized a FastAPI inference service and Dagster training/refresh pipelines; deployed on AWS EKS (Kubernetes) with autoscaled endpoints (Docker) for scalable and low-latency recommendation delivery.",
    ],
  },
  {
    id: "ocr-digitizer",
    filename: "OCR Digitizer Automation — May 2023",
    description: [
      "Developed a Windows desktop app with a CRNN-style OCR (CNN → BiLSTM → CTC) and beam-search decoding, plus layout segmentation and post-processing (normalization, de-duplication, schema validation); wrote normalized records to PostgreSQL and exported QA/exception reports via Pandas/Excel.",
      "Licensed as on-premise/per-seat software; generated USD 35,000 in sales by licensing to legal and supply-chain firms around North-Bengal.",
    ],
  },
  {
    id: "modified-sir",
    filename: "Modified SIR — Feb 2022",
    description: [
      "Extended the classical SIR model into an age-stratified SEIRV framework incorporating Exposed and Vaccinated compartments, non-constant population dynamics, and heterogeneous risk groups. Solved the coupled ODEs in SciPy and performed Bayesian parameter inference in PyMC3.",
      "Applied Unscented and Particle Filters (FilterPy) to perform sequential Bayesian updates of transmission parameters and compartment values (S, E, I, R, V) over time using static COVID-19 datasets.",
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

