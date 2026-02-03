import { useTranslation } from 'react-i18next';
import ContactButtons from './ContactButtons';

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="contacts3 map1 py-5" id="contact">
      <div className="container">
        <div className="mbr-section-head text-center mb-4">
          <h3 className="mbr-section-title display-2 mb-0">
            <strong>{t('pages.contact.title')}</strong>
          </h3>
          <h4
            className="mbr-section-subtitle display-5 mb-0 mt-2"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('pages.contact.subtitle')}
          </h4>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="card col-12 col-md-6 mb-4 mb-md-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span
                  className="bi bi-telephone-fill fs-2 me-3 text-primary"
                  aria-hidden="true"
                ></span>
                <div>
                  <h6 className="card-title mb-1 display-5">
                    <strong>{t('pages.contact.phone')}</strong>
                  </h6>
                  <p className="mbr-text display-7 mb-0">
                    <a href={`tel:${t('pages.contact.phoneNumber')}`}>
                      {t('pages.contact.phoneNumber')}
                    </a>
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span
                  className="bi bi-envelope-fill fs-2 me-3 text-primary"
                  aria-hidden="true"
                ></span>
                <div>
                  <h6 className="card-title mb-1 display-5">
                    <strong>{t('pages.contact.email')}</strong>
                  </h6>
                  <p className="mbr-text display-7 mb-0">
                    <a href={`mailto:${t('pages.contact.emailAddress')}`}>
                      {t('pages.contact.emailAddress')}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="map-wrapper col-12 col-md-6">
            <div className="google-map h-100" style={{ minHeight: 320 }}>
              <iframe
                frameBorder="0"
                style={{ border: 0, width: '100%', height: '100%' }}
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5372.747743090645!2d25.5858051!3d70.3268725!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x284a106525184e03!2sPirate%20Husky%20AS!5e0!3m2!1sno!2s!4v1625485234257!5m2!1sno!2s"
                allowFullScreen=""
                loading="lazy"
                title="Pirate Husky Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="text-center mb-4">
          <ContactButtons className="mb-3" />
        </div>
      </div>
    </section>
  );
}

