create extension if not exists pgcrypto;

create table if not exists bowling_registrations (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  registration_type text not null check (
    registration_type in ('team', 'sponsorship', 'lane-sponsor', 'gift')
  ),
  package_id text,
  package_name text,
  buyer_first_name text not null,
  buyer_last_name text not null,
  buyer_email text not null,
  buyer_phone text,
  organization text,
  team_name text,
  session_id text,
  session_name text,
  lane_count integer not null default 0,
  subtotal integer not null default 0,
  donation_total integer not null default 0,
  grand_total integer not null default 0,
  optional_gift integer not null default 0,
  sponsor_logo_name text,
  save_team_link boolean not null default true,
  payment_preference text not null default 'card' check (
    payment_preference in ('card', 'invoice', 'check')
  ),
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'paid', 'invoice_requested', 'check_pledged')
  ),
  export_status text not null default 'not_exported' check (
    export_status in ('not_exported', 'exported', 'needs_review')
  ),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  notes text
);

create index if not exists bowling_registrations_created_at_idx
  on bowling_registrations (created_at desc);

create index if not exists bowling_registrations_session_idx
  on bowling_registrations (session_id)
  where session_id is not null;

create index if not exists bowling_registrations_payment_status_idx
  on bowling_registrations (payment_status);

create table if not exists bowling_bowlers (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null references bowling_registrations(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  notes text
);

create index if not exists bowling_bowlers_registration_idx
  on bowling_bowlers (registration_id);

create table if not exists bowling_lane_sponsors (
  id uuid primary key default gen_random_uuid(),
  registration_id text references bowling_registrations(id) on delete cascade,
  sponsor_name text not null,
  logo_url text,
  lane_assignment text,
  recognition_name text,
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'paid', 'invoice_requested', 'check_pledged')
  )
);

create index if not exists bowling_lane_sponsors_registration_idx
  on bowling_lane_sponsors (registration_id);

create table if not exists bowling_export_batches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  export_type text not null,
  record_count integer not null,
  filename text not null,
  notes text
);

create or replace function set_bowling_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bowling_registrations_updated_at on bowling_registrations;

create trigger bowling_registrations_updated_at
before update on bowling_registrations
for each row
execute function set_bowling_updated_at();
