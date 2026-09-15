-- Map coordinates + live restaurant search support
-- Run this in the Supabase SQL Editor.

-- Coordinates for map pins
alter table restaurants add column if not exists lat double precision;
alter table restaurants add column if not exists lng double precision;

-- Track where a restaurant came from: the curated seed list, or live Google search
alter table restaurants add column if not exists source text not null default 'curated';

-- Google place_id for restaurants adopted from live search.
-- Unique so the same place is never saved twice.
alter table restaurants add column if not exists external_id text;

-- Plain unique index (not partial): Postgres treats NULLs as distinct, so the
-- curated rows with a null external_id don't collide, and ON CONFLICT can
-- still target this index when adopting a restaurant from live search.
create unique index if not exists restaurants_external_id_key
  on restaurants (external_id);

-- Live-search restaurants are inserted on demand when a user saves one,
-- so authenticated users need insert permission on this table.
alter table restaurants enable row level security;

drop policy if exists "Restaurants are viewable by everyone" on restaurants;
create policy "Restaurants are viewable by everyone" on restaurants
  for select using (true);

drop policy if exists "Authenticated users can add restaurants from search" on restaurants;
create policy "Authenticated users can add restaurants from search" on restaurants
  for insert to authenticated with check (source = 'google');
