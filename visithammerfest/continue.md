# Visit Hammerfest – Project State

## Current stack
- Containers via `docker-compose.yml`: `db` (Postgres 16 on `5433`), `api` (Fastify/Prisma on `5170`), `web` (Vite build served on `4179`).
- Run: `docker compose up -d --build web` for redeploys.
- Admin user seeded: `thomas@wegener.no` / `admin` (must change password on first login).
- Legacy data imported from MySQL container using `LEGACY_MYSQL_HOST=172.19.0.2`.
- Legacy media copied to `server/uploads/legacy` (988 files).

## Backend summary
- Fastify API in `server/src/` with Prisma/Postgres schema in `server/prisma/schema.prisma`.
- Auth: session cookies + CSRF headers, argon2 password hashing.
- RBAC: ADMIN can edit/publish everything; PARTNER can edit linked partner + related content.
- Media uploads: `POST /api/media/upload` with access checks, image optimization (resize/compress), and mime validation.
- Media galleries: `GET /api/media/links` + `PATCH /api/media/links/:id` with per-image publish toggle.
- Content routes: activities, partners, stores, articles, site info with publish workflow (DRAFT/PENDING/PUBLISHED).
- FAQ now supports region filtering (Hammerfest/Masoy/Porsanger).
- Locations API added (`/api/locations`) with hero images + galleries and show-on-home/menu flags.
- Activities/partners/stores now support `conceptIds` for concept landing pages.

## Frontend summary
- `src/App.tsx` renders the landing page, mega menu, and content landing pages with React Router.
- Routes: `/activities`, `/activities/:slug`, `/partners`, `/partners/:slug`, `/shopping`, `/shopping/:slug`, `/inspiration`, `/inspiration/:slug`, `/information`, `/information/:slug`, `/faq`, `/isbjornklubben`, `/concepts/:slug`, `/locations/:region` plus legacy redirects (`/articles/:slug`, `/stores`, `/inspirations`, `/activites`).
- Admin UI at `/admin` with login, password change, and editors for site info, locations, activities, partners, shopping, concepts, inspiration, information, FAQ, and users (media uploads supported).
- Vite dev port is `4179`. `VITE_API_BASE_URL` is used for API calls.
- NO/EN language toggle is wired through UI; localized fields are editable in admin.
- Detail pages show galleries; mailto/tel links are used for email and phone.
- Location lists and mega menu links now come from the locations table; concept pages show tagged activities/partners/stores.

## Sitemap (public)
- `/` (Home)
- `/activities` (Activities list)
- `/activities/:slug` (Activity detail)
- `/partners` (Partners list)
- `/partners/:slug` (Partner detail)
- `/shopping` (Shopping list)
- `/shopping/:slug` (Shopping detail)
- `/inspiration` (Inspiration list)
- `/inspiration/:slug` (Inspiration detail)
- `/information` (Information hub)
- `/information/:slug` (Information article)
- `/faq` (FAQ with region filters)
- `/isbjornklubben` (Isbjornklubben)
- `/concepts/:slug` (Concept landing pages)
- `/locations/:region` (Location landing pages)

## Release notes (customer-friendly)
- New site structure mirrors the old menu: Activities, Partners, Shopping, Inspiration, Information, plus dedicated FAQ and Isbjornklubben pages.
- Modern admin portal with secure login, role-based access (admins can edit everything; partners can edit their own content).
- Image uploads are optimized for web and support multiple images per page with publish toggles.
- Norwegian characters display correctly, and English is supported across editable fields.
- FAQ now supports regional grouping (Hammerfest, Masoy, Porsanger).
- New location landing pages group content by area and hide empty sections.
- Concept landing pages (Soft Adventures, Culture and local living, Fishing Paradise, The Culinary Arctic) are ready for home page linking.
- New Locations admin section allows adding places with hero images and galleries; activities/partners/shopping can be tagged by location and concept for grouped landing pages.

## Next steps (customer-facing)
1. Review and publish legacy images in each gallery (activities, partners, shopping, inspiration, information).
2. Fill missing English translations where needed.
3. Confirm which legacy pages should return (employee/legal/booking) and add them if required.
4. Decide on Norwegian collation requirements (affects sorting/search) and schedule the DB change if needed.
5. Review concept landing page home visibility and add hero images if desired.
6. Tag activities/partners/shopping with locations + concepts so the new landing pages fill out.

## Legacy page structure (from old PHP)
Routes were query-based and included:
- `activities` + `activity?id=...`
- `partners` + `partner?id=...`
- `stores` + `store?id=...` (Shopping)
- `inspirations` + `article?id=...`
- `information` (info banner + FAQ + info articles + map + contact)
- `employee`, `legal`
- `booking` + redirect to booking subdomain
- FAQ shown on home and information page
- Social icons + language switch in header

## Menu items in old header
- Activities, Partners, Stores/Shopping, Inspiration, Information
- Social icons (Facebook/Instagram)
- Language toggle flags
- Booking link was present but commented out

## Work already done
- Containerized API + web build.
- Prisma migrations applied and admin seeded.
- Legacy MySQL import script executed.
- Provider-aware media URLs (local now, Azure blob ready).
- Audit logging for content create/update.
- Added landing pages + detail routes for activities, partners, shopping, inspiration, and information.
- Added concept landing pages and location landing pages.
- Wired mega menu tabs + quick links for activities/partners/shopping/inspiration/information.
- Created and applied migrations:
  - `20260116122935_add_slugs_faq` (slugs + article type + FAQ).
  - `20260117103330_add_faq_region` (FAQ regions).
  - `20260117111721_add_media_link_publish` (image publish toggles).
- Reset Postgres, re-seeded admin, and re-imported legacy content to populate slugs/types/FAQ.
- Added `/admin` UI with secure login (sessions + CSRF), content editors, media uploads, and user management.
- Added image optimization on upload (resize/quality) and gallery handling with publish toggle.
- Decoded HTML entities so Scandinavian letters display correctly.
- Ran a maintenance script to publish legacy media links and fill missing EN fallbacks (no updates were needed).

## TODO (next planned work)
1. **Database collation**
   - Apply Norwegian ICU collation (dump/restore) if required for sorting/search.
2. **Legacy media curation**
   - Review gallery images per activity/partner/store/article and set publish toggles as needed.
3. **Content QA**
   - Confirm missing legacy pages (employee/legal/booking) and decide on scope.

## Open questions
- Source for `isbjornklubben` content (article, static page, or new page type?).
- Which legacy pages (employee/legal/booking) should be recreated now?
- Should FAQ live as its own page and be embedded on the information page, like before?
