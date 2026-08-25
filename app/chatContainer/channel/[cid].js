

import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Channel, MessageList, MessageInput, useChatContext, useChannelPreviewDisplayAvatar } from 'stream-chat-expo';

import cl from '@theme/Colours'
import l from '@theme/Layout'
import  { bS }  from '@theme/Styles'

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '@components/pageGeneral/pageHeader'
import { SquareButton } from '@components/Buttons';
import { useEvent } from '@hooks/useEvents';
import { UserIcon } from '@components/userIcons'
import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'
import { Text } from '@components/Text'

export default function ChannelScreen() {
    const insets = useSafeAreaInsets()
    const [channel, setChannel] = useState();
    const [channelError, setChannelError] = useState(false);
    const {cid} = useLocalSearchParams();
    const { client } = useChatContext();


    // Event channels are created with channel id = event.id (cid "messaging:{eventId}"); DM
    // channels get Stream-auto-generated ids that won't resolve to a real event. This is a
    // heuristic, not a long-term type discriminator -- fine for v1, but storing an explicit
    // type/eventId in the channel's custom data at creation would be more robust eventually.
    const parsedEventId = cid?.split(':')[1]
    const { event } = useEvent(parsedEventId)

    // queryChannels hits the same Stream HTTP client (and 3s timeout) that can reject right
    // after the app resumes from background -- without a catch here that left `channel`
    // unset forever, stranding the user on a bare spinner with no way back.
    const fetchChannel = async () => {
        setChannelError(false);
        try {
            const res = await client.queryChannels({ cid });
            setChannel(res[0]);
        } catch (err) {
            console.warn('Failed to load channel:', err);
            setChannelError(true);
        }
    };

    useEffect(()=> {
        fetchChannel();
    }, [cid])


    const CustomChatHeader = ({channel, onBackPress, onProfilePress, fontSize}) => {


        const { name, image } = useChannelPreviewDisplayAvatar(channel);

        const onBackPressHandler = () => onBackPress();
        const onProfilePressHandler = () => onProfilePress();

        const textSize = fontSize ? fontSize: bS.h1

        return(
            <View style={{ backgroundColor:cl.maroon.dark_95, paddingTop:insets.top,paddingBottom:l.spacing.s, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:l.margins.page - l.spacing.xs,  alignItems:'center' }}>
                 <TouchableOpacity onPress={onBackPressHandler}  >
                    <Back width={l.spacing.m} height={l.spacing.m} fill={cl.maroon.sixty}/>
                </TouchableOpacity>


                <TouchableOpacity onPress={onProfilePressHandler} style={{flexDirection:'row',  alignItems:'center', gap:l.spacing.s}}>
                    <UserIcon userImage={image} size={'small'}/>
                    <Text numberOfLines={1}  ellipsizeMode={'tail'} style={[textSize,{color:cl.basic.white, textAlign:'center'  }]}>{name}</Text>
                    <View style={{width:l.spacing.s}}/>
                </TouchableOpacity>



                <View style={{width:l.spacing.m}}/>
            </View>


        )

    }






    if (channelError) {
        return (
            <View style={{flex: 1, backgroundColor:cl.maroon.dark_95}}>
                <PageHeader back={true} label={'Chat'} onBackPress={()=>{router.navigate('../')}}/>
                <View style={{flex: 1, alignItems:'center', justifyContent:'center', gap:l.spacing.s}}>
                    <Text style={[bS.h4,{color:cl.basic.white}]}>Couldn't load this chat</Text>
                    <SquareButton size={'small'} label={'Retry'} onPress={fetchChannel}/>
                </View>
            </View>
        );
    }

    if(!channel) {
        return (
            <View style={{flex: 1, backgroundColor:cl.maroon.dark_95}}>
                <PageHeader back={true} label={'Chat'} onBackPress={()=>{router.navigate('../')}}/>
                <ActivityIndicator style={{flex: 1}}/>
            </View>
        );
    }

    return(
    
        <View style={[{flex: 1, backgroundColor:cl.basic.white}]}>
            <View style={{paddingBottom:l.spacing.s}}>
                <CustomChatHeader channel={channel} onBackPress={() => router.navigate('../')} fontSize={bS.h2} onProfilePress={() => console.log('wire to friend profile page when built')}/>
            </View>

            {event &&
                <View style={{alignItems:'center', paddingBottom:l.spacing.s}}>
                    <SquareButton size={'small'} label={'Photos'} onPress={()=>router.push(`/event/${event.id}/photos`)}/>
                </View>}

                <Channel channel={channel} keyboardVerticalOffset={0} additionalKeyboardAvoidingViewProps={{ style: { flex: 1 } }}>
                    <MessageList/>
                    <MessageInput/>
                </Channel>
                <View style={{backgroundColor:cl.basic.white, height:insets.bottom, width:'100%'}}/>
        </View>
    )

}
