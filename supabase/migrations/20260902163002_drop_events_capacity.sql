-- capacity was added to the schema at initial_schema.sql but the create-event UI never
-- built a field for it -- confirmed zero references anywhere in app/ or src/. Dropping
-- rather than building it out, per product decision.
alter table public.events drop column capacity;
