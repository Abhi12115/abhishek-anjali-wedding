# Abhishek & Anjali — From a Friend Request to Forever

A mobile-first wedding invitation built with React, Vite, custom CSS and Lucide icons.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Invitation links

The same website renders three invitation categories:

- `/invite/full` — all four functions
- `/invite/abhishek` — Abhishek's Grahsatak, Reception and Marriage
- `/invite/anjali` — Reception, Anjali's Grahsatak and Marriage

When deployed as a static SPA, configure the host to rewrite unknown paths to `/index.html` (Vercel's default Vite handling works; for Netlify use the included `_redirects` file).

## RSVP setup (optional, required for live submissions)

1. Create a free Supabase project.
2. Open SQL Editor and run `supabase-setup.sql`.
3. Copy the Project URL and anon/public key from Project Settings > API.
4. Create `.env` from `.env.example` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

5. Restart the dev server / redeploy.

The browser client is intentionally limited to INSERT. Row Level Security is enabled, and no public read policy is created. Organisers can review responses in the Supabase dashboard. Never put a Supabase service-role key in frontend code. The current public form has basic client-side validation; before sending to a large public audience, add CAPTCHA or a server-side rate limit to reduce spam.

Without Supabase credentials the RSVP form stays in preview mode and clearly tells the guest that submissions are not yet connected. It does not pretend to save a response.

## Deploy

### Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: Vite; Build command: `npm run build`; Output directory: `dist`.
4. Add the two Supabase environment variables if RSVP is enabled.
5. Deploy. Vercel supports SPA fallback for these routes.

### Netlify

1. Push the folder to GitHub and import it in Netlify.
2. Build command: `npm run build`; Publish directory: `dist`.
3. Add the Supabase environment variables if needed.
4. Deploy. `public/_redirects` provides SPA fallback.

## Assets to add later

- Real couple photographs for the gallery and consistent illustrated character references.
- Optional licensed/royalty-free instrumental track if you prefer a real flute/piano recording; the current music toggle plays a quiet original Web Audio ambient motif and requires a guest tap.
- Optional compressed palace/couple artwork if you want to replace the CSS illustration with custom art.

## Notes

- Wedding dates, event names, timings, venue names and addresses are kept as supplied.
- Calendar files are generated in the browser with Asia/Kolkata timezone.
- Google Maps links open a search for the supplied venue/address; confirm the exact venue pin before publishing.
- Gallery tiles are intentional placeholders, not fabricated couple photographs.
