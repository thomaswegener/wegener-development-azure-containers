import Seo from '../../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Camp() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Campground',
    name: t('seo.camp.title'),
    description: t('seo.camp.description'),
    url: new URL('/accommodation/camp', origin).toString(),
    parentOrganization: {
      '@id': `${origin}/#organization`,
    },
  };

  return (
    <div className="container mt-4">
      <Seo
        title={t('seo.camp.title')}
        description={t('seo.camp.description')}
        type="article"
        jsonLd={jsonLd}
      />
      <h1>{t('nav.camp')}</h1>
      <p>Welcome to our authentic wilderness camp experience.</p>
    </div>
  );
}
