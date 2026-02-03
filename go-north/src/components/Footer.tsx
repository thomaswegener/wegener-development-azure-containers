import logoVertical from '../assets/logo-vertical.png'
import miljofyrtarn from '../assets/miljofyrtarn.png'
import type { SocialLink, VideoCollection } from '../data'

type FooterProps = {
  socialLinks: SocialLink[]
  videoCollections: VideoCollection[]
  onVideoSelect: (id: string) => void
}

const Footer = ({ socialLinks, videoCollections, onVideoSelect }: FooterProps) => (
  <footer className="site-footer">
    <div className="footer-grid">
      <div>
        <img src={logoVertical} alt="Go North vertical logo" className="footer-logo" />
        <img src={miljofyrtarn} alt="Miljøfyrtårn certification" className="badge" />
      </div>
      <div>
        <h4>E-mail</h4>
        <a href="mailto:info@go-north.no" className="footer-link">
          info@go-north.no
        </a>
        <div className="social-row">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {videoCollections.map((collection) => (
        <div key={collection.id}>
          <h4>{collection.label}</h4>
          <ul>
            {collection.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="footer-link as-button"
                  onClick={() => onVideoSelect(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <p className="copyright">
      © {new Date().getFullYear()} Wegener Development — All rights reserved
    </p>
  </footer>
)

export default Footer
