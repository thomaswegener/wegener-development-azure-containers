// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    var cookiePopup = document.getElementById('cookie-consent-popup');
    var acceptButton = document.getElementById('accept-cookies');
    var necessaryButton = document.getElementById('necessary-cookies');
    var denyButton = document.getElementById('deny-cookies');
    var message = document.getElementById('cookie-message');

    var userLang = navigator.language || navigator.userLanguage; 
    var lang = userLang.startsWith('no') ? 'no' : 'en';

    var textContent = {
        en: {
            message: "We use cookies to ensure you get the best experience on our website. Please confirm that you consent to our use of cookies.",
            accept: "Yes, I agree",
            necessary: "Necessary only",
            deny: "Do not allow"
        },
        no: {
            message: "Denne siden bruker informasjonskapsler for å måle og optimalisere ytelsen. Vennligst bekreft at du samtykker til vår bruk av informasjonskapsler.",
            accept: "Ja, det er greit",
            necessary: "Kun nødvendige",
            deny: "Ikke tillat"
        }
    };

    var cookiesAccepted = localStorage.getItem('cookiesAccepted');

    // If markup is missing (some templates), still honor existing consent and exit quietly.
    if (!cookiePopup || !acceptButton || !necessaryButton || !denyButton || !message) {
        if (cookiesAccepted === 'true') {
            loadGtag();
            loadClarity();
        }
        return;
    }

    message.textContent = textContent[lang].message;
    acceptButton.textContent = textContent[lang].accept;
    necessaryButton.textContent = textContent[lang].necessary;
    denyButton.textContent = textContent[lang].deny;

    if (!cookiesAccepted) {
        cookiePopup.style.display = 'flex';
    } else if (cookiesAccepted === 'true') {
        loadGtag();
        loadClarity();
    }

    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiePopup.style.display = 'none';
        loadGtag();
        loadClarity();
    });

    necessaryButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'necessary');
        cookiePopup.style.display = 'none';
    });

    denyButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'false');
        cookiePopup.style.display = 'none';
    });

    function loadGtag() {
        if (window.gtagLoaded) {
            return;
        }
        window.gtagLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
        window.gtag('js', new Date());
        window.gtag('config', 'G-HP80FCT0BD');
        var gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-HP80FCT0BD";
        document.head.appendChild(gtagScript);
    }

    function loadClarity() {
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "mgw3m84809");
    }
});
