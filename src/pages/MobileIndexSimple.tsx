import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { PortfolioSection, type Section } from "@/components/PortfolioSection";

const sections: { id: Section; title: string }[] = [
  { id: "about", title: "About" }, { id: "experience", title: "Experience" },
  { id: "research", title: "Research" }, { id: "publications", title: "Preprints" },
  { id: "projects", title: "Projects" }, { id: "education", title: "Education" },
  { id: "skills", title: "Skills" }, { id: "socials", title: "Links" },
];

export default function MobileIndexSimple() {
  return <div className="min-h-screen bg-background text-foreground">
    <header className="px-5 pt-16 pb-8 border-b border-border bg-card/50 relative">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <p className="text-sm text-muted-foreground font-mono">visitor@n33lterminal:~/portfolio</p>
      <h1 className="text-3xl font-bold text-primary mt-2">Neel&apos;s Terminal</h1>
      <nav className="flex flex-wrap gap-3 mt-5" aria-label="Portfolio shortcuts">
        <a href="#publications" className="underline text-primary">Preprints</a>
        <Link to="/ai" className="underline text-primary">Ask my AI rep</Link>
        <Link to="/chai" className="underline text-primary">Chai</Link>
        <a href="/resume.pdf" download className="underline text-primary">Resume</a>
      </nav>
    </header>
    <main className="max-w-3xl mx-auto px-5 py-8 space-y-12 text-base leading-relaxed">
      {sections.map(({ id, title }) => <section key={id} id={id} className="space-y-5 scroll-mt-6">
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        <PortfolioSection section={id} />
      </section>)}
    </main>
    <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border">Built by Neel · Toronto</footer>
  </div>;
}
