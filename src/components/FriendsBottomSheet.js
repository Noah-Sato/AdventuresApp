import { forwardRef, useCallback, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import cl from '@theme/Colours'
import l from '@theme/Layout'
import { bS } from '@theme/Styles'

import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';
import { UserIcon } from '@components/userIcons';
import { useFriends } from '@hooks/useFriends';

// Dummy shape of `friends` from useFriends() -- matches FriendWithProfile[] (friends row + joined `profile`).
// Swap the `data={friends}` prop below for `data={DUMMY_FRIENDS}` to design against this.
const DUMMY_FRIENDS = [
    {
        id: 'f1a2b3c4-0001-4a1a-9c1a-000000000001',
        requester_id: 'u-current-user-0000000000000001',
        addressee_id: 'u-friend-000000000000000000001',
        status: 'accepted',
        pair_key: null,
        created_at: '2026-06-01T12:00:00.000Z',
        responded_at: '2026-06-01T12:05:00.000Z',
        profile: {
            id: 'u-friend-000000000000000000001',
            username: 'jsmith',
            full_name: 'Jamie Smith',
            avatar_url: 'https://i.pravatar.cc/150?img=1',
            website: null,
            updated_at: '2026-06-01T12:00:00.000Z',
        },
    },
    {
        id: 'f1a2b3c4-0002-4a1a-9c1a-000000000002',
        requester_id: 'u-friend-000000000000000000002',
        addressee_id: 'u-current-user-0000000000000001',
        status: 'accepted',
        pair_key: null,
        created_at: '2026-06-03T09:30:00.000Z',
        responded_at: '2026-06-03T10:00:00.000Z',
        profile: {
            id: 'u-friend-000000000000000000002',
            username: 'taylor_r',
            full_name: 'Taylor Rodriguez',
            avatar_url: 'https://i.pravatar.cc/150?img=2',
            website: null,
            updated_at: '2026-06-03T09:30:00.000Z',
        },
    },
    {
        id: 'f1a2b3c4-0003-4a1a-9c1a-000000000003',
        requester_id: 'u-current-user-0000000000000001',
        addressee_id: 'u-friend-000000000000000000003',
        status: 'accepted',
        pair_key: null,
        created_at: '2026-06-10T18:45:00.000Z',
        responded_at: '2026-06-10T19:00:00.000Z',
        profile: {
            id: 'u-friend-000000000000000000003',
            username: 'morgan99',
            full_name: null, // some profiles have no full_name -- item falls back to username
            avatar_url: null, // some have no avatar -- UserIcon should handle null
            website: null,
            updated_at: '2026-06-10T18:45:00.000Z',
        },
    },
];

const FriendsBottomSheet = forwardRef(function FriendsBottomSheet({ selectedIds = [], onDone }, ref) {
    const { friends } = useFriends();
    const [selected, setSelected] = useState(selectedIds);

    const toggleFriend = useCallback((profileId) => {
        setSelected((current) => (
            current.includes(profileId)
                ? current.filter((id) => id !== profileId)
                : [...current, profileId]
        ));
    }, []);

    const handleDone = useCallback(() => {
        onDone?.(selected);
        ref?.current?.close();
    }, [onDone, selected, ref]);


    const FriendItem = ({ data }) => {
        const isSelected = selected.includes(data.profile.id)
        return (
                        <TouchableOpacity style={styles.row} onPress={() => toggleFriend(data.profile.id)}>
                            <UserIcon userImage={data.profile.avatar_url} size={'small'} />
                            <Text numberOfLines={1} style={[bS.body2, { color: cl.basic.black, flex: 1 }]}>
                                {data.profile.full_name ?? data.profile.username}
                            </Text>
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]} />
                        </TouchableOpacity>
                    )
    }




    
    return (
        <BottomSheet ref={ref} index={-1} snapPoints={['60%']} enablePanDownToClose>
            <BottomSheetView style={styles.header}>
                <Text style={[bS.h5, { color: cl.basic.white }]}>{'Invite Friends'}</Text>
            </BottomSheetView>
            <BottomSheetFlatList
                style={{
                    
                    
                }}
                data={DUMMY_FRIENDS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const isSelected = selected.includes(item.profile.id)
                    return (
                        <FriendItem data={item}/>
                    )
                }}
                ListEmptyComponent={
                    <Text style={[bS.body2, { color: cl.grey.eighty, textAlign: 'center', paddingTop: l.spacing.l }]}>
                        {'No friends to invite yet'}
                    </Text>
                }
            />

            <BottomSheetView style={styles.footer}>
                <SquareButton label={'Done'} fill={true} size={'medium'} full={true} onPress={handleDone} />
            </BottomSheetView>
        </BottomSheet>
    );
});

export default FriendsBottomSheet;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: l.margins.page,
        paddingBottom: l.spacing.s,
    },
    listContent: {
        paddingHorizontal: l.margins.page,
        paddingBottom: l.spacing.l,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: l.spacing.s,
        paddingVertical: l.spacing.xs,
    },
    checkbox: {
        width: l.spacing.m,
        height: l.spacing.m,
        borderRadius: l.roundness.xs2,
        borderWidth: l.spacing.xs3,
        borderColor: cl.basic.black,
    },
    checkboxSelected: {
        backgroundColor: cl.green.light_thirty,
    },
    footer: {
        paddingHorizontal: l.margins.page,
        paddingBottom: l.spacing.l,
    },
})
