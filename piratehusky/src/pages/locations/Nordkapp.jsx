import LocationBanner from "../../components/LocationBanner";
import NordkappCarousel from "../../components/NordkappCarousel";
import Seo from '../../components/Seo';
import { useTranslation } from 'react-i18next';


export default function Honningsvag() {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://piratehusky.no';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: t('seo.locations.nordkapp.title'),
    description: t('seo.locations.nordkapp.description'),
    url: new URL('/locations/nordkapp', origin).toString(),
    image: new URL('/assets/icons/nordkapp.png', origin).toString(),
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Finnmark, Norway',
    },
  };

  return (
    <>
      <Seo
        title={t('seo.locations.nordkapp.title')}
        description={t('seo.locations.nordkapp.description')}
        image="/assets/icons/nordkapp.png"
        type="article"
        jsonLd={jsonLd}
      />
      <NordkappCarousel/>
      <div className="container mt-4">
        <h1>{t('seo.locations.nordkapp.title')}</h1>
        <p>Honningsvåg, the gateway to the North Cape, is our newest and growing department. We are thrilled to extend our passion and knowledge here – offering dogsledding (both on wheels and snow), husky hikes, and engaging lectures for guests and locals alike. With ships, planes, and cars arriving year-round, we are excited to be part of this dynamic Arctic hub, creating new memories at the edge of the world.</p>
      </div>
      <LocationBanner/>
    </>
  );
}
