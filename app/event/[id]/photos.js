import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { SquareButton } from '@components/Buttons';

import { useEvent } from '@hooks/useEvents';
import { useMyAttendance } from '@hooks/useAttendance';
import { useEventPhotos, usePostEventPhoto } from '@hooks/useEventPhotos';
import { useAuth } from '~/contexts/AuthProvider';

// UX-only mirror of the RLS posting window -- RLS is the real enforcement boundary.
function isWithinPostingWindow(event) {
    if (!event) return false
    const now = new Date()
    const start = new Date(event.start_date)
    const windowStart = new Date(start.getTime() - 2 * 60 * 60 * 1000)
    const end = event.end_date ? new Date(event.end_date) : new Date(start.getTime() + 4 * 60 * 60 * 1000)
    const windowEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000)
    return now >= windowStart && now <= windowEnd
}

export function PhotoGrid({ photos, numColumns = 3 }) {
    return (
        <FlatList
            data={photos}
            numColumns={numColumns}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                item.signedUrl ? (
                    <Image
                        source={{ uri: item.signedUrl }}
                        style={{ width: l.screen.width / numColumns, height: l.screen.width / numColumns }}
                        resizeMode={'cover'}
                    />
                ) : null
            )}
            ListEmptyComponent={
                <Text style={[bS.body2, { color: cl.grey.eighty, paddingHorizontal: l.margins.page }]}>
                    {'No photos yet.'}
                </Text>
            }
        />
    )
}

export default function EventPhotosScreen() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();
    const { event } = useEvent(id);
    const { attendance } = useMyAttendance(id);
    const { photos, loading, refetch } = useEventPhotos(id);
    const { postPhoto } = usePostEventPhoto();
    const [posting, setPosting] = useState(false);

    const isHost = event && session?.user.id === event.host_id;
    const canPost = (isHost || attendance?.status === 'going') && isWithinPostingWindow(event);

    const onPost = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.length) return;

        setPosting(true);
        const { error } = await postPhoto(id, result.assets[0].uri);
        setPosting(false);

        if (error) {
            Alert.alert(error.message);
            return;
        }
        refetch();
    };

    if (loading) {
        return (
            <View style={{ height: l.screen.height, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <View style={[mainStyles.page, { height: l.screen.height }]}>
            <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
                <PageHeader label={'Photos'} back={true} onBackPress={() => router.navigate('../')} />
            </View>

            {canPost && (
                <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.m, alignItems: 'center' }}>
                    <SquareButton
                        label={posting ? 'Posting...' : 'Post a Photo'}
                        fill={true}
                        size={'medium'}
                        onPress={onPost}
                    />
                </View>
            )}

            <PhotoGrid photos={photos} />
        </View>
    )
}
