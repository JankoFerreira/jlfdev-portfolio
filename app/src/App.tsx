import {type CSSProperties} from 'react';
import {About} from './About';
import {TechGlobe} from './TechGlobe';
import {RoleRotator,Loader,useOriginalInteractions} from './OriginalEffects';
export function App(){useOriginalInteractions();return <><Loader />
    <div className="fx-stage paint-atmosphere" aria-hidden="true"><canvas id="paint-canvas" /></div>
    <button id="backToTop" className="back-to-top" type="button" aria-label="Back to top">
        <span className="back-to-top__ring" aria-hidden="true"></span>
        <span className="back-to-top__core" aria-hidden="true">
            <svg className="back-to-top__icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M12 5.5l-5.25 5.25 1.5 1.5 2.75-2.75V18.5h2V9.5l2.75 2.75 1.5-1.5z"></path>
            </svg>
        </span>
        <span className="sr-only">Back to the top</span>
    </button>


<header className="navbar fade-down">
    <div className="nav-left">
        <a href="index.html" className="brand-pill" aria-label="Go to homepage">
            <span className="brand-pill-mark">JF</span>
        </a>
    </div>

    <nav className="nav-links">
        <a href="#home" className="active-link">Home</a>
        <a href="#about">About</a>
        <a href="#journey">Journey</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
    </nav>

    <button
        className="menu-btn"
        type="button"
        aria-expanded="false"
        aria-controls="sideMenu"
        aria-label="Open navigation menu"
        data-menu-toggle
    >
        &#9776;
    </button>
</header>

<div id="sideMenu" className="side-menu" aria-hidden="true">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#journey">Journey</a>
    <a href="#skills">Skills</a>
    <a href="#contact">Contact</a>
    <button type="button" className="close-btn" aria-label="Close navigation menu" data-menu-close>&times;</button>
</div>


<section id="home" className="hero">
    <div className="hero-content">
        <p className="hero-badge hero-reveal hero-reveal--1 hero-word-reveal"><span className="hero-drop-word" style={{"--hero-word-index":"0"} as CSSProperties}><span className="hero-word">Pretoria-based</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"1"} as CSSProperties}><span className="hero-word">developer</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"2"} as CSSProperties}><span className="hero-word">crafting</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"3"} as CSSProperties}><span className="hero-word">polished</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"4"} as CSSProperties}><span className="hero-word">websites</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"5"} as CSSProperties}><span className="hero-word">and</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"6"} as CSSProperties}><span className="hero-word">practical</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"7"} as CSSProperties}><span className="hero-word">digital</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"8"} as CSSProperties}><span className="hero-word">systems</span></span></p>

        <h1 className="hero-name">
            <span className="hero-name-intro hero-reveal hero-reveal--2 hero-word-reveal"><span className="hero-drop-word" style={{"--hero-word-index":"0"} as CSSProperties}><span className="hero-word">I</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"1"} as CSSProperties}><span className="hero-word">am</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"2"} as CSSProperties}><span className="hero-word">Janko</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"3"} as CSSProperties}><span className="hero-word">Ferreira,</span></span></span>
            <span className="hero-roles-line hero-reveal hero-reveal--3">
                <span className="hero-roles-prefix hero-word-reveal"><span className="hero-drop-word" style={{"--hero-word-index":"0"} as CSSProperties}><span className="hero-word">I</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"1"} as CSSProperties}><span className="hero-word">am</span></span></span> <span className="hero-role-article hero-word-reveal"><span className="hero-drop-word" style={{"--hero-word-index":"0"} as CSSProperties}><span className="hero-word">a</span></span></span>
                <RoleRotator />
            </span>
        </h1>

        <p className="hero-description hero-reveal hero-reveal--4 hero-word-reveal"><span className="hero-drop-word" style={{"--hero-word-index":"0"} as CSSProperties}><span className="hero-word">I</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"1"} as CSSProperties}><span className="hero-word">design</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"2"} as CSSProperties}><span className="hero-word">and</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"3"} as CSSProperties}><span className="hero-word">build</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"4"} as CSSProperties}><span className="hero-word">business</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"5"} as CSSProperties}><span className="hero-word">websites,</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"6"} as CSSProperties}><span className="hero-word">internal</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"7"} as CSSProperties}><span className="hero-word">tools,</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"8"} as CSSProperties}><span className="hero-word">and</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"9"} as CSSProperties}><span className="hero-word">practical</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"10"} as CSSProperties}><span className="hero-word">digital</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"11"} as CSSProperties}><span className="hero-word">systems</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"12"} as CSSProperties}><span className="hero-word">that</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"13"} as CSSProperties}><span className="hero-word">combine</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"14"} as CSSProperties}><span className="hero-word">clean</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"15"} as CSSProperties}><span className="hero-word">interfaces</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"16"} as CSSProperties}><span className="hero-word">with</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"17"} as CSSProperties}><span className="hero-word">real</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"18"} as CSSProperties}><span className="hero-word">operational</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"19"} as CSSProperties}><span className="hero-word">problem</span></span> <span className="hero-drop-word" style={{"--hero-word-index":"20"} as CSSProperties}><span className="hero-word">solving.</span></span></p>

        <div className="hero-buttons hero-reveal hero-reveal--5">
            <a href="#contact" className="hero-btn hero-btn-primary">
                Hire Me
                <span className="btn-icon" aria-hidden="true">&rarr;</span>
            </a>
            <a href="#work" className="hero-btn hero-btn-secondary">
                View Projects
                <span className="btn-icon" aria-hidden="true">&rarr;</span>
            </a>
        </div>

        <div className="hero-availability hero-reveal hero-reveal--6" aria-label="Current role and availability">
            <span>Currently: Data &amp; Systems Administrator</span>
            <span>Open to junior/full-stack web roles</span>
            <span>Pretoria / Remote</span>
        </div>

        <div className="hero-socials hero-reveal hero-reveal--6" aria-label="Professional links">
            <a href="https://github.com/JankoFerreira" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:Janko.Ferreira@gmail.com?subject=Portfolio%20Enquiry">Email</a>
        </div>

    </div>

    <div className="scroll-indicator">
        <span></span>
    </div>
</section>


<section id="skills" className="mission-section reveal-up">
    <div className="mission-inner">
        <div className="mission-text mission-text-full reveal-right">
            <p className="mission-kicker">Skills & Tools</p>
            <h2 className="glass-heading">What I Build With</h2>
            <p>
                I work across the full stack, with a strong focus on clean frontend builds,
                practical backend logic, and business-minded problem solving. These are the
                main tools I use when turning ideas into working digital solutions.
            </p>
        </div>

        <TechGlobe />
    </div>
</section>


<About />


<section id="work" className="experience-section reveal-up">
    <div className="experience-content">
        <div className="experience-section-head">
            <p className="experience-kicker">My Experience</p>
            <h2 className="glass-heading">Featured Website Projects</h2>
            <p className="experience-intro">
                A curated selection of websites presented as mini case studies: what I owned, what I built, and why each project mattered.
            </p>
        </div>

        <div className="experience-projects" aria-label="Featured website projects">
            <article className="experience-project-card">
<div className="experience-project-copy"><div className="experience-project-meta"><span className="experience-project-number">01</span><span className="experience-project-category">Live Studio Website</span></div><h3>NXW Studios</h3><p>A completed studio website with a custom 3D experience, built to bring the studio's identity to life.</p><dl className="experience-project-proof"><div><dt>Role</dt><dd>Designer and frontend developer</dd></div><div><dt>Outcome</dt><dd>Completed and launched at nxwbstudios.co.za.</dd></div></dl><div className="experience-project-actions"><a className="experience-project-button" href="https://nxwbstudios.co.za/" target="_blank" rel="noopener noreferrer">Visit Website</a></div><ul className="experience-project-tags"><li>React</li><li>WebGL</li><li>Three.js</li></ul></div>
<figure className="experience-project-preview" aria-label="NXW Studios project"><div className="experience-project-preview-frame"><div className="experience-project-preview-toolbar"><span></span><span></span><span></span></div><div className="experience-project-preview-screen"><div className="nxw-placeholder">NXW<span>STUDIOS / LIVE WEBSITE</span></div></div></div></figure></article>

            <article className="experience-project-card">
                <div className="experience-project-copy">
                    <div className="experience-project-meta">
                        <span className="experience-project-number">02</span>
                        <span className="experience-project-category">Informational / Community Website</span>
                    </div>
                    <h3>LYP SA</h3>
                    <p>
                        A modern informational website created to present camp and church-related content in a cleaner, more engaging, and more accessible format.
                    </p>
                    <dl className="experience-project-proof">
                        <div>
                            <dt>Role</dt>
                            <dd>Frontend developer and content-structure designer</dd>
                        </div>
                        <div>
                            <dt>Problem</dt>
                            <dd>The organisation needed information to feel easier to browse, trust, and act on.</dd>
                        </div>
                        <div>
                            <dt>Outcome</dt>
                            <dd>Created a cleaner public-facing experience with simplified navigation and clearer content grouping.</dd>
                        </div>
                    </dl>
                    <div className="experience-project-actions">
                        <a href="https://lypsa.co.za/" className="experience-project-button" target="_blank" rel="noopener noreferrer">
                            Visit Website
                        </a>
                    </div>
                    <ul className="experience-project-tags" aria-label="LYP SA technologies and services">
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>Informational Website</li>
                    </ul>
                </div>

                <figure className="experience-project-preview experience-project-preview--lypsa" aria-label="LYP SA website preview">
                    <div className="experience-project-preview-frame">
                        <div className="experience-project-preview-toolbar" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="experience-project-preview-screen">
                            <img src="media/lypsa.webp" alt="LYP SA website screenshot" className="experience-project-preview-image" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </figure>
            </article>

            <article className="experience-project-card">
                <div className="experience-project-copy">
                    <div className="experience-project-meta">
                        <span className="experience-project-number">03</span>
                        <span className="experience-project-category">Demo Business Website</span>
                    </div>
                    <h3>Bernina Moot</h3>
                    <p>
                        A polished demo website for a specialist sewing and machine business, focused on premium presentation, clearer structure, and stronger customer-facing design.
                    </p>
                    <dl className="experience-project-proof">
                        <div>
                            <dt>Role</dt>
                            <dd>Designer and frontend developer</dd>
                        </div>
                        <div>
                            <dt>Problem</dt>
                            <dd>The concept needed to make a specialist retail/service business feel modern, trustworthy, and easy to explore.</dd>
                        </div>
                        <div>
                            <dt>Outcome</dt>
                            <dd>Built a responsive demo with polished visuals, product/service framing, and a more premium brand impression.</dd>
                        </div>
                    </dl>
                    <div className="experience-project-actions">
                        <a href="https://jankoferreira.github.io/Berninamoot-demo-website/" className="experience-project-button" target="_blank" rel="noopener noreferrer">
                            Visit Website
                        </a>
                        <a href="https://github.com/JankoFerreira/Berninamoot-demo-website" className="experience-project-link" target="_blank" rel="noopener noreferrer" aria-label="Open Bernina Moot source code in a new tab">
                            Source Code
                        </a>
                    </div>
                    <ul className="experience-project-tags" aria-label="Bernina Moot technologies and services">
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>Demo Website</li>
                    </ul>
                </div>

                <figure className="experience-project-preview experience-project-preview--bernina" aria-label="Bernina Moot website preview">
                    <div className="experience-project-preview-frame">
                        <div className="experience-project-preview-toolbar" aria-hidden="true">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="experience-project-preview-screen">
                            <img src="media/bernina.webp" alt="Bernina Moot website screenshot" className="experience-project-preview-image" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </figure>
            </article>
        </div>

        <div className="experience-marquee-block">
            <div className="experience-marquee-head">
                <p className="experience-mini">More Demo Websites</p>
                <p className="experience-marquee-copy">A broader look at additional demo websites and concept builds.</p>
            </div>

            <div className="experience-marquee" aria-label="Additional demo website links">
                <div className="experience-marquee-track">
                    <a href="https://jankoferreira.github.io/vela-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--text">V</span>
                        <span>VELA Beauty Studio</span>
                    </a>
                    <a href="https://jankoferreira.github.io/ComputerHaven-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/computerhaven.svg" alt="ComputerHaven logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>ComputerHaven</span>
                    </a>
                    <a href="https://jankoferreira.github.io/oldchapel-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/old-chapel-vet.svg" alt="Old Chapel Vet logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Old Chapel Vet</span>
                    </a>
                    <a href="https://jankoferreira.github.io/photographer-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/photographer-demo.svg" alt="Photographer Demo logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Photographer Demo</span>
                    </a>
                    <a href="https://jankoferreira.github.io/Portfolio-demo-site/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/portfolio-demo.svg" alt="Portfolio Demo logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Portfolio Demo</span>
                    </a>
                    <a href="#" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--text">IG</span>
                        <span>Interfit Gym</span>
                    </a>
                    <a href="https://jlfdev.co.za/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/jlf-dev.svg" alt="JLF Dev logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>JLF Dev</span>
                    </a>
                    <a href="https://jankoferreira.github.io/Berninamoot-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/bernina-moot.svg" alt="Bernina Moot logo" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Bernina Moot</span>
                    </a>
                    
                    <a href="https://lypsa.co.za/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer">
                        <span className="experience-marquee-mark experience-marquee-mark--logo experience-marquee-mark--wide">
                            <img src="images/demo-logos/lypsa-logo.webp" alt="LYP SA logo" className="experience-marquee-logo experience-marquee-logo--wide" loading="lazy" decoding="async" />
                        </span>
                        <span>LYP SA</span>
                    </a>

                    <a href="https://jankoferreira.github.io/vela-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--text">V</span>
                        <span>VELA Beauty Studio</span>
                    </a>
                    <a href="https://jankoferreira.github.io/ComputerHaven-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/computerhaven.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>ComputerHaven</span>
                    </a>
                    <a href="https://jankoferreira.github.io/oldchapel-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/old-chapel-vet.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Old Chapel Vet</span>
                    </a>
                    <a href="https://jankoferreira.github.io/photographer-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/photographer-demo.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Photographer Demo</span>
                    </a>
                    <a href="https://jankoferreira.github.io/Portfolio-demo-site/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/portfolio-demo.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Portfolio Demo</span>
                    </a>
                    <a href="#" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--text">IG</span>
                        <span>Interfit Gym</span>
                    </a>
                    <a href="https://jlfdev.co.za/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/jlf-dev.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>JLF Dev</span>
                    </a>
                    <a href="https://jankoferreira.github.io/Berninamoot-demo-website/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo">
                            <img src="images/demo-logos/bernina-moot.svg" alt="" className="experience-marquee-logo" loading="lazy" decoding="async" />
                        </span>
                        <span>Bernina Moot</span>
                    </a>
                    
                    <a href="https://lypsa.co.za/" className="experience-marquee-pill" target="_blank" rel="noopener noreferrer" aria-hidden="true" tabIndex={-1}>
                        <span className="experience-marquee-mark experience-marquee-mark--logo experience-marquee-mark--wide">
                            <img src="images/demo-logos/lypsa-logo.webp" alt="" className="experience-marquee-logo experience-marquee-logo--wide" loading="lazy" decoding="async" />
                        </span>
                        <span>LYP SA</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="journey" className="portfolio-journey">
    <div className="journey-hud" aria-hidden="true">
        <span className="journey-hud__grid"></span>
        <span className="journey-hud__radar"></span>
        <span className="journey-hud__beam"></span>
        <span className="journey-hud__blip journey-hud__blip--1"></span>
        <span className="journey-hud__blip journey-hud__blip--2"></span>
        <span className="journey-hud__blip journey-hud__blip--3"></span>
    </div>

    <div className="journey-shell">
        <div className="journey-heading reveal-up">
            <div className="journey-heading-copy">
                <p className="journey-kicker">Career timeline</p>
                <h2 className="journey-title glass-heading">The Journey Behind the Code</h2>
                <p className="journey-intro">
                    A recruiter-readable timeline of my leadership foundation, systems work, current development responsibilities, and shipped website projects.
                </p>
            </div>
        </div>

        <div className="journey-timeline">
        <div
            className="journey-item reveal-left"
            data-journey-year="2018-2022"
            data-journey-title="Foundations & Leadership"
            data-journey-role="Leadership signal stabilised"
            data-journey-stack="Teamwork, discipline, communication"
            data-journey-impact="Built the personal operating system that later made technical work sustainable."
            data-journey-status="Core traits online"
        >
            <div className="journey-card">
                <div className="journey-date">2018-2022</div>

                <div className="journey-text">
                    <h4>Foundations & Leadership</h4>
                    <p className="journey-sub">2018-2022</p>

                    <ul>
                        <li>Built strong leadership, teamwork, and discipline through academics, sports, and youth leadership roles.</li>
                        <li>Recognised for entrepreneurship and leadership during high school and church youth camps.</li>
                    </ul>

                    <div className="journey-insight">
                        <div className="journey-insight-label">System Readout</div>
                        <div className="journey-insight-grid">
                            <span><strong>Role:</strong> Leadership signal stabilised</span>
                            <span><strong>Stack:</strong> Teamwork, discipline, communication</span>
                            <span><strong>Impact:</strong> Built the operating system behind later technical growth.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="journey-item reveal-left"
            data-journey-year="2020-2022"
            data-journey-title="Entrepreneurship & Technical Exposure"
            data-journey-role="Builder mindset activated"
            data-journey-stack="Client work, self-management, practical problem solving"
            data-journey-impact="Learned how to own outcomes, timelines, and real-world constraints."
            data-journey-status="Independent execution online"
        >
            <div className="journey-card">
                <div className="journey-date">2020-2022</div>

                <div className="journey-text">
                    <h4>Entrepreneurship & Technical Exposure</h4>
                    <p className="journey-sub">2020-2022</p>

                    <ul>
                        <li>Started and ran a small woodworking business during COVID, progressing from animal enclosures to furniture and custom builds.</li>
                        <li>Gained hands-on experience in problem solving, client work, time-management and self-management.</li>
                    </ul>

                    <div className="journey-insight">
                        <div className="journey-insight-label">System Readout</div>
                        <div className="journey-insight-grid">
                            <span><strong>Role:</strong> Builder mindset activated</span>
                            <span><strong>Stack:</strong> Client work, self-management, problem solving</span>
                            <span><strong>Impact:</strong> Learned how to own timelines and outcomes.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="journey-item reveal-left"
            data-journey-year="2023"
            data-journey-title="Transition into Technology"
            data-journey-role="Direction lock acquired"
            data-journey-stack="Leadership, logistics, technical infrastructure"
            data-journey-impact="Bridged hands-on field experience into a clear software development trajectory."
            data-journey-status="Transition corridor open"
        >
            <div className="journey-card">
                <div className="journey-date">2023</div>

                <div className="journey-text">
                    <h4>Transition into Technology</h4>
                    <p className="journey-sub">2023</p>

                    <ul>
                        <li>Worked in team leadership and construction environments while preparing for formal studies in software development.</li>
                        <li>Relocated to Pretoria and assisted with large-scale office setup and technical infrastructure.</li>
                    </ul>

                    <div className="journey-insight">
                        <div className="journey-insight-label">System Readout</div>
                        <div className="journey-insight-grid">
                            <span><strong>Role:</strong> Direction lock acquired</span>
                            <span><strong>Stack:</strong> Leadership, logistics, infrastructure</span>
                            <span><strong>Impact:</strong> Turned field experience into a clear tech path.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="journey-item reveal-left"
            data-journey-year="2024-Present"
            data-journey-title="Data & Systems Development"
            data-journey-role="Data & Systems Developer"
            data-journey-stack="AppSheet, VBA, process digitisation"
            data-journey-impact="Developing internal applications and automations that reduce manual admin and improve operational visibility."
            data-journey-status="Current role"
        >
            <div className="journey-card">
                <div className="journey-date">2024-Present</div>

                <div className="journey-text">
                    <h4>Data & Systems Development</h4>
                    <p className="journey-sub">2024-Present</p>

                    <ul>
                        <li>Currently working in a Data &amp; Systems role, developing AppSheet web and mobile applications.</li>
                        <li>Automating workflows with VBA and digitising processes to improve efficiency, consistency, and operational visibility.</li>
                        <li>Working with practical business requirements, user workflows, and structured data to build tools people can actually use.</li>
                    </ul>

                    <div className="journey-insight">
                        <div className="journey-insight-label">System Readout</div>
                        <div className="journey-insight-grid">
                            <span><strong>Role:</strong> Data &amp; Systems Developer</span>
                            <span><strong>Stack:</strong> AppSheet, VBA, process design</span>
                            <span><strong>Impact:</strong> Internal tools that reduce friction and manual overhead.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            className="journey-item reveal-left"
            data-journey-year="2025-Present"
            data-journey-title="Frontend & Web Development Focus"
            data-journey-role="Frontend / web developer"
            data-journey-stack="HTML, CSS, JavaScript, client websites"
            data-journey-impact="Building responsive websites, portfolio projects, and business-facing user interfaces."
            data-journey-status="Active portfolio growth"
        >
            <div className="journey-card">
                <div className="journey-date">2025-Present</div>

                <div className="journey-text">
                    <h4>Frontend & Web Development Focus</h4>
                    <p className="journey-sub">2025-Present</p>

                    <ul>
                        <li>Actively building and deploying websites for clients while sharpening frontend development, responsive layout, and interaction design.</li>
                        <li>Designed and coded this personal CV portfolio using HTML, CSS, and JavaScript to demonstrate both visual craft and implementation ability.</li>
                        <li>Building toward full-stack delivery with Python, FastAPI, SQL, and database-backed web systems.</li>
                    </ul>

                    <div className="journey-insight">
                        <div className="journey-insight-label">System Readout</div>
                        <div className="journey-insight-grid">
                            <span><strong>Role:</strong> Frontend / web developer</span>
                            <span><strong>Stack:</strong> HTML, CSS, JavaScript, client delivery</span>
                            <span><strong>Impact:</strong> Responsive websites and clearer digital experiences.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <article className="journey-item reveal-up" id="atlas"><div className="journey-card"><div className="journey-date">2026</div><div className="journey-text"><h4>Graduation &amp; Ferion Atlas</h4><p>Completed the Higher Certificate in Information Systems (Software Development) at Eduvos.</p><p>Building Ferion Atlas, an asset and inventory platform using React, TypeScript, FastAPI and PostgreSQL. Currently in pilot development.</p></div></div></article></div></div></section>

<section id="contact" className="contact-section reveal-up">
    <h2 className="contact-title glass-heading">Let's Work Together</h2>

    <p className="contact-subtitle">
        Looking for a junior/full-stack web developer, or need a polished website or internal tool?
        I'm open to roles, freelance work, and practical collaborations.
    </p>

    <form
        action="https://formspree.io/f/mdaazpvn"
        method="POST"
        className="contact-form"
        id="contactForm"
    >
        <div className="input-group">
            <input type="text" name="name" id="contact-name" autoComplete="name" required />
            <label htmlFor="contact-name">Your Name</label>
        </div>

        <div className="input-group">
            <input type="email" name="email" id="contact-email" autoComplete="email" required />
            <label htmlFor="contact-email">Email Address</label>
        </div>

        <div className="input-group">
            <textarea name="message" id="contact-message" rows={4} required></textarea>
            <label htmlFor="contact-message">Your Message</label>
        </div>

        <input type="text" name="company" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <button type="submit" className="contact-btn" id="sendBtn">
            <span className="btn-text">Send Message</span>
            <span className="btn-arrow" aria-hidden="true">&rarr;</span>
        </button>
        <p className="form-status sr-only" id="formStatus" role="status" aria-live="polite"></p>
    </form>
</section>


<footer>
    <p>Connect with me:</p>
    <div className="connect-links">
        <a
            href="https://wa.me/27682712616?text=Hi%20I%20found%20your%20portfolio%20website"
            target="_blank"
            rel="noopener noreferrer"
            className="connect-btn whatsapp"
        >
            WhatsApp
        </a>

        <a href="mailto:Janko.Ferreira@gmail.com?subject=Portfolio%20Enquiry&body=Hi%20I%20found%20your%20portfolio%20website" className="connect-btn email">
            Email
        </a>

        <a href="https://github.com/JankoFerreira" target="_blank" rel="noopener noreferrer" className="connect-btn github">
            GitHub
        </a>
    </div>
</footer></>;}