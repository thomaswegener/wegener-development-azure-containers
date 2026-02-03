import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Accommodation() {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <Seo
        title={t('seo.accommodation.title')}
        description={t('seo.accommodation.description')}
      />
      <h1>{t('nav.accommodation')}</h1>
      <p>Stay with us at Camp Husky or The Lodge.</p>
    </div>
  );
}
