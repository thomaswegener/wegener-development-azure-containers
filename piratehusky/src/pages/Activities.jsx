import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Activities() {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <Seo
        title={t('seo.activities.title')}
        description={t('seo.activities.description')}
      />
      <h1>{t('nav.activities')}</h1>
      <p>Discover our day tours and outdoor adventures.</p>
    </div>
  );
}
