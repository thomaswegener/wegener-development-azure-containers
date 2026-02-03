import { useTranslation } from 'react-i18next';
import Seo from '../../components/Seo';

function Sustainability() {
  const { t } = useTranslation();

  return (
    <section className="features18" id="welcome">
      <Seo
        title={t('seo.sustainability.title')}
        description={t('seo.sustainability.description')}
        type="article"
      />
      <div className="container">
        <h1 className="display-4 fw-bold mb-4">
          {t('pages.sustainability.title')}
        </h1>
        <div className="row justify-content-center">
          <div className="card col-12 col-lg">
            <div className="card-wrapper">
              <p style={{ whiteSpace: 'pre-line' }}>
                {t('pages.sustainability.text')}
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="image-wrapper">
              <img
                src="/assets/images/dogyard.jpg"
                alt="Dog yard"
                className="img-fluid"
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="card col-12 col-lg-12">
            <div className="card-wrapper">
              <a
                href="https://rapportering.miljofyrtarn.no/stats/170393"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/images/miljofyrtarn.png"
                  alt="Miljøfyrtårn logo"
                  style={{ maxWidth: '100px', height: 'auto' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sustainability;
