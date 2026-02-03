import MainCarousel from '../components/MainCarousel';
import SocialMedia from '../components/SocialMedia';
import AboutUs from '../components/AboutUs';
import LocationBanner from '../components/LocationBanner';
import ContactSection from '../components/ContactSection';
import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'Pirate Husky AS',
    url: origin,
    logo: new URL('/logo.png', origin).toString(),
    sameAs: [
      'https://www.facebook.com/piratehusky/',
      'https://www.instagram.com/piratehusky/',
      'https://www.youtube.com/@PirateHusky',
    ],
    areaServed: ['Porsanger', 'Hammerfest', 'Nordkapp'],
    knowsLanguage: ['en', 'no', 'de', 'fr', 'es'],
    telephone: '+47 453 80 189',
    email: 'info@piratehusky.no',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+47 453 80 189',
        contactType: 'customer support',
        email: 'info@piratehusky.no',
        availableLanguage: ['en', 'no', 'de', 'fr', 'es'],
      },
    ],
    description: t('seo.home.description'),
  };

  return (
    <>
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        image="/assets/main-carousel/banner1.jpg"
        jsonLd={jsonLd}
      />
      <h1 className="visually-hidden">
        {t('seo.home.title')}
      </h1>
      <MainCarousel /> {/* Full-width because it’s outside .container */}
      <LocationBanner />
      <AboutUs />
      <ContactSection />
      <SocialMedia />   
    </>
  );
}
