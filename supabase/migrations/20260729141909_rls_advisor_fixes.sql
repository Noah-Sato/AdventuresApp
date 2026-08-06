-- Advisor follow-ups after the initial schema migration:
-- 1) wrap auth.uid() as (select auth.uid()) so it's evaluated once per query, not once per row
-- 2) merge the two attendance INSERT policies into one (same two conditions, fewer policy evals)
-- 3) drop the avatars bucket's SELECT policy -- public buckets serve object URLs without it,
--    and a broad SELECT policy on storage.objects allows listing every file in the bucket
-- 4) handle_new_user() is only meant to run via the auth.users trigger, not be called directly
--    over the REST RPC endpoint -- revoke public execute

drop policy "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check ((select auth.uid()) = id);

drop policy "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using ((select auth.uid()) = id);

drop policy "events_select" on public.events;
create policy "events_select" on public.events for select using (
  visibility = 'public'
  or host_id = (select auth.uid())
  or exists (
    select 1 from public.attendance a
    where a.event_id = events.id and a.user_id = (select auth.uid())
  )
);

drop policy "events_insert_own" on public.events;
create policy "events_insert_own" on public.events for insert with check ((select auth.uid()) = host_id);

drop policy "events_update_own" on public.events;
create policy "events_update_own" on public.events for update using ((select auth.uid()) = host_id);

drop policy "events_delete_own" on public.events;
create policy "events_delete_own" on public.events for delete using ((select auth.uid()) = host_id);

drop policy "attendance_select" on public.attendance;
create policy "attendance_select" on public.attendance for select using (
  user_id = (select auth.uid())
  or exists (select 1 from public.events e where e.id = attendance.event_id and e.host_id = (select auth.uid()))
);

drop policy "attendance_insert_by_host" on public.attendance;
drop policy "attendance_insert_self_public" on public.attendance;
create policy "attendance_insert" on public.attendance for insert with check (
  exists (select 1 from public.events e where e.id = event_id and e.host_id = (select auth.uid()))
  or (
    user_id = (select auth.uid())
    and exists (select 1 from public.events e where e.id = event_id and e.visibility = 'public')
  )
);

drop policy "attendance_update_own_status" on public.attendance;
create policy "attendance_update_own_status" on public.attendance for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy "attendance_delete_own_or_host" on public.attendance;
create policy "attendance_delete_own_or_host" on public.attendance for delete using (
  user_id = (select auth.uid())
  or exists (select 1 from public.events e where e.id = attendance.event_id and e.host_id = (select auth.uid()))
);

drop policy "friends_select_own" on public.friends;
create policy "friends_select_own" on public.friends for select using (
  requester_id = (select auth.uid()) or addressee_id = (select auth.uid())
);

drop policy "friends_insert_own_request" on public.friends;
create policy "friends_insert_own_request" on public.friends for insert with check (
  requester_id = (select auth.uid())
);

drop policy "friends_update_by_addressee" on public.friends;
create policy "friends_update_by_addressee" on public.friends for update
  using (addressee_id = (select auth.uid()))
  with check (addressee_id = (select auth.uid()));

drop policy "friends_delete_own" on public.friends;
create policy "friends_delete_own" on public.friends for delete using (
  requester_id = (select auth.uid()) or addressee_id = (select auth.uid())
);

drop policy "push_tokens_all_own" on public.push_tokens;
create policy "push_tokens_all_own" on public.push_tokens for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy "avatars_read_all" on storage.objects;

revoke execute on function public.handle_new_user() from anon, authenticated;
