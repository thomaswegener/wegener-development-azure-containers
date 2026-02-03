import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './dogs.css';
import Seo from '../../components/Seo';

const fallbackLanguages = ['en', 'no', 'de', 'fr', 'es'];

export default function Dogs() {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isServer = typeof window === 'undefined';

  const currentLanguage = i18n.language || 'en';

  useEffect(() => {
    if (isServer) return;
    let cancelled = false;
    const loadDogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dogs');
        if (!response.ok) throw new Error('Unable to load dogs');
        const data = await response.json();
        if (!cancelled) {
          setDogs(data.dogs ?? []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('We could not load the dogs right now. Please try again later.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDogs();
    return () => {
      cancelled = true;
    };
  }, [isServer]);

  const sortedDogs = useMemo(
    () => [...dogs].sort((a, b) => a.name.localeCompare(b.name)),
    [dogs]
  );

  const getDescription = (dog) => {
    if (!dog.descriptions) return '';
    if (dog.descriptions[currentLanguage]) return dog.descriptions[currentLanguage];
    for (const lang of fallbackLanguages) {
      if (dog.descriptions[lang]) return dog.descriptions[lang];
    }
    return '';
  };

  const imageSrc = (dog) => `/assets/images/dogs/${dog.image || slugify(dog.name)}.jpg`;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Seo
          title={t('seo.dogs.title')}
          description={t('seo.dogs.description')}
          type="article"
        />
        <h1 className="mb-0">{t('pages.dogs.title')}</h1>
        {token && (
          <a href="/admin" className="btn btn-outline-primary">
            {t('admin.manageDogs')}
          </a>
        )}
      </div>
      {!loading && !error && sortedDogs.length === 0 && (
        <p className="lead">{t('pages.dogs.description')}</p>
      )}
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-warning">{error}</div>}
      {!loading && !error && (
        <div className="row g-4">
          {sortedDogs.map((dog) => (
            <div key={dog.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src={imageSrc(dog)} alt={dog.name} className="card-img-top dog-card-img" loading="lazy" />
                <div className="card-body">
                  <h5 className="card-title">{dog.name}</h5>
                  <p className="card-subtitle text-muted mb-2">{dog.birth}</p>
                  <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                    {getDescription(dog)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}
