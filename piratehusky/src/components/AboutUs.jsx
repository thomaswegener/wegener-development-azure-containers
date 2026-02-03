import { useTranslation } from 'react-i18next';

function AboutUs() {
  const { t } = useTranslation();

  return (
    <section className="py-5" id="about">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="image-wrapper">
              <img src="/assets/images/aboutus.jpg" alt="Pirate Husky family" className="img-fluid rounded shadow" />
            </div>
          </div>
          <div className="col-12 col-lg">
            <div className="card-wrapper">
              <h2 className="mb-4">{t('pages.about.intro.title')}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>
                {t('pages.about.intro.text')}
              </p>

              <div className="my-3">
                <a
                  href="https://givn.no/shop/piratehusky"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn.givn.no/badges/v1/landscape_yellow.svg"
                    alt="Kjøp gavekort fra Pirate Husky med Givn"
                    style={{ width: '256px' }}
                  />
                </a>
              </div>

              <a className="btn btn-primary mt-3" href="mailto:info@piratehusky.no">
                {t('common.sendEmail')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
