import { useTranslation } from 'react-i18next';
import ContactButtons from '../../components/ContactButtons';
import Seo from '../../components/Seo';


function DogSledding() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const sections = [
    { id: 1, images: ['dog1.jpg', 'dog2.jpg'] },
    { id: 2, images: ['dog3.jpg', 'dog4.jpg'] },
    { id: 3, images: ['dog5.jpg', 'dog6.jpg'] },
    { id: 4, images: ['weekend1.jpg', 'weekend2.jpg'] },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t('seo.dogSledding.title'),
    description: t('seo.dogSledding.description'),
    url: new URL('/tours/dog-sledding', origin).toString(),
    image: [
      new URL('/assets/images/dog1.jpg', origin).toString(),
      new URL('/assets/images/dog2.jpg', origin).toString(),
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
        title={t('seo.dogSledding.title')}
        description={t('seo.dogSledding.description')}
        image="/assets/images/dog1.jpg"
        type="article"
        jsonLd={jsonLd}
      />
      <h1 className="mb-4">{t('nav.dogSledding')}</h1>
      {sections.map((section) => (
        <section key={section.id} className="mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>{t(`pages.dogSledding.section${section.id}.title`)}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>
                {t(`pages.dogSledding.section${section.id}.text`)}
              </p>
              <ContactButtons className="mb-3" />        
                
            </div>
            <div className="col-lg-6">
              <img
                src={`/assets/images/${section.images[0]}`}
                alt="Dog sledding adventure in Finnmark"
                className="img-fluid mb-3"
              />
              <img
                src={`/assets/images/${section.images[1]}`}
                alt="Huskies and sled in Arctic landscape"
                className="img-fluid"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default DogSledding;
