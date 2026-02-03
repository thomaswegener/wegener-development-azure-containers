import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';

const CHANNEL_URL = 'https://www.youtube.com/@PirateHusky';
const TRAILER_EMBED_URL = 'https://www.youtube.com/embed/Jr6g7ok9Hmc';

export default function YouTube() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('pages.youtube.trailerTitle'),
    description: t('pages.youtube.trailerDescription'),
    embedUrl: TRAILER_EMBED_URL,
    url: CHANNEL_URL,
    publisher: {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Pirate Husky AS',
      url: origin,
    },
  };

  const highlights = [
    t('pages.youtube.highlight1'),
    t('pages.youtube.highlight2'),
    t('pages.youtube.highlight3'),
  ];

  return (
    <div className="container py-5">
      <Seo
        title={t('seo.youtube.title')}
        description={t('seo.youtube.description')}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="row align-items-center g-4 mb-5">
        <div className="col-12 col-lg-6">
          <h1 className="mb-3">{t('pages.youtube.title')}</h1>
          <p className="lead">{t('pages.youtube.subtitle')}</p>
          <ul className="mt-4">
            {highlights.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
          <a
            href={CHANNEL_URL}
            className="btn btn-danger mt-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('pages.youtube.cta')}
          </a>
        </div>
        <div className="col-12 col-lg-6">
          <div className="ratio ratio-16x9 shadow rounded overflow-hidden">
            <iframe
              src={TRAILER_EMBED_URL}
              title={t('pages.youtube.trailerTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-muted mt-2">{t('pages.youtube.trailerDescription')}</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5>{t('pages.youtube.cardCommunityTitle')}</h5>
              <p className="mb-0">{t('pages.youtube.cardCommunityText')}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5>{t('pages.youtube.cardBehindScenesTitle')}</h5>
              <p className="mb-0">{t('pages.youtube.cardBehindScenesText')}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5>{t('pages.youtube.cardPlanTripTitle')}</h5>
              <p className="mb-0">{t('pages.youtube.cardPlanTripText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
