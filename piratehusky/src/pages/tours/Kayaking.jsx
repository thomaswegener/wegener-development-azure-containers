import { useTranslation } from 'react-i18next';
import ContactButtons from '../../components/ContactButtons';
import Seo from '../../components/Seo';

function Kayaking() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t('seo.kayaking.title'),
    description: t('seo.kayaking.description'),
    url: new URL('/tours/kayaking', origin).toString(),
    image: [
      new URL('/assets/images/kayakk1.jpg', origin).toString(),
      new URL('/assets/images/kayakk2.jpg', origin).toString(),
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
        title={t('seo.kayaking.title')}
        description={t('seo.kayaking.description')}
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="mb-4">{t('nav.kayaking')}</h1>
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2>{t('pages.kayaking.section1.title')}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{t('pages.kayaking.section1.text')}</p>
                                  
                <ContactButtons className="mb-3" />


          </div>
          <div className="col-lg-6">
            <img
              src="/assets/images/kayakk1.jpg"
              alt="Kayaking adventure"
              className="img-fluid mb-3"
            />
            <img
              src="/assets/images/kayakk2.jpg"
              alt="Kayaking trip"
              className="img-fluid"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Kayaking;
