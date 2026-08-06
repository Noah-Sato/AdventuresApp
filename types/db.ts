import { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
export type Friend = Database["public"]["Tables"]["friends"]["Row"];
export type PushToken = Database["public"]["Tables"]["push_tokens"]["Row"];
export type EventPhoto = Database["public"]["Tables"]["event_photos"]["Row"];
