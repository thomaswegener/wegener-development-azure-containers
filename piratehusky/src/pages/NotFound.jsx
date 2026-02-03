import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <Seo title={t('seo.notFound.title')} noIndex />
      <h1>404 - {t('seo.notFound.title')}</h1>
      <p>This page does not exist.</p>
    </div>
  );
}
