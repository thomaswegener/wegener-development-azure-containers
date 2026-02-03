import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Seo from '../../components/Seo';

const LANGUAGES = ['en', 'no', 'de', 'fr', 'es'];

const buildEmptyDog = () => ({
  id: '',
  name: '',
  birth: '',
  image: '',
  descriptions: LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {})
});

const ensureDescriptions = (descriptions = {}) =>
  LANGUAGES.reduce((acc, lang) => {
    acc[lang] = descriptions[lang] ?? '';
    return acc;
  }, {});

export default function Admin() {
  const { t } = useTranslation();
  const { token, login, logout } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(buildEmptyDog());
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0]);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dogs');
      if (!response.ok) throw new Error('Failed to load dogs');
      const data = await response.json();
      setDogs(data.dogs ?? []);
    } catch (err) {
      console.error(err);
      setError(t('admin.statusError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchDogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      login(data.token, { username: data.username });
      setCredentials({ username: '', password: '' });
    } catch (err) {
      setError(err.message || t('admin.statusError'));
    }
  };

  const resetForm = () => {
    setForm(buildEmptyDog());
    setActiveLanguage(LANGUAGES[0]);
    setStatus('');
    setError('');
  };

  const selectDog = (dog) => {
    setForm({
      id: dog.id,
      name: dog.name,
      birth: dog.birth ?? '',
      image: dog.image ?? '',
      descriptions: ensureDescriptions(dog.descriptions)
    });
    setActiveLanguage(LANGUAGES[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (dogId) => {
    if (!token) return;
    const confirmation = window.confirm(t('admin.confirmDelete'));
    if (!confirmation) return;
    try {
      const response = await fetch(`/api/dogs/${dogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) {
        logout();
        return;
      }
      if (!response.ok) throw new Error('Delete failed');
      setStatus(t('admin.statusDeleted'));
      await fetchDogs();
      if (form.id === dogId) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(t('admin.statusError'));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;
    setStatus('');
    setError('');
    const payload = {
      name: form.name.trim(),
      birth: form.birth,
      image: form.image.trim(),
      descriptions: ensureDescriptions(form.descriptions)
    };
    const url = isEditing ? `/api/dogs/${form.id}` : '/api/dogs';
    const method = isEditing ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.status === 401) {
        logout();
        return;
      }
      if (!response.ok) throw new Error('Save failed');
      const saved = await response.json();
      setStatus(t('admin.statusSaved'));
      await fetchDogs();
      setForm({
        id: saved.id,
        name: saved.name,
        birth: saved.birth ?? '',
        image: saved.image ?? '',
        descriptions: ensureDescriptions(saved.descriptions)
      });
    } catch (err) {
      console.error(err);
      setError(t('admin.statusError'));
    }
  };

  if (!token) {
    return (
      <div className="container py-5">
        <Seo
          title={t('seo.admin.title')}
          description={t('seo.admin.description')}
          noIndex
        />
        <h1 className="mb-4">{t('admin.loginTitle')}</h1>
        <form className="card p-4" onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">{t('admin.username')}</label>
            <input
              type="text"
              className="form-control"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t('admin.password')}</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">
            {t('admin.login')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <Seo
          title={t('seo.admin.title')}
          description={t('seo.admin.description')}
          noIndex
        />
        <h1 className="mb-0">{t('admin.manageDogs')}</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={resetForm}>
            {t('admin.addDog')}
          </button>
          <button className="btn btn-outline-danger" onClick={() => { logout(); setStatus(t('admin.logoutMessage')); }}>
            {t('admin.logout')}
          </button>
        </div>
      </div>

      <form className="card p-4 mb-5" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">{t('admin.nameLabel')}</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">{t('admin.birthLabel')}</label>
            <input
              type="text"
              className="form-control"
              value={form.birth}
              onChange={(e) => setForm({ ...form, birth: e.target.value })}
              placeholder="DD.MM.YYYY"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">{t('admin.imageLabel')}</label>
            <input
              type="text"
              className="form-control"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="image-file-name"
            />
            <div className="form-text">
              {`/assets/images/dogs/${form.image || 'image'}.jpg`}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ul className="nav nav-tabs" role="tablist">
            {LANGUAGES.map((lang) => (
              <li className="nav-item" key={lang}>
                <button
                  className={`nav-link ${activeLanguage === lang ? 'active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeLanguage === lang}
                  onClick={() => setActiveLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
          <div className="border border-top-0 p-3">
            <label className="form-label">
              {`${t('admin.descriptionLabel')} (${activeLanguage.toUpperCase()})`}
            </label>
            <textarea
              className="form-control"
              rows="4"
              value={form.descriptions[activeLanguage]}
              onChange={(e) =>
                setForm({
                  ...form,
                  descriptions: { ...form.descriptions, [activeLanguage]: e.target.value }
                })
              }
            />
          </div>
        </div>

        {status && <div className="alert alert-success mt-3">{status}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <button type="submit" className="btn btn-primary mt-3">
          {isEditing ? t('admin.saveChanges') : t('admin.createDog')}
        </button>
      </form>

      <div className="card p-4">
        {loading && <p className="mb-0">Loading...</p>}
        {!loading && dogs.length === 0 && <p className="mb-0">{t('admin.noDogs')}</p>}
        <div className="row g-3">
          {dogs.map((dog) => (
            <div className="col-12 col-md-6" key={dog.id}>
              <div className="border rounded p-3 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">{dog.name}</h5>
                  <small className="text-muted">{dog.birth}</small>
                </div>
                <p className="text-muted flex-grow-1">
                  {(dog.descriptions?.en || '').slice(0, 160)}...
                </p>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => selectDog(dog)}>
                    {t('admin.editDog')}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(dog.id)}>
                    {t('admin.deleteDog')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
