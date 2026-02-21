import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useOutletContext,
  useParams
} from "react-router-dom";
import AdminApp from "./admin/AdminApp";

type NavLink = {
  label: string;
  to?: string;
  href?: string;
  badge?: string;
  external?: boolean;
};

type NavItem = { key: string; label: string; kicker: string; summary: string; links: NavLink[]; primaryTo?: string };
type SocialIconName = "facebook" | "instagram" | "youtube";
type SocialLink = { label: string; href: string; icon: SocialIconName };

type LocalizedText = {
  en?: string;
  no?: string;
};

type Activity = {
  id: string;
  slug?: string | null;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  location?: string[];
  conceptIds?: string[];
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
  mapEmbed?: string | null;
  bookingLink?: string | null;
  capacity?: string | null;
};

type Partner = {
  id: string;
  slug?: string | null;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  location?: string[];
  conceptIds?: string[];
  logoMediaId?: string | null;
  heroMediaId?: string | null;
  logoMediaUrl?: string | null;
  heroMediaUrl?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Store = {
  id: string;
  slug?: string | null;
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  location?: string[];
  conceptIds?: string[];
  logoMediaId?: string | null;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
  logoMediaUrl?: string | null;
  website?: string | null;
};

type Article = {
  id: string;
  slug?: string | null;
  type?: string | null;
  showOnHome?: boolean;
  location?: string[];
  title: LocalizedText;
  summary?: LocalizedText;
  body?: LocalizedText;
  author?: string | null;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
  buttonLink?: string | null;
};

type Concept = {
  id: string;
  slug: string;
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
  showOnHome?: boolean;
  showOnMenu?: boolean;
  name: LocalizedText;
  summary?: LocalizedText;
  heroMediaId?: string | null;
  heroMediaUrl?: string | null;
};

type SiteInfo = {
  name: LocalizedText;
  short?: LocalizedText;
  description?: LocalizedText;
  address?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  mapEmbed?: string | null;
  heroMediaUrl?: string | null;
  logoMediaUrl?: string | null;
  openingHours?: LocalizedText | null;
  heroSpringMediaUrl?: string | null;
  heroSummerMediaUrl?: string | null;
  heroAutumnMediaUrl?: string | null;
  heroWinterMediaUrl?: string | null;
  footerLinks?: Array<{ label: string; url: string }> | null;
};

type Faq = {
  id: string;
  region?: FaqRegion;
  category?: string | null;
  question: LocalizedText;
  answer?: LocalizedText;
};

type FaqRegion = "HAMMERFEST" | "MASOY" | "PORSANGER";

const regionSlugMap: Record<FaqRegion, string> = {
  HAMMERFEST: "hammerfest",
  MASOY: "masoy",
  PORSANGER: "porsanger"
};

const conceptFallbackImages: Record<string, string> = {
  "soft-adventures": "/media/concept-soft.jpg",
  "culture-and-local-living": "/media/concept-culture.jpg",
  "fishing-paradise": "/media/concept-fishing.jpg",
  "the-culinary-arctic": "/media/concept-culinary.jpg"
};

const locationFallbackImages: Record<string, string> = {
  hammerfest: "/media/location-hammerfest.svg",
  masoy: "/media/location-masoy.svg",
  porsanger: "/media/location-porsanger.svg"
};

const defaultLocationImage = "/media/location-default.svg";

type MediaLink = {
  id: string;
  mediaId: string;
  url: string;
  width?: number;
  height?: number;
};

type AppContext = {
  activities: Activity[];
  partners: Partner[];
  stores: Store[];
  inspiration: Article[];
  informationArticles: Article[];
  concepts: Concept[];
  locations: Location[];
  faqs: Faq[];
  siteInfo: SiteInfo | null;
  language: (typeof languages)[number];
  setLanguage: (value: (typeof languages)[number]) => void;
  localeKey: keyof LocalizedText;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredInspiration: Article[];
};

type Translator = (no: string, en: string) => string;

const buildNavItems = (t: Translator, bookingUrl: string, locationLinks: NavLink[]): NavItem[] => [
  {
    key: "activities",
    label: t("Aktiviteter", "Activities"),
    primaryTo: "/activities",
    kicker: t("Opplevelser i regionen", "Experiences in the region"),
    summary: t("Guidede turer, kultur og naturopplevelser fra lokalt vertskap.", "Guided tours, culture and nature experiences hosted by locals."),
    links: [
      { label: t("Se aktiviteter", "See activities"), to: "/activities" },
      { label: t("Book aktiviteter", "Book activities"), href: bookingUrl, external: true }
    ]
  },
  {
    key: "partners",
    label: t("Partnere", "Partners"),
    primaryTo: "/partners",
    kicker: t("Lokale aktører", "Local hosts"),
    summary: t("Vertskapet bak opplevelsene - hoteller, museer og småskala aktører.", "The hosts behind the experiences - hotels, museums and small-scale operators."),
    links: [
      { label: t("Se partnere", "See partners"), to: "/partners" },
      { label: t("Kontakt vertskapet", "Contact the hosts"), to: "/information" }
    ]
  },
  {
    key: "shopping",
    label: t("Shopping", "Shopping"),
    primaryTo: "/shopping",
    kicker: t("Butikker og handel", "Shops and retail"),
    summary: t("Lokale butikker, gallerier og matkonsepter i regionen.", "Local shops, galleries and food concepts in the region."),
    links: [
      { label: t("Se shopping", "See shops"), to: "/shopping" },
      { label: t("Handel i sentrum", "Shop downtown"), to: "/shopping" }
    ]
  },
  {
    key: "inspiration",
    label: t("Inspirasjon", "Inspiration"),
    primaryTo: "/inspiration",
    kicker: t("Historier og artikler", "Stories and articles"),
    summary: t("Tips, reiseruter og fortellinger fra kysten.", "Tips, itineraries and stories from the coast."),
    links: [
      { label: t("Les artikler", "Read articles"), to: "/inspiration" },
      { label: "Isbjornklubben", to: "/isbjornklubben", badge: t("Ny", "New") }
    ]
  },
  {
    key: "information",
    label: t("Informasjon", "Information"),
    primaryTo: "/information",
    kicker: t("Praktisk informasjon", "Practical information"),
    summary: t("Turistinformasjon, åpningstider og kontaktpunkter.", "Tourist information, opening hours and contacts."),
    links: [
      { label: t("Turistinformasjon", "Tourist information"), to: "/information" },
      ...locationLinks,
      { label: "FAQ", to: "/faq" }
    ]
  }
];

const buildBookableMenu = (t: Translator) => [
  t("Aktiviteter", "Activities"),
  t("Guidede turer", "Guided tours"),
  t("Overnatting", "Accommodation"),
  t("Mat og drikke", "Food and drink"),
  t("Transport", "Transport"),
  t("Pakker og tilbud", "Packages and offers")
];

const buildRegionHighlights = (t: Translator) => [
  {
    title: t("Nordlys og midnattssol", "Northern lights and midnight sun"),
    body: t("Høst og vinter med nordlysjakt, sommer med døgnåpent lys.", "Autumn and winter for aurora chasing, summer with endless light.")
  },
  {
    title: t("(Sjø)samisk kultur", "Sea Sami culture"),
    body: t("Formidlet av lokale entusiaster som deler tradisjoner og historier.", "Shared by local enthusiasts who pass on traditions and stories.")
  },
  {
    title: t("Fiskeværene våre", "Our fishing communities"),
    body: t("Kom tett på folkene som bor her - vertskapet står i bildene du ser.", "Get close to the people who live here - the hosts are in the photos you see.")
  },
  {
    title: t("Kort vei til kontraster", "Short distances, big contrasts"),
    body: t("Byliv, fjell og fjord på samme dag - og et vertskap som viser vei.", "City life, mountains and fjords on the same day - with hosts who show the way.")
  }
];

const buildTravelConcepts = (t: Translator) => [
  {
    title: t("Soft Adventures", "Soft Adventures"),
    body: t("Vinterturer, vandring og sykling for Arctic enthusiasts.", "Winter outings, hiking and cycling for Arctic enthusiasts."),
    tag: t("Sesong", "Season"),
    image: "/media/concept-culture.jpg"
  },
  {
    title: t("Culture and local living", "Culture and local living"),
    body: t("Byliv, museum og hverdagsliv med personlige verter.", "City life, museums and everyday life with personal hosts."),
    tag: t("Hele året", "All year"),
    image: "/media/concept-soft.jpg"
  },
  {
    title: t("Fishing Paradise", "Fishing Paradise"),
    body: t("Guidet fiske, sjømat og nært møte med kystens rytme.", "Guided fishing, seafood and close encounters with the rhythm of the coast."),
    tag: t("Hav", "Sea"),
    image: "/media/concept-culinary.jpg"
  },
  {
    title: t("The Culinary Arctic", "The Culinary Arctic"),
    body: t("Matopplevelser basert på Barentshavet og nordlige råvarer.", "Food experiences based on the Barents Sea and northern ingredients."),
    tag: t("Smaker", "Flavors"),
    image: "/media/concept-fishing.jpg"
  }
];

const languages = ["NO", "EN"] as const;
const faqRegions: Array<{ key: FaqRegion; label: string }> = [
  { key: "HAMMERFEST", label: "Hammerfest" },
  { key: "MASOY", label: "Måsøy" },
  { key: "PORSANGER", label: "Porsanger" }
];

const decodeHtml = (value: string) => {
  if (typeof window === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const stripHtml = (value: string) => {
  const decoded = decodeHtml(value);
  return decoded
    .replace(/<[^>]*>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeUrl = (value?: string | null) => {
  if (!value) return "";
  const decoded = decodeHtml(value).trim();
  if (!decoded) return "";
  if (/^https?:\/\//i.test(decoded)) return decoded;
  return `https://${decoded}`;
};

const normalizeEmail = (value?: string | null, fallback = "") => decodeHtml(value || fallback).trim();

const normalizePhone = (value?: string | null, fallback = "") => decodeHtml(value || fallback).trim();

const telHref = (value: string) => `tel:${value.replace(/[^0-9+]/g, "")}`;

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u00e6\u00c6]/g, "ae")
    .replace(/[\u00f8\u00d8]/g, "o")
    .replace(/[\u00e5\u00c5]/g, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const slugFor = (label: string, id: string, slug?: string | null) => {
  const base = slug || slugify(label);
  return base || id;
};

const matchLocation = (locations: string[] | undefined, locationSlug: string) => {
  if (!locations || !locations.length) return false;
  const target = slugify(locationSlug);
  return locations.some((value) => slugify(decodeHtml(value)).startsWith(target));
};

const pickText = (value: LocalizedText | undefined, localeKey: keyof LocalizedText, fallback = "") => {
  const next = value?.[localeKey] || value?.en || value?.no || fallback;
  return typeof next === "string" ? decodeHtml(next) : fallback;
};

const pickTag = (value: string | undefined, fallback: string) => decodeHtml(value || fallback);

const locationLabelFor = (
  value: string | undefined,
  locations: Location[],
  localeKey: keyof LocalizedText,
  fallback: string
) => {
  if (!value) return fallback;
  const normalized = slugify(decodeHtml(value));
  const match = locations.find((location) => slugify(location.slug) === normalized);
  if (match) return pickText(match.name, localeKey, fallback);
  const byName = locations.find((location) => slugify(pickText(location.name, localeKey, location.slug)) === normalized);
  if (byName) return pickText(byName.name, localeKey, fallback);
  return decodeHtml(value);
};

const useAppData = () => useOutletContext<AppContext>();

const currentSeasonUrl = (info: SiteInfo | null): string => {
  const m = new Date().getMonth() + 1; // 1–12
  if (m <= 2 || m === 12) return info?.heroWinterMediaUrl ?? info?.heroMediaUrl ?? "/media/hero.jpg";
  if (m <= 5) return info?.heroSpringMediaUrl ?? info?.heroMediaUrl ?? "/media/hero.jpg";
  if (m <= 8) return info?.heroSummerMediaUrl ?? info?.heroMediaUrl ?? "/media/hero.jpg";
  return info?.heroAutumnMediaUrl ?? info?.heroMediaUrl ?? "/media/hero.jpg";
};

const useGallery = (targetType: string, targetId?: string) => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  const [items, setItems] = useState<MediaLink[]>([]);

  useEffect(() => {
    if (!targetId) {
      setItems([]);
      return;
    }
    let active = true;
    const params = new URLSearchParams({ targetType, targetId });
    fetch(`${apiBase}/api/media/links?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      });
    return () => {
      active = false;
    };
  }, [apiBase, targetId, targetType]);

  return items;
};

const SocialIcon = ({ name }: { name: SocialIconName }) => {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="7.3" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 9l6 3-6 3V9z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"
        fill="currentColor"
      />
    </svg>
  );
};

const Footer = ({ siteInfo }: { siteInfo: SiteInfo | null }) => {
  const year = new Date().getFullYear();
  const links = siteInfo?.footerLinks?.filter((l) => l.label && l.url) ?? [];
  return (
    <footer className="site-footer">
      <div className="footer-links">
        {links.map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="footer-link">
            {link.label}
          </a>
        ))}
      </div>
      <p className="footer-copy">
        &copy; {year} Visit Hammerfest &mdash; Developed by{" "}
        <a href="https://wegener.no" target="_blank" rel="noreferrer">
          Wegener Development
        </a>
      </p>
    </footer>
  );
};

const AppShell = () => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  const [activities, setActivities] = useState<Activity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [inspiration, setInspiration] = useState<Article[]>([]);
  const [informationArticles, setInformationArticles] = useState<Article[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [language, setLanguage] = useState<(typeof languages)[number]>("NO");
  const [activeMenuKey, setActiveMenuKey] = useState("activities");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const localeKey = language === "NO" ? "no" : "en";
  const bookingUrl = language === "NO" ? "https://booking.visithammerfest.no/no/se-og-gjore" : "https://booking.visithammerfest.no/en/todo";
  const locationLinks = useMemo(
    () =>
      locations
        .filter((location) => location.showOnMenu ?? true)
        .map((location) => ({
          label: pickText(location.name, localeKey, location.slug),
          to: `/locations/${location.slug}`
        })),
    [locations, localeKey]
  );
  const navItems = useMemo(() => buildNavItems(t, bookingUrl, locationLinks), [language, bookingUrl, locationLinks]);
  const activeMenu = navItems.find((item) => item.key === activeMenuKey) ?? navItems[0];
  const searchPlaceholder = t("Søk opplevelser, steder eller mat", "Search experiences, places or food");
  const socialLinks = ([
    { label: "Facebook", href: siteInfo?.facebook || "https://www.facebook.com/visithammerfest/", icon: "facebook" },
    { label: "Instagram", href: siteInfo?.instagram || "https://www.instagram.com/visithammerfest/", icon: "instagram" },
    { label: "YouTube", href: siteInfo?.youtube || "", icon: "youtube" }
  ] as SocialLink[]).filter((link) => link.href);

  useEffect(() => {
    if (navItems.length && !navItems.some((item) => item.key === activeMenuKey)) {
      setActiveMenuKey(navItems[0].key);
    }
  }, [navItems, activeMenuKey]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;

    const fetchAll = async () => {
      try {
        const [
          activitiesRes,
          partnersRes,
          storesRes,
          inspirationRes,
          informationRes,
          conceptsRes,
          locationsRes,
          faqRes,
          infoRes
        ] = await Promise.all([
          fetch(`${apiBase}/api/activities`),
          fetch(`${apiBase}/api/partners`),
          fetch(`${apiBase}/api/stores`),
          fetch(`${apiBase}/api/articles?type=inspiration`),
          fetch(`${apiBase}/api/articles?type=information`),
          fetch(`${apiBase}/api/concepts`),
          fetch(`${apiBase}/api/locations`),
          fetch(`${apiBase}/api/faqs`),
          fetch(`${apiBase}/api/info`)
        ]);

        if (!active) return;

        if (activitiesRes.ok) setActivities(await activitiesRes.json());
        if (partnersRes.ok) setPartners(await partnersRes.json());
        if (storesRes.ok) setStores(await storesRes.json());
        if (inspirationRes.ok) setInspiration(await inspirationRes.json());
        if (informationRes.ok) setInformationArticles(await informationRes.json());
        if (conceptsRes.ok) setConcepts(await conceptsRes.json());
        if (locationsRes.ok) setLocations(await locationsRes.json());
        if (faqRes.ok) setFaqs(await faqRes.json());
        if (infoRes.ok) setSiteInfo(await infoRes.json());
      } catch {
        if (!active) return;
      }
    };

    fetchAll();
    return () => {
      active = false;
    };
  }, [apiBase]);

  const filteredInspiration = useMemo(() => {
    if (!searchTerm.trim()) return inspiration;
    return inspiration.filter((article) => pickText(article.title, localeKey).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [inspiration, searchTerm, localeKey]);

  const context: AppContext = {
    activities,
    partners,
    stores,
    inspiration,
    informationArticles,
    concepts,
    locations,
    faqs,
    siteInfo,
    language,
    setLanguage,
    localeKey,
    searchTerm,
    setSearchTerm,
    filteredInspiration
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/">
            <img src="/media/logo.png" alt="Visit Hammerfest" className="brand-mark" />
          </Link>
          <div>
            <p className="brand-kicker">Visit Hammerfest</p>
            <p className="brand-title">{t("Nord for det ordinære", "North of the ordinary")}</p>
          </div>
        </div>

        <div className="top-actions">
          <a className="pill-btn ghost" href={bookingUrl} target="_blank" rel="noreferrer">
            {t("Booking", "Booking")}
          </a>
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label={t("Åpne meny", "Toggle menu")}>
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line short" />
          </button>
          <button className="pill-btn" onClick={() => setSearchOpen((v) => !v)}>
            {searchOpen ? t("Lukk søk", "Close search") : t("Søk", "Search")}
          </button>
          <div className="lang-switch">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`pill-btn ghost ${language === lang ? "active" : ""}`}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                className="social-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </header>

      <nav className={`mega-nav ${menuOpen ? "open" : ""}`}>
        <div className="mega-tabs">
          {navItems.map((item) =>
            item.primaryTo ? (
              <Link
                key={item.key}
                to={item.primaryTo}
                className={`mega-tab ${activeMenu?.key === item.key ? "active" : ""}`}
                onMouseEnter={() => setActiveMenuKey(item.key)}
                onClick={() => {
                  setActiveMenuKey(item.key);
                  setMenuOpen(true);
                }}
              >
                <span className="kicker">{item.kicker}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                className={`mega-tab ${activeMenu?.key === item.key ? "active" : ""}`}
                onMouseEnter={() => setActiveMenuKey(item.key)}
                onClick={() => {
                  setActiveMenuKey(item.key);
                  setMenuOpen(true);
                }}
              >
                <span className="kicker">{item.kicker}</span>
                {item.label}
              </button>
            )
          )}
        </div>
        {activeMenu && (
          <div className="mega-panel">
            <div className="panel-content">
              <div className="panel-copy">
                <p className="kicker">{activeMenu.kicker}</p>
                <h3>{activeMenu.label}</h3>
                <p className="panel-summary">{activeMenu.summary}</p>
              </div>
            <div className="panel-links">
              {activeMenu.links.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} className="panel-link">
                    <span>{link.label}</span>
                      {link.badge && <span className="badge">{link.badge}</span>}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="panel-link"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                    >
                      <span>{link.label}</span>
                      {link.badge && <span className="badge">{link.badge}</span>}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="panel-cta">
              <p className="kicker">{t("Hurtigvalg", "Quick picks")}</p>
              <div className="cta-row">
                <a className="cta" href={bookingUrl} target="_blank" rel="noreferrer">
                  {t("Book aktiviteter", "Book activities")}
                </a>
                <Link className="cta ghost" to="/information">
                  {t("Kontakt turistinfo", "Contact tourist info")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {searchOpen && (
        <div className="search-bar">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={searchPlaceholder} aria-label={t("Søk", "Search")} />
          <p className="search-hint">{t("Søket filtrerer inspirasjonsartiklene mens du skriver.", "Search filters inspiration articles as you type.")}</p>
        </div>
      )}

      <Outlet context={context} />
      <Footer siteInfo={siteInfo} />
    </div>
  );
};

const HomePage = () => {
  const { filteredInspiration, informationArticles, concepts, locations, siteInfo, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const heroUrl = currentSeasonUrl(siteInfo);
  const bookableMenu = buildBookableMenu(t);
  const regionHighlights = buildRegionHighlights(t);
  const homeInspiration = filteredInspiration.filter((article) => article.showOnHome);
  const homeInformation = informationArticles.filter((article) => article.showOnHome);
  const homeConcepts = concepts.filter((concept) => concept.showOnHome);
  const fallbackLocations = [
    {
      key: "hammerfest",
      label: t("Hammerfest", "Hammerfest"),
      slug: regionSlugMap.HAMMERFEST,
      description: t("Kystbyen med arktisk storbypuls, vertskap og utsikt.", "The coastal city with Arctic energy, hosts and views."),
      image: "/media/location-hammerfest.svg"
    },
    {
      key: "masoy",
      label: t("Måsøy", "Masoy"),
      slug: regionSlugMap.MASOY,
      description: t("Øyriket med fiskevær, stillhet og nære møter.", "The island realm with fishing villages, calm and close encounters."),
      image: "/media/location-masoy.svg"
    },
    {
      key: "porsanger",
      label: t("Porsanger", "Porsanger"),
      slug: regionSlugMap.PORSANGER,
      description: t("Vidde, fjord og kulturmøter i et stort landskap.", "Plateaus, fjords and cultural encounters across a vast landscape."),
      image: "/media/location-porsanger.svg"
    }
  ];
  const publishedLocations = locations;
  const homeLocations = publishedLocations.filter((location) => location.showOnHome);
  const locationCards = (homeLocations.length ? homeLocations : publishedLocations).length
    ? (homeLocations.length ? homeLocations : publishedLocations).map((location) => {
        const slug = slugify(location.slug);
        const image =
          location.heroMediaUrl ||
          locationFallbackImages[slug] ||
          defaultLocationImage;
        return {
          key: location.id,
          label: pickText(location.name, localeKey, location.slug),
          slug: location.slug,
          description: stripHtml(pickText(location.summary, localeKey, "")),
          image
        };
      })
    : fallbackLocations;

  return (
    <main>
      <section className="hero" id="booking">
        <div className="hero-img" style={{ backgroundImage: `url(${heroUrl})` }} />
        <div className="hero-text">
          <p className="kicker">Hammerfest</p>
          <h1>{siteInfo?.name ? pickText(siteInfo.name, localeKey, t("Arktiske døgn der vertskapet møter deg", "Arctic days where hosts meet you")) : t("Arktiske døgn der vertskapet møter deg", "Arctic days where hosts meet you")}</h1>
          <p className="lead">
            {siteInfo?.short ? pickText(siteInfo.short, localeKey, "") || t("Vi er lokale entusiaster som inviterer andre arktiske entusiaster til å henge med oss.", "We are local enthusiasts, welcoming other Arctic enthusiasts to hang out.") : t("Vi er lokale entusiaster som inviterer andre arktiske entusiaster til å henge med oss.", "We are local enthusiasts, welcoming other Arctic enthusiasts to hang out.")}
          </p>
          {siteInfo?.openingHours && pickText(siteInfo.openingHours, localeKey, "") && (
            <p className="hero-hours">{pickText(siteInfo.openingHours, localeKey, "")}</p>
          )}
          <div className="hero-actions">
            <a className="cta" href="#konsepter">
              {t("Utforsk opplevelser", "Explore experiences")}
            </a>
            <Link className="cta ghost" to="/inspiration">
              {t("Les inspirasjon", "Read inspiration")}
            </Link>
          </div>
          <div className="hero-badges">
            <span>{t("Nordlys & midnattssol", "Northern lights & midnight sun")}</span>
            <span>{t("Personlig vertskap", "Personal hosts")}</span>
            <span>{t("Rask booking", "Fast booking")}</span>
          </div>
        </div>
      </section>

      {homeConcepts.length > 0 && (
        <section className="split" id="konsepter">
          <div>
            <p className="kicker">{t("Arktiske konsepter", "Arctic concepts")}</p>
            <h2>{t("Reis sammen med lokale verter", "Travel with local hosts")}</h2>
            <p>
              {t(
                "Nordlys på høst og vinter, midnattssol om sommeren, (sjø)samisk kulturformidling og nære møter i fiskeværene våre.",
                "Northern lights in autumn and winter, midnight sun in summer, Sea Sami culture and close encounters in our fishing communities."
              )}
            </p>
            <div className="pill-row">
              <Link className="pill-btn" to="/activities">
                {t("Se opplevelser →", "See experiences →")}
              </Link>
            </div>
            <div className="highlight-grid">
              {regionHighlights.map((item) => (
                <div key={item.title} className="highlight-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="concept-grid">
            {homeConcepts.map((concept) => {
              const title = pickText(concept.title, localeKey);
              const tag = pickText(concept.tag, localeKey, t("Opplevelser", "Experiences"));
              const body = pickText(concept.summary, localeKey, "");
              const image =
                concept.heroMediaUrl ||
                conceptFallbackImages[concept.slug] ||
                conceptFallbackImages["soft-adventures"];
              return (
                <Link key={concept.id} to={`/concepts/${concept.slug}`} className="concept-card link-card">
                  <div className="concept-media" style={image ? { backgroundImage: `url(${image})` } : undefined}>
                    <span>{tag}</span>
                  </div>
                  <div className="concept-body">
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid" id="locations">
        <div className="section-header">
          <p className="kicker">{t("Steder", "Places")}</p>
          <h2>{t("Utforsk regionene", "Explore the regions")}</h2>
          <p>{t("Velg en destinasjon og se innhold filtrert på området.", "Pick a destination to see content filtered by area.")}</p>
        </div>
        <div className="highlight-grid">
          {locationCards.map((card) => (
            <Link key={card.key} to={`/locations/${card.slug}`} className="highlight-card link-card location-card">
              <div className="location-media">
                <img src={card.image} alt="" aria-hidden="true" />
              </div>
              <div className="location-body">
                <h3>{card.label}</h3>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Booking menu hidden for now
      <section className="booking" id="booking-menu">
        <div className="booking-panel">
          <p className="kicker">{t("Bookingmeny", "Booking menu")}</p>
          <h2>{t("Sett sammen reisen din", "Plan your trip")}</h2>
          <p>{t("Trykk deg inn for å lese mer - hver kategori følges av en meny med tilbud og aktiviteter som kan bookes.", "Click in to read more - each category has a menu of bookable offers and activities.")}</p>
          <div className="booking-actions">
            <a className="text-link" href="#booking-menu">
              {t("Se bookbare tilbud →", "See bookable offers →")}
            </a>
          </div>
        </div>
        <div className="booking-list">
          {bookableMenu.map((item) => (
            <div key={item} className="booking-item">
              <span>{item}</span>
              <a href="#booking" className="pill-btn ghost">
                {t("Velg", "Choose")}
              </a>
            </div>
          ))}
        </div>
      </section>
      */}

      {homeInspiration.length > 0 && (
        <section className="story" id="inspiration">
          <div className="story-copy">
            <p className="kicker">{t("Inspirasjon", "Inspiration")}</p>
            <h2>{t("Utvalgte historier og tips", "Selected stories and tips")}</h2>
            <p>{t("Artikler merket for forsiden vises her.", "Articles flagged for the front page appear here.")}</p>
            <div className="pill-row">
              <Link className="pill-btn ghost" to="/inspiration">
                {t("Se alle artikler", "See all articles")}
              </Link>
            </div>
          </div>
          <div className="story-list">
            {homeInspiration.slice(0, 4).map((article) => {
              const title = pickText(article.title, localeKey);
              const slug = slugFor(title, article.id, article.slug);
              return (
                <article key={article.id} className="story-card">
                  <div className="card-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
                  <div>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(article.summary, localeKey, t("Tips og historier fra regionen.", "Tips and stories from the region.")))}</p>
                    <Link to={`/inspiration/${slug}`} className="text-link">
                      {t("Les artikkelen →", "Read article →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {homeInformation.length > 0 && (
        <section className="story" id="information">
          <div className="story-copy">
            <p className="kicker">{t("Informasjon", "Information")}</p>
            <h2>{t("Utvalgt praktisk informasjon", "Selected practical information")}</h2>
            <p>{t("Artikler merket for forsiden vises her.", "Articles flagged for the front page appear here.")}</p>
            <div className="pill-row">
              <Link className="pill-btn ghost" to="/information">
                {t("Se all informasjon", "See all information")}
              </Link>
            </div>
          </div>
          <div className="story-list">
            {homeInformation.slice(0, 4).map((article) => {
              const title = pickText(article.title, localeKey);
              const slug = slugFor(title, article.id, article.slug);
              return (
                <article key={article.id} className="story-card">
                  <div className="card-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
                  <div>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(article.summary, localeKey, t("Praktiske svar fra regionen.", "Practical answers from the region.")))}</p>
                    <Link to={`/information/${slug}`} className="text-link">
                      {t("Les artikkelen →", "Read article →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

const ActivitiesPage = () => {
  const { activities, locations, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Aktiviteter", "Activities")}</p>
        <h1>{t("Alle aktiviteter i regionen", "All activities in the region")}</h1>
        <p>{t("Utforsk guidede turer, kultur, natur og opplevelser fra lokale partnere.", "Explore guided tours, culture, nature and experiences from local partners.")}</p>
      </section>
      <section className="grid">
        <div className="card-grid">
          {activities.map((activity) => {
            const title = pickText(activity.name, localeKey);
            const slug = slugFor(title, activity.id, activity.slug);
            return (
              <article key={activity.id} className="feature-card">
                <div className="card-media" style={activity.heroMediaUrl ? { backgroundImage: `url(${activity.heroMediaUrl})` } : undefined} />
                <div className="card-body">
                  <span className="badge ghost badge-fixed">
                    {locationLabelFor(activity.location?.[0], locations, localeKey, t("Region", "Region"))}
                  </span>
                  <h3>{title}</h3>
                  <p>{stripHtml(pickText(activity.short, localeKey, t("Lokalt vertskap med opplevelser i sesong.", "Local hosts with seasonal experiences.")))}</p>
                  {activity.bookingLink && (
                    <a href={activity.bookingLink} target="_blank" rel="noreferrer" className="text-link">
                      {t("Booking →", "Booking →")}
                    </a>
                  )}
                  <Link to={`/activities/${slug}`} className="text-link" style={activity.bookingLink ? { color: 'var(--muted)', fontWeight: 500 } : undefined}>
                    {t("Se aktivitet →", "See activity →")}
                  </Link>
                </div>
              </article>
            );
          })}
          {!activities.length && <p className="muted">{t("Ingen aktiviteter er publisert ennå.", "No activities published yet.")}</p>}
        </div>
      </section>
    </main>
  );
};

const ActivityDetail = () => {
  const { activities, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const { slug } = useParams();
  const activity = activities.find((item) => slugFor(pickText(item.name, localeKey), item.id, item.slug) === slug);
  const gallery = useGallery("ACTIVITY", activity?.id);
  const galleryItems = gallery.filter((item) => item.mediaId !== activity?.heroMediaId);

  if (!activity) {
    return <NotFound message={t("Aktiviteten ble ikke funnet.", "Activity not found.")} />;
  }

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={activity.heroMediaUrl ? { backgroundImage: `url(${activity.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">{t("Aktivitet", "Activity")}</p>
          <h1>{pickText(activity.name, localeKey)}</h1>
          <p>{stripHtml(pickText(activity.description, localeKey, pickText(activity.short, localeKey)))}</p>
          {activity.bookingLink && (
            <a className="pill-btn" href={activity.bookingLink} target="_blank" rel="noreferrer">
              {t("Book aktiviteten", "Book activity")}
            </a>
          )}
        </div>
      </section>
      {galleryItems.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const PartnersPage = () => {
  const { partners, locations, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Partnere", "Partners")}</p>
        <h1>{t("Vertskapet i Visit Hammerfest", "Hosts of Visit Hammerfest")}</h1>
        <p>{t("Lokale bedrifter og organisasjoner som skaper opplevelser, tjenester og historier.", "Local businesses and organizations that create experiences, services and stories.")}</p>
      </section>
      <section className="grid">
        <div className="card-grid">
          {partners.map((partner) => {
            const title = pickText(partner.name, localeKey);
            const slug = slugFor(title, partner.id, partner.slug);
            return (
              <article key={partner.id} className="feature-card">
                <div className={`card-media ${partner.logoMediaUrl ? "logo-media" : ""}`}>
                  {partner.logoMediaUrl && <img src={partner.logoMediaUrl} alt={title} />}
                </div>
                <div className="card-body">
                  <span className="badge ghost badge-fixed">
                    {locationLabelFor(partner.location?.[0], locations, localeKey, "Hammerfest")}
                  </span>
                  <h3>{title}</h3>
                  <p>{stripHtml(pickText(partner.short, localeKey, t("Lokalt vertskap med kvalitet og nærhet.", "Local hosts with quality and closeness.")))}</p>
                  <Link to={`/partners/${slug}`} className="text-link">
                    {t("Se partner →", "See partner →")}
                  </Link>
                </div>
              </article>
            );
          })}
          {!partners.length && <p className="muted">{t("Ingen partnere er publisert ennå.", "No partners published yet.")}</p>}
        </div>
      </section>
    </main>
  );
};

const PartnerDetail = () => {
  const { partners, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const { slug } = useParams();
  const partner = partners.find((item) => slugFor(pickText(item.name, localeKey), item.id, item.slug) === slug);
  const partnerWebsite = normalizeUrl(partner?.website);
  const partnerEmail = normalizeEmail(partner?.email);
  const partnerPhone = normalizePhone(partner?.phone);
  const gallery = useGallery("PARTNER", partner?.id);
  const galleryItems = gallery.filter(
    (item) => item.mediaId !== partner?.heroMediaId && item.mediaId !== partner?.logoMediaId
  );

  if (!partner) {
    return <NotFound message={t("Partneren ble ikke funnet.", "Partner not found.")} />;
  }

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={partner.heroMediaUrl ? { backgroundImage: `url(${partner.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">{t("Partner", "Partner")}</p>
          <h1>{pickText(partner.name, localeKey)}</h1>
          <p>{stripHtml(pickText(partner.description, localeKey, pickText(partner.short, localeKey)))}</p>
          <div className="detail-actions">
            {partnerWebsite && (
              <a className="pill-btn" href={partnerWebsite} target="_blank" rel="noreferrer">
                {t("Besøk nettside", "Visit website")}
              </a>
            )}
            {partnerEmail && (
              <a className="pill-btn ghost" href={`mailto:${partnerEmail}`}>
                {partnerEmail}
              </a>
            )}
            {partnerPhone && (
              <a className="pill-btn ghost" href={telHref(partnerPhone)}>
                {partnerPhone}
              </a>
            )}
          </div>
        </div>
      </section>
      {galleryItems.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const ShoppingPage = () => {
  const { stores, locations, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Shopping", "Shopping")}</p>
        <h1>{t("Butikker og handel", "Shops and retail")}</h1>
        <p>{t("Lokale butikker, gallerier og handelstilbud.", "Local shops, galleries and retail offers.")}</p>
      </section>
      <section className="grid">
        <div className="card-grid">
          {stores.map((store) => {
            const title = pickText(store.name, localeKey);
            const slug = slugFor(title, store.id, store.slug);
            return (
              <article key={store.id} className="feature-card">
                <div className="card-media" style={store.heroMediaUrl ? { backgroundImage: `url(${store.heroMediaUrl})` } : undefined} />
                <div className="card-body">
                  <span className="badge ghost badge-fixed">
                    {locationLabelFor(store.location?.[0], locations, localeKey, t("Sentrum", "Downtown"))}
                  </span>
                  <h3>{title}</h3>
                  <p>{stripHtml(pickText(store.short, localeKey, t("Lokale leverandorer og handverkere.", "Local suppliers and artisans.")))}</p>
                  <Link to={`/shopping/${slug}`} className="text-link">
                    {t("Se butikk →", "See shop →")}
                  </Link>
                </div>
              </article>
            );
          })}
          {!stores.length && <p className="muted">{t("Ingen butikker er publisert ennå.", "No shops published yet.")}</p>}
        </div>
      </section>
    </main>
  );
};

const StoreDetail = () => {
  const { stores, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const { slug } = useParams();
  const store = stores.find((item) => slugFor(pickText(item.name, localeKey), item.id, item.slug) === slug);
  const storeWebsite = normalizeUrl(store?.website);
  const gallery = useGallery("STORE", store?.id);
  const galleryItems = gallery.filter(
    (item) => item.mediaId !== store?.heroMediaId && item.mediaId !== store?.logoMediaId
  );

  if (!store) {
    return <NotFound message={t("Butikken ble ikke funnet.", "Shop not found.")} />;
  }

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={store.heroMediaUrl ? { backgroundImage: `url(${store.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">{t("Shopping", "Shopping")}</p>
          <h1>{pickText(store.name, localeKey)}</h1>
          <p>{stripHtml(pickText(store.description, localeKey, pickText(store.short, localeKey)))}</p>
          {storeWebsite && (
            <a className="pill-btn" href={storeWebsite} target="_blank" rel="noreferrer">
              {t("Besøk nettside", "Visit website")}
            </a>
          )}
        </div>
      </section>
      {galleryItems.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const InspirationPage = () => {
  const { filteredInspiration, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Inspirasjon", "Inspiration")}</p>
        <h1>{t("Historier og artikler", "Stories and articles")}</h1>
        <p>{t("Tips, reiseruter og fortellinger - filtrer med søkefeltet i toppmenyen.", "Tips, itineraries and stories - filter with the search field in the top menu.")}</p>
      </section>
      <section className="story-list">
        {filteredInspiration.map((article) => {
          const title = pickText(article.title, localeKey);
          const slug = slugFor(title, article.id, article.slug);
          return (
            <article key={article.id} className="story-card">
              <div className="card-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
              <div>
                <h3>{title}</h3>
                <p>{stripHtml(pickText(article.summary, localeKey, t("Tips og historier fra regionen.", "Tips and stories from the region.")))}</p>
                <Link to={`/inspiration/${slug}`} className="text-link">
                  {t("Les artikkelen →", "Read article →")}
                </Link>
              </div>
            </article>
          );
        })}
        {!filteredInspiration.length && <p className="muted">{t("Ingen artikler matcher søket.", "No articles match the search.")}</p>}
      </section>
    </main>
  );
};

const ArticleDetail = ({ type }: { type?: "inspiration" | "information" }) => {
  const { inspiration, informationArticles, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const { slug } = useParams();
  const combined =
    type === "information"
      ? informationArticles
      : type === "inspiration"
        ? inspiration
        : [...inspiration, ...informationArticles];
  const article = combined.find((item) => slugFor(pickText(item.title, localeKey), item.id, item.slug) === slug);
  const gallery = useGallery("ARTICLE", article?.id);
  const galleryItems = gallery.filter((item) => item.mediaId !== article?.heroMediaId);

  if (!article) {
    return <NotFound message={t("Artikkelen ble ikke funnet.", "Article not found.")} />;
  }

  const resolvedType = type ?? (article.type?.toLowerCase() === "information" ? "information" : "inspiration");
  const kicker = resolvedType === "information" ? t("Informasjon", "Information") : t("Inspirasjon", "Inspiration");

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">{kicker}</p>
          <h1>{pickText(article.title, localeKey)}</h1>
          <p>{stripHtml(pickText(article.summary, localeKey, ""))}</p>
          {article.author && <p className="muted">{article.author}</p>}
        </div>
      </section>
      {article.body && (
        <section className="detail-content" dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(article.body, localeKey)) }} />
      )}
      {galleryItems.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const InformationPage = () => {
  const { siteInfo, informationArticles, faqs, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const [activeRegion, setActiveRegion] = useState<FaqRegion>("HAMMERFEST");
  const previewFaqs = faqs.filter((faq) => (faq.region ?? "HAMMERFEST") === activeRegion);
  const siteWebsite = normalizeUrl(siteInfo?.website);
  const siteEmail = normalizeEmail(siteInfo?.email);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Informasjon", "Information")}</p>
        <h1>{pickText(siteInfo?.name, localeKey, "Visit Hammerfest")}</h1>
        <p>{stripHtml(pickText(siteInfo?.short, localeKey, t("Turistinformasjon og praktiske råd.", "Tourist information and practical advice.")))}</p>
      </section>

      <section className="detail-hero">
        <div className="detail-media" style={siteInfo?.heroMediaUrl ? { backgroundImage: `url(${siteInfo.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p>{stripHtml(pickText(siteInfo?.description, localeKey, t("Vi hjelper deg med planlegging, ruter og lokale råd.", "We help you with planning, routes and local advice.")))}</p>
          <div className="detail-actions">
            {siteWebsite && (
              <a className="pill-btn" href={siteWebsite} target="_blank" rel="noreferrer">
                {t("Besøk nettside", "Visit website")}
              </a>
            )}
            {siteEmail && (
              <a className="pill-btn ghost" href={`mailto:${siteEmail}`}>
                {siteEmail}
              </a>
            )}
          </div>
        </div>
      </section>

      {informationArticles.length > 0 && (
        <section className="story-list">
          {informationArticles.map((article) => {
            const title = pickText(article.title, localeKey);
            const slug = slugFor(title, article.id, article.slug);
            return (
              <article key={article.id} className="story-card">
                <div className="card-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
                <div>
                  <h3>{title}</h3>
                  <p>{stripHtml(pickText(article.summary, localeKey, ""))}</p>
                  <Link to={`/information/${slug}`} className="text-link">
                    {t("Les mer →", "Read more →")}
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="faq-grid">
        <div className="section-header">
          <p className="kicker">FAQ</p>
          <h2>{t("Spørsmål og svar", "Questions and answers")}</h2>
          <div className="pill-row">
            {faqRegions.map((region) => (
              <button
                key={region.key}
                className={`pill-btn ghost ${activeRegion === region.key ? "active" : ""}`}
                onClick={() => setActiveRegion(region.key)}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
        <div className="faq-list">
          {previewFaqs.slice(0, 6).map((faq) => (
            <div key={faq.id} className="faq-card">
              <h3 dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(faq.question, localeKey)) }} />
              {faq.answer && <p dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(faq.answer, localeKey)) }} />}
            </div>
          ))}
          {!previewFaqs.length && <p className="muted">{t("Ingen FAQ er publisert ennå.", "No FAQ published yet.")}</p>}
        </div>
        <Link to="/faq" className="pill-btn">
          {t("Se hele FAQ", "See full FAQ")}
        </Link>
      </section>

      {siteInfo?.mapEmbed && (
        <section className="map-embed" dangerouslySetInnerHTML={{ __html: decodeHtml(siteInfo.mapEmbed) }} />
      )}
    </main>
  );
};

const ConceptDetail = () => {
  const { concepts, activities, partners, stores, locations, localeKey, language } = useAppData();
  const { slug } = useParams();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const concept = concepts.find((item) => item.slug === slug);

  if (!concept) {
    return <NotFound message={t("Konseptet ble ikke funnet.", "Concept not found.")} />;
  }

  const title = pickText(concept.title, localeKey);
  const summary = pickText(concept.summary, localeKey, "");
  const body = pickText(concept.body, localeKey, summary);
  const tag = pickText(concept.tag, localeKey, t("Opplevelser", "Experiences"));
  const image =
    concept.heroMediaUrl ||
    conceptFallbackImages[concept.slug] ||
    conceptFallbackImages["soft-adventures"];
  const conceptActivities = activities.filter((item) => item.conceptIds?.includes(concept.id));
  const conceptPartners = partners.filter((item) => item.conceptIds?.includes(concept.id));
  const conceptStores = stores.filter((item) => item.conceptIds?.includes(concept.id));

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={image ? { backgroundImage: `url(${image})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">{tag}</p>
          <h1>{title}</h1>
          <p>{stripHtml(body)}</p>
        </div>
      </section>
      {body && (
        <section className="detail-content" dangerouslySetInnerHTML={{ __html: decodeHtml(body) }} />
      )}

      {conceptActivities.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Aktiviteter", "Activities")}</p>
            <h2>{t("Opplevelser i konseptet", "Experiences in this concept")}</h2>
          </div>
          <div className="card-grid">
            {conceptActivities.map((activity) => {
              const title = pickText(activity.name, localeKey);
              const slug = slugFor(title, activity.id, activity.slug);
              return (
                <article key={activity.id} className="feature-card">
                  <div className="card-media" style={activity.heroMediaUrl ? { backgroundImage: `url(${activity.heroMediaUrl})` } : undefined} />
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(activity.location?.[0], locations, localeKey, t("Region", "Region"))}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(activity.short, localeKey, t("Lokale opplevelser gjennom hele året.", "Local experiences all year round.")))}</p>
                    <Link to={`/activities/${slug}`} className="text-link">
                      {t("Se aktivitet →", "See activity →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {conceptPartners.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Partnere", "Partners")}</p>
            <h2>{t("Vertskapet i konseptet", "Hosts in this concept")}</h2>
          </div>
          <div className="card-grid">
            {conceptPartners.map((partner) => {
              const title = pickText(partner.name, localeKey);
              const slug = slugFor(title, partner.id, partner.slug);
              return (
                <article key={partner.id} className="feature-card">
                  <div className={`card-media ${partner.logoMediaUrl ? "logo-media" : ""}`}>
                    {partner.logoMediaUrl && <img src={partner.logoMediaUrl} alt={title} />}
                  </div>
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(partner.location?.[0], locations, localeKey, t("Region", "Region"))}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(partner.short, localeKey, t("Lokalt vertskap med kvalitet og nærhet.", "Local hosts with quality and closeness.")))}</p>
                    <Link to={`/partners/${slug}`} className="text-link">
                      {t("Se partner →", "See partner →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {conceptStores.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Shopping", "Shopping")}</p>
            <h2>{t("Butikker og handel", "Shops and retail")}</h2>
          </div>
          <div className="card-grid">
            {conceptStores.map((store) => {
              const title = pickText(store.name, localeKey);
              const slug = slugFor(title, store.id, store.slug);
              return (
                <article key={store.id} className="feature-card">
                  <div className="card-media" style={store.heroMediaUrl ? { backgroundImage: `url(${store.heroMediaUrl})` } : undefined} />
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(store.location?.[0], locations, localeKey, t("Sentrum", "Downtown"))}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(store.short, localeKey, t("Lokale butikker og konsepter.", "Local shops and concepts.")))}</p>
                    <Link to={`/shopping/${slug}`} className="text-link">
                      {t("Se butikk →", "See shop →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};

const LocationLanding = () => {
  const { activities, partners, stores, inspiration, locations, localeKey, language } = useAppData();
  const { region } = useParams<{ region: string }>();
  const t = (no: string, en: string) => (language === "NO" ? no : en);

  const location = useMemo(() => {
    if (!region) return null;
    const slug = slugify(region);
    return (
      locations.find((item) => slugify(item.slug) === slug) ||
      locations.find((item) => slugify(pickText(item.name, localeKey, item.slug)) === slug)
    );
  }, [region, locations, localeKey]);

  const locationGallery = useGallery("LOCATION", location?.id);

  if (!location && region) {
    return <NotFound message={t("Stedet ble ikke funnet.", "Location not found.")} />;
  }

  const locationSlug = location?.slug ?? region ?? "";
  const locationLabel = location ? pickText(location.name, localeKey, location.slug) : t("Sted", "Location");
  const locationSummary = location ? stripHtml(pickText(location.summary, localeKey, "")) : "";

  const locationActivities = activities.filter((item) => matchLocation(item.location, locationSlug));
  const locationPartners = partners.filter((item) => matchLocation(item.location, locationSlug));
  const locationStores = stores.filter((item) => matchLocation(item.location, locationSlug));
  const locationInspiration = inspiration.filter((item) => matchLocation(item.location, locationSlug));

  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">{t("Sted", "Location")}</p>
        <h1>{locationLabel}</h1>
        <p>
          {locationSummary ||
            t(
              "Utforsk opplevelser, partnere, shopping og historier i dette området.",
              "Explore experiences, partners, shopping and stories from this area."
            )}
        </p>
      </section>

      {location?.heroMediaUrl && (
        <section className="detail-hero">
          <div className="detail-media" style={{ backgroundImage: `url(${location.heroMediaUrl})` }} />
          <div className="detail-body">
            <p className="kicker">{t("Sted", "Location")}</p>
            <h2>{locationLabel}</h2>
            {locationSummary && <p>{locationSummary}</p>}
          </div>
        </section>
      )}

      {locationActivities.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Aktiviteter", "Activities")}</p>
            <h2>{t("Opplevelser i regionen", "Experiences in the region")}</h2>
          </div>
          <div className="card-grid">
            {locationActivities.map((activity) => {
              const title = pickText(activity.name, localeKey);
              const slug = slugFor(title, activity.id, activity.slug);
              return (
                <article key={activity.id} className="feature-card">
                  <div className="card-media" style={activity.heroMediaUrl ? { backgroundImage: `url(${activity.heroMediaUrl})` } : undefined} />
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(activity.location?.[0], locations, localeKey, locationLabel)}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(activity.short, localeKey, t("Lokale opplevelser gjennom hele året.", "Local experiences all year round.")))}</p>
                    <Link to={`/activities/${slug}`} className="text-link">
                      {t("Se aktivitet →", "See activity →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {locationPartners.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Partnere", "Partners")}</p>
            <h2>{t("Vertskapet i området", "Hosts in the area")}</h2>
          </div>
          <div className="card-grid">
            {locationPartners.map((partner) => {
              const title = pickText(partner.name, localeKey);
              const slug = slugFor(title, partner.id, partner.slug);
              return (
                <article key={partner.id} className="feature-card">
                  <div className={`card-media ${partner.logoMediaUrl ? "logo-media" : ""}`}>
                    {partner.logoMediaUrl && <img src={partner.logoMediaUrl} alt={title} />}
                  </div>
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(partner.location?.[0], locations, localeKey, locationLabel)}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(partner.short, localeKey, t("Lokalt vertskap med kvalitet og nærhet.", "Local hosts with quality and closeness.")))}</p>
                    <Link to={`/partners/${slug}`} className="text-link">
                      {t("Se partner →", "See partner →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {locationStores.length > 0 && (
        <section className="grid">
          <div className="section-header">
            <p className="kicker">{t("Shopping", "Shopping")}</p>
            <h2>{t("Butikker og handel", "Shops and retail")}</h2>
          </div>
          <div className="card-grid">
            {locationStores.map((store) => {
              const title = pickText(store.name, localeKey);
              const slug = slugFor(title, store.id, store.slug);
              return (
                <article key={store.id} className="feature-card">
                  <div className="card-media" style={store.heroMediaUrl ? { backgroundImage: `url(${store.heroMediaUrl})` } : undefined} />
                  <div className="card-body">
                    <span className="badge ghost badge-fixed">
                      {locationLabelFor(store.location?.[0], locations, localeKey, locationLabel)}
                    </span>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(store.short, localeKey, t("Lokale butikker og konsepter.", "Local shops and concepts.")))}</p>
                    <Link to={`/shopping/${slug}`} className="text-link">
                      {t("Se butikk →", "See shop →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {locationInspiration.length > 0 && (
        <section className="story">
          <div className="story-copy">
            <p className="kicker">{t("Inspirasjon", "Inspiration")}</p>
            <h2>{t("Historier fra området", "Stories from the area")}</h2>
          </div>
          <div className="story-list">
            {locationInspiration.map((article) => {
              const title = pickText(article.title, localeKey);
              const slug = slugFor(title, article.id, article.slug);
              return (
                <article key={article.id} className="story-card">
                  <div className="card-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
                  <div>
                    <h3>{title}</h3>
                    <p>{stripHtml(pickText(article.summary, localeKey, t("Tips og historier fra regionen.", "Tips and stories from the region.")))}</p>
                    <Link to={`/inspiration/${slug}`} className="text-link">
                      {t("Les artikkelen →", "Read article →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {locationGallery.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {locationGallery.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const FaqPage = () => {
  const { faqs, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const [activeRegion, setActiveRegion] = useState<FaqRegion>("HAMMERFEST");
  const filteredFaqs = faqs.filter((faq) => (faq.region ?? "HAMMERFEST") === activeRegion);
  const grouped = filteredFaqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    const key = decodeHtml(faq.category || t("Generelt", "General"));
    if (!acc[key]) acc[key] = [];
    acc[key].push(faq);
    return acc;
  }, {});

  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">FAQ</p>
        <h1>{t("Spørsmål og svar", "Questions and answers")}</h1>
        <p>{t("Finn praktisk informasjon og hjelp til reisen.", "Find practical information and help for your trip.")}</p>
        <div className="pill-row">
          {faqRegions.map((region) => (
            <button
              key={region.key}
              className={`pill-btn ghost ${activeRegion === region.key ? "active" : ""}`}
              onClick={() => setActiveRegion(region.key)}
            >
              {region.label}
            </button>
          ))}
        </div>
      </section>
      <section className="faq-section">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="faq-group">
            <h2>{category}</h2>
            <div className="faq-list">
              {items.map((faq) => (
                <div key={faq.id} className="faq-card">
                  <h3 dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(faq.question, localeKey)) }} />
                  {faq.answer && <p dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(faq.answer, localeKey)) }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        {!filteredFaqs.length && <p className="muted">{t("Ingen FAQ er publisert ennå.", "No FAQ published yet.")}</p>}
      </section>
    </main>
  );
};

const IsbjornklubbenPage = () => {
  const { inspiration, informationArticles, localeKey, language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  const combined = [...inspiration, ...informationArticles];
  const article = combined.find((item) => slugFor(pickText(item.title, localeKey), item.id, item.slug) === "isbjornklubben");
  const gallery = useGallery("ARTICLE", article?.id);
  const galleryItems = gallery.filter((item) => item.mediaId !== article?.heroMediaId);

  if (!article) {
    return (
      <main className="page">
        <section className="page-header">
          <p className="kicker">Isbjornklubben</p>
          <h1>Isbjornklubben</h1>
          <p>{t("Innholdet kommer snart. Vi henter dette fra inspirasjonsartiklene.", "Content is coming soon. We will pull this from the inspiration articles.")}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="detail-media" style={article.heroMediaUrl ? { backgroundImage: `url(${article.heroMediaUrl})` } : undefined} />
        <div className="detail-body">
          <p className="kicker">Isbjornklubben</p>
          <h1>{pickText(article.title, localeKey)}</h1>
          <p>{stripHtml(pickText(article.summary, localeKey, ""))}</p>
        </div>
      </section>
      {article.body && (
        <section className="detail-content" dangerouslySetInnerHTML={{ __html: decodeHtml(pickText(article.body, localeKey)) }} />
      )}
      {galleryItems.length > 0 && (
        <section className="detail-gallery">
          <p className="kicker">{t("Galleri", "Gallery")}</p>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const LegacyArticleRedirect = () => {
  const { inspiration, informationArticles, localeKey } = useAppData();
  const { slug } = useParams();
  const combined = [...inspiration, ...informationArticles];
  const article = combined.find((item) => slugFor(pickText(item.title, localeKey), item.id, item.slug) === slug);

  if (!article) {
    return <NotFound message="Artikkelen ble ikke funnet." />;
  }

  const resolvedType = article.type?.toLowerCase() === "information" ? "information" : "inspiration";
  return <Navigate to={`/${resolvedType}/${slug}`} replace />;
};

const NotFound = ({ message }: { message?: string }) => {
  const { language } = useAppData();
  const t = (no: string, en: string) => (language === "NO" ? no : en);
  return (
    <main className="page">
      <section className="page-header">
        <p className="kicker">404</p>
        <h1>{t("Fant ikke siden", "Page not found")}</h1>
        <p>{message || t("Siden du ser etter finnes ikke.", "The page you are looking for does not exist.")}</p>
        <Link className="pill-btn" to="/">
          {t("Til forsiden", "Back to home")}
        </Link>
      </section>
    </main>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/*" element={<AdminApp />} />
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="activites" element={<Navigate to="/activities" replace />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="activities/:slug" element={<ActivityDetail />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="partners/:slug" element={<PartnerDetail />} />
          <Route path="shopping" element={<ShoppingPage />} />
          <Route path="shopping/:slug" element={<StoreDetail />} />
          <Route path="stores" element={<Navigate to="/shopping" replace />} />
          <Route path="inspirations" element={<Navigate to="/inspiration" replace />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="inspiration/:slug" element={<ArticleDetail type="inspiration" />} />
          <Route path="articles/:slug" element={<LegacyArticleRedirect />} />
          <Route path="information" element={<InformationPage />} />
          <Route path="information/:slug" element={<ArticleDetail type="information" />} />
          <Route path="concepts/:slug" element={<ConceptDetail />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="isbjornklubben" element={<IsbjornklubbenPage />} />
          <Route path="locations/:region" element={<LocationLanding />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
