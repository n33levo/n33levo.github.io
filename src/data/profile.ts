import portfolio from "./portfolio.json";

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
  href?: string | null;
  technologies?: string[];
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
      text: "▸ Research at PMCC AI Lab, UHN · Previously Applied AI at Lyft, Applied ML at Shopify, and Applied Scientist at Sigma Squared",
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

export const experiences: ExperienceItem[] = portfolio.experiences;
export const research: ExperienceItem[] = portfolio.research;
export const education: EducationItem[] = portfolio.education;
export const projects: ProjectItem[] = portfolio.projects;
export const socials = portfolio.socials as SocialLink[];
export const publications = portfolio.publications;
export const skills = portfolio.skills;
export const identity = portfolio.identity;
