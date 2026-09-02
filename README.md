# Hassan Diab — Personal Training Website

A full-stack fitness coaching platform built with Next.js, Supabase, and Vercel.

## Features

### Public Website
- **Home** — Hero, how it works, CTAs
- **Path Finder** — Interactive quiz that generates personalized training recommendations
- **Book Assessment** — Free movement assessment booking
- **Services** — Training packages and pricing
- **Transformations** — Client success stories with timelines
- **Exercise Library** — Video demonstrations with coaching tips
- **Blog** — Training tips and articles
- **Challenges** — Monthly community challenges

### Admin Panel (`/admin`)
- Dashboard with stats
- Manage exercises (with video/image upload)
- Manage services/packages
- Manage transformations (before/after photos)
- Manage blog posts
- View leads from Path Finder
- View bookings
- View clients and messages
- Site settings (contact info, hero image, social links)
- Media library

### Client Portal (`/portal`)
- Training dashboard
- View assigned program
- Log workouts
- Track progress (weight, measurements)
- Profile management

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel
- **Icons:** Lucide React

## Setup Guide

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run these files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_buckets.sql`
3. Go to **Authentication > Users** and create an admin user
4. Copy the user's UUID and run in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID';
   ```
5. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- Public site: `/`
- Admin login: `/login` (use admin credentials)
- Admin panel: `/admin`
- Client portal: `/portal`

### 4. Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)
4. Deploy

### 5. Post-Deploy

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel to your production domain
2. In Supabase **Authentication > URL Configuration**, add your Vercel domain to:
   - Site URL
   - Redirect URLs
3. Log in to `/admin` and configure site settings
4. Upload exercises, transformations, and services

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── admin/             # Admin panel (protected)
│   ├── portal/            # Client portal (protected)
│   ├── login/             # Auth page
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin components (MediaUpload, Sidebar)
│   ├── portal/            # Portal components
│   ├── layout/            # Header, Footer
│   ├── home/              # Homepage sections
│   ├── path-finder/       # Quiz component
│   └── ui/                # Reusable UI components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   ├── constants.ts       # App constants
│   └── utils.ts           # Helper functions
└── types/
    └── database.ts        # TypeScript types for DB
supabase/
└── migrations/            # SQL migration files
```

## Creating Client Accounts

1. Create user in Supabase Auth dashboard
2. Profile is auto-created with `client` role
3. Client logs in at `/login` and accesses `/portal`
4. Admin assigns programs from `/admin/programs`

## Storage Buckets

| Bucket | Purpose |
|--------|---------|
| `avatars` | Profile photos |
| `exercises` | Exercise videos and thumbnails |
| `transformations` | Before/after photos |
| `blog` | Blog cover images |
| `challenges` | Challenge images |
| `services` | Package images |
| `general` | Hero image, misc |

## License

Private — All rights reserved.
