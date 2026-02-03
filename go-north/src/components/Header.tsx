import { useState } from 'react'
import logoHorizontal from '../assets/logo-horizontal.png'
import type { PdfPackage, VideoCollection } from '../data'

type HeaderProps = {
  onVideoSelect: (id: string) => void
  onPdfSelect: (slug: string) => void
  onContactSelect: () => void
  activeVideoId?: string
  videoCollections: VideoCollection[]
  packages: PdfPackage[]
  homeVideoId: string
  defaultPdfSlug: string
}

const Header = ({
  onVideoSelect,
  onPdfSelect,
  onContactSelect,
  activeVideoId,
  videoCollections,
  packages,
  homeVideoId,
  defaultPdfSlug,
}: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleVideoClick = (id: string) => {
    onVideoSelect(id)
    closeMenu()
  }

  const handlePdfClick = (slug: string) => {
    onPdfSelect(slug)
    closeMenu()
  }

  const handleContactClick = () => {
    onContactSelect()
    closeMenu()
  }

  return (
    <header className="site-header">
      <div className="header-bar">
        <button
          className="brand"
          onClick={() => handleVideoClick(homeVideoId)}
          aria-label="Go North home"
        >
          <img src={logoHorizontal} alt="Go North logo" />
        </button>
        <button
          className="mobile-toggle"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
        >
          Menu
        </button>
      </div>
      <nav className={`primary-nav ${menuOpen ? 'open' : ''}`}>
        <button
          className="nav-link"
          type="button"
          onClick={() => handlePdfClick(defaultPdfSlug)}
        >
          Products
        </button>
        {videoCollections.map((collection) => (
          <div className="nav-group" key={collection.id}>
            <span className="group-label">{collection.label}</span>
            <div className="nav-sublist">
              {collection.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sub-link ${
                    activeVideoId === item.id ? 'active' : ''
                  }`}
                  onClick={() => handleVideoClick(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="nav-group">
          <span className="group-label">Packages</span>
          <div className="nav-sublist">
            {packages.map((pkg) => (
              <button
                key={pkg.slug}
                className="sub-link"
                type="button"
                onClick={() => handlePdfClick(pkg.slug)}
              >
                {pkg.title}
              </button>
            ))}
          </div>
        </div>
        <button className="nav-link" type="button" onClick={handleContactClick}>
          Contact
        </button>
      </nav>
    </header>
  )
}

export default Header
