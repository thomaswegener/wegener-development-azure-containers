import { useTranslation } from 'react-i18next';
import ContactButtons from '../../components/ContactButtons';
import Seo from '../../components/Seo';

function Hiking() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t('seo.hiking.title'),
    description: t('seo.hiking.description'),
    url: new URL('/tours/hiking', origin).toString(),
    image: [
      new URL('/assets/images/hike1.jpg', origin).toString(),
      new URL('/assets/images/hike2.jpg', origin).toString(),
    ],
    provider: {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Pirate Husky AS',
      url: origin,
    },
  };

  return (
    <div className="container py-5">
      <Seo
        title={t('seo.hiking.title')}
        description={t('seo.hiking.description')}
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="mb-4">{t('nav.hiking')}</h1>
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2>{t('pages.hiking.section1.title')}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{t('pages.hiking.section1.text')}</p>
                                  
                <ContactButtons className="mb-3" />

          </div>
          <div className="col-lg-6">
            <img src="/assets/images/hike1.jpg" alt="Hiking tour" className="img-fluid mb-3" />
            <img src="/assets/images/hike2.jpg" alt="Hiking tour" className="img-fluid" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hiking;
