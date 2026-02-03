const { useState } = React;

const services = [
    {
        title: "Web pages",
        description: "Fast, secure, and intentional sites that feel bespoke. From landing pages to full marketing stacks.",
        tags: ["Design systems", "Headless CMS", "Performance tuning"]
    },
    {
        title: "Application & system development",
        description: "APIs, internal tools, integrations, and automation that keep your operations humming.",
        tags: ["APIs & services", "Data flows", "DevOps & CI/CD"]
    },
    {
        title: "Security & reliability",
        description: "Security-first builds with observability, zero-trust posture, and incident-ready playbooks.",
        tags: ["Threat modeling", "Monitoring", "Hardening"]
    },
    {
        title: "AI & IT consultancy",
        description: "Practical AI, cloud, and IT guidance that ships. We pair strategy with hands-on implementation.",
        tags: ["AI copilots", "Cloud economics", "Delivery coaching"]
    }
];

const quickLinks = [
    { title: "Grafana dashboards", note: "Live service health and SLOs" },
    { title: "Server notes", note: "Runbooks, handovers, and maintenance logs" },
    { title: "Deployment board", note: "Releases, approvals, and rollback plans" }
];

const TopNav = () => (
    <nav className="top-nav">
        <div className="brand">
            <img src="wdev.png" alt="Wegener Development logo" className="brand-mark" />
            <div>
                <p className="eyebrow">Wegener Development</p>
                <p className="muted">Secure systems, clear execution.</p>
            </div>
        </div>
        <div className="nav-actions">
            <a href="#services" className="ghost">Services</a>
            <a href="#operations" className="ghost">Operations</a>
            <a href="#contact" className="cta">Let's talk</a>
        </div>
    </nav>
);

const LoginPanel = () => {
    const [status, setStatus] = useState("Access Grafana dashboards, server notes, and operations tools.");

    const handleSubmit = (event) => {
        event.preventDefault();
        setStatus("Request sent. Use SSO/VPN for Grafana and internal notes.");
    };

    return (
        <div className="login-panel" id="login">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Operations login</p>
                    <h3>Secure access</h3>
                </div>
                <span className="status-chip">Protected</span>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="email">Work email</label>
                    <input id="email" type="email" placeholder="you@wegener.no" required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="field inline">
                    <label htmlFor="otp">MFA code</label>
                    <input id="otp" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="123 456" />
                    <button type="submit" className="cta">Log in</button>
                </div>
            </form>
            <p className="login-status">{status}</p>
            <div className="quick-links">
                {quickLinks.map((link) => (
                    <div key={link.title} className="quick-link">
                        <div>
                            <p className="quick-title">{link.title}</p>
                            <p className="muted small">{link.note}</p>
                        </div>
                        <button className="ghost small-btn" type="button">Open</button>
                    </div>
                ))}
            </div>
            <p className="muted fine-print">SSO, VPN, and least-privilege enforced. Contact ops for elevated access.</p>
        </div>
    );
};

const Hero = () => (
    <header className="hero" id="top">
        <TopNav />
        <div className="hero-grid">
            <div className="hero-copy">
                <p className="eyebrow">Wegener Development</p>
                <h1>Secure, resilient, and human-centric digital products.</h1>
                <p className="lede">
                    We design, build, and safeguard web experiences, applications, and infrastructure.
                    Whether you need a sharp site, a reliable system, or pragmatic AI, we deliver with clarity.
                </p>
                <div className="hero-actions">
                    <a href="#services" className="cta">Explore services</a>
                    <a href="#operations" className="ghost">View operations</a>
                </div>
                <div className="stats">
                    <div>
                        <p className="stat-number">99.95%</p>
                        <p className="muted small">target uptime</p>
                    </div>
                    <div>
                        <p className="stat-number">24/7</p>
                        <p className="muted small">monitoring & response</p>
                    </div>
                    <div>
                        <p className="stat-number">AI-first</p>
                        <p className="muted small">consultancy & build</p>
                    </div>
                </div>
            </div>
            <LoginPanel />
        </div>
    </header>
);

const Services = () => (
    <section id="services" className="section">
        <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2>We pair strategy with delivery.</h2>
            <p className="muted">
                From bespoke websites to complex systems, we architect, build, and secure solutions that stay online and keep pace with your business.
            </p>
        </div>
        <div className="services-grid">
            {services.map((service) => (
                <div key={service.title} className="service-card">
                    <div className="card-top">
                        <p className="eyebrow">{service.title}</p>
                        <p className="muted">{service.description}</p>
                    </div>
                    <div className="tag-row">
                        {service.tags.map((tag) => (
                            <span key={tag} className="chip">{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const Operations = () => (
    <section id="operations" className="section operations">
        <div className="section-head">
            <p className="eyebrow">Operational visibility</p>
            <h2>Stay close to the work.</h2>
            <p className="muted">
                Direct paths into Grafana dashboards, server notes, and deployment logs keep teams aligned and ready.
            </p>
        </div>
        <div className="ops-grid">
            <div className="ops-card">
                <p className="eyebrow">Grafana dashboards</p>
                <h3>Live observability</h3>
                <p className="muted">Service health, latency, capacity, and SLO burn-down in one place.</p>
                <a className="ghost" href="#login">Login to open</a>
            </div>
            <div className="ops-card">
                <p className="eyebrow">Server notes</p>
                <h3>Runbooks & handovers</h3>
                <p className="muted">Weekly notes, change logs, and post-mortems for quick onboarding.</p>
                <a className="ghost" href="#login">Login to open</a>
            </div>
            <div className="ops-card">
                <p className="eyebrow">AI-ready workflows</p>
                <h3>Assistive tooling</h3>
                <p className="muted">Copilots, playbook automation, and safe data access for operators.</p>
                <a className="ghost" href="#contact">Talk to us</a>
            </div>
        </div>
    </section>
);

const Contact = () => (
    <section id="contact" className="section contact">
        <div>
            <p className="eyebrow">Let's plan</p>
            <h2>Ready for your next release?</h2>
            <p className="muted">Tell us what you need—web, applications, security, AI—and we will scope it together.</p>
        </div>
        <div className="contact-actions">
            <a className="cta" href="mailto:thomas@wegener.no">thomas@wegener.no</a>
            <a className="ghost" href="#top">Back to top</a>
        </div>
    </section>
);

const App = () => (
    <div className="page">
        <Hero />
        <main>
            <Services />
            <Operations />
            <Contact />
        </main>
    </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
