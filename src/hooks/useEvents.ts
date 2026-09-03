import { useCallback, useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-expo';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import type { Event, Profile } from '@schema/db';
import type { TablesInsert } from '@schema/supabase';
import { extFromAsset } from '../utilities';
import * as ImagePicker from "expo-image-picker";

export type NewEvent = Omit<TablesInsert<'events'>, 'host_id'>;
export type EventWithHost = Event & { host: Profile };

// Events hosted by the current user.
export function useMyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('host_id', user.id)
      .order('start_date', { ascending: true });
    if (!error && data) setEvents(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return { events, loading, refetch: fetchMyEvents };
}

// Events the current user is invited to or attending (any attendance row, any status).
export function useUpcomingEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUpcoming = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('events(*)')
      .eq('user_id', user.id)
      .order('start_date', { foreignTable: 'events', ascending: true })
      .returns<{ events: Event | null }[]>();
    if (!error && data) {
      setEvents(data.map((row) => row.events).filter((e): e is Event => e !== null));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  return { events, loading, refetch: fetchUpcoming };
}

// Public events to browse on Home -- distinct from useUpcomingEvents (which is scoped to events
// you already have an attendance row on). Excludes events already in that set so the two Home
// sections don't show duplicate cards; needs pagination as public events accumulate.
export function usePublicEvents(excludeIds: string[] = [], limit = 20) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPublic = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*')
      .eq('visibility', 'public')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }
    const { data, error } = await query;
    if (!error && data) setEvents(data);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, excludeIds.join(',')]);

  useEffect(() => {
    fetchPublic();
  }, [fetchPublic]);

  return { events, loading, refetch: fetchPublic };
}

export function useEvent(id: string | undefined) {
  const [event, setEvent] = useState<EventWithHost | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*, host:profiles!events_host_id_fkey(*)')
      .eq('id', id)
      .single();
    if (!error) setEvent(data as EventWithHost);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, refetch: fetchEvent };
}

export function useCreateEvent() {
  const { user } = useAuth();
  const { client } = useChatContext();

  const createEvent = async (newEvent: NewEvent) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('events')
      .insert({ ...newEvent, host_id: user.id })
      .select()
      .single();

    if (error || !data) return { data, error };

    // Hosts always count as 'going' -- otherwise they couldn't post to their own event's
    // photo feed, which is gated on going-attendee status. Not fatal if this fails.
    try {
      await supabase
        .from('attendance')
        .insert({ event_id: data.id, user_id: user.id, status: 'going', responded_at: new Date().toISOString() });
    } catch (attendanceError) {
      console.log('Failed to create host attendance row', attendanceError);
    }

    // Every event gets a Stream channel keyed by its own id, host as the first member.
    // Not fatal if this fails -- the event itself is already created.
    try {
      const channel = client.channel('messaging', data.id, {
        name: data.title,
        members: [user.id],
      });
      await channel.create();
    } catch (channelError) {
      console.log('Failed to create event channel', channelError);
    }

    return { data, error };
  };

  return { createEvent };
}

// Host-only cover + up to 2 description photos -- event-listing content, entirely separate from
// the attendee feed (event_photos). Public bucket (event-covers), no attendee-status/window
// gating -- just the existing events_update_own policy. "Before start" is enforced client-side
// only (the edit screen hides itself once the event starts), not at the RLS layer, since this
// isn't a shared-space security boundary the way feed posting is.
export function useEventCoverPhotos() {
  const uploadCover = async (eventId: string, asset: ImagePicker.ImagePickerAsset) => {
    const arraybuffer = await fetch(asset.uri).then((res) => res.arrayBuffer());
    const ext = extFromAsset(asset)
    const path = `${eventId}/cover.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('event-covers')
      .upload(path, arraybuffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: true });
    if (uploadError) return { error: uploadError };

    const { data: urlData } = supabase.storage.from('event-covers').getPublicUrl(path);
    const { error } = await supabase
      .from('events')
      .update({ image_url: urlData.publicUrl })
      .eq('id', eventId);
    return { error };
  };

  const uploadDescriptionImage = async (
    eventId: string,
    slot: 0 | 1,
    asset: ImagePicker.ImagePickerAsset,
    currentImages: string[] | null
  ) => {
    const arraybuffer = await fetch(asset.uri).then((res) => res.arrayBuffer());
    const ext = extFromAsset(asset)
    const path = `${eventId}/description-${slot}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('event-covers')
      .upload(path, arraybuffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: true });
    if (uploadError) return { error: uploadError };

    const { data: urlData } = supabase.storage.from('event-covers').getPublicUrl(path);
    const next = [...(currentImages ?? [])];
    next[slot] = urlData.publicUrl;

    const { error } = await supabase
      .from('events')
      .update({ description_images: next.slice(0, 2) })
      .eq('id', eventId);
    return { error };
  };

  return { uploadCover, uploadDescriptionImage };
}
