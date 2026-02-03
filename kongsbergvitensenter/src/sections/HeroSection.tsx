import heroVisual from '../assets/hero-visual.jpg'
import logo from '../assets/logo.png'
import kbgLogo from '../assets/kbglogo.png'

export const HeroSection = () => (
  <section
    className="scroll-block scroll-block--hero"
    data-scroll-section="hero"
    data-gradient-start="#000000"
    data-gradient-end="#000000"
  >
    <div className="scroll-block__inner">
      <header className="hero">
        <div className="hero-text">
          <div className="brand-logos">
            <img
              src={logo}
              alt="Kongsberg Vitensenter"
              className="brand-mark brand-mark--primary"
            />
            <img
              src={kbgLogo}
              alt="Kongsberg Kommune"
              className="brand-mark brand-mark--kbg"
            />
          </div>
          <p className="eyebrow">Kongsberg Vitensenter - Kultur og velferd</p>
          <h1>
            Realfag og teknologi
            <span> Opplevelser designet for nysgjerrighet</span>
          </h1>
          <p className="lead">
            Se hva som skjer på Vitensenteret i vår aktivitetskalender.
          </p>
          <div className="hero-cta">
            <a href="#kalender" className="primary">
              Aktivitetskalender
            </a>
            <a href="#om-oss" className="ghost">
              Bli kjent med oss
            </a>
            <div className="hero-social">
              <a
                className="icon-button"
                href="https://www.facebook.com/kongsbergvitensenter"
                target="_blank"
                rel="noreferrer"
                aria-label="Følg oss på Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.5 10.5V8.4c0-.9.6-1.1 1-1.1h1.9V5h-2.6C11 5 10 6.9 10 8.2v2.3H8v2.4h2v6.1h3v-6.1h2.1l.4-2.4H13.5Z"
                  />
                </svg>
              </a>
              <a
                className="icon-button"
                href="mailto:post@kongsbergvitensenter.no"
                aria-label="Send e-post til post@kongsbergvitensenter.no"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 2v.35l8 4.8 8-4.8V8l-8 4.8L4 8Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroVisual} alt="Interaktiv kalender" />
        </div>
      </header>
    </div>
  </section>
)
