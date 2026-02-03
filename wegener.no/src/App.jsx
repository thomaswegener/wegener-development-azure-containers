import React, { useEffect, useMemo, useState } from "react";

const heroImage = "/nature1.jpg";
const tierImages = ["/natur1.jpg", "/natur2.jpg", "/nature5.jpg", "/nature4.jpg"];
const GA_ID = "G-9DRWYE733M";

const translations = {
  en: {
    meta: {
      eyebrow: "Wegener Development",
      tagline: "Your partner for solutions on the web.",
    },
    nav: { contact: "Contact", home: "Home" },
    hero: {
      title: ["Welcome to us,", "we help you become visible online."],
      lede: "",
      actions: { primary: "See the packages", secondary: "Get an estimate" },
    },
    tiers: {
      eyebrow: "Web packages",
      title: "Choose the solution that fits you",
      lead:
        "My name is Thomas Wegener and I run Wegener Development, delivering modern web solutions. I have a strong connection to Northern Norway, experience from the tourism industry, and a passion for sharing nature and stories. Using modern technology, I build solutions that fit my customers and enhance the visitor experience.",
      intro:
        "Fill in the contact form, and we will set up a meeting to talk through the possibilities. We focus on showing experiences and impressions. Together we can guide visitors to want to see and experience more.",
      campaign: {
        note: "Campaign for Visit Hammerfest partners until April 1 (visithammerfest.no).",
        prices: {
          tier1: "Est. NOK 6,000–9,750",
          tier2: "Est. NOK 13,750–21,250",
        },
      },
      items: [
        {
          value: "tier1",
          label: "Tier 1",
          title: "A simple page",
          summary: "A presentation that makes an impression.",
          price: "Est. NOK 12,000–19,500",
          priceNote: "1 landing page, launch in 1–2 weeks.",
          features: [
            "A scrolling page",
            "Design and functionality",
            "Contact form",
            "Analytics tools",
            "Search engine optimization",
            "You are responsible for text and images",
          ],
          cta: "Choose Tier 1",
        },
        {
          value: "tier2",
          label: "Tier 2",
          title: "A slightly larger site with multiple subpages",
          summary: "Content is spread across multiple pages with clear navigation.",
          price: "Est. NOK 27,500–42,500",
          priceNote: "3–6 landing pages + better visibility on Google.",
          features: [
            "Clear menu and structure",
            "Design and functionality",
            "User behavior tracking",
            "Analytics tools",
            "Search engine optimization",
            "You are responsible for text and images",
          ],
          cta: "Choose Tier 2",
        },
        {
          value: "tier3",
          label: "Tier 3",
          title: "Portal",
          summary: "Portal with login, booking, and webshop.",
          price: "From NOK 95,000+",
          priceNote: "Contact for an offer (scope-based).",
          features: [
            "Login for administration",
            "Online booking and webshop (Shopify)",
            "Easy content editing",
            "Customer pages and messages",
            "Connections to the systems you use",
            "You are responsible for text and images",
          ],
          cta: "Request Tier 3 offer",
        },
        {
          value: "tier4",
          label: "Tier 4",
          title: "Internal portal",
          summary: "Employee solutions from timesheets to HSE.",
          price: "Setup NOK 25,000",
          priceNote: "Monthly: NOK 149/129/99 per user (2–20/21–50/51–100). Min monthly NOK 1,490.",
          features: [
            "Timesheets and leave",
            "HSE, routines, and documents",
            "Handbook and internal news",
            "Approvals and messages",
            "Price per employee per month",
          ],
          cta: "Choose Tier 4",
        },
      ],
    },
    includes: {
      eyebrow: "Always included",
      title: "Everything needed to launch",
      items: [
        { icon: "domain", text: "Your own domain name" },
        { icon: "seo", text: "Search engine optimization" },
        { icon: "collaboration", text: "Involvement during development" },
        { icon: "backup", text: "Backups and alerts" },
        { icon: "analytics", text: "Google Analytics set up" },
        { icon: "speed", text: "Fast websites" },
        { icon: "launch", text: "Launch and handover" },
      ],
    },
    hosting: {
      eyebrow: "Hosting & traffic",
      title: "Simple monthly hosting pricing.",
      intro: "Hosting is billed monthly with a fixed price + traffic based on actual usage on our cloud servers.",
      items: [
        {
          icon: "hosting",
          title: "Monthly price",
          body: "From NOK 290 / month, depending on usage and size.",
        },
        {
          icon: "traffic",
          title: "Traffic",
          body: "Billed by actual usage (GB). We can estimate before launch.",
        },
        {
          icon: "analytics",
          title: "Analytics",
          body: "Google Analytics is set up and shared with you.",
        },
      ],
      note: "All prices are estimates and confirmed after scope and expected traffic.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to build?",
      intro: "Share your plan and we will reply quickly with a clear proposal.",
      back: "Back to top",
      openForm: "Open contact form",
      formTitle: "Contact Wegener Development",
      formDescription: "Tell us a bit about your project and preferred tier.",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company (optional)",
        phone: "Phone (optional)",
        tier: "Preferred tier",
        addons: "Add-ons you want",
        budget: "Budget (optional)",
        timeline: "Preferred timeline (optional)",
        message: "Project details",
        submit: "Send",
      },
      tiers: [
        { value: "tier1", label: "Tier 1 – A simple page" },
        { value: "tier2", label: "Tier 2 – A slightly larger site" },
        { value: "tier3", label: "Tier 3 – Portal" },
        { value: "tier4", label: "Tier 4 – Internal portal" },
        { value: "custom", label: "Custom project" },
      ],
      addons: [
        { value: "brand", label: "Brand refresh / logo" },
        { value: "seo", label: "Better visibility on Google" },
        { value: "booking", label: "Online booking" },
        { value: "shopify", label: "Webshop (Shopify)" },
        { value: "multilang", label: "Multilingual content" },
      ],
      status: {
        idle: "",
        sending: "Sending your request...",
        success: "Sent. We will respond shortly.",
        error: "Something went wrong. Please try again.",
      },
    },
    consent: {
      title: "Cookie settings",
      body: "We use analytics to understand how the site is used. Choose your preference.",
      submit: "Save settings",
      options: {
        all: "All",
        none: "None",
      },
      descriptions: {
        all: "Includes analytics cookies.",
        none: "No cookies beyond what is required.",
      },
    },
    demos: {
      tier1: {
        image: "/nature2.jpg",
        hero: {
          eyebrow: "Example page",
          title: "A simple page that makes an impression",
          lede: "Everything important on one page with a clear call to action and quick contact.",
          primary: "Request this page",
          secondary: "Back to main page",
          highlights: ["Clear message", "Fast delivery", "Simple contact flow"],
        },
        sections: [
          {
            title: "How the page is built",
            body: "A clean flow that gives visitors answers quickly and leads them to contact.",
            cards: [
              { title: "Hero section", text: "Short message, button, and trust." },
              { title: "Services", text: "A quick overview of what you deliver." },
              { title: "Proof", text: "Reviews, cases, or a short credibility block." },
              { title: "Contact", text: "Form and direct contact details." },
            ],
          },
          {
            title: "Ideal for",
            body: "Perfect for smaller businesses that want a strong online presence fast.",
            cards: [
              { title: "Local services", text: "Make it easy to call or book." },
              { title: "New businesses", text: "Launch quickly and look professional." },
              { title: "Campaigns", text: "Focused message with clear goal." },
            ],
          },
        ],
      },
      tier2: {
        image: "/nature3.jpg",
        hero: {
          eyebrow: "Example page",
          title: "A larger site with clear structure",
          lede: "Content is spread across multiple pages with clear navigation.",
          primary: "Request this site",
          secondary: "Back to main page",
          highlights: ["3–6 pages", "Better visibility", "Easy to update"],
        },
        sections: [
          {
            title: "Page overview",
            body: "A small site where each service gets its own page.",
            cards: [
              { title: "Front page", text: "Main message, overview, and CTA." },
              { title: "Service page", text: "Detailed info for one service." },
              { title: "Service page", text: "Another focused service page." },
              { title: "About & contact", text: "Who you are and how to reach you." },
            ],
          },
          {
            title: "Content that converts",
            body: "Clear sections that guide visitors from interest to inquiry.",
            cards: [
              { title: "Clear benefits", text: "Explain why you are the right choice." },
              { title: "Simple forms", text: "Fewer steps to get in touch." },
              { title: "Trust builders", text: "References, logos, and testimonials." },
            ],
          },
        ],
      },
      tier3: {
        image: "/nature4.jpg",
        hero: {
          eyebrow: "Example page",
          title: "Portal with booking and administration",
          lede: "A full portal that gathers content, booking, and management in one place.",
          primary: "Request this portal",
          secondary: "Back to main page",
          highlights: ["Admin login", "Booking flow", "Webshop"],
        },
        sections: [
          {
            title: "Experiences and content",
            body: "Highlight activities, packages, and content in a rich layout.",
            cards: [
              { title: "Activities", text: "Showcase tours and experiences." },
              { title: "Stay & food", text: "Collect partners and offers." },
              { title: "Events", text: "Calendar with key dates." },
            ],
          },
          {
            title: "Book and pay",
            body: "A smooth flow for booking and payment.",
            cards: [
              { title: "Availability", text: "Calendar and capacity control." },
              { title: "Checkout", text: "Safe payment and confirmations." },
              { title: "Packages", text: "Bundle offers for higher value." },
            ],
          },
          {
            title: "Administration",
            body: "Control content, bookings, and reporting.",
            cards: [
              { title: "Login", text: "Access for editing and management." },
              { title: "Content editor", text: "Update pages and offers quickly." },
              { title: "Reports", text: "Overview of bookings and sales." },
            ],
          },
        ],
      },
      tier4: {
        image: "/nature5.jpg",
        hero: {
          eyebrow: "Example page",
          title: "Internal portal for employees",
          lede: "Timesheets, HSE, documents, and approvals in one simple system.",
          primary: "Request this portal",
          secondary: "Back to main page",
          highlights: ["2–100 employees", "Fast to use", "Manager overview"],
        },
        sections: [
          {
            title: "Daily operations",
            body: "Modules that help employees and managers every day.",
            cards: [
              { title: "Timesheets", text: "Register hours and approve quickly." },
              { title: "Projects", text: "Track progress and tasks." },
              { title: "Leave", text: "Apply and approve with one click." },
            ],
          },
          {
            title: "HSE and FDV",
            body: "Simple access to routines, documents, and deviations.",
            cards: [
              { title: "HSE", text: "Procedures and safety documents." },
              { title: "Deviations", text: "Log and follow up incidents." },
              { title: "Documents", text: "Versioned and easy to find." },
            ],
          },
          {
            title: "Reports and exports",
            body: "Overview for management and invoicing.",
            cards: [
              { title: "Invoice lines", text: "Export billable work." },
              { title: "Project status", text: "See hours and progress." },
              { title: "PDF & API", text: "Reports and integrations." },
            ],
          },
        ],
      },
    },
    sections: {
      hero: "Hero",
      tiers: "Packages",
      includes: "Included",
      hosting: "Hosting",
      contact: "Contact",
      demo: "Example",
    },
  },
  no: {
    meta: {
      eyebrow: "Wegener Development",
      tagline: "Din partner for løsninger på nett.",
    },
    nav: { contact: "Kontakt", home: "Hjem" },
    hero: {
      title: ["Vi hjelper deg bli synlig"],
      lede: "",
      actions: { primary: "Se pakkene", secondary: "Få et estimat" },
    },
    tiers: {
      eyebrow: "Webpakker",
      title: "Velg løsningen som passer for deg",
      lead:
        "Jeg heter Thomas Wegener og driver Wegener Development, som leverer moderne webløsninger. Jeg har en sterk tilknytning til Nord-Norge, erfaring fra reiseliv og en lidenskap for å formidle natur og historier. Med moderne teknologi bygger jeg løsninger som passer kundene mine og løfter opplevelsen for besøkende.",
      intro:
        "Fyll inn kontaktskjema, så avtaler vi et møte og snakker om mulighetene. Vi er opptatt av å få frem opplevelser og inntrykk. Sammen kan vi lede de besøkende til å ville se og oppleve mer.",
      campaign: {
        note: "Kampanje for partnere av Visit Hammerfest til 1. april (visithammerfest.no).",
        prices: {
          tier1: "Estimert NOK 6.000–9.750",
          tier2: "Estimert NOK 13.750–21.250",
        },
      },
      items: [
        {
          value: "tier1",
          label: "Nivå 1",
          title: "En enkel side",
          summary: "En presentasjon som gjør et inntrykk.",
          price: "Estimert NOK 12.000–19.500",
          priceNote: "1 landingsside, lansering på 1–2 uker.",
          features: [
            "En scrollende side",
            "Design og funksjonalitet",
            "Kontaktskjema",
            "Analyseverktøy",
            "Søkemotoroptimalisering",
            "Dere er ansvarlige for tekst og bilder",
          ],
          cta: "Velg nivå 1",
        },
        {
          value: "tier2",
          label: "Nivå 2",
          title: "En litt større side med flere undersider",
          summary: "Innholdet er fordelt på flere sider, med oversiktlig navigasjon.",
          price: "Estimert NOK 27.500–42.500",
          priceNote: "3–6 landingssider + bedre synlighet på Google.",
          features: [
            "Tydelig meny og struktur",
            "Design og funksjonalitet",
            "Sporing av brukeratferd",
            "Analyseverktøy",
            "Søkemotoroptimalisering",
            "Dere er ansvarlige for tekst og bilder",
          ],
          cta: "Velg nivå 2",
        },
        {
          value: "tier3",
          label: "Nivå 3",
          title: "Portal",
          summary: "Portal med innlogging, booking og nettbutikk.",
          price: "Fra NOK 95.000+",
          priceNote: "Kontakt for tilbud (omfangsbasert).",
          features: [
            "Innlogging for administrering",
            "Nettbooking og nettbutikk (Shopify)",
            "Enkel redigering av innhold",
            "Kundesider og meldinger",
            "Koblinger til systemene dere bruker",
            "Dere er ansvarlige for tekst og bilder",
          ],
          cta: "Be om tilbud på nivå 3",
        },
        {
          value: "tier4",
          label: "Nivå 4",
          title: "Internportal",
          summary: "Ansattløsninger fra timeføring til HMS.",
          price: "Oppstart NOK 25.000",
          priceNote: "Månedlig: NOK 149/129/99 per ansatt (2–20/21–50/51–100). Min månedspris NOK 1.490.",
          features: [
            "Timeføring og fravær",
            "HMS, rutiner og dokumenter",
            "Håndbok og interne nyheter",
            "Godkjenninger og meldinger",
            "Pris per ansatt per måned",
          ],
          cta: "Velg nivå 4",
        },
      ],
    },
    includes: {
      eyebrow: "Alltid inkludert",
      title: "Alt du trenger for lansering",
      items: [
        { icon: "domain", text: "Ditt eget domenenavn" },
        { icon: "seo", text: "Søkemotoroptimalisering" },
        { icon: "collaboration", text: "Involvering i utviklingen" },
        { icon: "backup", text: "Backup og varsler" },
        { icon: "analytics", text: "Google Analytics satt opp" },
        { icon: "speed", text: "Raske nettsider" },
        { icon: "launch", text: "Lansering og overlevering" },
      ],
    },
    hosting: {
      eyebrow: "Hosting & trafikk",
      title: "Enkel månedspris for hosting.",
      intro: "Hosting faktureres per måned med en fast pris + trafikk etter faktisk bruk på våre servere.",
      items: [
        {
          icon: "hosting",
          title: "Månedspris",
          body: "Fra NOK 290 / måned, avhengig av bruk og størrelse.",
        },
        {
          icon: "traffic",
          title: "Trafikk",
          body: "Faktureres etter faktisk bruk (GB). Vi kan estimere før lansering.",
        },
        {
          icon: "analytics",
          title: "Analytics",
          body: "Google Analytics settes opp og deles med deg.",
        },
      ],
      note: "Alle priser er estimater og bekreftes etter omfang og forventet trafikk.",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Klar for å bygge?",
      intro: "Del planen din, så svarer vi raskt med et tydelig forslag.",
      back: "Til toppen",
      openForm: "Åpne kontaktskjema",
      formTitle: "Kontakt Wegener Development",
      formDescription: "Fortell litt om prosjektet og ønsket nivå.",
      fields: {
        name: "Navn",
        email: "E-post",
        company: "Selskap (valgfritt)",
        phone: "Telefon (valgfritt)",
        tier: "Ønsket nivå",
        addons: "Tillegg du ønsker",
        budget: "Budsjett (valgfritt)",
        timeline: "Ønsket tidslinje (valgfritt)",
        message: "Prosjektdetaljer",
        submit: "Send",
      },
      tiers: [
        { value: "tier1", label: "Nivå 1 – Onepager" },
        { value: "tier2", label: "Nivå 2 – Landingssider" },
        { value: "tier3", label: "Nivå 3 – Portal" },
        { value: "tier4", label: "Nivå 4 – Internportal" },
        { value: "custom", label: "Egendefinert prosjekt" },
      ],
      addons: [
        { value: "brand", label: "Profil / logo" },
        { value: "seo", label: "Synlighet på Google" },
        { value: "booking", label: "Nettbooking" },
        { value: "shopify", label: "Nettbutikk (Shopify)" },
        { value: "multilang", label: "Flerspråklig innhold" },
      ],
      status: {
        idle: "",
        sending: "Sender forespørsel...",
        success: "Sendt. Vi tar kontakt snart.",
        error: "Noe gikk galt. Prøv igjen.",
      },
    },
    consent: {
      title: "Informasjonskapsler",
      body: "Vi bruker analyse for å forstå hvordan siden brukes. Velg ditt nivå.",
      submit: "Lagre valg",
      options: {
        all: "Alle",
        none: "Ingen",
      },
      descriptions: {
        all: "Inkluderer analyse.",
        none: "Ingen informasjonskapsler utover det som er nødvendig.",
      },
    },
    demos: {
      tier1: {
        image: "/nature2.jpg",
        hero: {
          eyebrow: "Eksempelside",
          title: "Onepager med tydelig budskap",
          lede: "Alt viktig på én side, med tydelig knapp og rask kontakt.",
          primary: "Be om denne siden",
          secondary: "Tilbake til forsiden",
          highlights: ["Tydelig budskap", "Rask levering", "Enkel kontakt"],
        },
        sections: [
          {
            title: "Slik er siden bygget",
            body: "En ren flyt som gir besøkende svar raskt og leder til kontakt.",
            cards: [
              { title: "Toppseksjon", text: "Kort budskap, knapp og tillit." },
              { title: "Tjenester", text: "Rask oversikt over det dere leverer." },
              { title: "Bevis", text: "Referanser, caser eller troverdighet." },
              { title: "Kontakt", text: "Skjema og direkte kontaktinfo." },
            ],
          },
          {
            title: "Passer for",
            body: "Perfekt for mindre bedrifter som vil bli synlige raskt.",
            cards: [
              { title: "Lokale tjenester", text: "Gjør det lett å ringe eller booke." },
              { title: "Nye bedrifter", text: "Lanser raskt og se profesjonell ut." },
              { title: "Kampanjer", text: "Fokusert budskap med tydelig mål." },
            ],
          },
        ],
      },
      tier2: {
        image: "/nature3.jpg",
        hero: {
          eyebrow: "Eksempelside",
          title: "Landingssider med tydelig struktur",
          lede: "Hver tjeneste får egen side med eget budskap og mål.",
          primary: "Be om dette nettstedet",
          secondary: "Tilbake til forsiden",
          highlights: ["3–6 sider", "Bedre synlighet", "Enkelt å oppdatere"],
        },
        sections: [
          {
            title: "Sideoversikt",
            body: "Et lite nettsted der hver tjeneste får en egen landingsside.",
            cards: [
              { title: "Forside", text: "Hovedbudskap, oversikt og CTA." },
              { title: "Tjenesteside", text: "Detaljer om én tjeneste." },
              { title: "Tjenesteside", text: "En ekstra side med fokus." },
              { title: "Om oss & kontakt", text: "Hvem dere er og hvordan nå dere." },
            ],
          },
          {
            title: "Innhold som konverterer",
            body: "Tydelige seksjoner som leder fra interesse til kontakt.",
            cards: [
              { title: "Klare fordeler", text: "Fortell hvorfor dere er riktig valg." },
              { title: "Enkle skjema", text: "Færre steg til kontakt." },
              { title: "Tillit", text: "Referanser, logoer og omtaler." },
            ],
          },
        ],
      },
      tier3: {
        image: "/nature4.jpg",
        hero: {
          eyebrow: "Eksempelside",
          title: "Portal med booking og administrering",
          lede: "En komplett portal som samler innhold, booking og drift på ett sted.",
          primary: "Be om denne portalen",
          secondary: "Tilbake til forsiden",
          highlights: ["Innlogging for administrering", "Bookingflyt", "Nettbutikk"],
        },
        sections: [
          {
            title: "Opplevelser og innhold",
            body: "Vis frem aktiviteter, pakker og innhold i en rik layout.",
            cards: [
              { title: "Aktiviteter", text: "Vis frem opplevelser og turer." },
              { title: "Opphold & mat", text: "Samle partnere og tilbud." },
              { title: "Arrangementer", text: "Kalender med viktige datoer." },
            ],
          },
          {
            title: "Bestill og betal",
            body: "En smidig flyt for bestilling og betaling.",
            cards: [
              { title: "Tilgjengelighet", text: "Kalender og kapasitet." },
              { title: "Betaling", text: "Sikker betaling og bekreftelser." },
              { title: "Pakker", text: "Samle tilbud for høyere verdi." },
            ],
          },
          {
            title: "Administrering",
            body: "Kontroller innhold, bestillinger og rapporter.",
            cards: [
              { title: "Innlogging", text: "Tilgang for redigering og drift." },
              { title: "Innholdsredigering", text: "Oppdater sider og tilbud raskt." },
              { title: "Rapporter", text: "Oversikt over bestillinger og salg." },
            ],
          },
        ],
      },
      tier4: {
        image: "/nature5.jpg",
        hero: {
          eyebrow: "Eksempelside",
          title: "Internportal for ansatte",
          lede: "Timeføring, HMS, dokumenter og godkjenninger samlet.",
          primary: "Be om denne portalen",
          secondary: "Tilbake til forsiden",
          highlights: ["2–100 ansatte", "Rask i bruk", "Oversikt for ledere"],
        },
        sections: [
          {
            title: "Daglig drift",
            body: "Moduler som hjelper ansatte og ledere i hverdagen.",
            cards: [
              { title: "Timeføring", text: "Registrer timer og godkjenn raskt." },
              { title: "Prosjekter", text: "Følg fremdrift og oppgaver." },
              { title: "Fravær", text: "Søk og godkjenn med et klikk." },
            ],
          },
          {
            title: "HMS og FDV",
            body: "Enkel tilgang til rutiner, dokumenter og avvik.",
            cards: [
              { title: "HMS", text: "Prosedyrer og sikkerhet." },
              { title: "Avvik", text: "Registrer og følg opp." },
              { title: "Dokumenter", text: "Versjonert og lett å finne." },
            ],
          },
          {
            title: "Rapporter og eksport",
            body: "Oversikt for ledelse og fakturering.",
            cards: [
              { title: "Fakturalinjer", text: "Eksporter fakturerbart arbeid." },
              { title: "Prosjektstatus", text: "Se timer og fremdrift." },
              { title: "PDF og API", text: "Rapporter og integrasjoner." },
            ],
          },
        ],
      },
    },
    sections: {
      hero: "Forside",
      tiers: "Pakker",
      includes: "Inkludert",
      hosting: "Hosting",
      contact: "Kontakt",
      demo: "Eksempel",
    },
  },
};

const iconMap = {
  domain: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3 2.5 15 0 18" />
      <path d="M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  ),
  seo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  collaboration: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="3" />
      <path d="M4 20c0-3 4-5 8-5s8 2 8 5" />
    </svg>
  ),
  backup: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18a4 4 0 0 1-1-7 5 5 0 0 1 9-2 4 4 0 0 1 1 8" />
      <path d="M12 12v6" />
      <path d="m9 15 3 3 3-3" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19h16" />
      <path d="M7 16v-5" />
      <path d="M12 16v-8" />
      <path d="M17 16v-3" />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  launch: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c3 1 5 3 6 6-1 3-3 5-6 6-3-1-5-3-6-6 1-3 3-5 6-6z" />
      <path d="M12 8v4" />
      <path d="M9 22l3-4 3 4" />
    </svg>
  ),
  hosting: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="6" rx="2" />
      <rect x="4" y="13" width="16" height="6" rx="2" />
      <path d="M8 8h.01" />
      <path d="M8 16h.01" />
    </svg>
  ),
  traffic: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10" />
      <path d="m13 3 4 4-4 4" />
      <path d="M17 17H7" />
      <path d="m11 21-4-4 4-4" />
    </svg>
  ),
};

const Icon = ({ name }) => (
  <span className="icon-badge" aria-hidden="true">
    {iconMap[name]}
  </span>
);

const CookieBanner = ({ t, value, onChange, onSubmit }) => (
  <form className="cookie-banner" role="dialog" aria-live="polite" onSubmit={onSubmit}>
    <div className="cookie-copy">
      <p className="cookie-title">{t.consent.title}</p>
      <p className="muted">{t.consent.body}</p>
    </div>
    <div className="cookie-options">
      {["all", "none"].map((option) => (
        <label key={option} className="cookie-option">
          <input
            type="radio"
            name="cookie-consent"
            value={option}
            checked={value === option}
            onChange={(event) => onChange(event.target.value)}
          />
          <span>
            {t.consent.options[option]}
            <span className="muted small">{t.consent.descriptions[option]}</span>
          </span>
        </label>
      ))}
    </div>
    <div className="cookie-actions">
      <button className="cta" type="submit">
        {t.consent.submit}
      </button>
    </div>
  </form>
);

const LanguageToggle = ({ lang, onChange }) => (
  <div className="language-toggle" role="group" aria-label="Language select">
    <button className={lang === "en" ? "toggle active" : "toggle"} onClick={() => onChange("en")} type="button">
      EN
    </button>
    <button className={lang === "no" ? "toggle active" : "toggle"} onClick={() => onChange("no")} type="button">
      NO
    </button>
  </div>
);

const TopNav = ({ t, lang, onChangeLanguage }) => (
  <nav className="top-nav">
    <div className="brand">
      <img src="/wdev.png" alt="Wegener Development logo" className="brand-mark" />
      <div>
        <p className="eyebrow">{t.meta.eyebrow}</p>
        <p className="muted">{t.meta.tagline}</p>
      </div>
    </div>
    <div className="nav-actions">
      <LanguageToggle lang={lang} onChange={onChangeLanguage} />
      <a href="#contact" className="cta">
        {t.nav.contact}
      </a>
    </div>
  </nav>
);

const DemoNav = ({ t, lang, onChangeLanguage, onOpenContact }) => (
  <nav className="top-nav demo-nav">
    <div className="brand">
      <img src="/wdev.png" alt="Wegener Development logo" className="brand-mark" />
      <div>
        <p className="eyebrow">{t.meta.eyebrow}</p>
        <p className="muted">{t.meta.tagline}</p>
      </div>
    </div>
    <div className="nav-actions">
      <LanguageToggle lang={lang} onChange={onChangeLanguage} />
      <a href="/" className="ghost">
        {t.nav.home}
      </a>
      <button className="cta" type="button" onClick={onOpenContact}>
        {t.nav.contact}
      </button>
    </div>
  </nav>
);

const Hero = ({ t, lang, onChangeLanguage }) => (
  <header className="hero" id="top" data-section={t.sections.hero} style={{ "--hero-image": `url('${heroImage}')` }}>
    <div className="container">
      <TopNav t={t} lang={lang} onChangeLanguage={onChangeLanguage} />
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">{t.meta.eyebrow}</p>
          <h1 className="hero-title">
            {(Array.isArray(t.hero.title) ? t.hero.title : [t.hero.title]).map((line, index) => (
              <span key={`${line}-${index}`} className="hero-title-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="hero-actions">
            <a href="#tiers" className="cta">
              {t.hero.actions.primary}
            </a>
            <a href="#contact" className="ghost">
              {t.hero.actions.secondary}
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const TierPanels = ({ t, onSelectTier }) => (
  <section id="tiers" className="tiers" data-section={t.sections.tiers}>
    <div className="container">
      <div className="section-head">
        <p className="eyebrow">{t.tiers.eyebrow}</p>
        <h2>{t.tiers.title}</h2>
        {t.tiers.lead && <p className="muted section-lead">{t.tiers.lead}</p>}
        <p className="muted section-intro">{t.tiers.intro}</p>
      </div>
    </div>
    <div className="tier-panels">
      {t.tiers.items.map((tier, index) => (
        <article
          key={tier.title}
          className={index % 2 === 0 ? "tier-panel align-left" : "tier-panel align-right"}
          data-section={`${t.sections.tiers} - ${tier.label}`}
          style={{ "--image": `url('${tierImages[index] || tierImages[tierImages.length - 1]}')`, "--delay": `${index * 120}ms` }}
        >
          <div className="container">
            <div className="tier-content">
              <p className="eyebrow">{tier.label}</p>
              <h3>{tier.title}</h3>
              <p className="muted">{tier.summary}</p>
              <div className="price-block">
                <p className="price">{tier.price}</p>
                <p className="muted small">{tier.priceNote}</p>
                {tier.campaignNote && <p className="campaign-note">{tier.campaignNote}</p>}
              </div>
              <ul className="feature-list">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button className="cta" type="button" onClick={() => onSelectTier(tier.value)}>
                {tier.cta}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const DemoPage = ({ t, demo, tierKey, lang, onChangeLanguage, onOpenContact }) => {
  const tierData = t.tiers.items.find((item) => item.value === tierKey);

  return (
    <div className="demo-page" data-section={t.sections.demo}>
      <header className="demo-hero" data-section={t.sections.demo} style={{ "--demo-image": `url('${demo.image}')` }}>
        <div className="container">
          <DemoNav t={t} lang={lang} onChangeLanguage={onChangeLanguage} onOpenContact={onOpenContact} />
          <div className="demo-hero-grid">
            <div className="demo-hero-copy">
              <p className="eyebrow">{demo.hero.eyebrow}</p>
              <h1>{demo.hero.title}</h1>
              <p className="lede">{demo.hero.lede}</p>
              <div className="hero-actions">
                <button className="cta" type="button" onClick={onOpenContact}>
                  {demo.hero.primary}
                </button>
                <a href="/" className="ghost">
                  {demo.hero.secondary}
                </a>
              </div>
              <div className="hero-highlights">
                {demo.hero.highlights.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {tierData && (
              <div className="demo-hero-card">
                <p className="eyebrow">{tierData.label}</p>
                <h3>{tierData.title}</h3>
                <p className="muted">{tierData.summary}</p>
                <div className="price-block">
                  <p className="price">{tierData.price}</p>
                  <p className="muted small">{tierData.priceNote}</p>
                  {tierData.campaignNote && <p className="campaign-note">{tierData.campaignNote}</p>}
                </div>
                <ul className="feature-list">
                  {tierData.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className="cta" type="button" onClick={onOpenContact}>
                  {tierData.cta}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {demo.sections.map((section) => (
        <section key={section.title} className="demo-section" data-section={section.title}>
          <div className="container">
            <div className="section-head">
              <h2>{section.title}</h2>
              <p className="muted">{section.body}</p>
            </div>
            <div className="demo-grid">
              {section.cards.map((card) => (
                <div key={card.title} className="demo-card">
                  <h3>{card.title}</h3>
                  <p className="muted">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section contact demo-contact" data-section={t.sections.contact}>
        <div className="container contact-inner">
          <div>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>{t.contact.title}</h2>
            <p className="muted">{t.contact.intro}</p>
          </div>
          <div className="contact-actions">
            <a className="cta" href="mailto:thomas@wegener.no">
              thomas@wegener.no
            </a>
            <button className="ghost" type="button" onClick={onOpenContact}>
              {t.contact.openForm}
            </button>
            <a className="ghost" href="/">
              {t.nav.home}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const Includes = ({ t }) => (
  <section className="section includes" data-section={t.sections.includes}>
    <div className="container">
      <div className="section-head">
        <p className="eyebrow">{t.includes.eyebrow}</p>
        <h2>{t.includes.title}</h2>
      </div>
      <div className="includes-grid">
        {t.includes.items.map((item) => (
          <div key={item.text} className="includes-card">
            <Icon name={item.icon} />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Hosting = ({ t }) => (
  <section id="hosting" className="section hosting" data-section={t.sections.hosting}>
    <div className="container">
      <div className="section-head">
        <p className="eyebrow">{t.hosting.eyebrow}</p>
        <h2>{t.hosting.title}</h2>
        <p className="muted">{t.hosting.intro}</p>
      </div>
      <div className="hosting-grid">
        {t.hosting.items.map((item) => (
          <div key={item.title} className="hosting-card">
            <Icon name={item.icon} />
            <h3>{item.title}</h3>
            <p className="muted">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="muted small hosting-note">{t.hosting.note}</p>
    </div>
  </section>
);

const ContactModal = ({ open, onClose, t, onSubmit, status, initialTier }) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    tier: initialTier || "tier1",
    addons: [],
    budget: "",
    timeline: "",
    message: "",
  });

  useEffect(() => {
    if (!open) return;
    if (!initialTier) return;
    setFormState((prev) => ({ ...prev, tier: initialTier }));
  }, [open, initialTier]);

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddonToggle = (addon) => {
    setFormState((prev) => {
      const exists = prev.addons.includes(addon);
      const addons = exists ? prev.addons.filter((item) => item !== addon) : [...prev.addons, addon];
      return { ...prev, addons };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" data-section={t.sections.contact}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h3>{t.contact.formTitle}</h3>
            <p className="muted small">{t.contact.formDescription}</p>
          </div>
          <button className="ghost small-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>{t.contact.fields.name}</span>
            <input name="name" value={formState.name} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>{t.contact.fields.email}</span>
            <input name="email" type="email" value={formState.email} onChange={handleChange} required />
          </label>
          <div className="field-row">
            <label className="field">
              <span>{t.contact.fields.company}</span>
              <input name="company" value={formState.company} onChange={handleChange} />
            </label>
            <label className="field">
              <span>{t.contact.fields.phone}</span>
              <input name="phone" value={formState.phone} onChange={handleChange} />
            </label>
          </div>
          <label className="field">
            <span>{t.contact.fields.tier}</span>
            <select name="tier" value={formState.tier} onChange={handleChange} required>
              {t.contact.tiers.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>{t.contact.fields.addons}</span>
            <div className="checkbox-grid">
              {t.contact.addons.map((addon) => (
                <label key={addon.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formState.addons.includes(addon.value)}
                    onChange={() => handleAddonToggle(addon.value)}
                  />
                  <span>{addon.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field-row">
            <label className="field">
              <span>{t.contact.fields.budget}</span>
              <input name="budget" value={formState.budget} onChange={handleChange} />
            </label>
            <label className="field">
              <span>{t.contact.fields.timeline}</span>
              <input name="timeline" value={formState.timeline} onChange={handleChange} />
            </label>
          </div>
          <label className="field">
            <span>{t.contact.fields.message}</span>
            <textarea name="message" rows="4" value={formState.message} onChange={handleChange} required />
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost small-btn" onClick={onClose}>
              {t.contact.back}
            </button>
            <button type="submit" className="cta">
              {t.contact.fields.submit}
            </button>
          </div>
          {status && <p className="muted small status-line">{status}</p>}
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState("no");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [selectedTier, setSelectedTier] = useState("tier1");
  const [pathname, setPathname] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/",
  );
  const [consent, setConsent] = useState(() => {
    if (typeof window === "undefined") return "unset";
    return localStorage.getItem("ga_consent") || "unset";
  });
  const [consentChoice, setConsentChoice] = useState("all");
  const normalizedPath = useMemo(() => {
    const trimmed = pathname.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  }, [pathname]);
  const isHammerfest = normalizedPath.toLowerCase().startsWith("/visithammerfest");
  const tierMatch = normalizedPath.toLowerCase().match(/^\/tier([1-4])$/);
  const tierKey = tierMatch ? `tier${tierMatch[1]}` : null;
  const t = useMemo(() => {
    const base = translations[lang];
    if (!isHammerfest) return base;
    const campaign = base.tiers.campaign;
    if (!campaign) return base;
    const items = base.tiers.items.map((item) => {
      if (item.value === "tier1") {
        return { ...item, price: campaign.prices.tier1, campaignNote: campaign.note };
      }
      if (item.value === "tier2") {
        return { ...item, price: campaign.prices.tier2, campaignNote: campaign.note };
      }
      return item;
    });
    return {
      ...base,
      tiers: {
        ...base.tiers,
        items,
      },
    };
  }, [lang, isHammerfest]);

  const webhookUrl =
    "https://discord.com/api/webhooks/1434519484458074165/YpW07SjEvZHylDGqGX8NDeZ0Y6E4YTFk4_Kf8iU5Wphgpdgylb5qJfdR_Sre72sbZlky";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const handleContactSubmit = async (payload) => {
    const tierLabel = t.contact.tiers.find((tier) => tier.value === payload.tier)?.label || payload.tier;
    const addonLabels = t.contact.addons
      .filter((addon) => payload.addons.includes(addon.value))
      .map((addon) => addon.label)
      .join(", ");

    const analyticsLabel = `${t.sections.contact} - ${tierLabel}`;
    if (consent === "all" && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "form_submit", {
        event_category: "interaction",
        event_label: analyticsLabel,
      });
    }

    setSubmitStatus(t.contact.status.sending);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [
            `New contact request from wegener.no (${lang.toUpperCase()})`,
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            payload.company ? `Company: ${payload.company}` : null,
            payload.phone ? `Phone: ${payload.phone}` : null,
            `Tier: ${tierLabel}`,
            `Add-ons: ${addonLabels || "None"}`,
            payload.budget ? `Budget: ${payload.budget}` : null,
            payload.timeline ? `Timeline: ${payload.timeline}` : null,
            `Message: ${payload.message}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      setSubmitStatus(t.contact.status.success);
      setTimeout(() => setModalOpen(false), 1000);
    } catch (error) {
      setSubmitStatus(t.contact.status.error);
    }
  };

  const openContact = (tierValue) => {
    setSelectedTier(tierValue || "tier1");
    setModalOpen(true);
  };

  const demo = tierKey ? t.demos?.[tierKey] : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", { analytics_storage: "denied" });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (consent === "unset") return;
    localStorage.setItem("ga_consent", consent);
    const allowAnalytics = consent === "all";
    window.gtag?.("consent", "update", { analytics_storage: allowAnalytics ? "granted" : "denied" });
    if (!allowAnalytics) return;
    if (!window.__gaInitialized) {
      window.gtag?.("config", GA_ID, { send_page_view: true });
      window.gtag?.("event", "page_view");
      window.__gaInitialized = true;
    }
  }, [consent]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (consent !== "all") return;
    const handleClick = (event) => {
      const target = event.target.closest("a, button");
      if (!target) return;
      const labelText =
        target.getAttribute("aria-label") ||
        target.getAttribute("title") ||
        target.textContent?.trim() ||
        target.getAttribute("href") ||
        "Unknown";
      const sectionEl = target.closest("[data-section]") || target.closest("section") || target.closest("header");
      const sectionName = sectionEl?.getAttribute("data-section") || sectionEl?.id || "Page";
      window.gtag?.("event", "click", {
        event_category: "interaction",
        event_label: `${sectionName} - ${labelText}`,
      });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [consent]);

  useEffect(() => {
    if (consent === "unset") {
      setConsentChoice("all");
      return;
    }
    setConsentChoice(consent);
  }, [consent]);

  if (demo && tierKey) {
    return (
      <div className="page">
        <DemoPage
          t={t}
          demo={demo}
          tierKey={tierKey}
          lang={lang}
          onChangeLanguage={setLang}
          onOpenContact={() => openContact(tierKey)}
        />
        <ContactModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          t={t}
          onSubmit={handleContactSubmit}
          status={submitStatus}
          initialTier={selectedTier}
        />
        {consent === "unset" && (
          <CookieBanner
            t={t}
            value={consentChoice}
            onChange={setConsentChoice}
            onSubmit={(event) => {
              event.preventDefault();
              setConsent(consentChoice);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <Hero t={t} lang={lang} onChangeLanguage={setLang} />
      <main>
        <TierPanels t={t} onSelectTier={openContact} />
        <Includes t={t} />
        <Hosting t={t} />
        <section id="contact" className="section contact" data-section={t.sections.contact}>
          <div className="container contact-inner">
            <div>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p className="muted">{t.contact.intro}</p>
            </div>
            <div className="contact-actions">
              <a className="cta" href="mailto:thomas@wegener.no">
                thomas@wegener.no
              </a>
              <button className="ghost" type="button" onClick={() => openContact()}>
                {t.contact.openForm}
              </button>
              <a className="ghost" href="#top">
                {t.contact.back}
              </a>
            </div>
          </div>
        </section>
      </main>
      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        t={t}
        onSubmit={handleContactSubmit}
        status={submitStatus}
        initialTier={selectedTier}
      />
      {consent === "unset" && (
        <CookieBanner
          t={t}
          value={consentChoice}
          onChange={setConsentChoice}
          onSubmit={(event) => {
            event.preventDefault();
            setConsent(consentChoice);
          }}
        />
      )}
    </div>
  );
};

export default App;
