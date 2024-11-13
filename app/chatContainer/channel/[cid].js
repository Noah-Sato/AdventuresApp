

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

import { PageHeader } from '@components/pageGeneral/pageHeader'



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
    <View style={[{backgroundColor:cl.maroon.dark_95, paddingBottom:insets.bottom, height:l.screen.height/1.15}]}>
        <View style={{paddingBottom:l.spacing.s}}>
        <PageHeader back={true} label={'chat header '} onBackPress={()=>{router.navigate('../')}}/>
        </View>
        
        
            
            <Channel channel={channel}>
                <MessageList/>
                <MessageInput/>
            </Channel>
        
    </View>
    )

}