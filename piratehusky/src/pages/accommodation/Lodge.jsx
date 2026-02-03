import { useTranslation } from 'react-i18next';
import ContactButtons from '../../components/ContactButtons';
import Seo from '../../components/Seo';


export default function Lodge() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: t('seo.lodge.title'),
    description: t('seo.lodge.description'),
    url: new URL('/accommodation/lodge', origin).toString(),
    image: [
      new URL('/assets/images/accommodation/lodge1.jpg', origin).toString(),
      new URL('/assets/images/accommodation/lodge2.jpg', origin).toString(),
    ],
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Pirate Husky AS',
      url: origin,
    },
  };

  return (
    <div className="container py-5">
      <Seo
        title={t('seo.lodge.title')}
        description={t('seo.lodge.description')}
        image="/assets/images/accommodation/lodge1.jpg"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="mb-4">{t('nav.lodge')}</h1>
      <section className="mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6 mb-3">
            <img
              src="/assets/images/accommodation/lodge1.jpg"
              alt="Lodge Interior"
              className="img-fluid rounded shadow mb-3"
            />
            <img
              src="/assets/images/accommodation/lodge2.jpg"
              alt="Lodge Exterior"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-12 col-lg">
            <h2>{t('pages.lodge.title')}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{t('pages.lodge.description')}</p>
            <div className="mb-3">
              <ContactButtons className="mb-3" />

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
