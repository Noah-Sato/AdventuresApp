drop policy "Anyone can upload an avatar." on "storage"."objects";

drop policy "Avatar images are publicly accessible." on "storage"."objects";

drop policy "Avatars are publicly deletable 1oj01fe_0" on "storage"."objects";

create policy "Enable access for all users"
on "storage"."buckets"
as permissive
for all
to public;


create policy "Enable read access for all users"
on "storage"."objects"
as permissive
for all
to public
using (true);


create policy "Give Access to All 1oj01fe_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Give Access to All 1oj01fe_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Give Access to All 1oj01fe_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'avatars'::text));


create policy "Give Access to All 1oj01fe_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'avatars'::text));



