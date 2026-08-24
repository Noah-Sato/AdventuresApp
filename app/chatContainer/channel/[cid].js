

import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo';

import cl from '@theme/Colours'
import l from '@theme/Layout'

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '@components/pageGeneral/pageHeader'
import { SquareButton } from '@components/Buttons';
import { useEvent } from '@hooks/useEvents';


export default function ChannelScreen() {
    const insets = useSafeAreaInsets()
    const [channel, setChannel] = useState();
    const {cid} = useLocalSearchParams();

    const { client } = useChatContext();

    // Event channels are created with channel id = event.id (cid "messaging:{eventId}"); DM
    // channels get Stream-auto-generated ids that won't resolve to a real event. This is a
    // heuristic, not a long-term type discriminator -- fine for v1, but storing an explicit
    // type/eventId in the channel's custom data at creation would be more robust eventually.
    const parsedEventId = cid?.split(':')[1]
    const { event } = useEvent(parsedEventId)

    useEffect(()=> {

        const fetchChannel = async () => {
            const res = await client.queryChannels({ cid });
            setChannel(res[0])
        };

        fetchChannel();
    }, [cid])


    if(!channel) {
        return <ActivityIndicator />;
    }

    return(
    
        <View style={[{flex: 1, backgroundColor:cl.maroon.dark_95, paddingBottom:insets.bottom,}]}>
            <View style={{paddingBottom:l.spacing.s}}>
                <PageHeader back={true} label={'chat header '} onBackPress={()=>{router.navigate('../')}}/>
            </View>

            {event &&
                <View style={{alignItems:'center', paddingBottom:l.spacing.s}}>
                    <SquareButton size={'small'} label={'Photos'} onPress={()=>router.push(`/event/${event.id}/photos`)}/>
                </View>}

                <Channel channel={channel} additionalKeyboardAvoidingViewProps={{ style: { flex: 1 } }}>
                    <MessageList/>
                    <MessageInput/>
                </Channel>

        </View>
    )

}
