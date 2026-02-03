import { useTranslation } from 'react-i18next';
import Seo from '../../components/Seo';

const guidesData = [
  {
    name: 'Emilie',
    img: '/assets/images/guides/emilie.jpg',
    textKey: 'pages.guides.emilie'
  },
  {
    name: 'Janne',
    img: '/assets/images/guides/janne.jpg',
    textKey: 'pages.guides.janne'
  },
  {
    name: 'Laila',
    img: '/assets/images/guides/laila.jpg',
    textKey: 'pages.guides.laila'
  },
  {
    name: 'Jakob',
    img: '/assets/images/guides/jakob.jpg',
    textKey: 'pages.guides.jakob'
  }
];

export default function Guides() {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <Seo
        title={t('seo.guides.title')}
        description={t('seo.guides.description')}
        type="article"
      />
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">{t('nav.guides')}</h1>
      </div>

      {guidesData.map((guide, index) => (
        <div className="row align-items-center mb-5" key={index}>
          <div className="col-md-6 mb-3 mb-md-0">
            <img
              src={guide.img}
              alt={guide.name}
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <p
              className="lead"
              style={{ whiteSpace: 'pre-line' }}
            >
              <strong>{guide.name}</strong>
              {`\n\n${t(guide.textKey)}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
