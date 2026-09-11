# Gachi

Find your food people — a platonic dining-matchmaking app for Social Foodies.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) for accounts, profiles, matches, and plans

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables,
   seeds cuisines + a few sample restaurants, and sets up row-level security.
3. In **Project Settings → API**, copy the Project URL and `anon` public key.
4. Copy `.env.local.example` to `.env.local` and fill in those two values:

   ```bash
   cp .env.local.example .env.local
   ```

5. (Optional, for faster local testing) In **Authentication → Providers → Email**,
   turn off "Confirm email" so new accounts are active immediately instead of
   needing an email click.
6. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

## How matching works

Each person picks the cuisines they love during onboarding. On the Discover tab,
everyone else is ranked by taste-match % — the overlap between your cuisine picks
and theirs (shared ÷ union). Tapping **Match** creates a mutual match immediately
(no swiping/ghosting — Gachi is low-pressure by design). From the Matches tab you
can lock in a restaurant to plan a meal together.

## Project structure

- `src/app/page.tsx` — public marketing landing page
- `src/app/login`, `src/app/signup` — auth
- `src/app/onboarding` — pick cuisines + basic profile info
- `src/app/app/*` — the signed-in product (Home, Discover, Matches, Profile)
- `src/lib/data.ts` — server-side data fetching from Supabase
- `src/lib/matching.ts` — taste-match scoring
- `supabase/schema.sql` — database schema, seed data, RLS policies

## Next steps to consider

- Real restaurant data (an API like Google Places/Yelp instead of the seeded list)
- Photo uploads for profiles (Supabase Storage)
- In-app messaging once a match is made
- Stripe integration for the $4.99/mo subscription tier
