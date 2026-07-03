-- Row-level security: every row is owned by exactly one auth user (US-61).
-- One "owner can do everything to their own rows" policy per table.

-- users (keyed on id, not user_id)
create policy "users own profile"
  on public.users for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "own devices"
  on public.devices for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own raw_events"
  on public.raw_events for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own exclude_rules"
  on public.exclude_rules for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own category_overrides"
  on public.category_overrides for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own daily_aggregates"
  on public.daily_aggregates for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own insights"
  on public.insights for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
