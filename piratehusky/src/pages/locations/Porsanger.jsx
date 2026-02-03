import LocationBanner from "../../components/LocationBanner";
import PorsangerCarousel from "../../components/PorsangerCarousel";
import Seo from '../../components/Seo';
import { useTranslation } from 'react-i18next';

export default function Porsanger() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: t('seo.locations.porsanger.title'),
    description: t('seo.locations.porsanger.description'),
    url: new URL('/locations/porsanger', origin).toString(),
    image: new URL('/assets/icons/porsanger.png', origin).toString(),
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Finnmark, Norway',
    },
  };

  return (
    <>
      <Seo
        title={t('seo.locations.porsanger.title')}
        description={t('seo.locations.porsanger.description')}
        image="/assets/icons/porsanger.png"
        type="article"
        jsonLd={jsonLd}
      />
      <PorsangerCarousel/>
      <div className="container mt-4">
        <h1>{t('seo.locations.porsanger.title')}</h1>
        <p>Børselv is home to our 40 Siberian Huskies and the starting point for most of our dogsledding and multi-day adventures – whether on sled, kayak, or foot. Here, we’ve transformed an old sheep farm into a comfortable kennel facility where our dogs live in pairs or trios, freely choosing between their indoor and outdoor spaces. It’s our base for exploring the wilderness and launching real Arctic expeditions, all year around.</p>
      </div>
      <LocationBanner />
    </>
    
  );
}
