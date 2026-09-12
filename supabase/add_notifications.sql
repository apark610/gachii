-- Add phone number and email to profiles for notifications
alter table profiles add column if not exists phone_number text;
alter table profiles add column if not exists email_notifications boolean default true;
alter table profiles add column if not exists sms_notifications boolean default false;

-- Create notifications table to track notification preferences and history
create table if not exists notification_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete cascade,
  event_type text not null, -- 'message_received', 'plan_proposed', 'plan_accepted'
  related_user_id uuid references profiles (id),
  created_at timestamptz default now()
);

-- Enable RLS on notifications
alter table notification_events enable row level security;

-- Users can see their own notification events
create policy "Users see their own notifications" on notification_events
  for select to authenticated using (auth.uid() = profile_id);

-- System can insert notifications
create policy "System can insert notifications" on notification_events
  for insert to authenticated with check (profile_id = auth.uid());

-- Fix messages RLS policies to be more permissive
drop policy if exists "Users see messages for their matches" on messages;
drop policy if exists "Users can send messages for their matches" on messages;

create policy "Users see messages for their matches" on messages
  for select to authenticated using (
    exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

create policy "Users can send messages for their matches" on messages
  for insert to authenticated with check (
    sender_id = auth.uid()
    and exists (
      select 1 from matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );
