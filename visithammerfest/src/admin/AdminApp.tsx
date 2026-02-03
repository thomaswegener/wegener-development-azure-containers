import type { ChangeEvent, KeyboardEvent, LegacyRef, RefObject } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type LocalizedText = {
  en?: string;
  no?: string;
};

type ContentStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED";
type FaqRegion = "HAMMERFEST" | "MASOY" | "PORSANGER";

type AdminUser = {
  id: string;
  email: string;
  displayName?: string | null;
  mustChangePassword: boolean;
  roles: string[];
  partnerIds: string[];
};

type AuthState = {
  user: AdminUser;
  csrfToken: string;
};

type Activity = {
  id: string;
  slug?: string | null;
  status: ContentStatus;
  partnerId?: string | null;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  category?: string[];
  season?: string[];
  location?: string[];
  conceptIds?: string[];
  mapEmbed?: string | null;
  bookingLink?: string | null;
  capacity?: string | null;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
};

type Partner = {
  id: string;
  slug?: string | null;
  status: ContentStatus;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  buttonLabel?: LocalizedText;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string[];
  location?: string[];
  conceptIds?: string[];
  target?: string[];
  mapEmbed?: string | null;
  logoMediaId?: string | null;
  heroMediaId?: string | null;
  logoMediaUrl?: string | null;
  heroMediaUrl?: string | null;
};

type Store = {
  id: string;
  slug?: string | null;
  status: ContentStatus;
  partnerId?: string | null;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  buttonLabel?: LocalizedText;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string[];
  location?: string[];
  conceptIds?: string[];
  target?: string[];
  mapEmbed?: string | null;
  logoMediaId?: string | null;
  heroMediaId?: string | null;
  logoMediaUrl?: string | null;
  heroMediaUrl?: string | null;
};

type Article = {
  id: string;
  slug?: string | null;
  status: ContentStatus;
  type?: string | null;
  showOnHome?: boolean;
  location?: string[];
  title: LocalizedText;
  summary?: LocalizedText;
  body?: LocalizedText;
  author?: string | null;
  priority?: number | null;
  buttonLabel?: LocalizedText;
  buttonLink?: string | null;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
};

type Concept = {
  id: string;
  slug: string;
  status: ContentStatus;
  showOnHome?: boolean;
  title: LocalizedText;
  summary?: LocalizedText;
  body?: LocalizedText;
  tag?: LocalizedText;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
};

type Location = {
  id: string;
  slug: string;
  status: ContentStatus;
  showOnHome?: boolean;
  showOnMenu?: boolean;
  name: LocalizedText;
  summary?: LocalizedText;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
};

type SiteInfo = {
  id: string;
  status: ContentStatus;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  buttonLabel?: LocalizedText;
  buttonLink?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  address?: string | null;
  email?: string | null;
  website?: string | null;
  mapEmbed?: string | null;
  logoMediaId?: string | null;
  heroMediaId?: string | null;
  logoMediaUrl?: string | null;
  heroMediaUrl?: string | null;
};

type Faq = {
  id: string;
  status: ContentStatus;
  region: FaqRegion;
  category?: string | null;
  question: LocalizedText;
  answer?: LocalizedText;
};

type AdminUserRecord = {
  id: string;
  email: string;
  displayName?: string | null;
  mustChangePassword: boolean;
  roles: string[];
  partnerIds: string[];
};

type AdminSection =
  | "overview"
  | "site"
  | "locations"
  | "activities"
  | "partners"
  | "stores"
  | "concepts"
  | "inspiration"
  | "information"
  | "faqs"
  | "users";

type LocaleMode = "no" | "en";
type CardVariant = "feature" | "story";

type MediaLink = {
  id: string;
  mediaId: string;
  url: string;
  label?: string | null;
  isPublished?: boolean;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
};

const emptyLocalized = (): LocalizedText => ({ no: "", en: "" });

const decodeHtml = (value: string) => {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const ensureLocalized = (value?: LocalizedText) => ({
  no: value?.no ? decodeHtml(value.no) : "",
  en: value?.en ? decodeHtml(value.en) : ""
});

const decodeText = (value?: string | null) => (value ? decodeHtml(value) : "");
const decodeList = (value?: string[]) => (value ?? []).map((item) => decodeHtml(item));
const stripHtml = (value: string) =>
  decodeHtml(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanPlainText = (value: string) => stripHtml(value);

const cleanRichText = (value: string) => {
  if (!value) return "";
  let cleaned = decodeHtml(value);
  cleaned = cleaned
    .replace(/<\s*\/?\s*ql-[^>]*>/gi, "")
    .replace(/<\s*span[^>]*>/gi, "")
    .replace(/<\/\s*span\s*>/gi, "")
    .replace(/<\s*font[^>]*>/gi, "")
    .replace(/<\/\s*font\s*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "")
    .replace(/<p>\s*(<p>)+/gi, "<p>")
    .replace(/<\/p>\s*(<\/p>)+/gi, "</p>")
    .replace(/\s{2,}/g, " ");
  return cleaned.trim();
};

const updateLocalizedValue = (value: LocalizedText | undefined, locale: LocaleMode, next: string) => ({
  ...(value ?? {}),
  [locale]: next
});

const cleanLocalizedValue = (
  value: LocalizedText | undefined,
  cleaner: (input: string) => string
): LocalizedText => ({
  no: value?.no ? cleaner(value.no) : "",
  en: value?.en ? cleaner(value.en) : ""
});

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const fromList = (value?: string[]) => (value ?? []).join(", ");

const slugifyValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\u00e6\u00c6]/g, "ae")
    .replace(/[\u00f8\u00d8]/g, "o")
    .replace(/[\u00e5\u00c5]/g, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeLocationValues = (values: string[] | undefined, locations: Location[]) => {
  if (!values?.length) return [];
  if (!locations.length) return values;
  const slugMap = new Map<string, string>();
  const nameMap = new Map<string, string>();
  locations.forEach((location) => {
    const slugKey = slugifyValue(location.slug);
    slugMap.set(slugKey, location.slug);
    const label = displayName(location.name);
    if (label) {
      nameMap.set(slugifyValue(label), location.slug);
    }
  });
  return values.map((value) => {
    const normalized = slugifyValue(decodeText(value));
    return slugMap.get(normalized) || nameMap.get(normalized) || value;
  });
};

const minPasswordLength = 5;
const isValidEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
const NEW_ID = "__new__";

const LocaleModeContext = createContext<LocaleMode>("no");

const displayName = (value?: LocalizedText) => {
  const text = value?.no || value?.en || "Uten navn";
  return decodeHtml(text);
};

const pickLocalized = (value: LocalizedText | undefined, mode: LocaleMode) => {
  const no = value?.no?.trim() ?? "";
  const en = value?.en?.trim() ?? "";
  return mode === "en" ? en || no : no || en;
};

const statusOptions: ContentStatus[] = ["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"];

const AdminApp = () => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [section, setSection] = useState<AdminSection>("overview");
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [inspirationArticles, setInspirationArticles] = useState<Article[]>([]);
  const [informationArticles, setInformationArticles] = useState<Article[]>([]);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [localeMode, setLocaleMode] = useState<LocaleMode>("no");

  const csrfToken = auth?.csrfToken ?? "";

  const apiFetch = async <T,>(path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (options.method && options.method !== "GET" && options.method !== "HEAD" && csrfToken) {
      headers.set("x-csrf-token", csrfToken);
    }

    const response = await fetch(`${apiBase}${path}`, {
      credentials: "include",
      ...options,
      headers
    });

    if (response.status === 401) {
      setAuth(null);
      throw new Error("Uautorisert. Logg inn på nytt.");
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "Noe gikk galt.");
    }

    if (response.status === 204) return null as T;
    return (await response.json()) as T;
  };

  const loadSession = async () => {
    try {
      const payload = await apiFetch<{ user: AdminUser; csrfToken: string }>("/api/auth/me");
      setAuth(payload);
    } catch {
      setAuth(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadData = async () => {
    if (!auth) return;
    setDataLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        apiFetch<Activity[]>("/api/activities?includeAll=true"),
        apiFetch<Location[]>("/api/locations?includeAll=true"),
        apiFetch<Partner[]>("/api/partners?includeAll=true"),
        apiFetch<Store[]>("/api/stores?includeAll=true"),
        apiFetch<Concept[]>("/api/concepts?includeAll=true"),
        apiFetch<Article[]>("/api/articles?type=inspiration&includeAll=true"),
        apiFetch<Article[]>("/api/articles?type=information&includeAll=true"),
        apiFetch<SiteInfo>("/api/info"),
        apiFetch<Faq[]>("/api/faqs?includeAll=true"),
        apiFetch<AdminUserRecord[]>("/api/users")
      ]);

      const [
        activitiesResult,
        locationsResult,
        partnersResult,
        storesResult,
        conceptsResult,
        inspirationResult,
        informationResult,
        infoResult,
        faqResult,
        usersResult
      ] = results;

      if (activitiesResult.status === "fulfilled") setActivities(activitiesResult.value);
      if (locationsResult.status === "fulfilled") setLocations(locationsResult.value);
      if (partnersResult.status === "fulfilled") setPartners(partnersResult.value);
      if (storesResult.status === "fulfilled") setStores(storesResult.value);
      if (conceptsResult.status === "fulfilled") setConcepts(conceptsResult.value);
      if (inspirationResult.status === "fulfilled") setInspirationArticles(inspirationResult.value);
      if (informationResult.status === "fulfilled") setInformationArticles(informationResult.value);
      if (infoResult.status === "fulfilled") {
        setSiteInfo(infoResult.value);
      } else {
        setSiteInfo(null);
      }
      if (faqResult.status === "fulfilled") setFaqs(faqResult.value);
      if (usersResult.status === "fulfilled") setUsers(usersResult.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      await loadSession();
      if (!active) return;
      if (auth) {
        await loadData();
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (auth) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.id]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const payload = await apiFetch<{ user: AdminUser; csrfToken: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setAuth(payload);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke logge inn.");
    }
  };

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setAuth(null);
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    await apiFetch("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (auth) {
      setAuth({ ...auth, user: { ...auth.user, mustChangePassword: false } });
    }
  };

  const uploadMedia = async (file: File, targetType: string, targetId: string, label?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetType", targetType);
    formData.append("targetId", targetId);
    if (label) formData.append("label", label);

    return await apiFetch<{ id: string; url: string }>("/api/media/upload", {
      method: "POST",
      body: formData
    });
  };

  const upsertActivity = async (draft: Activity) => {
    const payload = {
      partnerId: draft.partnerId || null,
      name: draft.name,
      short: draft.short,
      description: draft.description,
      category: draft.category ?? [],
      season: draft.season ?? [],
      location: draft.location ?? [],
      conceptIds: draft.conceptIds ?? [],
      mapEmbed: draft.mapEmbed ?? null,
      bookingLink: draft.bookingLink ?? null,
      capacity: draft.capacity ?? null,
      heroMediaId: draft.heroMediaId ?? undefined,
      slug: draft.slug ?? undefined,
      status: draft.status
    };

    let saved: Activity;
    if (draft.id) {
      saved = await apiFetch<Activity>(`/api/activities/${draft.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    } else {
      saved = await apiFetch<Activity>("/api/activities", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    await loadData();
    return saved.id;
  };

  const upsertPartner = async (draft: Partner) => {
    const payload = {
      name: draft.name,
      short: draft.short,
      description: draft.description,
      buttonLabel: draft.buttonLabel,
      facebook: draft.facebook ?? null,
      twitter: draft.twitter ?? null,
      instagram: draft.instagram ?? null,
      youtube: draft.youtube ?? null,
      address: draft.address ?? null,
      email: draft.email ?? null,
      phone: draft.phone ?? null,
      website: draft.website ?? null,
      category: draft.category ?? [],
      location: draft.location ?? [],
      conceptIds: draft.conceptIds ?? [],
      target: draft.target ?? [],
      mapEmbed: draft.mapEmbed ?? null,
      heroMediaId: draft.heroMediaId ?? undefined,
      logoMediaId: draft.logoMediaId ?? undefined,
      slug: draft.slug ?? undefined,
      status: draft.status
    };

    let saved: Partner;
    if (draft.id) {
      saved = await apiFetch<Partner>(`/api/partners/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Partner>("/api/partners", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const upsertStore = async (draft: Store) => {
    const payload = {
      partnerId: draft.partnerId || null,
      name: draft.name,
      short: draft.short,
      description: draft.description,
      buttonLabel: draft.buttonLabel,
      facebook: draft.facebook ?? null,
      twitter: draft.twitter ?? null,
      instagram: draft.instagram ?? null,
      youtube: draft.youtube ?? null,
      address: draft.address ?? null,
      email: draft.email ?? null,
      phone: draft.phone ?? null,
      website: draft.website ?? null,
      category: draft.category ?? [],
      location: draft.location ?? [],
      conceptIds: draft.conceptIds ?? [],
      target: draft.target ?? [],
      mapEmbed: draft.mapEmbed ?? null,
      heroMediaId: draft.heroMediaId ?? undefined,
      logoMediaId: draft.logoMediaId ?? undefined,
      slug: draft.slug ?? undefined,
      status: draft.status
    };

    let saved: Store;
    if (draft.id) {
      saved = await apiFetch<Store>(`/api/stores/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Store>("/api/stores", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const upsertConcept = async (draft: Concept) => {
    const payload = {
      title: draft.title,
      summary: draft.summary,
      body: draft.body,
      tag: draft.tag,
      heroMediaId: draft.heroMediaId ?? undefined,
      slug: draft.slug ?? undefined,
      status: draft.status,
      showOnHome: draft.showOnHome ?? true
    };

    let saved: Concept;
    if (draft.id) {
      saved = await apiFetch<Concept>(`/api/concepts/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Concept>("/api/concepts", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const upsertLocation = async (draft: Location) => {
    const payload = {
      name: draft.name,
      summary: draft.summary,
      heroMediaId: draft.heroMediaId ?? undefined,
      slug: draft.slug ?? undefined,
      status: draft.status,
      showOnHome: draft.showOnHome ?? false,
      showOnMenu: draft.showOnMenu ?? true
    };

    let saved: Location;
    if (draft.id) {
      saved = await apiFetch<Location>(`/api/locations/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Location>("/api/locations", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const upsertArticle = async (draft: Article, type: "inspiration" | "information") => {
    const payload = {
      title: draft.title,
      summary: draft.summary,
      body: draft.body,
      author: draft.author ?? null,
      priority: draft.priority ?? null,
      buttonLabel: draft.buttonLabel,
      buttonLink: draft.buttonLink ?? null,
      heroMediaId: draft.heroMediaId ?? undefined,
      location: draft.location ?? [],
      slug: draft.slug ?? undefined,
      type,
      status: draft.status,
      showOnHome: draft.showOnHome ?? false
    };

    let saved: Article;
    if (draft.id) {
      saved = await apiFetch<Article>(`/api/articles/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Article>("/api/articles", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const upsertFaq = async (draft: Faq) => {
    const payload = {
      region: draft.region,
      category: draft.category ?? null,
      question: draft.question,
      answer: draft.answer,
      status: draft.status
    };

    let saved: Faq;
    if (draft.id) {
      saved = await apiFetch<Faq>(`/api/faqs/${draft.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      saved = await apiFetch<Faq>("/api/faqs", { method: "POST", body: JSON.stringify(payload) });
    }

    await loadData();
    return saved.id;
  };

  const updateSiteInfo = async (draft: SiteInfo) => {
    const payload = {
      name: draft.name,
      short: draft.short,
      description: draft.description,
      buttonLabel: draft.buttonLabel,
      buttonLink: draft.buttonLink ?? null,
      facebook: draft.facebook ?? null,
      twitter: draft.twitter ?? null,
      instagram: draft.instagram ?? null,
      youtube: draft.youtube ?? null,
      address: draft.address ?? null,
      email: draft.email ?? null,
      website: draft.website ?? null,
      mapEmbed: draft.mapEmbed ?? null,
      heroMediaId: draft.heroMediaId ?? undefined,
      logoMediaId: draft.logoMediaId ?? undefined,
      status: draft.status
    };

    await apiFetch("/api/info", { method: "PATCH", body: JSON.stringify(payload) });
    await loadData();
  };

  const upsertUser = async (draft: AdminUserRecord & { password?: string }) => {
    let saved: AdminUserRecord;
    if (draft.id) {
      saved = await apiFetch<AdminUserRecord>(`/api/users/${draft.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          displayName: draft.displayName ?? null,
          role: draft.roles[0] ?? "PARTNER",
          partnerIds: draft.partnerIds,
          mustChangePassword: draft.mustChangePassword
        })
      });
    } else {
      saved = await apiFetch<AdminUserRecord>("/api/users", {
        method: "POST",
        body: JSON.stringify({
          email: draft.email,
          password: draft.password,
          displayName: draft.displayName ?? null,
          role: draft.roles[0] ?? "PARTNER",
          partnerIds: draft.partnerIds
        })
      });
    }

    await loadData();
    return saved.id;
  };

  if (authLoading) {
    return (
      <div className="page-shell admin-shell">
        <div className="admin-loading">Laster inn...</div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="page-shell admin-shell">
        <AdminLogin onLogin={handleLogin} error={error} />
      </div>
    );
  }

  if (!auth.user.roles.includes("ADMIN")) {
    return (
      <div className="page-shell admin-shell">
        <section className="admin-card">
          <h1>Ingen tilgang</h1>
          <p>Denne admin-flaten krever admin-rolle.</p>
          <button className="pill-btn" onClick={handleLogout}>
            Logg ut
          </button>
        </section>
      </div>
    );
  }

  const adminSections: Array<{ key: AdminSection; label: string }> = [
    { key: "overview", label: "Oversikt" },
    { key: "site", label: "Site info" },
    { key: "locations", label: "Steder" },
    { key: "activities", label: "Aktiviteter" },
    { key: "partners", label: "Partnere" },
    { key: "stores", label: "Shopping" },
    { key: "concepts", label: "Konsepter" },
    { key: "inspiration", label: "Inspirasjon" },
    { key: "information", label: "Informasjon" },
    { key: "faqs", label: "FAQ" },
    { key: "users", label: "Brukere" }
  ];

  return (
    <LocaleModeContext.Provider value={localeMode}>
      <div className="page-shell admin-shell">
        <header className="topbar">
          <div className="brand">
            <Link to="/">
              <img src="/media/logo.png" alt="Visit Hammerfest" className="brand-mark" />
            </Link>
            <div>
              <p className="brand-kicker">Visit Hammerfest</p>
              <p className="brand-title">Admin kontroll</p>
            </div>
          </div>
          <div className="top-actions">
            <LanguageToggle value={localeMode} onChange={setLocaleMode} />
            <Link className="pill-btn ghost" to="/">
              Til forsiden
            </Link>
            <button className="pill-btn" onClick={handleLogout}>
              Logg ut
            </button>
          </div>
        </header>

        {auth.user.mustChangePassword && (
          <PasswordCard onSave={handlePasswordChange} />
        )}

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-layout">
          <aside className="admin-nav">
            {adminSections.map((item) => (
              <button
                key={item.key}
                className={`admin-nav-item ${section === item.key ? "active" : ""}`}
                onClick={() => setSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </aside>

          <main className="admin-main">
            {dataLoading && <div className="admin-loading">Oppdaterer innhold...</div>}
            {!dataLoading && section === "overview" && (
              <AdminOverview
                activities={activities.length}
                locations={locations.length}
                partners={partners.length}
                stores={stores.length}
                concepts={concepts.length}
                inspiration={inspirationArticles.length}
                information={informationArticles.length}
                faqs={faqs.length}
              />
            )}
            {section === "site" && (
              <SiteInfoSection
                value={siteInfo}
                onSave={updateSiteInfo}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "locations" && (
              <LocationsSection items={locations} onSave={upsertLocation} onUpload={uploadMedia} apiFetch={apiFetch} />
            )}
            {section === "activities" && (
              <ActivitiesSection
                items={activities}
                partners={partners}
                locations={locations}
                concepts={concepts}
                onSave={upsertActivity}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "partners" && (
              <PartnersSection
                items={partners}
                locations={locations}
                concepts={concepts}
                onSave={upsertPartner}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "stores" && (
              <StoresSection
                items={stores}
                partners={partners}
                locations={locations}
                concepts={concepts}
                onSave={upsertStore}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "concepts" && (
              <ConceptsSection items={concepts} onSave={upsertConcept} onUpload={uploadMedia} />
            )}
            {section === "inspiration" && (
              <ArticlesSection
                items={inspirationArticles}
                label="Inspirasjon"
                type="inspiration"
                locations={locations}
                onSave={upsertArticle}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "information" && (
              <ArticlesSection
                items={informationArticles}
                label="Informasjon"
                type="information"
                locations={locations}
                onSave={upsertArticle}
                onUpload={uploadMedia}
                apiFetch={apiFetch}
              />
            )}
            {section === "faqs" && <FaqSection items={faqs} onSave={upsertFaq} />}
            {section === "users" && (
              <UsersSection items={users} partners={partners} onSave={upsertUser} />
            )}
          </main>
        </div>
      </div>
    </LocaleModeContext.Provider>
  );
};

const AdminLogin = ({ onLogin, error }: { onLogin: (email: string, password: string) => void; error?: string | null }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>Admin innlogging</h1>
        <p>Bruk admin-brukeren for å redigere innholdet på siden.</p>
        {error && <p className="admin-error">{error}</p>}
        <label className="admin-field">
          E-post
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label className="admin-field">
          Passord
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
        </label>
        <button className="pill-btn" onClick={() => onLogin(email, password)}>
          Logg inn
        </button>
      </div>
    </div>
  );
};

const PasswordCard = ({ onSave }: { onSave: (currentPassword: string, newPassword: string) => Promise<void> }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    setStatus(null);
    try {
      await onSave(currentPassword, newPassword);
      setStatus("Passord oppdatert.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Kunne ikke oppdatere passord.");
    }
  };

  return (
    <section className="admin-card admin-password">
      <h2>Bytt passord</h2>
      <p>Du må bytte passord for å fortsette. Nytt passord må være minst {minPasswordLength} tegn.</p>
      <div className="admin-row">
        <label className="admin-field">
          Gjeldende passord
          <input
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            type="password"
          />
        </label>
        <label className="admin-field">
          Nytt passord
          <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" />
        </label>
      </div>
      <button className="pill-btn" onClick={handleSubmit}>
        Oppdater passord
      </button>
      {status && <p className="admin-hint">{status}</p>}
    </section>
  );
};

const AdminOverview = ({
  activities,
  locations,
  partners,
  stores,
  concepts,
  inspiration,
  information,
  faqs
}: Record<string, number>) => {
  const items = [
    { label: "Aktiviteter", value: activities },
    { label: "Steder", value: locations },
    { label: "Partnere", value: partners },
    { label: "Shopping", value: stores },
    { label: "Konsepter", value: concepts },
    { label: "Inspirasjon", value: inspiration },
    { label: "Informasjon", value: information },
    { label: "FAQ", value: faqs }
  ];

  return (
    <section className="admin-card">
      <h2>Oversikt</h2>
      <div className="admin-stats">
        {items.map((item) => (
          <div key={item.label} className="admin-stat">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const SiteInfoSection = ({
  value,
  onSave,
  onUpload,
  apiFetch
}: {
  value: SiteInfo | null;
  onSave: (draft: SiteInfo) => Promise<void>;
  onUpload: (file: File, targetType: string, targetId: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState<SiteInfo>(() =>
    value
      ? {
          ...clone(value),
          name: ensureLocalized(value.name),
          short: ensureLocalized(value.short),
          description: ensureLocalized(value.description),
          buttonLabel: ensureLocalized(value.buttonLabel),
          mapEmbed: value.mapEmbed ?? "",
          status: value.status ?? "DRAFT"
        }
      : {
          id: "",
          status: "DRAFT",
          name: emptyLocalized(),
          short: emptyLocalized(),
          description: emptyLocalized(),
          buttonLabel: emptyLocalized(),
          buttonLink: "",
          facebook: "",
          twitter: "",
          instagram: "",
          youtube: "",
          address: "",
          email: "",
          website: "",
          mapEmbed: "",
          heroMediaId: null,
          logoMediaId: null
        }
  );

  useEffect(() => {
    if (value) {
      setDraft({
        ...clone(value),
        name: ensureLocalized(value.name),
        short: ensureLocalized(value.short),
        description: ensureLocalized(value.description),
        buttonLabel: ensureLocalized(value.buttonLabel),
        mapEmbed: value.mapEmbed ?? "",
        status: value.status ?? "DRAFT"
      });
    }
  }, [value]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: SiteInfo = {
        ...draft,
        name: cleanLocalizedValue(draft.name, cleanPlainText),
        short: cleanLocalizedValue(draft.short, cleanRichText),
        description: cleanLocalizedValue(draft.description, cleanRichText),
        buttonLabel: cleanLocalizedValue(draft.buttonLabel, cleanPlainText)
      };
      await onSave(cleaned);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = (field: "heroMediaId" | "logoMediaId") => async (file: File) => {
    if (!draft.id) return;
    const asset = await onUpload(file, "SITE_INFO", draft.id);
    setDraft((current) => ({ ...current, [field]: asset.id, ...(field === "heroMediaId" ? { heroMediaUrl: asset.url } : { logoMediaUrl: asset.url }) }));
  };

  const previewTitle = pickLocalized(draft.name, localeMode);
  const previewShort = pickLocalized(draft.short, localeMode);
  const previewDescription = pickLocalized(draft.description, localeMode) || previewShort;
  const previewButton = pickLocalized(draft.buttonLabel, localeMode);

  return (
    <section className="admin-card">
      <SectionHeader title="Site info" onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <RichTextToolbar hint="Marker tekst og velg fet skrift eller lenke." />
      <div className="admin-preview-panel">
        <div className="admin-preview">
          <p className="kicker">Forhåndsvisning</p>
          <section className="page-header admin-preview-header">
            <p className="kicker">Informasjon</p>
            <EditableContent
              as="h1"
              value={previewTitle}
              onChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              placeholder="Navn"
              allowNewLines={false}
            />
            <EditableContent
              as="p"
              value={previewShort}
              onChange={(next) => setDraft({ ...draft, short: updateLocalizedValue(draft.short, localeMode, next) })}
              placeholder="Kort tekst"
              mode="rich"
            />
          </section>
        </div>
        <DetailPreview
          label="Informasjon"
          title={previewTitle}
          description={previewDescription}
          imageUrl={draft.heroMediaUrl ?? ""}
          actionLabel={previewButton}
          onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
          onDescriptionChange={(next) => setDraft({ ...draft, description: updateLocalizedValue(draft.description, localeMode, next) })}
          onActionLabelChange={(next) => setDraft({ ...draft, buttonLabel: updateLocalizedValue(draft.buttonLabel, localeMode, next) })}
        />
      </div>
      <div className="admin-grid">
        <InputField label="Knappelenke" value={draft.buttonLink ?? ""} onChange={(value) => setDraft({ ...draft, buttonLink: value })} />
        <InputField label="Adresse" value={draft.address ?? ""} onChange={(value) => setDraft({ ...draft, address: value })} />
        <InputField label="E-post" value={draft.email ?? ""} onChange={(value) => setDraft({ ...draft, email: value })} />
        <InputField label="Nettside" value={draft.website ?? ""} onChange={(value) => setDraft({ ...draft, website: value })} />
      </div>
      <div className="admin-grid">
        <InputField label="Facebook" value={draft.facebook ?? ""} onChange={(value) => setDraft({ ...draft, facebook: value })} />
        <InputField label="Instagram" value={draft.instagram ?? ""} onChange={(value) => setDraft({ ...draft, instagram: value })} />
        <InputField label="YouTube" value={draft.youtube ?? ""} onChange={(value) => setDraft({ ...draft, youtube: value })} />
      </div>
      <InputField label="Map embed" value={draft.mapEmbed ?? ""} onChange={(value) => setDraft({ ...draft, mapEmbed: value })} multiline />
      <div className="admin-grid">
        <MediaField
          label="Hero-bilde"
          currentUrl={draft.heroMediaUrl ?? ""}
          onUpload={handleUpload("heroMediaId")}
          disabled={!draft.id}
          hint="Forslag: 1600x1000 px (JPG/WEBP)."
        />
        <MediaField
          label="Logo"
          currentUrl={draft.logoMediaUrl ?? ""}
          onUpload={handleUpload("logoMediaId")}
          disabled={!draft.id}
          hint="Forslag: 800x800 px (PNG med transparent bakgrunn)."
        />
      </div>
      <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
    </section>
  );
};

const LocationsSection = ({
  items,
  onSave,
  onUpload,
  apiFetch
}: {
  items: Location[];
  onSave: (draft: Location) => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Location | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        name: ensureLocalized(selected.name),
        summary: ensureLocalized(selected.summary),
        slug: selected.slug ?? "",
        showOnHome: selected.showOnHome ?? false,
        showOnMenu: selected.showOnMenu ?? true
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        name: emptyLocalized(),
        summary: emptyLocalized(),
        slug: "",
        heroMediaId: null,
        heroMediaUrl: "",
        showOnHome: false,
        showOnMenu: true
      });
    }
  }, [items, selectedId]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.name).localeCompare(displayName(b.name))),
    [items]
  );

  const handleUpload = async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "LOCATION", draft.id);
    setDraft((current) => (current ? { ...current, heroMediaId: asset.id, heroMediaUrl: asset.url } : current));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Location = {
        ...draft,
        name: cleanLocalizedValue(draft.name, cleanPlainText),
        summary: cleanLocalizedValue(draft.summary, cleanRichText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.name, localeMode);
  const previewSummary = pickLocalized(draft.summary, localeMode);
  const previewBadge = draft.showOnHome ? "Forside" : "Skjult";

  return (
    <section className="admin-card">
      <SectionHeader title="Steder" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.name)}</span>
              <small>{item.status}</small>
              {!item.heroMediaId && !item.heroMediaUrl && <small className="admin-warning">No image</small>}
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <div className="admin-preview">
              <p className="kicker">Forhåndsvisning</p>
              <section className="page-header admin-preview-header">
                <p className="kicker">Sted</p>
                <EditableContent
                  as="h1"
                  value={previewTitle}
                  onChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
                  placeholder="Navn"
                  allowNewLines={false}
                />
                <EditableContent
                  as="p"
                  value={previewSummary}
                  onChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
                  placeholder="Kort tekst"
                  mode="rich"
                />
              </section>
            </div>
            <DetailPreview
              label="Sted"
              title={previewTitle}
              description={previewSummary}
              imageUrl={draft.heroMediaUrl ?? ""}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
            />
            <PreviewCard
              title={previewTitle}
              description={previewSummary}
              imageUrl={draft.heroMediaUrl ?? ""}
              badge={previewBadge}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
            />
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
          </div>
          <MediaField
            label="Hero-bilde"
            currentUrl={draft.heroMediaUrl ?? ""}
            onUpload={handleUpload}
            disabled={!draft.id}
            hint="Forslag: 1600x1000 px (JPG/WEBP)."
          />
          <GalleryField
            label="Galleri"
            targetType="LOCATION"
            targetId={draft.id}
            apiFetch={apiFetch}
            onUpload={onUpload}
            excludeMediaIds={draft.heroMediaId ? [draft.heroMediaId] : []}
            hint="Forslag: 1600x1000 px. Flere bilder kan brukes senere."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
          <label className="admin-field">
            Vis på forsiden
            <input
              type="checkbox"
              checked={draft.showOnHome ?? false}
              onChange={(event) => setDraft({ ...draft, showOnHome: event.target.checked })}
            />
          </label>
          <label className="admin-field">
            Vis i meny
            <input
              type="checkbox"
              checked={draft.showOnMenu ?? true}
              onChange={(event) => setDraft({ ...draft, showOnMenu: event.target.checked })}
            />
          </label>
        </div>
      </div>
    </section>
  );
};

const ActivitiesSection = ({
  items,
  partners,
  locations,
  concepts,
  onSave,
  onUpload,
  apiFetch
}: {
  items: Activity[];
  partners: Partner[];
  locations: Location[];
  concepts: Concept[];
  onSave: (draft: Activity) => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Activity | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId, locations]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        name: ensureLocalized(selected.name),
        short: ensureLocalized(selected.short),
        description: ensureLocalized(selected.description),
        category: decodeList(selected.category),
        season: decodeList(selected.season),
        location: normalizeLocationValues(selected.location, locations),
        conceptIds: selected.conceptIds ?? [],
        mapEmbed: decodeText(selected.mapEmbed),
        bookingLink: decodeText(selected.bookingLink),
        capacity: decodeText(selected.capacity),
        slug: selected.slug ?? ""
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        name: emptyLocalized(),
        short: emptyLocalized(),
        description: emptyLocalized(),
        category: [],
        season: [],
        location: [],
        conceptIds: [],
        mapEmbed: "",
        bookingLink: "",
        capacity: "",
        heroMediaId: null,
        partnerId: null,
        slug: ""
      });
    }
  }, [items, selectedId, locations]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.name).localeCompare(displayName(b.name))),
    [items]
  );
  const locationOptions = useMemo(
    () => locations.map((location) => ({ value: location.slug, label: displayName(location.name) })),
    [locations]
  );
  const conceptOptions = useMemo(
    () => concepts.map((concept) => ({ value: concept.id, label: displayName(concept.title) })),
    [concepts]
  );

  const handleUpload = async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "ACTIVITY", draft.id);
    setDraft((current) => (current ? { ...current, heroMediaId: asset.id, heroMediaUrl: asset.url } : current));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Activity = {
        ...draft,
        name: cleanLocalizedValue(draft.name, cleanPlainText),
        short: cleanLocalizedValue(draft.short, cleanRichText),
        description: cleanLocalizedValue(draft.description, cleanRichText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.name, localeMode);
  const previewShort = pickLocalized(draft.short, localeMode);
  const previewDescription = pickLocalized(draft.description, localeMode) || previewShort;
  const previewBadge = draft.location?.[0] || "Hammerfest";

  return (
    <section className="admin-card">
      <SectionHeader
        title="Aktiviteter"
        onNew={() => setSelectedId(NEW_ID)}
        onSave={handleSave}
        saving={saving}
      />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.name)}</span>
              <small>{item.status}</small>
              {!item.heroMediaId && !item.heroMediaUrl && <small className="admin-warning">No image</small>}
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <DetailPreview
              label="Aktivitet"
              title={previewTitle}
              description={previewDescription}
              imageUrl={draft.heroMediaUrl ?? ""}
              actionLabel={draft.bookingLink ? "Book aktiviteten" : undefined}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) =>
                setDraft({ ...draft, description: updateLocalizedValue(draft.description, localeMode, next) })
              }
            />
            <PreviewCard
              title={previewTitle}
              description={previewShort}
              imageUrl={draft.heroMediaUrl ?? ""}
              badge={previewBadge}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, short: updateLocalizedValue(draft.short, localeMode, next) })}
            />
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
            <SelectField
              label="Partner"
              value={draft.partnerId ?? ""}
              options={[{ value: "", label: "Ingen partner" }, ...partners.map((partner) => ({ value: partner.id, label: displayName(partner.name) }))]}
              onChange={(value) => setDraft({ ...draft, partnerId: value || null })}
            />
          </div>
          <div className="admin-grid">
            <ArrayField label="Kategori" value={draft.category ?? []} onChange={(value) => setDraft({ ...draft, category: value })} />
            <ArrayField label="Sesong" value={draft.season ?? []} onChange={(value) => setDraft({ ...draft, season: value })} />
            <MultiSelectField
              label="Sted"
              value={draft.location ?? []}
              options={locationOptions}
              onChange={(value) => setDraft({ ...draft, location: value })}
              hint={!locationOptions.length ? "Legg til steder først." : undefined}
            />
          </div>
          <MultiSelectField
            label="Konsepter"
            value={draft.conceptIds ?? []}
            options={conceptOptions}
            onChange={(value) => setDraft({ ...draft, conceptIds: value })}
            hint={!conceptOptions.length ? "Legg til konsepter først." : undefined}
          />
          <div className="admin-grid">
            <InputField label="Booking lenke" value={draft.bookingLink ?? ""} onChange={(value) => setDraft({ ...draft, bookingLink: value })} />
            <InputField label="Kapasitet" value={draft.capacity ?? ""} onChange={(value) => setDraft({ ...draft, capacity: value })} />
          </div>
          <InputField label="Map embed" value={draft.mapEmbed ?? ""} onChange={(value) => setDraft({ ...draft, mapEmbed: value })} multiline />
          <MediaField
            label="Hero-bilde"
            currentUrl={draft.heroMediaUrl ?? ""}
            onUpload={handleUpload}
            disabled={!draft.id}
            hint="Forslag: 1600x1000 px (JPG/WEBP)."
          />
          <GalleryField
            label="Galleri"
            targetType="ACTIVITY"
            targetId={draft.id}
            apiFetch={apiFetch}
            onUpload={onUpload}
            excludeMediaIds={draft.heroMediaId ? [draft.heroMediaId] : []}
            hint="Forslag: 1600x1000 px. Flere bilder vises på aktivitetssiden."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
        </div>
      </div>
    </section>
  );
};

const PartnersSection = ({
  items,
  locations,
  concepts,
  onSave,
  onUpload,
  apiFetch
}: {
  items: Partner[];
  locations: Location[];
  concepts: Concept[];
  onSave: (draft: Partner) => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Partner | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId, locations]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        name: ensureLocalized(selected.name),
        short: ensureLocalized(selected.short),
        description: ensureLocalized(selected.description),
        buttonLabel: ensureLocalized(selected.buttonLabel),
        category: decodeList(selected.category),
        location: normalizeLocationValues(selected.location, locations),
        conceptIds: selected.conceptIds ?? [],
        target: decodeList(selected.target),
        mapEmbed: decodeText(selected.mapEmbed),
        slug: selected.slug ?? ""
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        name: emptyLocalized(),
        short: emptyLocalized(),
        description: emptyLocalized(),
        buttonLabel: emptyLocalized(),
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        category: [],
        location: [],
        conceptIds: [],
        target: [],
        mapEmbed: "",
        heroMediaId: null,
        logoMediaId: null,
        slug: ""
      });
    }
  }, [items, selectedId, locations]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.name).localeCompare(displayName(b.name))),
    [items]
  );
  const locationOptions = useMemo(
    () => locations.map((location) => ({ value: location.slug, label: displayName(location.name) })),
    [locations]
  );
  const conceptOptions = useMemo(
    () => concepts.map((concept) => ({ value: concept.id, label: displayName(concept.title) })),
    [concepts]
  );

  const handleUpload = (field: "heroMediaId" | "logoMediaId") => async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "PARTNER", draft.id);
    setDraft((current) =>
      current
        ? {
            ...current,
            [field]: asset.id,
            ...(field === "heroMediaId" ? { heroMediaUrl: asset.url } : { logoMediaUrl: asset.url })
          }
        : current
    );
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Partner = {
        ...draft,
        name: cleanLocalizedValue(draft.name, cleanPlainText),
        short: cleanLocalizedValue(draft.short, cleanRichText),
        description: cleanLocalizedValue(draft.description, cleanRichText),
        buttonLabel: cleanLocalizedValue(draft.buttonLabel, cleanPlainText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.name, localeMode);
  const previewShort = pickLocalized(draft.short, localeMode);
  const previewDescription = pickLocalized(draft.description, localeMode) || previewShort;
  const previewBadge = draft.location?.[0] || "Hammerfest";
  const previewImage = draft.logoMediaUrl ?? draft.heroMediaUrl ?? "";

  return (
    <section className="admin-card">
      <SectionHeader title="Partnere" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.name)}</span>
              <small>{item.status}</small>
              {!item.heroMediaId && !item.heroMediaUrl && !item.logoMediaId && !item.logoMediaUrl && (
                <small className="admin-warning">No image</small>
              )}
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <DetailPreview
              label="Partner"
              title={previewTitle}
              description={previewDescription}
              imageUrl={draft.heroMediaUrl ?? ""}
              actionLabel={pickLocalized(draft.buttonLabel, localeMode) || (draft.website ? "Besøk nettside" : undefined)}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) =>
                setDraft({ ...draft, description: updateLocalizedValue(draft.description, localeMode, next) })
              }
              onActionLabelChange={(next) =>
                setDraft({ ...draft, buttonLabel: updateLocalizedValue(draft.buttonLabel, localeMode, next) })
              }
            />
            <PreviewCard
              title={previewTitle}
              description={previewShort}
              imageUrl={previewImage}
              badge={previewBadge}
              logo={Boolean(draft.logoMediaUrl)}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, short: updateLocalizedValue(draft.short, localeMode, next) })}
            />
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
            <InputField label="Adresse" value={draft.address ?? ""} onChange={(value) => setDraft({ ...draft, address: value })} />
            <InputField label="E-post" value={draft.email ?? ""} onChange={(value) => setDraft({ ...draft, email: value })} />
            <InputField label="Telefon" value={draft.phone ?? ""} onChange={(value) => setDraft({ ...draft, phone: value })} />
            <InputField label="Nettside" value={draft.website ?? ""} onChange={(value) => setDraft({ ...draft, website: value })} />
          </div>
          <div className="admin-grid">
            <ArrayField label="Kategori" value={draft.category ?? []} onChange={(value) => setDraft({ ...draft, category: value })} />
            <MultiSelectField
              label="Sted"
              value={draft.location ?? []}
              options={locationOptions}
              onChange={(value) => setDraft({ ...draft, location: value })}
              hint={!locationOptions.length ? "Legg til steder først." : undefined}
            />
            <ArrayField label="Målgruppe" value={draft.target ?? []} onChange={(value) => setDraft({ ...draft, target: value })} />
          </div>
          <MultiSelectField
            label="Konsepter"
            value={draft.conceptIds ?? []}
            options={conceptOptions}
            onChange={(value) => setDraft({ ...draft, conceptIds: value })}
            hint={!conceptOptions.length ? "Legg til konsepter først." : undefined}
          />
          <div className="admin-grid">
            <InputField label="Facebook" value={draft.facebook ?? ""} onChange={(value) => setDraft({ ...draft, facebook: value })} />
            <InputField label="Instagram" value={draft.instagram ?? ""} onChange={(value) => setDraft({ ...draft, instagram: value })} />
            <InputField label="YouTube" value={draft.youtube ?? ""} onChange={(value) => setDraft({ ...draft, youtube: value })} />
          </div>
          <InputField label="Map embed" value={draft.mapEmbed ?? ""} onChange={(value) => setDraft({ ...draft, mapEmbed: value })} multiline />
          <div className="admin-grid">
            <MediaField
              label="Hero-bilde"
              currentUrl={draft.heroMediaUrl ?? ""}
              onUpload={handleUpload("heroMediaId")}
              disabled={!draft.id}
              hint="Forslag: 1600x1000 px (JPG/WEBP)."
            />
            <MediaField
              label="Logo"
              currentUrl={draft.logoMediaUrl ?? ""}
              onUpload={handleUpload("logoMediaId")}
              disabled={!draft.id}
              hint="Forslag: 800x800 px (PNG med transparent bakgrunn)."
            />
          </div>
          <GalleryField
            label="Galleri"
            targetType="PARTNER"
            targetId={draft.id}
            apiFetch={apiFetch}
            onUpload={onUpload}
            excludeMediaIds={[draft.heroMediaId, draft.logoMediaId].filter(Boolean) as string[]}
            hint="Forslag: 1600x1000 px. Flere bilder vises på partnersiden."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
        </div>
      </div>
    </section>
  );
};

const StoresSection = ({
  items,
  partners,
  locations,
  concepts,
  onSave,
  onUpload,
  apiFetch
}: {
  items: Store[];
  partners: Partner[];
  locations: Location[];
  concepts: Concept[];
  onSave: (draft: Store) => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Store | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId, locations]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        name: ensureLocalized(selected.name),
        short: ensureLocalized(selected.short),
        description: ensureLocalized(selected.description),
        buttonLabel: ensureLocalized(selected.buttonLabel),
        category: decodeList(selected.category),
        location: normalizeLocationValues(selected.location, locations),
        conceptIds: selected.conceptIds ?? [],
        target: decodeList(selected.target),
        mapEmbed: decodeText(selected.mapEmbed),
        slug: selected.slug ?? ""
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        name: emptyLocalized(),
        short: emptyLocalized(),
        description: emptyLocalized(),
        buttonLabel: emptyLocalized(),
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        category: [],
        location: [],
        conceptIds: [],
        target: [],
        mapEmbed: "",
        heroMediaId: null,
        logoMediaId: null,
        partnerId: null,
        slug: ""
      });
    }
  }, [items, selectedId]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.name).localeCompare(displayName(b.name))),
    [items]
  );
  const locationOptions = useMemo(
    () => locations.map((location) => ({ value: location.slug, label: displayName(location.name) })),
    [locations]
  );
  const conceptOptions = useMemo(
    () => concepts.map((concept) => ({ value: concept.id, label: displayName(concept.title) })),
    [concepts]
  );

  const handleUpload = (field: "heroMediaId" | "logoMediaId") => async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "STORE", draft.id);
    setDraft((current) =>
      current
        ? {
            ...current,
            [field]: asset.id,
            ...(field === "heroMediaId" ? { heroMediaUrl: asset.url } : { logoMediaUrl: asset.url })
          }
        : current
    );
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Store = {
        ...draft,
        name: cleanLocalizedValue(draft.name, cleanPlainText),
        short: cleanLocalizedValue(draft.short, cleanRichText),
        description: cleanLocalizedValue(draft.description, cleanRichText),
        buttonLabel: cleanLocalizedValue(draft.buttonLabel, cleanPlainText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.name, localeMode);
  const previewShort = pickLocalized(draft.short, localeMode);
  const previewDescription = pickLocalized(draft.description, localeMode) || previewShort;
  const previewBadge = draft.location?.[0] || "Sentrum";

  return (
    <section className="admin-card">
      <SectionHeader title="Shopping" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.name)}</span>
              <small>{item.status}</small>
              {!item.heroMediaId && !item.heroMediaUrl && !item.logoMediaId && !item.logoMediaUrl && (
                <small className="admin-warning">No image</small>
              )}
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <DetailPreview
              label="Shopping"
              title={previewTitle}
              description={previewDescription}
              imageUrl={draft.heroMediaUrl ?? ""}
              actionLabel={pickLocalized(draft.buttonLabel, localeMode) || (draft.website ? "Besøk nettside" : undefined)}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) =>
                setDraft({ ...draft, description: updateLocalizedValue(draft.description, localeMode, next) })
              }
              onActionLabelChange={(next) =>
                setDraft({ ...draft, buttonLabel: updateLocalizedValue(draft.buttonLabel, localeMode, next) })
              }
            />
            <PreviewCard
              title={previewTitle}
              description={previewShort}
              imageUrl={draft.heroMediaUrl ?? ""}
              badge={previewBadge}
              onTitleChange={(next) => setDraft({ ...draft, name: updateLocalizedValue(draft.name, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, short: updateLocalizedValue(draft.short, localeMode, next) })}
            />
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
            <SelectField
              label="Partner"
              value={draft.partnerId ?? ""}
              options={[{ value: "", label: "Ingen partner" }, ...partners.map((partner) => ({ value: partner.id, label: displayName(partner.name) }))]}
              onChange={(value) => setDraft({ ...draft, partnerId: value || null })}
            />
            <InputField label="Adresse" value={draft.address ?? ""} onChange={(value) => setDraft({ ...draft, address: value })} />
            <InputField label="E-post" value={draft.email ?? ""} onChange={(value) => setDraft({ ...draft, email: value })} />
            <InputField label="Telefon" value={draft.phone ?? ""} onChange={(value) => setDraft({ ...draft, phone: value })} />
            <InputField label="Nettside" value={draft.website ?? ""} onChange={(value) => setDraft({ ...draft, website: value })} />
          </div>
          <div className="admin-grid">
            <ArrayField label="Kategori" value={draft.category ?? []} onChange={(value) => setDraft({ ...draft, category: value })} />
            <MultiSelectField
              label="Sted"
              value={draft.location ?? []}
              options={locationOptions}
              onChange={(value) => setDraft({ ...draft, location: value })}
              hint={!locationOptions.length ? "Legg til steder først." : undefined}
            />
            <ArrayField label="Målgruppe" value={draft.target ?? []} onChange={(value) => setDraft({ ...draft, target: value })} />
          </div>
          <MultiSelectField
            label="Konsepter"
            value={draft.conceptIds ?? []}
            options={conceptOptions}
            onChange={(value) => setDraft({ ...draft, conceptIds: value })}
            hint={!conceptOptions.length ? "Legg til konsepter først." : undefined}
          />
          <InputField label="Map embed" value={draft.mapEmbed ?? ""} onChange={(value) => setDraft({ ...draft, mapEmbed: value })} multiline />
          <div className="admin-grid">
            <MediaField
              label="Hero-bilde"
              currentUrl={draft.heroMediaUrl ?? ""}
              onUpload={handleUpload("heroMediaId")}
              disabled={!draft.id}
              hint="Forslag: 1600x1000 px (JPG/WEBP)."
            />
            <MediaField
              label="Logo"
              currentUrl={draft.logoMediaUrl ?? ""}
              onUpload={handleUpload("logoMediaId")}
              disabled={!draft.id}
              hint="Forslag: 800x800 px (PNG med transparent bakgrunn)."
            />
          </div>
          <GalleryField
            label="Galleri"
            targetType="STORE"
            targetId={draft.id}
            apiFetch={apiFetch}
            onUpload={onUpload}
            excludeMediaIds={[draft.heroMediaId, draft.logoMediaId].filter(Boolean) as string[]}
            hint="Forslag: 1600x1000 px. Flere bilder vises på butikksiden."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
        </div>
      </div>
    </section>
  );
};

const ConceptsSection = ({
  items,
  onSave,
  onUpload
}: {
  items: Concept[];
  onSave: (draft: Concept) => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Concept | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        title: ensureLocalized(selected.title),
        summary: ensureLocalized(selected.summary),
        body: ensureLocalized(selected.body),
        tag: ensureLocalized(selected.tag),
        slug: selected.slug ?? "",
        showOnHome: selected.showOnHome ?? true
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        title: emptyLocalized(),
        summary: emptyLocalized(),
        body: emptyLocalized(),
        tag: emptyLocalized(),
        heroMediaId: null,
        heroMediaUrl: "",
        slug: "",
        showOnHome: true
      });
    }
  }, [items, selectedId]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.title).localeCompare(displayName(b.title))),
    [items]
  );
  const handleUpload = async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "CONCEPT", draft.id);
    setDraft((current) => (current ? { ...current, heroMediaId: asset.id, heroMediaUrl: asset.url } : current));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Concept = {
        ...draft,
        title: cleanLocalizedValue(draft.title, cleanPlainText),
        summary: cleanLocalizedValue(draft.summary, cleanRichText),
        body: cleanLocalizedValue(draft.body, cleanRichText),
        tag: cleanLocalizedValue(draft.tag, cleanPlainText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.title, localeMode);
  const previewSummary = pickLocalized(draft.summary, localeMode);
  const previewBody = pickLocalized(draft.body, localeMode);
  const previewTag = pickLocalized(draft.tag, localeMode) || "Opplevelser";
  const previewDescription = previewSummary || previewBody;

  return (
    <section className="admin-card">
      <SectionHeader title="Konsepter" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.title)}</span>
              <small>{item.status}</small>
              {!item.heroMediaId && !item.heroMediaUrl && <small className="admin-warning">No image</small>}
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <DetailPreview
              label={previewTag}
              title={previewTitle}
              description={previewDescription}
              imageUrl={draft.heroMediaUrl ?? ""}
              onTitleChange={(next) => setDraft({ ...draft, title: updateLocalizedValue(draft.title, localeMode, next) })}
              onDescriptionChange={(next) =>
                setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })
              }
            />
            <article className="concept-card admin-preview-card">
              <div className="concept-media" style={draft.heroMediaUrl ? { backgroundImage: `url(${draft.heroMediaUrl})` } : undefined}>
                <EditableContent
                  as="span"
                  value={previewTag}
                  onChange={(next) => setDraft({ ...draft, tag: updateLocalizedValue(draft.tag, localeMode, next) })}
                  placeholder="Merkelapp"
                  allowNewLines={false}
                />
              </div>
              <div className="concept-body">
                <EditableContent
                  as="h4"
                  value={previewTitle}
                  onChange={(next) => setDraft({ ...draft, title: updateLocalizedValue(draft.title, localeMode, next) })}
                  placeholder="Tittel"
                  allowNewLines={false}
                />
                <EditableContent
                  as="p"
                  value={previewSummary}
                  onChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
                  placeholder="Kort beskrivelse"
                  mode="rich"
                />
              </div>
            </article>
            <div className="admin-preview">
              <p className="kicker">Innhold</p>
              <EditableContent
                as="div"
                className="detail-content admin-editable-block"
                value={previewBody}
                onChange={(next) => setDraft({ ...draft, body: updateLocalizedValue(draft.body, localeMode, next) })}
                placeholder="Skriv inn innhold her..."
                mode="rich"
              />
            </div>
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
          </div>
          <MediaField
            label="Hero-bilde"
            currentUrl={draft.heroMediaUrl ?? ""}
            onUpload={handleUpload}
            disabled={!draft.id}
            hint="Forslag: 1600x1000 px (JPG/WEBP)."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
          <label className="admin-field">
            Vis på forsiden
            <input
              type="checkbox"
              checked={draft.showOnHome ?? true}
              onChange={(event) => setDraft({ ...draft, showOnHome: event.target.checked })}
            />
          </label>
        </div>
      </div>
    </section>
  );
};

const ArticlesSection = ({
  items,
  label,
  type,
  locations,
  onSave,
  onUpload,
  apiFetch
}: {
  items: Article[];
  label: string;
  type: "inspiration" | "information";
  locations: Location[];
  onSave: (draft: Article, type: "inspiration" | "information") => Promise<string>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Article | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        title: ensureLocalized(selected.title),
        summary: ensureLocalized(selected.summary),
        body: ensureLocalized(selected.body),
        buttonLabel: ensureLocalized(selected.buttonLabel),
        author: decodeText(selected.author ?? ""),
        showOnHome: selected.showOnHome ?? false,
        location: normalizeLocationValues(selected.location, locations),
        slug: selected.slug ?? ""
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        title: emptyLocalized(),
        summary: emptyLocalized(),
        body: emptyLocalized(),
        buttonLabel: emptyLocalized(),
        buttonLink: "",
        author: "",
        priority: null,
        heroMediaId: null,
        showOnHome: false,
        location: [],
        slug: ""
      });
    }
  }, [items, selectedId, locations]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => displayName(a.title).localeCompare(displayName(b.title))),
    [items]
  );
  const locationOptions = useMemo(
    () => locations.map((location) => ({ value: location.slug, label: displayName(location.name) })),
    [locations]
  );

  const handleUpload = async (file: File) => {
    if (!draft?.id) return;
    const asset = await onUpload(file, "ARTICLE", draft.id);
    setDraft((current) => (current ? { ...current, heroMediaId: asset.id, heroMediaUrl: asset.url } : current));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Article = {
        ...draft,
        title: cleanLocalizedValue(draft.title, cleanPlainText),
        summary: cleanLocalizedValue(draft.summary, cleanRichText),
        body: cleanLocalizedValue(draft.body, cleanRichText),
        buttonLabel: cleanLocalizedValue(draft.buttonLabel, cleanPlainText)
      };
      const savedId = await onSave(cleaned, type);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) return null;

  const previewTitle = pickLocalized(draft.title, localeMode);
  const previewSummary = pickLocalized(draft.summary, localeMode);
  const previewBody = pickLocalized(draft.body, localeMode);
  const previewLabel = type === "information" ? "Informasjon" : "Inspirasjon";
  const previewDescription = previewSummary || previewBody;

  return (
    <section className="admin-card">
      <SectionHeader title={label} onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.title)}</span>
              <small>{item.status}</small>
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <DetailPreview
              label={previewLabel}
              title={previewTitle}
              description={previewDescription}
              imageUrl={draft.heroMediaUrl ?? ""}
              actionLabel={pickLocalized(draft.buttonLabel, localeMode) || undefined}
              onTitleChange={(next) => setDraft({ ...draft, title: updateLocalizedValue(draft.title, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
              onActionLabelChange={(next) =>
                setDraft({ ...draft, buttonLabel: updateLocalizedValue(draft.buttonLabel, localeMode, next) })
              }
            />
            <PreviewCard
              title={previewTitle}
              description={previewSummary}
              imageUrl={draft.heroMediaUrl ?? ""}
              variant="story"
              onTitleChange={(next) => setDraft({ ...draft, title: updateLocalizedValue(draft.title, localeMode, next) })}
              onDescriptionChange={(next) => setDraft({ ...draft, summary: updateLocalizedValue(draft.summary, localeMode, next) })}
            />
            <div className="admin-preview">
              <p className="kicker">Innhold</p>
              <EditableContent
                as="div"
                className="detail-content admin-editable-block"
                value={previewBody}
                onChange={(next) => setDraft({ ...draft, body: updateLocalizedValue(draft.body, localeMode, next) })}
                placeholder="Skriv inn artikkelinnhold..."
                mode="rich"
              />
            </div>
          </div>
          <div className="admin-grid">
            <InputField label="Slug" value={draft.slug ?? ""} onChange={(value) => setDraft({ ...draft, slug: value })} />
            <InputField label="Forfatter" value={draft.author ?? ""} onChange={(value) => setDraft({ ...draft, author: value })} />
            <InputField
              label="Prioritet"
              value={draft.priority?.toString() ?? ""}
              onChange={(value) => setDraft({ ...draft, priority: value ? Number(value) : null })}
            />
            <InputField label="Knappelenke" value={draft.buttonLink ?? ""} onChange={(value) => setDraft({ ...draft, buttonLink: value })} />
            {type === "inspiration" && (
              <MultiSelectField
                label="Sted"
                value={draft.location ?? []}
                options={locationOptions}
                onChange={(value) => setDraft({ ...draft, location: value })}
                hint={!locationOptions.length ? "Legg til steder først." : undefined}
              />
            )}
          </div>
          <MediaField
            label="Hero-bilde"
            currentUrl={draft.heroMediaUrl ?? ""}
            onUpload={handleUpload}
            disabled={!draft.id}
            hint="Forslag: 1600x1000 px (JPG/WEBP)."
          />
          <GalleryField
            label="Galleri"
            targetType="ARTICLE"
            targetId={draft.id}
            apiFetch={apiFetch}
            onUpload={onUpload}
            excludeMediaIds={draft.heroMediaId ? [draft.heroMediaId] : []}
            hint="Forslag: 1600x1000 px. Flere bilder vises på artikkelsiden."
          />
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
          <label className="admin-field">
            Vis på forsiden
            <input
              type="checkbox"
              checked={draft.showOnHome ?? false}
              onChange={(event) => setDraft({ ...draft, showOnHome: event.target.checked })}
            />
          </label>
        </div>
      </div>
    </section>
  );
};

const FaqSection = ({ items, onSave }: { items: Faq[]; onSave: (draft: Faq) => Promise<string> }) => {
  const localeMode = useContext(LocaleModeContext);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<Faq | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({
        ...clone(selected),
        region: selected.region ?? "HAMMERFEST",
        question: ensureLocalized(selected.question),
        answer: ensureLocalized(selected.answer),
        category: decodeText(selected.category ?? "")
      });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        status: "DRAFT",
        region: "HAMMERFEST",
        category: "",
        question: emptyLocalized(),
        answer: emptyLocalized()
      });
    }
  }, [items, selectedId]);

  if (!draft) return null;
  const previewQuestion = pickLocalized(draft.question, localeMode);
  const previewAnswer = pickLocalized(draft.answer, localeMode);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const cleaned: Faq = {
        ...draft,
        question: cleanLocalizedValue(draft.question, cleanRichText),
        answer: cleanLocalizedValue(draft.answer, cleanRichText)
      };
      const savedId = await onSave(cleaned);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card">
      <SectionHeader title="FAQ" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {items.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{displayName(item.question)}</span>
              <small>{item.status}</small>
            </button>
          ))}
        </div>
        <div className="admin-form">
          <RichTextToolbar />
          <div className="admin-preview-panel">
            <div className="admin-preview">
              <p className="kicker">Forhåndsvisning</p>
              <div className="faq-card admin-editable-block">
                <EditableContent
                  as="h3"
                  value={previewQuestion}
                  onChange={(next) => setDraft({ ...draft, question: updateLocalizedValue(draft.question, localeMode, next) })}
                  placeholder="Spørsmål"
                  mode="rich"
                  allowNewLines={false}
                />
                <EditableContent
                  as="p"
                  value={previewAnswer}
                  onChange={(next) => setDraft({ ...draft, answer: updateLocalizedValue(draft.answer, localeMode, next) })}
                  placeholder="Svar"
                  mode="rich"
                />
              </div>
            </div>
          </div>
          <div className="admin-grid">
            <SelectField
              label="Region"
              value={draft.region}
              options={[
                { value: "HAMMERFEST", label: "Hammerfest" },
                { value: "MASOY", label: "Måsøy" },
                { value: "PORSANGER", label: "Porsanger" }
              ]}
              onChange={(value) => setDraft({ ...draft, region: value as FaqRegion })}
            />
            <InputField label="Kategori" value={draft.category ?? ""} onChange={(value) => setDraft({ ...draft, category: value })} />
          </div>
          <StatusField value={draft.status} onChange={(value) => setDraft({ ...draft, status: value })} />
        </div>
      </div>
    </section>
  );
};

const UsersSection = ({
  items,
  partners,
  onSave
}: {
  items: AdminUserRecord[];
  partners: Partner[];
  onSave: (draft: AdminUserRecord & { password?: string }) => Promise<string>;
}) => {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);
  const [draft, setDraft] = useState<(AdminUserRecord & { password?: string }) | null>(null);

  useEffect(() => {
    if (selectedId === null && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      setDraft({ ...clone(selected), roles: selected.roles.length ? selected.roles : ["PARTNER"] });
    } else if (selectedId === NEW_ID || (selectedId === null && items.length === 0)) {
      setDraft({
        id: "",
        email: "",
        displayName: "",
        roles: ["PARTNER"],
        partnerIds: [],
        mustChangePassword: true,
        password: ""
      });
    }
  }, [items, selectedId]);

  if (!draft) return null;

  const togglePartner = (partnerId: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      partnerIds: draft.partnerIds.includes(partnerId)
        ? draft.partnerIds.filter((id) => id !== partnerId)
        : [...draft.partnerIds, partnerId]
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    if (!draft.email.trim()) {
      setSaveStatus("E-post er påkrevd.");
      return;
    }
    if (!isValidEmail(draft.email)) {
      setSaveStatus("Ugyldig e-postformat.");
      return;
    }
    if (draft.id === "" && (!draft.password || draft.password.length < minPasswordLength)) {
      setSaveStatus(`Passord må være minst ${minPasswordLength} tegn.`);
      return;
    }
    setSaving(true);
    setSaveStatus(null);
    try {
      const savedId = await onSave(draft);
      if (savedId) setSelectedId(savedId);
      setSaveStatus("Lagret.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card">
      <SectionHeader title="Brukere" onNew={() => setSelectedId(NEW_ID)} onSave={handleSave} saving={saving} />
      {saveStatus && <p className="admin-hint">{saveStatus}</p>}
      <div className="admin-split">
        <div className="admin-list">
          {items.map((item) => (
            <button
              key={item.id}
              className={`admin-list-item ${item.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{item.email}</span>
              <small>{item.roles.join(", ")}</small>
            </button>
          ))}
        </div>
        <div className="admin-form">
          <InputField
            label="E-post"
            value={draft.email}
            onChange={(value) => setDraft({ ...draft, email: value })}
            disabled={draft.id !== ""}
          />
          {draft.id === "" && (
            <>
              <InputField
                label="Passord"
                value={draft.password ?? ""}
                onChange={(value) => setDraft({ ...draft, password: value })}
                type="password"
              />
              <p className="admin-hint">Minst {minPasswordLength} tegn.</p>
            </>
          )}
          <InputField
            label="Visningsnavn"
            value={draft.displayName ?? ""}
            onChange={(value) => setDraft({ ...draft, displayName: value })}
          />
          <SelectField
            label="Rolle"
            value={draft.roles[0] ?? "PARTNER"}
            options={[
              { value: "ADMIN", label: "ADMIN" },
              { value: "PARTNER", label: "PARTNER" }
            ]}
            onChange={(value) => setDraft({ ...draft, roles: [value] })}
          />
          <label className="admin-field">
            Krev passordbytte
            <input
              type="checkbox"
              checked={draft.mustChangePassword}
              onChange={(event) => setDraft({ ...draft, mustChangePassword: event.target.checked })}
            />
          </label>
          <div className="admin-field">
            <span>Partnerkobling</span>
            <div className="admin-checkbox-grid">
              {partners.map((partner) => (
                <label key={partner.id} className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={draft.partnerIds.includes(partner.id)}
                    onChange={() => togglePartner(partner.id)}
                  />
                  <span>{displayName(partner.name)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({
  title,
  onSave,
  onNew,
  saving
}: {
  title: string;
  onSave: () => void;
  onNew?: () => void;
  saving?: boolean;
}) => (
  <div className="admin-header">
    <div>
      <h2>{title}</h2>
      <p className="admin-hint">Husk å lagre endringer og publisere når du er klar.</p>
    </div>
    <div className="admin-actions">
      {onNew && (
        <button className="pill-btn ghost" onClick={onNew}>
          Ny
        </button>
      )}
      <button className="pill-btn" onClick={onSave} disabled={saving}>
        {saving ? "Lagrer..." : "Lagre"}
      </button>
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  disabled = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
}) => (
  <label className="admin-field">
    {label}
    {multiline ? (
      <textarea value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
    ) : (
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} disabled={disabled} />
    )}
  </label>
);

const SelectField = ({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) => (
  <label className="admin-field">
    {label}
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const ArrayField = ({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) => {
  const [text, setText] = useState(fromList(value));

  useEffect(() => {
    setText(fromList(value));
  }, [value]);

  return (
    <label className="admin-field">
      {label}
      <input
        value={text}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          onChange(toList(next));
        }}
      />
    </label>
  );
};

const MultiSelectField = ({
  label,
  value,
  options,
  onChange,
  hint
}: {
  label: string;
  value: string[];
  options: Array<{ value: string; label: string }>;
  onChange: (value: string[]) => void;
  hint?: string;
}) => (
  <div className="admin-field">
    <span>{label}</span>
    <div className="admin-checkbox-grid">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label key={option.value} className="admin-checkbox">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => {
                if (event.target.checked) {
                  onChange([...value, option.value]);
                } else {
                  onChange(value.filter((entry) => entry !== option.value));
                }
              }}
            />
            {option.label || option.value}
          </label>
        );
      })}
      {!options.length && <span className="admin-hint">Ingen valg tilgjengelig.</span>}
    </div>
    {hint && <p className="admin-hint">{hint}</p>}
  </div>
);

const LocalizedField = ({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value?: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) => {
  const localeMode = useContext(LocaleModeContext);
  const showNo = localeMode === "no";
  const showEn = localeMode === "en";
  const gridClass = "admin-locale-grid admin-locale-single";

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className={gridClass}>
        {showNo && (
          <label>
            NO
            {multiline ? (
              <textarea value={value?.no ?? ""} onChange={(event) => onChange({ ...value, no: event.target.value })} />
            ) : (
              <input value={value?.no ?? ""} onChange={(event) => onChange({ ...value, no: event.target.value })} />
            )}
          </label>
        )}
        {showEn && (
          <label>
            EN
            {multiline ? (
              <textarea value={value?.en ?? ""} onChange={(event) => onChange({ ...value, en: event.target.value })} />
            ) : (
              <input value={value?.en ?? ""} onChange={(event) => onChange({ ...value, en: event.target.value })} />
            )}
          </label>
        )}
      </div>
    </div>
  );
};

const StatusField = ({ value, onChange }: { value: ContentStatus; onChange: (value: ContentStatus) => void }) => (
  <SelectField
    label="Status"
    value={value}
    options={statusOptions.map((status) => ({ value: status, label: status }))}
    onChange={(next) => onChange(next as ContentStatus)}
  />
);

const MediaField = ({
  label,
  currentUrl,
  onUpload,
  disabled,
  hint
}: {
  label: string;
  currentUrl: string;
  onUpload: (file: File) => void;
  disabled?: boolean;
  hint?: string;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className="admin-media">
        <div
          className="admin-media-preview"
          style={currentUrl ? { backgroundImage: `url(${currentUrl})` } : undefined}
        />
        <input type="file" accept="image/*" disabled={disabled || uploading} onChange={handleFile} />
      </div>
      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
};

const GalleryField = ({
  label,
  targetType,
  targetId,
  hint,
  excludeMediaIds,
  apiFetch,
  onUpload
}: {
  label: string;
  targetType: string;
  targetId: string;
  hint?: string;
  excludeMediaIds?: string[];
  apiFetch: <T,>(path: string, options?: RequestInit) => Promise<T>;
  onUpload: (file: File, targetType: string, targetId: string, label?: string) => Promise<{ id: string; url: string }>;
}) => {
  const [items, setItems] = useState<MediaLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!targetId) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ targetType, targetId, includeAll: "true" });
      const data = await apiFetch<MediaLink[]>(`/api/media/links?${params.toString()}`);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente bilder.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, targetId, targetType]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !targetId) return;
    event.target.value = "";
    await onUpload(file, targetType, targetId, "gallery");
    await loadItems();
  };

  const handleRemove = async (linkId: string) => {
    await apiFetch(`/api/media/links/${linkId}`, { method: "DELETE" });
    await loadItems();
  };

  const handlePublishToggle = async (linkId: string, nextValue: boolean) => {
    await apiFetch(`/api/media/links/${linkId}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: nextValue })
    });
    await loadItems();
  };

  const visibleItems = excludeMediaIds?.length
    ? items.filter((item) => !excludeMediaIds.includes(item.mediaId))
    : items;

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className="admin-media">
        <input type="file" accept="image/*" disabled={!targetId} onChange={handleUpload} />
      </div>
      {hint && <p className="admin-hint">{hint}</p>}
      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-hint">Laster bilder...</p>}
      {!loading && (
        <div className="admin-gallery-grid">
          {visibleItems.map((item) => (
            <div key={item.id} className="admin-gallery-item">
              <img src={item.url} alt="" />
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={item.isPublished ?? true}
                  onChange={(event) => handlePublishToggle(item.id, event.target.checked)}
                />
                Publisert
              </label>
              <button className="pill-btn ghost" onClick={() => handleRemove(item.id)}>
                Fjern
              </button>
            </div>
          ))}
          {!visibleItems.length && <p className="admin-hint">Ingen galleribilder enda.</p>}
        </div>
      )}
    </div>
  );
};

const RichTextToolbar = ({ hint }: { hint?: string }) => {
  const exec = (command: string, value?: string) => {
    if (typeof document === "undefined") return;
    document.execCommand(command, false, value);
  };

  const handleLink = () => {
    const url = window.prompt("Lenke (https://...)");
    if (!url) return;
    exec("createLink", url);
    const selection = window.getSelection();
    const anchor = selection?.anchorNode instanceof HTMLElement
      ? selection.anchorNode.closest("a")
      : selection?.anchorNode?.parentElement?.closest("a");
    if (anchor) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }
  };

  return (
    <div className="admin-editor-toolbar">
      <span>Format</span>
      <button type="button" className="pill-btn ghost" onMouseDown={(event) => event.preventDefault()} onClick={() => exec("bold")}>
        Bold
      </button>
      <button type="button" className="pill-btn ghost" onMouseDown={(event) => event.preventDefault()} onClick={() => exec("insertLineBreak")}>
        Linjeskift
      </button>
      <button type="button" className="pill-btn ghost" onMouseDown={(event) => event.preventDefault()} onClick={handleLink}>
        Lenke
      </button>
      {hint && <span className="admin-hint">{hint}</span>}
    </div>
  );
};

type EditableMode = "plain" | "rich";
type EditableTag = "div" | "p" | "h1" | "h3" | "h4" | "span";

const EditableContent = ({
  as = "div",
  value,
  onChange,
  placeholder,
  mode = "plain",
  className,
  allowNewLines = true
}: {
  as?: EditableTag;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mode?: EditableMode;
  className?: string;
  allowNewLines?: boolean;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as;

  useEffect(() => {
    if (!ref.current) return;
    const current = mode === "rich" ? ref.current.innerHTML : ref.current.textContent ?? "";
    if (current !== value) {
      if (mode === "rich") {
        ref.current.innerHTML = value || "";
      } else {
        ref.current.textContent = value || "";
      }
    }
  }, [value, mode]);

  const handleInput = () => {
    if (!ref.current) return;
    const next = mode === "rich" ? ref.current.innerHTML : ref.current.textContent ?? "";
    onChange(next);
  };

  const handleBlur = () => {
    if (!ref.current) return;
    const raw = mode === "rich" ? ref.current.innerHTML : ref.current.textContent ?? "";
    let cleaned = mode === "rich" ? cleanRichText(raw) : cleanPlainText(raw);
    if (mode === "rich" && as !== "div") {
      cleaned = cleaned.replace(/<\/?p[^>]*>/gi, "");
    }
    if (cleaned !== raw) {
      if (mode === "rich") {
        ref.current.innerHTML = cleaned;
      } else {
        ref.current.textContent = cleaned;
      }
    }
    onChange(cleaned);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!allowNewLines && event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <Tag
      ref={ref as unknown as LegacyRef<any>}
      className={`admin-editable ${className ?? ""}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      data-empty={value ? "false" : "true"}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

const PreviewCard = ({
  title,
  description,
  imageUrl,
  badge,
  variant = "feature",
  logo = false,
  onTitleChange,
  onDescriptionChange
}: {
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  variant?: CardVariant;
  logo?: boolean;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}) => {
  const cardClass = variant === "story" ? "story-card" : "feature-card";
  const bodyClass = variant === "story" ? "" : "card-body";
  const mediaClass = `card-media${logo ? " logo-media" : ""}`;
  const mediaStyle = !logo && imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined;

  return (
    <article className={`${cardClass} admin-preview-card`}>
      <div className={mediaClass} style={mediaStyle}>
        {logo && imageUrl && <img src={imageUrl} alt={title || "Logo"} />}
      </div>
      <div className={bodyClass || undefined}>
        {badge && <span className="badge ghost badge-fixed">{badge}</span>}
        {onTitleChange ? (
          <EditableContent as="h3" value={title} onChange={onTitleChange} placeholder="Navn" allowNewLines={false} />
        ) : (
          <h3>{title || "Navn"}</h3>
        )}
        {onDescriptionChange ? (
          <EditableContent as="p" value={description} onChange={onDescriptionChange} placeholder="Kort beskrivelse" mode="rich" />
        ) : (
          <p>{description || "Kort beskrivelse"}</p>
        )}
      </div>
    </article>
  );
};

const DetailPreview = ({
  label,
  title,
  description,
  imageUrl,
  actionLabel,
  onTitleChange,
  onDescriptionChange,
  onActionLabelChange
}: {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  actionLabel?: string;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onActionLabelChange?: (value: string) => void;
}) => (
  <div className="admin-preview">
    <p className="kicker">Forhåndsvisning</p>
    <section className="detail-hero admin-preview-hero">
      <div className="detail-media" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} />
      <div className="detail-body">
        <p className="kicker">{label}</p>
        {onTitleChange ? (
          <EditableContent as="h1" value={title} onChange={onTitleChange} placeholder="Tittel" allowNewLines={false} />
        ) : (
          <h1>{title || "Tittel"}</h1>
        )}
        {onDescriptionChange ? (
          <EditableContent as="p" value={description} onChange={onDescriptionChange} placeholder="Kort beskrivelse" mode="rich" />
        ) : (
          <p>{description || "Kort beskrivelse"}</p>
        )}
        {(actionLabel || onActionLabelChange) && (
          <span className="pill-btn admin-editable-button">
            {onActionLabelChange ? (
              <EditableContent
                as="span"
                value={actionLabel ?? ""}
                onChange={onActionLabelChange}
                placeholder="Knappetekst"
                allowNewLines={false}
              />
            ) : (
              actionLabel
            )}
          </span>
        )}
      </div>
    </section>
  </div>
);

const LanguageToggle = ({
  value,
  onChange
}: {
  value: LocaleMode;
  onChange: (value: LocaleMode) => void;
}) => (
  <div className="admin-language-toggle">
    <span>Sprak</span>
    <button className={`pill-btn ghost ${value === "no" ? "active" : ""}`} onClick={() => onChange("no")}>
      NO
    </button>
    <button className={`pill-btn ghost ${value === "en" ? "active" : ""}`} onClick={() => onChange("en")}>
      EN
    </button>
  </div>
);

export default AdminApp;
