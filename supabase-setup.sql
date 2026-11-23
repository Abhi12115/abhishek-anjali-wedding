-- Run this once in Supabase Dashboard > SQL Editor.
-- Public guests can INSERT RSVP records but cannot SELECT, UPDATE or DELETE them.
create table if not exists public.wedding_rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text not null check (char_length(guest_name) between 1 and 100),
  phone text check (phone is null or char_length(phone) <= 20),
  message text check (message is null or char_length(message) <= 500),
  invitation_type text not null check (invitation_type in ('full', 'abhishek', 'anjali')),
  responses jsonb not null check (jsonb_typeof(responses) = 'array')
);

alter table public.wedding_rsvps enable row level security;
revoke all on public.wedding_rsvps from anon, authenticated;
grant insert on public.wedding_rsvps to anon, authenticated;

drop policy if exists "Guests can submit RSVP" on public.wedding_rsvps;
create policy "Guests can submit RSVP"
on public.wedding_rsvps
for insert
to anon, authenticated
with check (
  invitation_type in ('full', 'abhishek', 'anjali')
  and jsonb_array_length(responses) between 1 and 4
);

-- Organisers should review responses in the Supabase Dashboard using an owner account.
-- Do not add a public SELECT policy or expose a service-role key in the website.
