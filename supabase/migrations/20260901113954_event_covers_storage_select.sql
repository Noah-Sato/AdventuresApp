-- event-covers uploads were failing RLS ("new row violates row-level security policy")
-- even though the insert/update policies correctly permit the host: the bucket had no
-- SELECT policy on storage.objects, and Supabase Storage's upload response reads the
-- written row back (RETURNING-style), which Postgres RLS gates on a SELECT policy
-- independently of the INSERT/UPDATE policy that already passed. event-photos already
-- has this (event_photos_storage_select) -- event-covers never did.
-- Bucket is public (same tier as avatars): open select, no per-row gating needed.
create policy "event_covers_storage_select" on storage.objects for select using (
  bucket_id = 'event-covers'
);
