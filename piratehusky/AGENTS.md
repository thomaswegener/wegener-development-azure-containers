# Repository Guidelines

## Project Structure & Module Organization
- Frontend lives in `src` with `main.jsx` bootstrapping React, `App.jsx` wiring layout, and `Router.jsx` defining routes. UI pieces are in `components/`; page-level views in `pages/`; shared context in `context/`; translations in `i18n/` plus `src/i18n.js`. Global styles sit in `App.css` and `index.css`, and static assets live in `src/assets/` and `public/`.
- The Express API is in `server/index.js`, persisting data in `server/data/dogs.json` (created on demand). Built assets are emitted to `dist/` and served by the server in production.

## Build, Test, and Development Commands
- Install: `npm install` (Node >= 20.17).
- Local dev (frontend + API): `npm run dev` (runs Vite and the Express server in parallel). Use `npm run server` to run only the API with hot restarts handled manually.
- Production build: `npm run build` (outputs to `dist/`); preview with `npm run preview`. Start production server with `npm run start` after building.
- Lint: `npm run lint` to apply ESLint rules across server and client.

## Coding Style & Naming Conventions
- JavaScript/JSX with ES modules; prefer functional React components. Use 2-space indentation, single quotes, and trailing commas per the existing code style.
- Components: PascalCase filenames and exports (e.g., `DogCard.jsx`). Helpers, hooks, and variables: camelCase. Keep routing definitions centralized in `Router.jsx` and avoid inline styles unless minimal (prefer CSS in `App.css`/`index.css`).
- Follow ESLint feedback; hooks must comply with `eslint-plugin-react-hooks`. Keep server utilities pure and colocate route helpers near their routes.

## Testing Guidelines
- No automated test suite is present. When adding tests, colocate under `src/__tests__/` or alongside components (e.g., `components/DogCard.test.jsx`) and cover routing, translations, and API integration boundaries. Run linters as a minimum gate until tests are introduced.

## Commit & Pull Request Guidelines
- Use concise, present-tense commits; Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) are preferred. Group related changes (frontend vs. server) and include brief rationales in the body.
- Pull requests should state purpose, affected areas (`src/components`, `server`), and manual test notes. Include screenshots/GIFs for UI changes and note any env vars touched (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `PORT`).

## Security & Configuration Tips
- Do not commit credentials; configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, and `PORT` via environment variables. Avoid exposing JWT secrets client-side.
- The API writes to `server/data/dogs.json`; ensure local writes are acceptable before running in restricted environments, and add backups or mounts in containerized setups if persistence matters.
