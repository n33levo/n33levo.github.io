import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  aboutContent,
  education,
  experiences,
  projects,
  socials,
} from "@/data/profile";

const MobileIndexSimple = () => {
  const navigate = useNavigate();

  const aboutHighlights = useMemo(() => {
    return aboutContent.highlights.map((item) => {
      if (item.actionLabel && item.text.includes(item.actionLabel)) {
        const [before, after] = item.text.split(item.actionLabel);
        return (
          <li key={item.text} className="text-sm leading-relaxed">
            {before}
            <span className="font-semibold text-primary">{item.actionLabel}</span>
            {after}
          </li>
        );
      }

      return (
        <li key={item.text} className="text-sm leading-relaxed">
          {item.text}
        </li>
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 py-8 text-center space-y-2 border-b border-border bg-card/50">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          visitor@n33lterminal:~/mobile
        </p>
        <h1 className="text-3xl font-bold text-primary">Neel&apos;s Mobile Terminal</h1>
        <p className="text-sm text-muted-foreground">
          Crafted for phone for easier reading. Experience terminal in full-screen.
        </p>
      </header>

      <main className="px-5 py-8 space-y-10">
        <section className="space-y-4" id="about">
          <h2 className="text-2xl font-semibold text-primary">About</h2>
          <div className="flex items-center gap-4">
            <img
              src={aboutContent.profileImage.src}
              alt={aboutContent.profileImage.alt}
              className="w-20 h-20 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{aboutContent.name}</p>
              <p className="text-sm text-muted-foreground">
                Applied Math & CS @ University of Toronto
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {aboutContent.intro}
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">
              {aboutContent.preludeHeading}
            </p>
            <ul className="space-y-1">{aboutHighlights}</ul>
          </div>
        </section>

        <section className="space-y-4" id="experience">
          <h2 className="text-2xl font-semibold text-primary">Experience</h2>
          <div className="space-y-6">
            {experiences.map((experience) => (
              <article
                key={`${experience.organization}-${experience.role}`}
                className="rounded-lg border border-border bg-card/60 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={experience.logoSrc}
                    alt={experience.logoAlt}
                    className="w-12 h-12 rounded bg-background object-contain p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold text-terminal-cyan">
                      {experience.role}, {experience.organization}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {experience.location} — {experience.dates}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {experience.bullets.map((bullet) => (
                    <li key={bullet}>- {bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="education">
          <h2 className="text-2xl font-semibold text-primary">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <article
                key={edu.institution}
                className="rounded-lg border border-border bg-card/60 p-4 shadow-sm flex gap-3"
              >
                <img
                  src={edu.logoSrc}
                  alt={edu.logoAlt}
                  className="w-12 h-12 rounded bg-background object-contain p-1"
                />
                <div>
                  <h3 className="text-base font-semibold text-terminal-cyan">
                    {edu.institution} — {edu.location}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.details}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="projects">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-primary">Projects</h2>
            <button
              onClick={() => navigate("/chai")}
              className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Launch Chai
            </button>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-lg border border-border bg-card/60 p-4 shadow-sm space-y-2"
              >
                <h3 className="text-base font-semibold text-terminal-cyan">
                  {project.filename}
                </h3>
                <ul className="space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description.map((line) => (
                    <li key={line}>- {line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="socials">
          <h2 className="text-2xl font-semibold text-primary">Socials</h2>
          <div className="rounded-lg border border-border bg-card/60 p-4 shadow-sm space-y-3">
            {socials.map((social) => (
              <div key={social.label} className="text-sm">
                <span className="font-semibold text-terminal-cyan">
                  {social.label}:
                </span>{" "}
                <a
                  href={social.href}
                  target={social.type === "external" ? "_blank" : undefined}
                  rel={social.type === "external" ? "noopener noreferrer" : undefined}
                  className="underline hover:text-primary"
                >
                  {social.value}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-muted-foreground border-t border-border bg-card/50">
        Built with ❤️ by Neel • Optimized for mobile screens
      </footer>
    </div>
  );
};

export default MobileIndexSimple;

