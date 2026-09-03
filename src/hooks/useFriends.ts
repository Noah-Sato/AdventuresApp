import { useCallback, useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import type { Friend, Profile } from '@schema/db';

export type FriendWithProfile = Friend & { profile: Profile };

type FriendRow = Friend & { requester: Profile; addressee: Profile };

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendWithProfile[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendWithProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('friends')
      .select(
        '*, requester:profiles!friends_requester_id_fkey(*), addressee:profiles!friends_addressee_id_fkey(*)'
      )
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!error && data) {
      const withOtherProfile: FriendWithProfile[] = (data as FriendRow[]).map((row) => ({
        ...row,
        profile: row.requester_id === user.id ? row.addressee : row.requester,
      }));

      setFriends(withOtherProfile.filter((r) => r.status === 'accepted'));
      setIncomingRequests(
        withOtherProfile.filter((r) => r.status === 'pending' && r.addressee_id === user.id)
      );
      setOutgoingRequests(
        withOtherProfile.filter((r) => r.status === 'pending' && r.requester_id === user.id)
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const sendRequest = async (addresseeId: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('friends')
      .insert({ requester_id: user.id, addressee_id: addresseeId });
    if (!error) await fetchFriends();
    return { error };
  };

  const acceptRequest = async (friendRowId: string) => {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', friendRowId);
    if (!error) await fetchFriends();
    return { error };
  };

  // Declining an incoming request and removing an existing friend are both a delete --
  // RLS allows either party to delete a row regardless of status.
  const removeFriend = async (friendRowId: string) => {
    const { error } = await supabase.from('friends').delete().eq('id', friendRowId);
    if (!error) await fetchFriends();
    return { error };
  };

  return {
    friends,
    incomingRequests,
    outgoingRequests,
    loading,
    sendRequest,
    acceptRequest,
    declineRequest: removeFriend,
    removeFriend,
    refetch: fetchFriends,
  };
}

export function useUserSearch() {
  const { user } = useAuth();

  const search = useCallback(
    async (query: string): Promise<Profile[]> => {
      if (!query || query.length < 2) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .neq('id', user?.id ?? '')
        .limit(20);
      return error || !data ? [] : (data as Profile[]);
    },
    [user]
  );

  return { search };
}
