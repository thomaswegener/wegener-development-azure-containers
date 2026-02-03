# Kongsberg Vitensenter · React + Notion

En moderne React-applikasjon med TypeScript som henter aktivitetskalender og «Om oss»-innhold direkte fra Notion. Løsningen inkluderer en Express-backend som henter data fra Notion API-et og server statiske filer, og kan kjøres som en Docker-container.

## Teknologistack

- React 19 + TypeScript (Vite)
- Express server (`server/`) som proxy mot Notion
- Notion SDK (`@notionhq/client`)
- Docker støtte for enkel deploy

## Kom i gang

1. Kopier `.env.example` til `.env` og sett variablene:
   ```bash
   cp .env.example .env
   ```
2. Installer avhengigheter:
   ```bash
   npm install
   ```
3. Start backend som henter fra Notion (standardport 4173 eller det du har satt i `PORT`) – `dev:server` overvåker filendringer:
   ```bash
   npm run dev:server
   ```
4. Start frontend (port 5173). Dev-proxyen leser `VITE_PROXY_SERVER_PORT` og viderekobler `/api` til backend-porten:
   ```bash
   npm run dev
   ```

Backend og frontend kjører separat i utvikling. Når dette deployes vil Express-appen servere den bygde React-applikasjonen.

## Notion-integrasjon

For å hente data trenger du:

- `NOTION_API_KEY`: En intern integrasjon i Notion (Opprett under **Settings → Connections → Develop or manage integrations**).
- `NOTION_CALENDAR_DATABASE_ID`: ID for aktivitetsdatabasen (åpne databasen i Notion, kopier ID-en fra URL-en).
- `NOTION_ABOUT_DATABASE_ID`: ID for «Om oss»-databasen.

### Deling og tilgang

1. Opprett integrasjonen i Notion.
2. Åpne databasen → `⋮` meny → **Add connections** → velg integrasjonen.
3. Kopier database-ID-ene (ligger mellom siste `/` og `?` i URL-en).

### Forventet datamodell

Kalenderdatabase (kravene kan overstyres via miljøvariabler, se `.env.example`):

| Notion-navn | Type | Forklaring | Standard env |
|-------------|------|------------|--------------|
| `Name` | Title | Navn på aktiviteten | – |
| `Date` | Date | Start-/slutttid | `NOTION_CALENDAR_DATE_PROP` |
| `Summary` | Rich text | Kort beskrivelse | `NOTION_CALENDAR_SUMMARY_PROP` |
| `Location` | Rich text | Hvor skjer aktiviteten? | `NOTION_CALENDAR_LOCATION_PROP` |
| `Audience` | Multi-select | Hvem passer aktiviteten for | `NOTION_CALENDAR_AUDIENCE_PROP` |
| `Hosts` | People/Rich text | Hvem leder aktiviteten | `NOTION_CALENDAR_HOSTS_PROP` |
| `OpenForPublic` | Checkbox/Select | Marker hva som er åpent | `NOTION_CALENDAR_PUBLIC_PROP` |
| `Tags` | Multi-select | Frivillig tagging | `NOTION_CALENDAR_TAGS_PROP` |

«Om oss»-database:

| Notion-navn | Type | Forklaring | Standard env |
|-------------|------|------------|--------------|
| `Name` | Title | Navn | – |
| `Role` | Rich text/Select | Tittel | `NOTION_ABOUT_ROLE_PROP` |
| `Bio` | Rich text | Kort beskrivelse | `NOTION_ABOUT_BIO_PROP` |
| `Focus` | Multi-select | Faglige fokusområder | `NOTION_ABOUT_FOCUS_PROP` |
| `Email` | Email/Rich text | Kontaktinfo | `NOTION_ABOUT_EMAIL_PROP` |
| `Phone` | Phone/Rich text | Telefon | `NOTION_ABOUT_PHONE_PROP` |

Hvis feltnavnene dine er annerledes setter du de respektive `NOTION_*_PROP` variablene i `.env`.

## Bygg og drift

### Prod build

```bash
npm run build:all  # bygger frontend + server
npm start          # kjører dist-server/index.js på PORT (default 4000)
```

### Docker

```
docker build -t vitensenteret-web .
docker run --env-file .env -p 4173:4173 vitensenteret-web
```

Containeren kjører `node dist-server/index.js` og server React-applikasjonen via Express.

## Struktur

```
web/
├── src/                 # React-komponenter, hooks og stilark
├── server/              # Express API + Notion-klient
├── shared/              # TypeScript-typer brukt av både client og server
├── public/              # Statisk innhold
└── Dockerfile           # Multi-stage build for produksjon
```

## Videre arbeid

- Implementere autentisering/rollebasert visning hvis enkelte aktiviteter ikke skal publiseres.
- Legge til caching/webhooks mot Notion for raskere responstid.
- Integrere kalenderen i eksisterende driftssystemer (for eksempel ICS-eksport eller Outlook synk).
