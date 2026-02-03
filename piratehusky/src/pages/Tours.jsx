import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Tours() {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <Seo
        title={t('seo.tours.title')}
        description={t('seo.tours.description')}
      />
      <h1>{t('nav.tours')}</h1>
      <p>Explore our unforgettable multi-day expeditions in dog sledding, hiking, kayaking, and skiing.</p>
    </div>
  );
}
