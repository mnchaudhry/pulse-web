-- Onboarding state (onboarding-flow.md §3) — resumability must be derived
-- from real data, not a separate wizard-state flag that can drift. These are
-- the three signals the flow needs: disclosure confirmed, tour completed
-- (both account-scoped, not per-device localStorage — a second device must
-- not repeat the tour), and whether a device has ever been renamed away from
-- its auto-generated label (Stage 4).

alter table public.users
  add column disclosure_confirmed_at timestamptz,
  add column tour_completed_at timestamptz,
  add column first_data_seen_at timestamptz;

alter table public.devices
  add column renamed boolean not null default false;
