alter table "public"."attendance" drop column "comfirmed";

alter table "public"."attendance" add column "confirmed" boolean;


