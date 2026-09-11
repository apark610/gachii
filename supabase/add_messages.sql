-- Create messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches (id) on delete cascade,
  sender_id uuid references profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table messages enable row level security;

-- Users can see messages for their matches
create policy "Users see messages for their matches" on messages
  for select to authenticated using (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

-- Users can insert messages for their matches
create policy "Users can send messages for their matches" on messages
  for insert to authenticated with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );
