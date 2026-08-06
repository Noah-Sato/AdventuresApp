import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

import { mainStyles } from '@theme/Styles';
import l from '@theme/Layout';
import { PageHeader } from '@components/pageGeneral/pageHeader';

import { useMemoryBankPhotos } from '@hooks/useEventPhotos';
import { PhotoGrid } from './event/[id]/photos';

export default function MemoryBankScreen() {
    const { photos, loading } = useMemoryBankPhotos();

    return (
        <View style={[mainStyles.page, { height: l.screen.height }]}>
            <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
                <PageHeader label={'Memory Bank'} back={true} onBackPress={() => router.navigate('../')} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator />
                </View>
            ) : (
                <PhotoGrid photos={photos} />
            )}
        </View>
    )
}
