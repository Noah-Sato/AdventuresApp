import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import type { EventPhoto } from '@schema/db';
import * as ImagePicker from 'expo-image-picker';
import { extFromAsset } from '../utilities';

// The event-photos bucket is private (unlike avatars) -- visibility must follow the same
// "any attendance row" rule as the table, which a public bucket's direct-URL access would
// bypass entirely. So every read path needs a signed URL, not getPublicUrl().
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type EventPhotoWithUrl = EventPhoto & { signedUrl: string | null };
export type EventPhotoWithContext = EventPhotoWithUrl & { event: { title: string } | null };

async function attachSignedUrls<T extends EventPhoto>(
  photos: T[]
): Promise<(T & { signedUrl: string | null })[]> {
  if (photos.length === 0) return [];
  const { data } = await supabase.storage
    .from('event-photos')
    .createSignedUrls(
      photos.map((p) => p.image_url),
      SIGNED_URL_TTL_SECONDS
    );
  return photos.map((photo, i) => ({ ...photo, signedUrl: data?.[i]?.signedUrl ?? null }));
}

export function usePostEventPhoto() {
  const { user } = useAuth();

  const postPhoto = async (eventId: string, asset: ImagePicker.ImagePickerAsset) => {
    if (!user) return { error: new Error('Not authenticated') };

    const arraybuffer = await fetch(asset.uri).then((res) => res.arrayBuffer());
    const ext = extFromAsset(asset);
    const path = `${eventId}/${uuidv4()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('event-photos')
      .upload(path, arraybuffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}` });
    if (uploadError) return { error: uploadError };

    const { error } = await supabase
      .from('event_photos')
      .insert({ event_id: eventId, posted_by: user.id, image_url: path });
    return { error };
  };

  return { postPhoto };
}

// Per-event photo grid.
export function useEventPhotos(eventId: string | undefined) {
  const [photos, setPhotos] = useState<EventPhotoWithUrl[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    if (!error && data) setPhotos(await attachSignedUrls(data));
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, refetch: fetchPhotos };
}

// Home: unified cross-event feed. RLS's "any attendance row" select policy does the filtering --
// this only grows over time, so it's paginated (limit) from day one. Embeds the event's title
// so each feed item can show which event it's from -- the whole point of the mechanic is
// knowing exactly what you're missing, not just an anonymous photo stream.
export function useUnifiedPhotoFeed(limit = 30) {
  const [photos, setPhotos] = useState<EventPhotoWithContext[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_photos')
      .select('*, event:events(title)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (!error && data) setPhotos(await attachSignedUrls(data as unknown as EventPhotoWithContext[]));
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { photos, loading, refetch: fetchFeed };
}

// Profile "memory bank": going-only, a stricter subset than RLS's any-attendance rule, so it
// needs an explicit client-side filter rather than relying on the select policy alone.
export function useMemoryBankPhotos(limit = 60) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<EventPhotoWithUrl[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: goingRows, error: goingError } = await supabase
      .from('attendance')
      .select('event_id')
      .eq('user_id', user.id)
      .eq('status', 'going');

    if (goingError || !goingRows || goingRows.length === 0) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .in('event_id', goingRows.map((r) => r.event_id))
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data) setPhotos(await attachSignedUrls(data));
    setLoading(false);
  }, [user, limit]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return { photos, loading, refetch: fetchMemories };
}
