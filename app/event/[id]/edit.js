import { useState, useRef } from 'react';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { View, Image, ActivityIndicator, Alert } from 'react-native';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { SquareButton } from '@components/Buttons';
import PhotoSourceBottomSheet from '@components/PhotoSourceBottomSheet';
import { pickImage } from '@src/utilities.js';

import { useAuth } from '~/contexts/AuthProvider';
import { useEvent, useEventCoverPhotos } from '@hooks/useEvents';

// This screen is reused for both "right after creating an event" and later edits -- the host
// can set cover/description photos at creation time or any time after, including once the
// event is underway or over. Scoped narrowly to just these photo fields, not full event editing.

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
    const photoSheetRef = useRef(null);
    // Which of the three targets ('cover' | 0 | 1) is waiting on the sheet's answer --
    // all three PhotoSlots share one sheet/ref, so this is how onPhotoSourceSelected knows
    // which upload function to call once the user picks a source.
    const pendingTargetRef = useRef(null);

    if (loading) {
        return (
            <View style={{ height: l.screen.height, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    if (!event) return <Redirect href="../" />

    const isHost = session?.user.id === event.host_id

    if (!isHost) return <Redirect href="../" />

    const openPicker = (target) => {
        pendingTargetRef.current = target;
        photoSheetRef.current?.expand();
    };

    const onPhotoSourceSelected = async (source) => {
        const target = pendingTargetRef.current;
        if (target === null) return;

        setUploadingSlot(target);

        const asset = await pickImage(source, {
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (asset) {
            const { error } = target === 'cover'
                ? await uploadCover(id, asset)
                : await uploadDescriptionImage(id, target, asset, event.description_images);

            if (error) {
                console.log('photo upload failed', JSON.stringify(error, null, 2));
                Alert.alert(error.message);
            } else {
                refetch();
            }
        }

        pendingTargetRef.current = null;
        setUploadingSlot(null);
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
                    onPick={() => openPicker('cover')}
                    uploading={uploadingSlot === 'cover'}
                />
                <PhotoSlot
                    label={'Description Photo 1'}
                    url={event.description_images?.[0]}
                    onPick={() => openPicker(0)}
                    uploading={uploadingSlot === 0}
                />
                <PhotoSlot
                    label={'Description Photo 2'}
                    url={event.description_images?.[1]}
                    onPick={() => openPicker(1)}
                    uploading={uploadingSlot === 1}
                />

                <SquareButton label={'Done'} fill={true} size={'medium'} onPress={() => router.navigate('../')} />
            </View>
            <PhotoSourceBottomSheet ref={photoSheetRef} onSelect={onPhotoSourceSelected} />
        </View>
    )
}
