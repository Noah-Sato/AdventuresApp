import { useState } from 'react';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { View, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { SquareButton } from '@components/Buttons';

import { useAuth } from '~/contexts/AuthProvider';
import { useEvent, useEventCoverPhotos } from '@hooks/useEvents';

// This screen is reused for both "right after creating an event" and later edits -- the host
// can set cover/description photos at creation time or add them any time before the event
// starts. Scoped narrowly to just these photo fields, not full event editing.

function PhotoSlot({ label, url, onPick, uploading }) {
    return (
        <View style={{ gap: l.spacing.xs, alignItems: 'center' }}>
            <Text style={[bS.body2, { color: cl.basic.white }]}>{label}</Text>
            {url && (
                <Image
                    source={{ uri: url }}
                    style={{ width: l.screen.width - (2 * l.margins.page), height: l.screen.width * 0.5, borderRadius: l.spacing.xs }}
                    resizeMode={'cover'}
                />
            )}
            <SquareButton
                label={uploading ? 'Uploading...' : (url ? 'Change' : 'Choose Photo')}
                size={'small'}
                onPress={onPick}
            />
        </View>
    )
}

export default function EditEventScreen() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();
    const { event, loading, refetch } = useEvent(id);
    const { uploadCover, uploadDescriptionImage } = useEventCoverPhotos();
    const [uploadingSlot, setUploadingSlot] = useState(null);

    if (loading) {
        return (
            <View style={{ height: l.screen.height, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    if (!event) return <Redirect href="../" />

    const isHost = session?.user.id === event.host_id
    const canEdit = isHost && new Date(event.start_date) > new Date()

    if (!canEdit) return <Redirect href="../" />

    const pick = async (onUpload) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.length) return;
        await onUpload(result.assets[0].uri);
        refetch();
    };

    const onPickCover = () => {
        setUploadingSlot('cover');
        pick(async (uri) => {
            const { error } = await uploadCover(id, uri);
            if (error) Alert.alert(error.message);
        }).finally(() => setUploadingSlot(null));
    };

    const onPickDescription = (slot) => {
        setUploadingSlot(slot);
        pick(async (uri) => {
            const { error } = await uploadDescriptionImage(id, slot, uri, event.description_images);
            if (error) Alert.alert(error.message);
        }).finally(() => setUploadingSlot(null));
    };

    return (
        <View style={[mainStyles.page, { height: l.screen.height }]}>
            <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
                <PageHeader label={'Event Photos'} close={true} onClosePress={() => router.navigate('../')} />
            </View>

            <View style={{ paddingHorizontal: l.margins.page, gap: l.spacing.l, alignItems: 'center' }}>
                <PhotoSlot
                    label={'Cover Photo'}
                    url={event.image_url}
                    onPick={onPickCover}
                    uploading={uploadingSlot === 'cover'}
                />
                <PhotoSlot
                    label={'Description Photo 1'}
                    url={event.description_images?.[0]}
                    onPick={() => onPickDescription(0)}
                    uploading={uploadingSlot === 0}
                />
                <PhotoSlot
                    label={'Description Photo 2'}
                    url={event.description_images?.[1]}
                    onPick={() => onPickDescription(1)}
                    uploading={uploadingSlot === 1}
                />

                <SquareButton label={'Done'} fill={true} size={'medium'} onPress={() => router.navigate('../')} />
            </View>
        </View>
    )
}
