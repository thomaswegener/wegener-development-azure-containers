import Seo from '../../components/Seo';
import ContactSection from '../../components/ContactSection';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
        type="article"
      />
      <div className="container py-5">
        <h1 className="mb-4">{t('nav.contact')}</h1>
      </div>
      <ContactSection />
    </>
  );
}
