import LocationBanner from "../../components/LocationBanner";
import HammerfestCarousel from '../../components/HammerfestCarousel';
import Seo from '../../components/Seo';
import { useTranslation } from 'react-i18next';


export default function Hammerfest() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: t('seo.locations.hammerfest.title'),
    description: t('seo.locations.hammerfest.description'),
    url: new URL('/locations/hammerfest', origin).toString(),
    image: new URL('/assets/icons/hammerfest.png', origin).toString(),
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Finnmark, Norway',
    },
  };

  return (
    <>
      <Seo
        title={t('seo.locations.hammerfest.title')}
        description={t('seo.locations.hammerfest.description')}
        image="/assets/icons/hammerfest.png"
        type="article"
        jsonLd={jsonLd}
      />
      <HammerfestCarousel/>
      <div className="container mt-4">
        <h1>{t('seo.locations.hammerfest.title')}</h1>
        <p>In Hammerfest, the northernmost town in the world, we welcome daily guests from Hurtigruten, Havila, and independent travelers. This is where culture and nature meet – with hikes, sightseeing, and husky hikes happening daily. For larger groups, we offer dogsledding on snow or wheels, in the nearby area. We are proud storytellers of Hammerfest’s rich and ancient history, sharing stories and nature experiences with every guest who arrives by ship, plane, or car.</p>
      </div>
      <LocationBanner/>
    </>
  );
}
