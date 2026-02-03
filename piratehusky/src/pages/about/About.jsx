import AboutUs from '../../components/AboutUs';
import Seo from '../../components/Seo';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t('seo.about.title')}
        description={t('seo.about.description')}
      />
      <div className="container py-5">
        <h1 className="mb-4">{t('seo.about.title')}</h1>
      </div>
      <AboutUs />
    </>
  );
}
