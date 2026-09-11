-- Add saved restaurants tracking table
create table if not exists saved_restaurants (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete cascade,
  restaurant_id uuid references restaurants (id) on delete cascade,
  created_at timestamptz default now(),
  unique (profile_id, restaurant_id)
);

-- Update meetups/plans table to reference restaurant proposals with status
alter table plans add column if not exists proposed_by uuid references profiles (id);
alter table plans add column if not exists accepted_at timestamptz;

-- RLS for saved restaurants
alter table saved_restaurants enable row level security;

create policy "Users see their saved restaurants" on saved_restaurants
  for select to authenticated using (auth.uid() = profile_id);

create policy "Users save their own restaurants" on saved_restaurants
  for insert to authenticated with check (auth.uid() = profile_id);

create policy "Users delete their own saved restaurants" on saved_restaurants
  for delete to authenticated using (auth.uid() = profile_id);
