-- Break the events <-> attendance RLS circular reference by moving the
-- cross-table membership checks into SECURITY DEFINER functions. These run
-- with the function owner's privileges, so their internal queries don't
-- re-trigger RLS on the other table -- which is what caused
-- "infinite recursion detected in policy for relation events".

create or replace function public.is_event_host(p_event_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from events e where e.id = p_event_id and e.host_id = p_user_id
  );
$$;

create or replace function public.is_event_attendee(p_event_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from attendance a where a.event_id = p_event_id and a.user_id = p_user_id
  );
$$;

drop policy if exists events_select on public.events;
create policy events_select on public.events
for select
using (
  visibility = 'public'::event_visibility
  or host_id = (select auth.uid())
  or public.is_event_attendee(events.id, (select auth.uid()))
);

drop policy if exists attendance_select on public.attendance;
create policy attendance_select on public.attendance
for select
using (
  user_id = (select auth.uid())
  or public.is_event_host(attendance.event_id, (select auth.uid()))
);

drop policy if exists attendance_insert on public.attendance;
create policy attendance_insert on public.attendance
for insert
with check (
  public.is_event_host(attendance.event_id, (select auth.uid()))
  or (
    user_id = (select auth.uid())
    and exists (
      select 1 from events e where e.id = attendance.event_id and e.visibility = 'public'::event_visibility
    )
  )
);

drop policy if exists attendance_delete_own_or_host on public.attendance;
create policy attendance_delete_own_or_host on public.attendance
for delete
using (
  user_id = (select auth.uid())
  or public.is_event_host(attendance.event_id, (select auth.uid()))
);
