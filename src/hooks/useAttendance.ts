import { useCallback, useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-expo';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import type { Attendance, Profile } from '@schema/db';
import type { Enums } from '@schema/supabase';

export type AttendeeWithProfile = Attendance & { profile: Profile };

// All attendance rows (invited/going/maybe/declined) for an event, with the attendee's profile.
export function useEventAttendees(eventId: string | undefined) {
  const [attendees, setAttendees] = useState<AttendeeWithProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendees = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('*, profile:profiles!attendance_user_id_fkey(*)')
      .eq('event_id', eventId);
    if (!error && data) setAttendees(data as AttendeeWithProfile[]);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  return { attendees, loading, refetch: fetchAttendees };
}

// The current user's own attendance row for an event (null if not invited/attending at all).
export function useMyAttendance(eventId: string | undefined) {
  const { user } = useAuth();
  const { client } = useChatContext();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMine = useCallback(async () => {
    if (!eventId || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!error) setAttendance(data);
    setLoading(false);
  }, [eventId, user]);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const respond = async (status: Enums<'attendance_status'>) => {
    if (!eventId || !user) return { error: new Error('Not authenticated') };

    if (attendance) {
      const { error } = await supabase
        .from('attendance')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', attendance.id);
      if (!error) await fetchMine();
      return { error };
    }

    // No existing row (self-RSVP to a public event) -- insert directly at the target status.
    const { error } = await supabase
      .from('attendance')
      .insert({ event_id: eventId, user_id: user.id, status, responded_at: new Date().toISOString() });

    if (!error) {
      await fetchMine();
      try {
        await client.channel('messaging', eventId).addMembers([user.id]);
      } catch (channelError) {
        console.log('Failed to join event channel', channelError);
      }
    }
    return { error };
  };

  return { attendance, loading, respond, refetch: fetchMine };
}

// Host-side: invite a set of friends to an event (creates 'invited' attendance rows and adds
// them to the event's Stream channel -- the host is already a member so has permission to do
// the latter, unlike an invitee trying to add themselves before accepting).
export function useInviteFriends() {
  const { user } = useAuth();
  const { client } = useChatContext();

  const inviteFriends = async (eventId: string | undefined, friendUserIds: string[]) => {
    if (!eventId || !user || friendUserIds.length === 0) return { error: null };
    const rows = friendUserIds.map((userId) => ({
      event_id: eventId,
      user_id: userId,
      status: 'invited' as const,
      invited_by: user.id,
    }));
    const { error } = await supabase.from('attendance').insert(rows);

    if (!error) {
      try {
        await client.channel('messaging', eventId).addMembers(friendUserIds);
      } catch (channelError) {
        console.log('Failed to add invitees to event channel', channelError);
      }
    }

    return { error };
  };

  return { inviteFriends };
}
