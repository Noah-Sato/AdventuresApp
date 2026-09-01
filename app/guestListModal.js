import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { View, FlatList, TouchableOpacity } from 'react-native';

import { useAuth } from '~/contexts/AuthProvider';
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { UserIcon } from '@components/userIcons';
import { SquareButton } from '@components/Buttons';
import { Text } from '@components/Text'

import { mainStyles, bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { useEvent } from '@hooks/useEvents'
import { useEventAttendees, useInviteFriends } from '@hooks/useAttendance'
import { useFriends } from '@hooks/useFriends'

const statusColor = {
    going: 'green',
    declined: 'red',
    invited: 'white',
    maybe: 'white',
}

function AttendeeRow({ attendee }) {
    const colorGroup = cl[statusColor[attendee.status]] ?? cl.basic
    const borderColor = attendee.status === 'declined' || attendee.status === 'going'
        ? colorGroup.light_thirty
        : cl.basic.white

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: l.spacing.s, paddingVertical: l.spacing.xs }}>
            <UserIcon userImage={attendee.profile.avatar_url} size={'small'} borderColor={borderColor} />
            <Text style={[bS.body2, { color: cl.basic.white }]}>{attendee.profile.full_name ?? attendee.profile.username}</Text>
            <Text style={[bS.body3, { color: cl.grey.eighty }]}>{attendee.status}</Text>
        </View>
    )
}

export default function Page() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();
    const { event } = useEvent(id);
    const { attendees, refetch: refetchAttendees } = useEventAttendees(id);
    const { friends } = useFriends();
    const { inviteFriends } = useInviteFriends();

    const [selected, setSelected] = useState([]);
    const [inviting, setInviting] = useState(false);

    const isHost = event && session?.user.id === event.host_id;

    const invitableFriends = useMemo(() => {
        const alreadyInvited = new Set(attendees.map((a) => a.user_id));
        return friends.filter((f) => !alreadyInvited.has(f.profile.id));
    }, [friends, attendees]);

    const toggleSelected = (friendId) => {
        setSelected((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
        );
    };

    const onInvite = async () => {
        if (selected.length === 0) return;
        setInviting(true);
        await inviteFriends(id, selected);
        setSelected([]);
        setInviting(false);
        refetchAttendees();
    };

    return(
        <View style={[mainStyles.page, { height: l.screen.height }]}>
            <View style={{ paddingBottom: l.spacing.xl, paddingHorizontal: l.margins.page }}>
                <PageHeader close={true} onClosePress={()=>{router.navigate('../')}} label={'Guest List'}/>
            </View>

            <View style={{ paddingHorizontal: l.margins.page, gap: l.spacing.s }}>
                <Text style={[bS.h6, { color: cl.basic.white }]}>{'Guests'}</Text>
                <FlatList
                    data={attendees}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <AttendeeRow attendee={item} />}
                    ListEmptyComponent={
                        <Text style={[bS.body2, { color: cl.grey.eighty }]}>{'No one invited yet.'}</Text>
                    }
                />

                {isHost && (
                    <View style={{ paddingTop: l.spacing.l, gap: l.spacing.s }}>
                        <Text style={[bS.h6, { color: cl.basic.white }]}>{'Invite friends'}</Text>
                        <FlatList
                            data={invitableFriends}
                            keyExtractor={(item) => item.profile.id}
                            renderItem={({ item }) => {
                                const isSelected = selected.includes(item.profile.id);
                                return (
                                    <TouchableOpacity
                                        onPress={() => toggleSelected(item.profile.id)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: l.spacing.xs,
                                        }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: l.spacing.s }}>
                                            <UserIcon userImage={item.profile.avatar_url} size={'small'} />
                                            <Text style={[bS.body2, { color: cl.basic.white }]}>
                                                {item.profile.full_name ?? item.profile.username}
                                            </Text>
                                        </View>
                                        <Text style={[bS.body3, { color: isSelected ? cl.green.light_thirty : cl.grey.eighty }]}>
                                            {isSelected ? 'Selected' : 'Select'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            ListEmptyComponent={
                                <Text style={[bS.body2, { color: cl.grey.eighty }]}>{'All your friends are already invited.'}</Text>
                            }
                        />

                        {selected.length > 0 && (
                            <View style={{ alignItems: 'center', paddingTop: l.spacing.s }}>
                                <SquareButton
                                    label={inviting ? 'Inviting...' : `Invite ${selected.length}`}
                                    fill={true}
                                    size={'medium'}
                                    onPress={onInvite}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    )
}
