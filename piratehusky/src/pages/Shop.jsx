import Shop from '../components/Shop';
import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

export default function ShopPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Seo
        title={t('seo.shop.title')}
        description={t('seo.shop.description')}
      />
      <h1 className="visually-hidden">{t('nav.shop')}</h1>
      <Shop />
    </div>
  );
}
