alter table bowling_registrations
add column if not exists access_token text;

create unique index if not exists bowling_registrations_access_token_idx
  on bowling_registrations (access_token)
  where access_token is not null;
