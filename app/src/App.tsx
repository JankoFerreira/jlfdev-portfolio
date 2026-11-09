import { useEffect, useRef, useState, type FormEvent } from "react";
import { About } from "./About";
import { TechGlobe } from "./TechGlobe";

const links = [["Home", "#home"], ["About", "#about"], ["Skills", "#skills"], ["Work", "#work"], ["Journey", "#journey"], ["Contact", "#contact"]] as const;
const projects = [
  { title: "NXW Studios", type: "Live studio website", description: "I designed and built the studio website around a custom 3D scene, with shader-driven geometry and scroll-linked transitions.", role: "Designer and frontend developer", outcome: "Delivered a responsive studio website with a custom WebGL experience and device-specific fallbacks.", stack: ["React", "Three.js", "WebGL", "GSAP"], url: "https://nxwbstudios.co.za/", image: null, mark: "NXW", label: "Visit website" },
  { title: "Ferion Atlas", type: "Pilot development", description: "A multi-tenant asset and inventory platform for office teams tracking equipment and stock across locations.", role: "Full-stack developer", outcome: "Built asset records, transfers, loans, stock workflows, organisation-scoped access and audit history. The system is in pilot development.", stack: ["React", "TypeScript", "FastAPI", "PostgreSQL"], url: "#atlas", image: null, mark: "ATLAS", label: "Project details" },
  { title: "LYP South Africa", type: "Community website", description: "A public website for camp and church-related information, designed to make content easier to browse and act on.", role: "Frontend developer and content-structure designer", outcome: "Created a clearer public-facing experience with simplified navigation and content grouping.", stack: ["HTML", "CSS", "JavaScript"], url: "https://lypsa.co.za/", image: "lypsa.webp", mark: "", label: "Visit website" },
  { title: "Bernina Moot", type: "Demo website", description: "A website concept for a specialist sewing and machine business, focused on clearer services and a polished customer experience.", role: "Designer and frontend developer", outcome: "Built a responsive demo with product and service information presented in a clear visual hierarchy.", stack: ["HTML", "CSS", "JavaScript"], url: "https://jankoferreira.github.io/Berninamoot-demo-website/", image: "bernina.webp", mark: "", label: "View demo" }
] as const;

function Navigation() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <header className="navbar" id="page-top">
    <a href="#home" className="brand-pill" aria-label="Janko Ferreira home"><span className="brand-pill-mark">JF</span></a>
    <nav className="nav-links" aria-label="Main navigation">{links.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav>
    <button className="menu-btn" ref={trigger} type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? "×" : "☰"}</button>
    {open && <nav id="mobile-menu" className="react-menu" aria-label="Mobile navigation">{links.map(([name, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{name}</a>)}</nav>}
  </header>;
}

function Contact() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const controller = new AbortController();
    request.current = controller; setSending(true); setStatus("");
    try {
      const response = await fetch("https://formspree.io/f/mdaazpvn", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error("Submission failed");
      form.reset(); setStatus("Thanks — your message has been sent.");
    } catch {
      if (!controller.signal.aborted) setStatus("Your message could not be sent. Please try again or email Janko.Ferreira@gmail.com.");
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setSending(false);
    }
  }
  return <section id="contact" className="contact-section">
    <h2>Let’s Work Together</h2><p>Hiring for a full-stack, frontend, or software development role? I’m open to roles, freelance work, and practical collaborations.</p>
    <form className="contact-form" onSubmit={submit}>
      <label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required />
      <label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" name="email" autoComplete="email" required />
      <label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows={5} required />
      <input name="_gotcha" type="text" hidden tabIndex={-1} autoComplete="off" />
      <button type="submit" className="hero-btn hero-btn-primary" disabled={sending}>{sending ? "Sending…" : "Send message →"}</button>
      <p role="status">{status}</p>
    </form>
  </section>;
}

export function App() {
  const hero = useRef<HTMLElement>(null);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowTop(!entry.isIntersecting));
    if (hero.current) observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="portfolio-background" aria-hidden="true" />
    <Navigation />
    <main id="main">
      <section id="home" className="hero" ref={hero}>
        <div className="hero-content">
          <p className="hero-badge">Pretoria-based developer crafting polished websites and practical digital systems</p>
          <h1 className="hero-name"><span className="hero-name-intro">I am Janko Ferreira,</span><span className="hero-roles-line">I am a <span className="highlight name-glow">Full-Stack Developer</span></span></h1>
          <p className="hero-description">I design and build business websites, internal tools, and practical digital systems that combine clean interfaces with real operational problem solving.</p>
          <div className="hero-buttons">
            <a href="#contact" className="hero-btn hero-btn-primary">Hire Me <span aria-hidden="true">→</span></a>
            <a href="#work" className="hero-btn hero-btn-secondary">View Projects <span aria-hidden="true">→</span></a>
            <a href="mailto:Janko.Ferreira@gmail.com?subject=CV%20request" className="hero-btn hero-btn-secondary">Request CV <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-availability"><span>Data &amp; Systems Administrator</span><span>Open to development roles</span><span>Pretoria / Remote</span></div>
          <div className="hero-socials"><a href="https://github.com/JankoFerreira">GitHub</a><a href="mailto:Janko.Ferreira@gmail.com">Email</a></div>
        </div>
        <a className="scroll-indicator" href="#skills" aria-label="Explore skills"><span /></a>
      </section>
      <section id="skills" className="mission-section"><div className="mission-inner">
        <div className="mission-text mission-text-full"><p className="mission-kicker">Skills &amp; Tools</p><h2 className="glass-heading">What I Build With</h2><p>I work across the full stack, with a strong focus on clean frontend builds, practical backend logic, and business-minded problem solving.</p></div>
        <TechGlobe />
      </div></section>
      <About />
      <section id="work" className="experience-section"><div className="experience-content">
        <div className="experience-section-head"><p className="experience-kicker">My Experience</p><h2 className="glass-heading">Featured Projects</h2><p className="experience-intro">What I built, the role I played, and where each project stands.</p></div>
        <div className="experience-projects">{projects.map((project, i) => <article className="experience-project-card" key={project.title}>
          <div className="experience-project-copy">
            <div className="experience-project-meta"><span className="experience-project-number">0{i + 1}</span><span className="experience-project-category">{project.type}</span></div>
            <h3>{project.title}</h3><p>{project.description}</p>
            <dl className="experience-project-proof"><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Outcome</dt><dd>{project.outcome}</dd></div></dl>
            <ul className="project-tags">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
            <a className="experience-project-button" href={project.url}>{project.label} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="experience-project-preview">{project.image ? <img src={`media/${project.image}`} alt={`${project.title} website preview`} loading="lazy" decoding="async" /> : <div className="project-monogram" aria-hidden="true">{project.mark}<span>JANKO FERREIRA / DEVELOPMENT</span></div>}</div>
        </article>)}</div>
      </div></section>
      <section id="journey" className="portfolio-journey"><div className="journey-shell">
        <div className="journey-heading"><div className="journey-heading-copy"><p className="journey-kicker">Career timeline</p><h2 className="journey-title glass-heading">The Journey Behind the Code</h2></div></div>
        <div className="journey-timeline">
          {[
            { id: "atlas", year: "2026", title: "Ferion Atlas", text: "Building a React and TypeScript frontend with a FastAPI backend and PostgreSQL data model. The pilot covers assets, inventory, access control and audit history." },
            { id: "education", year: "2026", title: "Eduvos graduate", text: "Completed the Higher Certificate in Information Systems (Software Development)." },
            { id: "experience", year: "2024–Present", title: "Data & Systems Administrator", text: "Develop and support internal tools at Living Church of God South Africa, including call centre workflows, reporting, registration, AppSheet applications and VBA automation." },
            { id: "webcast", year: "2020–Present", title: "Webcast & audiovisual operations", text: "Volunteer in live webcast production, audiovisual setup and troubleshooting." }
          ].map(item => <article className="journey-item" id={item.id} key={item.id}><div className="journey-card"><div className="journey-date">{item.year}</div><div className="journey-text"><h3>{item.title}</h3><p>{item.text}</p></div></div></article>)}
        </div>
      </div></section>
      <Contact />
    </main>
    <footer><p>Connect with me</p><div className="connect-links">
      <a className="connect-btn" href="mailto:Janko.Ferreira@gmail.com">Email</a>
      <a className="connect-btn" href="https://github.com/JankoFerreira">GitHub</a>
      <a className="connect-btn" href="https://wa.me/27682712616">WhatsApp</a>
      <a className="connect-btn" href="mailto:Janko.Ferreira@gmail.com?subject=CV%20request">Request CV</a>
    </div></footer>
    {showTop && <a className="react-back-top" href="#home" aria-label="Back to top">↑</a>}
  </>;
}
