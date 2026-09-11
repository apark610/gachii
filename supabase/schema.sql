-- Gachi database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text default '',
  city text default '',
  avatar_color text default '#c1613f',
  onboarded boolean default false,
  created_at timestamptz default now()
);

create table if not exists cuisines (
  slug text primary key,
  label text not null
);

insert into cuisines (slug, label) values
  ('korean', 'Korean'),
  ('japanese', 'Japanese'),
  ('thai', 'Thai'),
  ('vietnamese', 'Vietnamese'),
  ('chinese', 'Chinese'),
  ('mexican', 'Mexican'),
  ('italian', 'Italian'),
  ('indian', 'Indian'),
  ('mediterranean', 'Mediterranean'),
  ('american', 'American'),
  ('french', 'French'),
  ('filipino', 'Filipino')
on conflict (slug) do nothing;

create table if not exists profile_cuisines (
  profile_id uuid references profiles (id) on delete cascade,
  cuisine_slug text references cuisines (slug) on delete cascade,
  primary key (profile_id, cuisine_slug)
);

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cuisine_slug text references cuisines (slug),
  neighborhood text not null,
  city text not null default 'Los Angeles',
  vibe_tags text[] default '{}',
  created_at timestamptz default now()
);

insert into restaurants (name, cuisine_slug, neighborhood, city, vibe_tags) values
  ('Yangban Society', 'korean', 'Arts District', 'Los Angeles', array['Sharing', 'Date-worthy']),
  ('Osen Izakaya', 'japanese', 'Little Tokyo', 'Los Angeles', array['Casual', 'Late-night']),
  ('Majordomo', 'korean', 'Silver Lake', 'Los Angeles', array['Bold', 'Sharing']),
  ('Night + Market', 'thai', 'West Hollywood', 'Los Angeles', array['Spicy', 'Casual'])
on conflict do nothing;

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references profiles (id) on delete cascade,
  user_b uuid references profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'matched', 'passed')),
  taste_match int not null default 0,
  created_at timestamptz default now(),
  unique (user_a, user_b)
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches (id) on delete cascade,
  restaurant_id uuid references restaurants (id),
  scheduled_for timestamptz,
  status text not null default 'proposed' check (status in ('proposed', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- Row level security
alter table profiles enable row level security;
alter table profile_cuisines enable row level security;
alter table matches enable row level security;
alter table plans enable row level security;

create policy "Profiles are viewable by authenticated users" on profiles
  for select to authenticated using (true);

create policy "Users can insert their own profile" on profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update to authenticated using (auth.uid() = id);

create policy "Profile cuisines are viewable by authenticated users" on profile_cuisines
  for select to authenticated using (true);

create policy "Users manage their own cuisine picks" on profile_cuisines
  for all to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "Users see matches involving them" on matches
  for select to authenticated using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users create matches involving them" on matches
  for insert to authenticated with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users update matches involving them" on matches
  for update to authenticated using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users see plans for their matches" on plans
  for select to authenticated using (
    exists (
      select 1 from matches
      where matches.id = plans.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

create policy "Users create plans for their matches" on plans
  for insert to authenticated with check (
    exists (
      select 1 from matches
      where matches.id = plans.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );
