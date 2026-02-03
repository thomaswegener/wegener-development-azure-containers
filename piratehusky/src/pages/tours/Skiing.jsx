import { useTranslation } from 'react-i18next';
import ContactButtons from '../../components/ContactButtons';
import Seo from '../../components/Seo';

function Skiing() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t('seo.skiing.title'),
    description: t('seo.skiing.description'),
    url: new URL('/tours/skiing', origin).toString(),
    image: [
      new URL('/assets/images/dog3.jpg', origin).toString(),
      new URL('/assets/images/dog4.jpg', origin).toString(),
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
        title={t('seo.skiing.title')}
        description={t('seo.skiing.description')}
        image="/assets/images/dog3.jpg"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="mb-4">{t('nav.skiing')}</h1>
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2>{t('pages.skiing.section1.title')}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{t('pages.skiing.section1.text')}</p>
            <ContactButtons className="mb-3" />
          </div>
          <div className="col-lg-6">
            <img src="/assets/images/dog3.jpg" alt="Arctic ski expedition in Finnmark" className="img-fluid mb-3" />
            <img src="/assets/images/dog4.jpg" alt="Backcountry skiing with huskies" className="img-fluid" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Skiing;
