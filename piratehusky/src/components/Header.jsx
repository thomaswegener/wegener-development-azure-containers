import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Facebook, Instagram } from 'react-bootstrap-icons';
import { openBookingWidget } from '../utils/analytics';

function Header() {
  const { i18n, t } = useTranslation();
  const [langDropdown, setLangDropdown] = useState(false);
  const languageFlags = useMemo(() => ({
    en: '🇬🇧',
    no: '🇳🇴',
    de: '🇩🇪',
    fr: '🇫🇷',
    es: '🇪🇸'
  }), []);
  const currentFlag = languageFlags[i18n.language] || '🌐';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdown(false);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/assets/images/logo.png"
              alt="Pirate Husky"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <span className="fw-bold">Pirate Husky</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  href="#"
                  id="menu-book-item"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openBookingWidget('nav_activities');
                  }}
                >
                  {t('nav.activities')}
                </a>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="toursDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {t('nav.tours')}
                </a>
                <ul className="dropdown-menu" aria-labelledby="toursDropdown">
                  <li><Link className="dropdown-item" to="/tours/dog-sledding">{t('nav.dogSledding')}</Link></li>
                  <li><Link className="dropdown-item" to="/tours/hiking">{t('nav.hiking')}</Link></li>
                  <li><Link className="dropdown-item" to="/tours/kayaking">{t('nav.kayaking')}</Link></li>
                  <li><Link className="dropdown-item" to="/tours/skiing">{t('nav.skiing')}</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/youtube">{t('nav.youtube')}</Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {t('nav.about')}
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/about/about">{t('nav.about')}</Link></li>
                  <li><Link className="dropdown-item" to="/sledespesialisten">{t('nav.sledespesialisten')}</Link></li>
                  <li><Link className="dropdown-item" to="/about/sustainability">{t('nav.sustainability')}</Link></li>
                  <li><Link className="dropdown-item" to="/about/guides">{t('nav.guides')}</Link></li>
                  <li><Link className="dropdown-item" to="/about/dogs">{t('nav.dogs')}</Link></li>
                  <li><Link className="dropdown-item" to="/about/contact">{t('nav.contact')}</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="btn btn-link nav-link dropdown-toggle"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded={langDropdown}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{currentFlag}</span>
                </button>
                {langDropdown && (
                  <ul className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                    <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>🇬🇧</button></li>
                    <li><button className="dropdown-item" onClick={() => changeLanguage('no')}>🇳🇴</button></li>
                    <li><button className="dropdown-item" onClick={() => changeLanguage('de')}>🇩🇪</button></li>
                    <li><button className="dropdown-item" onClick={() => changeLanguage('fr')}>🇫🇷</button></li>
                    <li><button className="dropdown-item" onClick={() => changeLanguage('es')}>🇪🇸</button></li>
                  </ul>
                )}
              </li>

              <li className="nav-item d-flex align-items-center gap-2 ms-lg-2">
                <a
                  href="https://www.facebook.com/piratehusky/"
                  className="text-decoration-none text-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pirate Husky on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/piratehusky/"
                  className="text-decoration-none text-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pirate Husky on Instagram"
                >
                  <Instagram size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
