-- Add update policy for plans table to allow users to update status
create policy "Users can update plans they're involved in" on plans
  for update to authenticated using (
    exists (
      select 1 from matches
      where matches.id = plans.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );
