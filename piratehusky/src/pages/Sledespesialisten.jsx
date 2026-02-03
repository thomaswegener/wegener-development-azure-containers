import Seo from '../components/Seo';
import { useTranslation } from 'react-i18next';

const galleryImages = [
  {
    src: '/sledespesialisten/20220209-112830-880x660.jpg',
    alt: 'Rekka slede i verkstedet',
  },
  {
    src: '/sledespesialisten/20220209-113054-880x1173.jpg',
    alt: 'Detaljer av Rekka sleden',
  },
  {
    src: '/sledespesialisten/20220209-113110-880x1173.jpeg',
    alt: 'Rekka slede fra siden',
  },
  {
    src: '/sledespesialisten/20220209-112901-880x1173.jpeg',
    alt: 'Rekka slede i snøen',
  },
];

export default function Sledespesialisten() {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <Seo
        title={t('seo.sledespesialisten.title')}
        description={t('seo.sledespesialisten.description')}
        image="/sledespesialisten/20220209-112923-816x612.jpg"
        type="article"
      />

      <section className="mb-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h1 className="display-4 fw-bold mb-3">Sledespesialisten AS</h1>
            <p className="lead">
              Rekka sleden er bygget for arktiske forhold - solid, lettkjørt og
              testet på Finnmarksvidda og Svalbard.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-primary" href="#bestill">
                Bestill
              </a>
              <a className="btn btn-outline-secondary" href="#om-oss">
                Om oss
              </a>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <img
              src="/sledespesialisten/20220209-113023-2000x2667.jpeg"
              alt="Rekka slede klar for levering"
              className="img-fluid rounded shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="bestill" className="mb-5">
        <h2 className="mb-4">Bestill</h2>
        <div className="card border-0 shadow-sm">
          <div className="row g-0 align-items-center">
            <div className="col-12 col-md-5">
              <img
                src="/sledespesialisten/20220209-112923-816x612.jpg"
                alt="Rekka sled"
                className="img-fluid rounded-start"
                loading="lazy"
              />
            </div>
            <div className="col-12 col-md-7">
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  <div>
                    <h3 className="card-title h2">REKKA</h3>
                    <p className="card-text">
                      Komplett med drag NOK 30 000,- inkl mva (ved henting i
                      Børselv). For tilbud med frakt, ta kontakt med oss.
                      Leveringstid 5-8 uker.
                    </p>
                  </div>
                  <div className="text-md-end">
                    <p className="h2 mb-3">30 000 kr</p>
                    <a
                      href="mailto:info@sledespesialisten.com"
                      className="btn btn-secondary"
                    >
                      Send forespørsel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="om-oss" className="mb-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h2 className="mb-3">Om oss</h2>
            <p>
              Sledespesialisten AS ble offisielt startet opp i 2012, men da
              hadde allerede Rekka sleden vært i utvikling i årevis, av Ove
              Boine. Ove eide og driftet firmaet selv helt fram til 2017, og
              solgte i 2018 til Gøran Andersen i Børselv, som eier og drifter i
              dag.
            </p>
            <p>
              Rekka sleden er en flatslede / lasteslede for å bruke bak
              snøscooter. Den er av heltre, med sving, og er både solid og
              lettkjørt. Sleden er godt testet både på fastlandet over mange
              år, og på Svalbard hvor den blant annet er hyppig brukt som slede
              til snøscooterguider.
            </p>
            <p>
              Vi selger både ferdige Rekka sleder komplett med drag, deler til
              sleder, og utfører reparasjoner av gamle sleder.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <img
              src="/sledespesialisten/logo-1024x1024-jpg-1024x1024.jpg"
              alt="Sledespesialisten logo"
              className="img-fluid rounded shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="bilder" className="mb-5">
        <h2 className="text-center mb-4">Bilder</h2>
        <div className="row g-3">
          {galleryImages.map((image) => (
            <div className="col-6 col-lg-3" key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                className="img-fluid rounded shadow-sm"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="kontakt" className="mb-5">
        <div className="text-center mb-4">
          <h2>Kontakt oss</h2>
          <p className="text-muted mb-0">Gøran Andersen</p>
        </div>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <i className="bi bi-telephone-fill fs-3 text-primary"></i>
                  <div>
                    <h3 className="h6 mb-1">Telefon</h3>
                    <p className="mb-0">+47 934 52 853</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-envelope-fill fs-3 text-primary"></i>
                  <div>
                    <h3 className="h6 mb-1">Epost</h3>
                    <a href="mailto:info@sledespesialisten.com">
                      info@sledespesialisten.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="ratio ratio-4x3 shadow-sm rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCNveGQ9bfpKFwWzQLLftrR9hNiHwdqQG8&q=B%C3%B8rselvveien%20124,%209716%20B%C3%B8rselv"
                title="Børselvveien 124, Børselv"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
