import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';

import { PageHeader } from '@components/pageGeneral/pageHeader'


import { ChannelList, Channel, MessageList, MessageInput } from 'stream-chat-expo'
import { useState } from 'react';


import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { router } from 'expo-router';


export default function Page() {
    const insets = useSafeAreaInsets()
    


    
    
    return( 
        <View style={[mainStyles.page]}>
            <View style={{
                paddingBottom:l.spacing.s, 
                paddingHorizontal:l.margins.page, 
                width:l.screen.width,
                alignItems:'center'}}>
                <PageHeader label={'chats'}/>
            </View>
            <ChannelList onSelect={(channel) => router.push(`channel/${channel.cid}`)}/>
        </View>
    )
}