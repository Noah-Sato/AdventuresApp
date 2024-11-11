

import { View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Button  } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ChannelList, Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo';

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { mainStyles } from '@src/theme/Styles';
import { supabase } from '~/utils/supabase'
import { Dictionary } from '@config/Dictionary'

import { Text } from '@src/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function ChannelScreen() {
    const insets = useSafeAreaInsets()
    const [channel, setChannel] = useState();
    const {cid} = useLocalSearchParams();
    
    const { client } = useChatContext();    

    
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
        <View style={{paddingBottom:insets.bottom}}>
            <Channel channel={channel}>
                <MessageList/>
                <MessageInput/>
            </Channel>
        </View>
    )

}