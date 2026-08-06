-- Event photo feed (the FOMO mechanic) + cover/description photos + host-auto-going support.
--
-- Two distinct photo concepts, don't conflate them:
-- 1. event_photos: the attendee feed. Only 'going' attendees (host included) can post, only
--    within a window from 2h before start_date through ~24h after the event ends. Visible to
--    anyone with ANY attendance row on the event, indefinitely -- this is what makes decliners
--    see what they missed.
-- 2. events.image_url (existing) + events.description_images (new): host-only cover/description
--    photos, editable any time before the event starts. No attendee-status or window gating --
--    just the existing events_update_own policy. Client-side-only "before start" UX gate, not
--    RLS-enforced, since this isn't a shared-space security boundary the way posting is.

alter table public.events
  add column description_images text[]
  check (coalesce(array_length(description_images, 1), 0) <= 2);

create table public.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  posted_by uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

create index event_photos_event_id_idx on public.event_photos (event_id);
create index event_photos_created_at_idx on public.event_photos (created_at desc);

alter table public.event_photos enable row level security;

-- window_start = start_date - 2h, window_end = coalesce(end_date, start_date + 4h) + 24h
create policy "event_photos_insert" on public.event_photos for insert with check (
  now() between
    (select e.start_date - interval '2 hours' from public.events e where e.id = event_id)
    and
    (select coalesce(e.end_date, e.start_date + interval '4 hours') + interval '24 hours' from public.events e where e.id = event_id)
  and (
    exists (select 1 from public.events e where e.id = event_id and e.host_id = (select auth.uid()))
    or exists (
      select 1 from public.attendance a
      where a.event_id = event_photos.event_id and a.user_id = (select auth.uid()) and a.status = 'going'
    )
  )
);

create policy "event_photos_select" on public.event_photos for select using (
  exists (select 1 from public.events e where e.id = event_id and e.host_id = (select auth.uid()))
  or exists (
    select 1 from public.attendance a
    where a.event_id = event_photos.event_id and a.user_id = (select auth.uid())
  )
);

-- Deletion is time-based, not content-based: a host can delete their event any time before it
-- starts (cover/description photos existing doesn't block this), but once start_date has passed
-- the event can no longer be deleted at all -- simpler than gating on event_photos existing, and
-- has the same practical effect since feed posts can't exist before shortly before start_date.
drop policy "events_delete_own" on public.events;
create policy "events_delete_own" on public.events for delete using (
  (select auth.uid()) = host_id and start_date > now()
);

-- Backfill: events created before this migration have no attendance row for their host at all
-- (the auto-going-row fix landed in application code alongside this migration). Insert -- for
-- attendee-list/guest-count consistency, not strictly required since the insert policy above
-- already OR's in host_id directly rather than depending on this row existing.
insert into public.attendance (event_id, user_id, status, responded_at)
select e.id, e.host_id, 'going', e.created_at
from public.events e
where not exists (
  select 1 from public.attendance a where a.event_id = e.id and a.user_id = e.host_id
);

-- event-photos storage bucket: PRIVATE (not public like avatars) -- visibility must follow the
-- same "any attendance row" rule as the table, which a public bucket's direct-URL access would
-- bypass entirely. The app must use createSignedUrl(), not getPublicUrl(), for this bucket.
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', false)
on conflict (id) do nothing;

create policy "event_photos_storage_insert" on storage.objects for insert with check (
  bucket_id = 'event-photos'
  and exists (
    select 1 from public.events e
    where e.id = (storage.foldername(name))[1]::uuid
      and now() between (e.start_date - interval '2 hours')
        and (coalesce(e.end_date, e.start_date + interval '4 hours') + interval '24 hours')
      and (
        e.host_id = (select auth.uid())
        or exists (
          select 1 from public.attendance a
          where a.event_id = e.id and a.user_id = (select auth.uid()) and a.status = 'going'
        )
      )
  )
);

create policy "event_photos_storage_select" on storage.objects for select using (
  bucket_id = 'event-photos'
  and exists (
    select 1 from public.events e
    where e.id = (storage.foldername(name))[1]::uuid
      and (
        e.host_id = (select auth.uid())
        or exists (
          select 1 from public.attendance a
          where a.event_id = e.id and a.user_id = (select auth.uid())
        )
      )
  )
);

-- event-covers storage bucket: host-only cover/description photos. Public is fine here (same
-- permissiveness tier as avatars) since these are meant to be visible wherever the event itself
-- is visible, and events_select already governs who can see the event row referencing them.
insert into storage.buckets (id, name, public)
values ('event-covers', 'event-covers', true)
on conflict (id) do nothing;

create policy "event_covers_storage_insert" on storage.objects for insert with check (
  bucket_id = 'event-covers'
  and exists (
    select 1 from public.events e
    where e.id = (storage.foldername(name))[1]::uuid
      and e.host_id = (select auth.uid())
  )
);

create policy "event_covers_storage_update" on storage.objects for update using (
  bucket_id = 'event-covers'
  and exists (
    select 1 from public.events e
    where e.id = (storage.foldername(name))[1]::uuid
      and e.host_id = (select auth.uid())
  )
);
