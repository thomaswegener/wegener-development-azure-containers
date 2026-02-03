# Go North React App Notes

## Milestones
1. Migrated existing PHP site to Vite + React (videos, PDFs, contact).
2. Added data-driven navigation and copied assets/products into public/.
3. Integrated lazy-loaded react-pdf viewer with custom toolbar and styling.
4. Upgraded Node.js to 20.x; npm install & builds run via sudo due to read-only workspace.

## Next focus when reopening
- Remove legacy flipbook files in public/products once write access is available.
- Hook ContactForm up to a real endpoint/Formoid replacement.
- Consider further bundle splitting (lazy route-based) and CDN hosting for videos.
- Update social links and add analytics/telemetry if desired.
- Deploy dist/ to production (Netlify/Vercel/manual copy).
