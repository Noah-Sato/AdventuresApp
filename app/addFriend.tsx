import { useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { UserIcon } from '@components/userIcons';

import { useFriends, useUserSearch } from '@hooks/useFriends';
import type { Profile } from '@schema/db';

export default function AddFriendScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const { search } = useUserSearch();
  const { friends, outgoingRequests, sendRequest } = useFriends();

  const onChangeQuery = async (text: string) => {
    setQuery(text);
    setResults(await search(text));
  };

  const statusFor = (profileId: string) => {
    if (friends.some((f) => f.profile.id === profileId)) return 'friends';
    if (outgoingRequests.some((r) => r.profile.id === profileId)) return 'requested';
    return 'none';
  };

  return (
    <View style={[mainStyles.page]}>
      <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
        <PageHeader label={'Add Friend'} close={true} onClosePress={() => router.navigate('../')} />
      </View>

      <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.m }}>
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder={'Search by username'}
          placeholderTextColor={cl.grey.eighty}
          autoCapitalize={'none'}
          style={{
            borderWidth: l.spacing.xs3,
            borderColor: cl.basic.white,
            borderRadius: l.spacing.xs,
            paddingHorizontal: l.spacing.s,
            paddingVertical: l.spacing.s,
            color: cl.basic.white,
            fontFamily: 'tenor-sans',
          }}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = statusFor(item.id);
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: l.spacing.s,
                paddingHorizontal: l.margins.page,
                gap: l.spacing.s,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: l.spacing.s, flex: 1 }}>
                <TouchableOpacity onPress={() => {
                  const otherId = item.id
                  if (otherId) router.push(`./app/user/${otherId}`);
                }}>
                  <UserIcon userImage={item.avatar_url} size={'small'} />
                  <Text numberOfLines={1} style={[bS.body2, { color: cl.basic.white, flexShrink: 1 }]}>
                    {item.full_name ?? item.username}
                  </Text>
                </TouchableOpacity>
              </View>
              {status === 'none' && (
                <TouchableOpacity onPress={() => sendRequest(item.id)}>
                  <Text style={[bS.body3, { color: cl.red.light_thirty }]}>{'Add'}</Text>
                </TouchableOpacity>
              )}
              {status === 'requested' && (
                <Text style={[bS.body3, { color: cl.grey.eighty }]}>{'Requested'}</Text>
              )}
              {status === 'friends' && (
                <Text style={[bS.body3, { color: cl.grey.eighty }]}>{'Friends'}</Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          query.length >= 2 ? (
            <Text style={[bS.body2, { color: cl.grey.eighty, paddingHorizontal: l.margins.page }]}>
              {'No users found.'}
            </Text>
          ) : null
        }
      />
    </View>
  );
}
