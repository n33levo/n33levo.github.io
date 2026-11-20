import { aboutContent, education, experiences, identity, projects, publications, research, skills, socials } from "@/data/profile";

export type Section = "about" | "experience" | "research" | "education" | "projects" | "publications" | "skills" | "socials";

export function PortfolioSection({ section, onCommand }: { section: Section; onCommand?: (command: string) => void }) {
  if (section === "about") return <div className="space-y-4">
    <div className="flex items-center gap-4">
      <img src={aboutContent.profileImage.src} alt={aboutContent.profileImage.alt} className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
      <div><h2 className="text-xl font-semibold text-primary">{aboutContent.name}</h2><p>Applied Math & CS @ University of Toronto</p></div>
    </div>
    <p>{aboutContent.intro}</p>
    <ul className="space-y-2">{aboutContent.highlights.map(item => <li key={item.text}>
      {item.actionValue && onCommand ? <button className="text-left underline decoration-primary" onClick={() => onCommand(item.actionValue!)}>{item.text}</button> : item.text}
    </li>)}</ul>
  </div>;
  if (section === "experience" || section === "research") return <div className="space-y-6">
    {(section === "experience" ? experiences : research).map(item => <article key={item.organization} className="space-y-2">
      <div className="flex items-start gap-3">
        <img src={item.logoSrc} alt={item.logoAlt} className="w-12 h-12 rounded object-contain bg-white p-1" />
        <div><h3 className="font-semibold text-terminal-cyan">{item.role}, {item.organization}</h3><p className="text-sm text-muted-foreground">{item.location} · {item.dates}</p></div>
      </div>
      <ul className="list-disc pl-5 space-y-2">{item.bullets.map(text => <li key={text}>{text}</li>)}</ul>
    </article>)}
  </div>;
  if (section === "education") return <div className="space-y-4">{education.map(item => <article key={item.institution}>
    <h3 className="font-semibold text-terminal-cyan">{item.institution} · {item.location}</h3><p>{item.details}</p>
  </article>)}</div>;
  if (section === "projects") return <div className="space-y-6">{projects.map(item => <article key={item.id} className="space-y-2">
    <h3 className="font-semibold text-terminal-cyan">{item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline">{item.filename}</a> : item.filename}</h3>
    <p className="text-sm text-muted-foreground">{item.technologies?.join(" · ")}</p>
    <ul className="list-disc pl-5 space-y-2">{item.description.map(text => <li key={text}>{text}</li>)}</ul>
  </article>)}{onCommand && <button onClick={() => onCommand("cat archives/old_projects.txt")} className="text-primary underline">Earlier projects</button>}</div>;
  if (section === "publications") return <div className="space-y-6">
    <a href={identity.scholar} target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Scholar profile</a>
    {publications.map(item => <article key={item.id} className="space-y-2">
      <h3 className="font-semibold text-terminal-cyan"><a href={item.url} target="_blank" rel="noopener noreferrer" className="underline">{item.title}</a></h3>
      <p className="text-sm text-muted-foreground">{item.authors} · {item.year} · {item.status} · arXiv:{item.id}</p>
      <p>{item.summary}</p>
    </article>)}
  </div>;
  if (section === "skills") return <div className="space-y-4">{Object.entries(skills).map(([group, items]) => <div key={group}>
    <h3 className="font-semibold text-terminal-cyan">{group}</h3><p>{items.join(" · ")}</p>
  </div>)}</div>;
  return <div className="space-y-3">{socials.map(item => <p key={item.label}>
    <span className="font-semibold text-terminal-cyan">{item.label}: </span>
    <a href={item.href} target={item.type === "external" ? "_blank" : undefined} rel={item.type === "external" ? "noopener noreferrer" : undefined} className="underline break-words">{item.value}</a>
  </p>)}</div>;
}
