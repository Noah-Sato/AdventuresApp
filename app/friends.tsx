import { View, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { UserIcon } from '@components/userIcons';
import { SquareButton } from '@components/Buttons';

import { useFriends, type FriendWithProfile } from '@hooks/useFriends';

function RequestRow({
  request,
  onAccept,
  onDecline,
}: {
  request: FriendWithProfile;
  onAccept: () => void;
  onDecline: () => void;
}) {
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
        <UserIcon userImage={request.profile.avatar_url} size={'small'} />
        <Text numberOfLines={1} style={[bS.body2, { color: cl.basic.white, flexShrink: 1 }]}>
          {request.profile.full_name ?? request.profile.username}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: l.spacing.s }}>
        <TouchableOpacity onPress={onAccept}>
          <Text style={[bS.body3, { color: cl.green.light_thirty }]}>{'Accept'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDecline}>
          <Text style={[bS.body3, { color: cl.red.light_thirty }]}>{'Decline'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FriendRow({ friend }: { friend: FriendWithProfile }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: l.spacing.s,
        paddingVertical: l.spacing.s,
        paddingHorizontal: l.margins.page,
      }}>
      <UserIcon userImage={friend.profile.avatar_url} size={'small'} />
      <Text style={[bS.body2, { color: cl.basic.white }]}>
        {friend.profile.full_name ?? friend.profile.username}
      </Text>
    </View>
  );
}

export default function FriendsScreen() {
  const { friends, incomingRequests, acceptRequest, removeFriend, loading } = useFriends();

  return (
    <View style={[mainStyles.page]}>
      <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.s }}>
        <PageHeader label={'Friends'} back={true} onBackPress={() => router.navigate('../')} />
      </View>
      <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
        <SquareButton
          label={'Add Friend'}
          size={'small'}
          fill={true}
          onPress={() => router.navigate('/addFriend')}
        />
      </View>

      {incomingRequests.length > 0 && (
        <View style={{ paddingBottom: l.spacing.m }}>
          <Text
            style={[
              bS.body3,
              { color: cl.grey.eighty, paddingHorizontal: l.margins.page, paddingBottom: l.spacing.xs },
            ]}>
            {'Requests'}
          </Text>
          <FlatList
            data={incomingRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RequestRow
                request={item}
                onAccept={() => acceptRequest(item.id)}
                onDecline={() => removeFriend(item.id)}
              />
            )}
          />
        </View>
      )}

      <Text
        style={[
          bS.body3,
          { color: cl.grey.eighty, paddingHorizontal: l.margins.page, paddingBottom: l.spacing.xs },
        ]}>
        {'Friends'}
      </Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendRow friend={item} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={[bS.body2, { color: cl.grey.eighty, paddingHorizontal: l.margins.page }]}>
              {'No friends yet -- tap the icon above to add some.'}
            </Text>
          ) : null
        }
      />
    </View>
  );
}
