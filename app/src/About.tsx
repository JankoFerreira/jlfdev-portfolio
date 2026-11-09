import { useState } from "react";
export function About() {
const [portrait,setPortrait] = useState("media/about5.webp");
return (
<section onMouseLeave={() => setPortrait("media/about5.webp")} id="about" className="jlf-about-section reveal-up" aria-labelledby="jlf-about-identity-heading">
    <div className="jlf-about-shell">
        <div className="jlf-about-grid">
            <article className="jlf-about-card jlf-about-card--identity">
                <p className="jlf-about-label">IDENTITY</p>
                <h2 id="jlf-about-identity-heading" className="jlf-about-identity-title">
                    <span>JANKO</span>
                    <span>FERREIRA</span>
                </h2>
                <p className="jlf-about-identity-subtext">FULL-STACK DEVELOPER</p>
            </article>

            <article className="jlf-about-card jlf-about-card--snapshot">
                <p className="jlf-about-label">PROFILE</p>
                <h3 className="jlf-about-title">What I'm focused on right now.</h3>

                <div className="jlf-about-signals-stack" aria-label="Quick snapshot cards">
                    <article className="jlf-about-signal jlf-about-signal--discipline" onMouseEnter={() => setPortrait("media/discipline1.webp")} onFocus={() => setPortrait("media/discipline1.webp")} tabIndex={0}>
                        <h4>DISCIPLINE</h4>
                        <p>Discipline is not optional for me.</p>
                        <p>I train consistently, stay active through a Run/Walk Club, and earned my Lifeguard certification — all of which shape my focus, resilience, and work ethic.</p>
                    </article>

                    <article className="jlf-about-signal jlf-about-signal--education" onMouseEnter={() => setPortrait("media/about10.webp")} onFocus={() => setPortrait("media/about10.webp")} tabIndex={0}>
                        <h4>EDUCATION</h4>
                        <p>Graduated from Eduvos in 2026 with a Higher Certificate in Information Systems (Software Development).</p>
                    </article>

                    <article className="jlf-about-signal jlf-about-signal--growth" onMouseEnter={() => setPortrait("media/about6.webp")} onFocus={() => setPortrait("media/about6.webp")} tabIndex={0}>
                        <h4>GROWTH</h4>
                        <p>I learn fast, but I apply faster.</p>
                        <p>Every new skill is tested in real builds - turning knowledge into working systems, not just theory.</p>
                    </article>
                </div>
            </article>

            <article className="jlf-about-card jlf-about-card--mindset jlf-about-card--direction">
                <p className="jlf-about-label">DIRECTION</p>
                <h3 className="jlf-about-title">Building forward.</h3>
                <span className="jlf-about-accent" aria-hidden="true"></span>
                <p className="jlf-about-copy">
                    I focus on building with purpose - always moving forward, improving systems, and creating solutions that actually make an impact.
                </p>

                <div className="jlf-about-mindset-media">
                    <img src="media/ocean4.webp" alt="Sunrise over the ocean with a low horizon and reflected light across the water." loading="lazy" decoding="async" />
                    <span className="jlf-about-tag jlf-about-tag--forward">FORWARD</span>
                </div>

                <p className="jlf-about-copy jlf-about-copy--compact">
                    Every project is a step toward something better, not just something finished.
                </p>
            </article>

            <article className="jlf-about-card jlf-about-card--portrait">
                <div className="jlf-about-portrait-frame">
                    <img
                        src={portrait}
                        alt="Portrait of Janko Ferreira in a suit."
                        loading="lazy"
                        decoding="async"
                        data-default-src="media/about5.webp"
                        data-discipline-src="media/discipline1.webp"
                        data-education-src="media/about10.webp"
                        data-growth-src="media/about6.webp"
                        data-perspective-src="media/about2.webp"
                     />
                </div>
            </article>

            <article className="jlf-about-card jlf-about-card--focus">
                <p className="jlf-about-label">CURRENT FOCUS</p>
                <h3 className="jlf-about-title">Current Focus</h3>
                <p className="jlf-about-focus-subtitle">Web applications and workflow automation.</p>
                <span className="jlf-about-accent" aria-hidden="true"></span>

                <p className="jlf-about-copy">
                    I build websites and internal tools, drawing on my work as a Data &amp; Systems Administrator to understand the workflows behind them.
                </p>
                <p className="jlf-about-copy jlf-about-copy--compact">
                    From clean front-end experiences to powerful backend systems and automation, I focus on building solutions that are both practical and high-performing.
                </p>

                <div className="jlf-about-focus-reel" aria-label="Technology skills">
                    <div className="jlf-about-focus-track">
                        <div className="jlf-about-focus-pill">
                            <img src="media/html5.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>HTML5</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/css3.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>CSS3</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/javascript.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>JavaScript</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/python.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>Python</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/fastapi.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>FastAPI</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/postgresql.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>PostgreSQL</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/sqlite.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>SQLite</span>
                        </div>
                        <div className="jlf-about-focus-pill">
                            <img src="media/git.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            <span>Git</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/html5.svg" alt="" loading="lazy" decoding="async" />
                            <span>HTML5</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/css3.svg" alt="" loading="lazy" decoding="async" />
                            <span>CSS3</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/javascript.svg" alt="" loading="lazy" decoding="async" />
                            <span>JavaScript</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/python.svg" alt="" loading="lazy" decoding="async" />
                            <span>Python</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/fastapi.svg" alt="" loading="lazy" decoding="async" />
                            <span>FastAPI</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/postgresql.svg" alt="" loading="lazy" decoding="async" />
                            <span>PostgreSQL</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/sqlite.svg" alt="" loading="lazy" decoding="async" />
                            <span>SQLite</span>
                        </div>
                        <div className="jlf-about-focus-pill" aria-hidden="true">
                            <img src="media/git.svg" alt="" loading="lazy" decoding="async" />
                            <span>Git</span>
                        </div>
                    </div>
                </div>
            </article>

            <article className="jlf-about-card jlf-about-card--craft">
                <div className="jlf-about-craft-copy">
                    <p className="jlf-about-label">PERSPECTIVE</p>
                    <h3 className="jlf-about-title">Looking beyond the immediate.</h3>
                    <span className="jlf-about-accent" aria-hidden="true"></span>
                    <p className="jlf-about-copy">
                        I value perspective - stepping back, thinking clearly, and keeping sight of the bigger picture. It helps me stay grounded, make better decisions, and build with more intention.
                    </p>
                </div>
            </article>
        </div>
    </div>
</section>

);
}
