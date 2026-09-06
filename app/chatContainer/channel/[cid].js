

import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
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

    // Expo Router reuses this screen instance across navigations between two [cid] routes,
    // so `channel` state from the previously viewed chat can still be set while `cid` (and
    // therefore `event`) has already moved on. Track the latest requested cid in a ref so an
    // in-flight fetch for a since-abandoned channel can't clobber state after the user has
    // navigated elsewhere.
    const cidRef = useRef(cid);
    cidRef.current = cid;

    // Stream's default 'messaging' permissions only grant UpdateChannel to the channel's
    // creator -- attendees stay 'channel_member' and get a permission error, so only the
    // host (who created the channel) may attempt this backfill. The channel.cid check guards
    // against the same stale-state race described above ever pairing a leftover channel with
    // the newly loaded event.
    useEffect(() => {
        const isHost = channel?.data?.created_by?.id === client.userID;
        if (event?.image_url && channel && channel.cid === cid && !channel.data?.image && isHost) {
            // updatePartial merges just the given field -- channel.update() replaces the
            // whole custom data object and would wipe out `name`, leaving Stream's UI to
            // fall back to a member's name for the channel.
            channel.updatePartial({ set: { image: event.image_url } }).catch((err) =>
                console.log('failed to backfill channel image', err)
            );
        }
    }, [event, channel, cid]);

    // queryChannels hits the same Stream HTTP client (and 3s timeout) that can reject right
    // after the app resumes from background -- without a catch here that left `channel`
    // unset forever, stranding the user on a bare spinner with no way back.
    const fetchChannel = async () => {
        setChannelError(false);
        setChannel(undefined);
        const requestedCid = cid;
        try {
            const res = await client.queryChannels({ cid: requestedCid });
            if (cidRef.current === requestedCid) setChannel(res[0]);
        } catch (err) {
            console.warn('Failed to load channel:', err);
            if (cidRef.current === requestedCid) setChannelError(true);
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
                <CustomChatHeader channel={channel} onBackPress={() => router.navigate('../')} fontSize={bS.h2} onProfilePress={() => {
                    const otherId = Object.keys(channel.state.members).find((id) => id !== client.userID)
                    if (otherId) router.push(`/user/${otherId}`)
                }}/>
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
