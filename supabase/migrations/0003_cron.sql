-- Scheduled jobs (US-48/60 + insight generation). Uses pg_cron + pg_net to call
-- the Edge Functions on a schedule. Times are UTC. Adjust the project ref below
-- if you point this at a different Supabase project.
--
-- Alternative to this migration: Supabase Dashboard → Cron → "Create job" →
-- type "Edge Function" (or HTTP request) with the same schedules.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Base URL for this project's Edge Functions.
-- ref: voybadskdsdzsgmvvflm
-- https://<ref>.supabase.co/functions/v1/<name>

-- Roll raw_events → daily_aggregates and prune >90d — 00:00 Asia/Karachi (19:00 UTC).
select cron.schedule(
  'pulse-aggregate-daily',
  '0 19 * * *',
  $$ select net.http_post(
       url := 'https://voybadskdsdzsgmvvflm.supabase.co/functions/v1/aggregate-daily',
       headers := '{"Content-Type":"application/json"}'::jsonb
     ) $$
);

-- Generate proactive insights — 00:15 Asia/Karachi (19:15 UTC), after aggregation.
select cron.schedule(
  'pulse-generate-insights',
  '15 19 * * *',
  $$ select net.http_post(
       url := 'https://voybadskdsdzsgmvvflm.supabase.co/functions/v1/generate-insights',
       headers := '{"Content-Type":"application/json"}'::jsonb
     ) $$
);

-- Daily email digest — 08:00 Asia/Karachi (03:00 UTC).
select cron.schedule(
  'pulse-digest-daily',
  '0 3 * * *',
  $$ select net.http_post(
       url := 'https://voybadskdsdzsgmvvflm.supabase.co/functions/v1/send-digests?type=daily',
       headers := '{"Content-Type":"application/json"}'::jsonb
     ) $$
);

-- Weekly email digest — Mondays 08:00 Asia/Karachi (03:00 UTC).
select cron.schedule(
  'pulse-digest-weekly',
  '0 3 * * 1',
  $$ select net.http_post(
       url := 'https://voybadskdsdzsgmvvflm.supabase.co/functions/v1/send-digests?type=weekly',
       headers := '{"Content-Type":"application/json"}'::jsonb
     ) $$
);
