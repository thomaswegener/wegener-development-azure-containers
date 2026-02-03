import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const COOKIE_KEY = "acceptAnalytics";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY) === "true";
    setShow(!accepted);
    // If already accepted, load GA
    if (accepted && !window.GA_INITIALIZED) {
      loadGoogleAnalytics();
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setShow(false);
    loadGoogleAnalytics();
  };

  return show ? (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#222", color: "#fff", padding: "1rem", zIndex: 9999,
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <span>
        {t('consent.message')}
      </span>
      <button
        onClick={acceptCookies}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {t('consent.accept')}
      </button>
    </div>
  ) : null;
}

// Google Analytics loader function
function loadGoogleAnalytics() {
  if (window.GA_INITIALIZED) return;
  window.GA_INITIALIZED = true;
  // Insert the script tag
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-44MD1NFB5G";
  script.async = true;
  document.head.appendChild(script);

  // Insert the config inline script
  const inlineScript = document.createElement("script");
  inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-44MD1NFB5G');
  `;
  document.head.appendChild(inlineScript);
}
