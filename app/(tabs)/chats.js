import { Stack } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@src/components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';



import { ChannelList, Channel, MessageList, MessageInput } from 'stream-chat-expo'
import { useState } from 'react';

import AddChats from '@assets/ButtonIcons/chat_bubble_outline_24px_outlined.svg'

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { router } from 'expo-router';
import { useAuth } from "@contexts/AuthProvider.tsx";




function PageHeader(props) {
    const insets = useSafeAreaInsets()


    const onPressHandler = () => props.onPress();
    
    return(
        <View style={[{
            flexDirection:'row',
            paddingTop:insets.top + l.spacing.s,
            width:l.screen.width - (2 * l.margins.page),
            justifyContent:'space-between'

                
        } ]}>
            <View style={{width:l.spacing.l}}/>

            <View style={{
            flexDirection:'row',
            gap:l.spacing.s,
            alignItems:'center',
            alignSelf:'center',
            alignContent:'center'
        }}>
            

            <Text numberOfLines={1}  ellipsizeMode={'tail'} style={[bS.h1,{color:cl.basic.white,  textAlign:'center' }]}>{props.label}</Text>
            </View>

            
            <TouchableOpacity style={{alignSelf:'flex-end',}} onPress={onPressHandler}  >
                <AddChats width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>
            
        </View>


    )

}


export default function Page() {
    const insets = useSafeAreaInsets()
    const { user } = useAuth();


    
    
    return( 
        <View style={[mainStyles.page]}>
            <View style={{
                paddingBottom:l.spacing.s, 
                paddingHorizontal:l.margins.page, 
                width:l.screen.width,
                alignItems:'center'}}>
                <PageHeader label={'chats'} onPress={()=>{router.navigate('/chatContainer/users')}}/>
            </View>
            <ChannelList
                filters={{members: {$in: [user.id]}}} 
                onSelect={(channel) => router.push(`/chatContainer/channel/${channel.cid}`)}/>
        </View>
    )
}