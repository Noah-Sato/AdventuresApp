import { router } from 'expo-router';
import { View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { Text } from '@components/Text';

import { useMemoryBankPhotos } from '@hooks/useEventPhotos';
import { PhotoGrid } from './event/[id]/photos';
import { usePastEvents } from '@hooks/useEvents';



export default function MemoryBankScreen() {
    //const { photos, loading } = useMemoryBankPhotos();
    const { events, loading } = usePastEvents();

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
                <FlatList
                    data={events}
                    numColumns={2}
                    keyExtractor={item=> item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            style={{ width: l.screen.width / 2, padding: l.spacing.xs}}
                            onPress={()=> router.push(`/event/${item.id}/memory`)}
                        >
                            <Image source={{uri: item.image_url}} style={{width:'100%', height:150, borderRadius:l.roundness.xs}}/>
                            <Text numberOfLines={1} style={[bS.body3, {color:cl.basic.white}]}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={[bS.body2, {color:cl.grey.eighty, paddingHorizontal: l.margins.page}]}>
                            {"No past events yet."}
                        </Text>
                    }
                />

            )}
        </View>
    )
}
