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
      text: "▸ Currently Research@UHN + Vector Institute, Applied AI@Sigma Squared (σ²) under EO Ventures",
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
    role: "Research Intern",
    organization: "UHN + Vector Institute of AI",
    location: "Toronto, ON",
    dates: "Nov 2025 – Present",
    logoSrc: "/uhn_logo.png",
    logoAlt: "UHN Logo",
    bullets: [
      "Architecting a scalable V2G discovery framework at PMCC AI Lab on distributed cloud infrastructure; synthesizing probabilistic fine-mapping and agentic functional reasoning to prioritize causal variants in oncogenic and complex traits.",
    ],
  },
  {
    role: "Applied AI Intern",
    organization: "Sigma Squared",
    location: "Boston, MA",
    dates: "June 2025 – Present",
    logoSrc: "/sigmasquared_logo.png",
    logoAlt: "Sigma Squared Logo",
    bullets: [
      "Engineered Agentic EDA-to-ETL pipeline in PySpark with MLflow tracking; used Optuna for Bayesian hyperparameter tuning & ensemble calibration, achieving 27% variance reduction and 8% RMSE improvement; deployed via Kubernetes for large-scale predictive workflows.",
      "Cowrote low-level Agentic SDK library with MCP wrapping across 50+ workflows; scaled ETL with Airflow, Kafka, and dbt, achieving 99.95% SLA and sub-100 ms latency via caching and concurrency tuning, with OpenTelemetry SLO monitoring.",
      "Coauthoring proprietary research on econometric-based clustering for embeddings; translating theory into scalable code using probabilistic calibration and statistical modeling with PyMC, Statsmodels, and reproducible pipelines in DVC.",
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
      "Architected α-signal pipeline on Databricks using Delta Lake and Apache Spark for distributed orchestration; implemented asynchronous multi-stage parallel retrievers with Azure OpenAI Batch and trained ranking, answering 3,000+ analyst questions per batch.",
      "Reinforced answers with Microsoft Claimification extracted and cross-referenced claims with parallelised compliment retrieving; internal benchmarking achieved 99% entailment, 91.8% accuracy, 91.2% macro-F1 and ≤5.4% ambiguity.",
      "Built a Scala-based retrieval optimization layer leveraging MLlib MinHashLSH deduplication and learned query routing; reduced cross-retriever collisions by 58% and improved evidence latency from 20 to 3 minutes.",
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
      "Delivered a multi-tenant RAG chatbot with LangChain routing on Pinecone namespaces; indexed Microsoft 365 SharePoint via Microsoft Graph (delta sync) and ServiceNow Knowledge API; tracked retrieval metadata in Postgres.",
      "Shipped CI/CD for RAG (GitHub Actions + RAGAS evals) with automated index refresh and Unsloth-based GPU fine-tuning (QLoRA); instrumented pipelines with OpenTelemetry and monitored via Prometheus, cutting release time by 60%.",
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
      "Developed a version-control employee scheduling system that automates shift assignments from submitted availability; integrated a Random Forest model for reasoning-based optimization using historical performance data, improving shift coverage by 12%.",
      "Implemented OAuth-secured ticketing system with REST endpoints for ticket creation and updates; stored records in MongoDB, managed sessions with Redis, and synced analytics to Google Sheets, reducing IT desk resolution time by 40% (3d→1.8d).",
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

