-- Notifications never sent: profiles has no email column, so the check
-- `recipient.email` in notifyMessageReceived was always undefined.
-- Emails live in auth.users; mirror them onto profiles.

alter table profiles add column if not exists email text;

-- Backfill existing users.
update profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- Keep it in sync for every future signup. Fires on profile insert (the
-- profile row is created during onboarding, after the auth user exists).
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
    select email into new.email from auth.users where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_sync_email on profiles;
create trigger profiles_sync_email
  before insert on profiles
  for each row execute function public.sync_profile_email();

-- The event log is written by the SENDER on behalf of the RECIPIENT, so
-- `profile_id = auth.uid()` denied every insert. Any signed-in user may log
-- an event; reads stay scoped to the recipient.
drop policy if exists "System can insert notifications" on notification_events;
create policy "Signed-in users can log notification events" on notification_events
  for insert to authenticated with check (true);
