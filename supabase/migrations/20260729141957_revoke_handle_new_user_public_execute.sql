-- Postgres grants EXECUTE to the PUBLIC pseudo-role by default on function creation; revoking
-- from anon/authenticated directly doesn't remove that ambient grant, so the advisor still
-- flagged handle_new_user() as callable. Revoke from PUBLIC itself.
revoke execute on function public.handle_new_user() from public;
