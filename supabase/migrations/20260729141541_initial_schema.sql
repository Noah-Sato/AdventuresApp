-- FOMO initial schema: profiles, events, attendance (doubles as invites), friends, push_tokens.
-- RLS is written one policy per operation (never a broad `for all`) so a missing policy fails
-- loudly instead of silently — the old schema had zero write policies on `events` and an
-- ownerless `with check (true)` insert on `attendance`; this design makes both impossible.

create type public.event_visibility as enum ('public', 'private');
create type public.attendance_status as enum ('invited', 'going', 'maybe', 'declined');
create type public.friend_status as enum ('pending', 'accepted', 'blocked');

-- profiles: extends auth.users, unchanged from the old design (this part was already correct)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  visibility public.event_visibility not null default 'private',
  start_date timestamptz not null,
  end_date timestamptz,
  capacity int check (capacity is null or capacity > 0),
  place_id text,
  formatted_address text,
  lat double precision,
  lng double precision,
  image_url text,
  created_at timestamptz not null default now()
);

create index events_host_id_idx on public.events (host_id);
create index events_visibility_start_date_idx on public.events (visibility, start_date);

alter table public.events enable row level security;

-- events_select is added after the attendance table exists (it references attendance), see below.
create policy "events_insert_own" on public.events for insert with check (auth.uid() = host_id);
create policy "events_update_own" on public.events for update using (auth.uid() = host_id);
create policy "events_delete_own" on public.events for delete using (auth.uid() = host_id);

-- attendance: doubles as the invite table. An invite is a row with status='invited' before the
-- invitee responds -- avoids a separate event_invites table and the insert/delete sync it'd need
-- every time an invite is answered.
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.attendance_status not null default 'invited',
  invited_by uuid references public.profiles(id),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index attendance_user_id_idx on public.attendance (user_id);
create index attendance_event_id_idx on public.attendance (event_id);

-- now that attendance exists, add the events select policy that references it
create policy "events_select" on public.events for select using (
  visibility = 'public'
  or host_id = auth.uid()
  or exists (
    select 1 from public.attendance a
    where a.event_id = events.id and a.user_id = auth.uid()
  )
);

alter table public.attendance enable row level security;

create policy "attendance_select" on public.attendance for select using (
  user_id = auth.uid()
  or exists (select 1 from public.events e where e.id = attendance.event_id and e.host_id = auth.uid())
);

-- Insert path 1: the host invites someone (row created on behalf of another user).
create policy "attendance_insert_by_host" on public.attendance for insert with check (
  exists (select 1 from public.events e where e.id = event_id and e.host_id = auth.uid())
);

-- Insert path 2: a user self-RSVPs to a public event (no invite needed).
create policy "attendance_insert_self_public" on public.attendance for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.events e where e.id = event_id and e.visibility = 'public')
);

-- Only the invitee may change their own status; the host cannot flip someone else's RSVP.
create policy "attendance_update_own_status" on public.attendance for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "attendance_delete_own_or_host" on public.attendance for delete using (
  user_id = auth.uid()
  or exists (select 1 from public.events e where e.id = attendance.event_id and e.host_id = auth.uid())
);

-- friends
create table public.friends (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.friend_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> addressee_id),
  pair_key text generated always as (
    least(requester_id::text, addressee_id::text) || '_' || greatest(requester_id::text, addressee_id::text)
  ) stored,
  unique (pair_key)
);

create index friends_requester_idx on public.friends (requester_id);
create index friends_addressee_idx on public.friends (addressee_id);

alter table public.friends enable row level security;

create policy "friends_select_own" on public.friends for select using (
  requester_id = auth.uid() or addressee_id = auth.uid()
);
create policy "friends_insert_own_request" on public.friends for insert with check (
  requester_id = auth.uid()
);
create policy "friends_update_by_addressee" on public.friends for update
  using (addressee_id = auth.uid())
  with check (addressee_id = auth.uid());
create policy "friends_delete_own" on public.friends for delete using (
  requester_id = auth.uid() or addressee_id = auth.uid()
);

-- push_tokens: fully owner-restricted; server reads via service_role in edge functions,
-- intentionally bypassing RLS since that's the only legitimate way to read another user's token.
create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null,
  device_id text,
  platform text check (platform in ('ios', 'android', 'web')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, expo_push_token)
);

alter table public.push_tokens enable row level security;
create policy "push_tokens_all_own" on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- avatars storage bucket, carried over from the old project.
-- NOTE: policy is public-read / any-authenticated-write, same permissiveness as before (no
-- per-user folder scoping) because Avatar.tsx's upload path isn't namespaced by user id
-- (`${Date.now()}.${ext}`, flat). Tightening this to a real per-user path is a Phase 4 polish
-- item, not v1 schema work -- flagging so it isn't mistaken for already-fixed.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_read_all" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_insert_authenticated" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "avatars_update_authenticated" on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "avatars_delete_authenticated" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');
