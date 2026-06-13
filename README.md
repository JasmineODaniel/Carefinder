# Carefinder

A civic health directory for Nigeria — search, filter, and export verified hospital records across all 36 states.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (design tokens in `src/index.css`) |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase Auth |
| Maps | Mapbox GL JS |
| Email | Resend |
| CSV export | PapaParse |
| Rich text | react-md-editor |
| Icons | Font Awesome 6 |
| Tests | Vitest + Playwright |

## Features

- **Full-text search** across hospital name, city, and LGA
- **Specialty filter** — 20+ categories including Cardiology, Maternity, Emergency, and more
- **Geolocation** — "Near me" mode finds hospitals within an adjustable radius using PostGIS
- **Map view** — all results pinned live on Mapbox; switch between list, map, and split views
- **CSV export** — download filtered results with column selection via PapaParse
- **Shareable links** — every search state is encoded in the URL
- **Admin dashboard** — authenticated admins can add, edit, and moderate hospital records
- **Role-based access** — Supabase Row Level Security enforces read-only public access and write access for admins only

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase and Mapbox keys
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_MAPBOX_TOKEN` | Mapbox public access token |
| `VITE_RESEND_API_KEY` | Resend API key (email sharing) |

## Project structure

```
src/
  components/      # Shared UI and layout (Header, PageLayout, Button)
  features/
    auth/          # AuthContext, login flow
    hospitals/     # HospitalCard, FilterBar, useHospitals, useNearbyHospitals
    export/        # ExportModal (CSV via PapaParse)
    share/         # ShareModal (email via Resend)
    map/           # HospitalMap (Mapbox GL JS)
  pages/           # Route-level components (HomePage, SearchPage, AdminDashboardPage)
  types/           # Shared TypeScript types
  index.css        # Tailwind v4 @theme design tokens
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Type-check and bundle for production
npm run preview    # Preview the production build locally
npm run test       # Run unit tests with Vitest
npm run e2e        # Run end-to-end tests with Playwright
npm run lint       # ESLint
```

## Database

The app uses Supabase with a `hospitals` table that includes a PostGIS `location` column for geospatial queries. The `useNearbyHospitals` hook calls a Postgres function that returns hospitals ordered by distance from a given coordinate.

Migrations live in `supabase/migrations/`. Run them with the Supabase CLI:

```bash
supabase db push
```

## Deployment

Build output goes to `dist/`. Deploy to any static host (Vercel, Netlify, Cloudflare Pages). Set the environment variables in your host's dashboard before deploying.
