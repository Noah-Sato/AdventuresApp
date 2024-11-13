import { View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { Text } from '@src/components/Text';
import { UserIcon } from "../userIcons";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from '~/contexts/AuthProvider';
import { router } from "expo-router";



export  function ListItem ({user}) {

    

    const { client } = useChatContext()
    const { user: me } = useAuth()

    const onPress = async () => {

        const channel = client.channel('messaging', {
            members: [me.id, user.id]
        });

        await channel.watch();
        router.replace(`/channel/${channel.cid}`)
    }


    return(
        <TouchableOpacity onPress={onPress}>
            <View style={{
                flexDirection:'row', 
                alignItems:'center', 
                paddingVertical:l.spacing.s,
                paddingHorizontal:l.spacing.l, 
                gap:l.spacing.s, 
                borderBottomWidth:2,
                borderColor:cl.basic.white}}>
                <UserIcon userImage={user.avatar_url} size={'small'}/>
                <Text style={[bS.h7,{color:cl.basic.white}]}>{user.full_name}</Text>
            </View>
        </TouchableOpacity>
    )


}