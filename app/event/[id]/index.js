import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { mainStyles } from '@theme/Styles';
import { useAuth } from '~/contexts/AuthProvider';

import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { format, isSameDay, isTomorrow, parseISO } from 'date-fns'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'
import { EventsIcon } from '@components/eventsDisplay/eventIcons';
import { UserIcon } from '@components/userIcons';
import { SquareButton } from '@components/Buttons';
import { SocialIcons } from '@theme/Icons'

import { Text } from '@components/Text'
import { Description } from '@components/listDisplays/Description';

import { useEvent } from '@hooks/useEvents'
import { useEventAttendees, useMyAttendance } from '@hooks/useAttendance'


function PageHeader(props) {
    const insets = useSafeAreaInsets()

    const label = props.label ? props.label : 'Header Placeholder'
    const closeIcon = props.close ? props.close : false



    const onBackPressHandler = () => props.onBackPress();
    const onClosePressHandler = () => props.onClosePress();

    return(
        <View style={[{

            paddingTop:insets.top ,
            justifyContent:'space-between',
            alignItems:'center',


        } ]}>
            {closeIcon &&
            <TouchableOpacity style={{width:'100%', alignItems:'flex-start'}} onPress={onClosePressHandler}  >
                <Back width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>
            }

            <View style={{
            paddingTop:l.spacing.xs3,
            alignItems:'center',
            alignSelf:'center',
            width:l.screen.width - (4* l.margins.page)

        }}>


            <Text numberOfLines={2} ellipsizeMode={'tail'} style={[bS.h1,{color:cl.basic.white, textAlign:'center' }]}>{label}</Text>
            </View>


        </View>

    )



}

function formatEventDate(startDate, endDate) {
    const start = parseISO(startDate)
    const end = endDate ? parseISO(endDate) : null
    const dayLabel = isTomorrow(start) ? 'Tomorrow, ' : ''
    const sameDay = end ? isSameDay(start, end) : true

    const startLabel = `${dayLabel}${format(start, sameDay ? 'do MMM, p' : 'do MMM, p')}`
    if (!end || sameDay) return startLabel
    return `${startLabel} - ${format(end, 'do MMM, p')}`
}

const statusBorderColor = (status) => {
    if (status === 'going') return cl.green.light_thirty
    if (status === 'declined') return cl.red.light_thirty
    return cl.basic.white
}

function GuestIconDisplay({ eventId, attendees }) {
    const displayed = attendees.length > 5 ? attendees.slice(0, 4) : attendees

    return(
        <TouchableOpacity onPress={()=>(router.push({
            pathname:'/guestListModal',
            params:{ id: eventId }
        }))}>
            <View style={{flexDirection:'row', gap:l.spacing.xs, paddingLeft:l.spacing.s}}>
                {displayed.map((item)=>(
                    <UserIcon borderColor={statusBorderColor(item.status)} key={item.id} size={'small'} userImage={item.profile.avatar_url}/>
                ))}
                {(attendees.length > 5) && <Text style={[bS.body3, {color:cl.basic.white}]}>{`+${attendees.length-5}`}</Text>}
            </View>
        </TouchableOpacity>
    )
}

function ShareIconContainer(){
    return(
        <View style={{
            gap:l.spacing.xs,
            paddingHorizontal:l.spacing.s,
            paddingTop:l.spacing.m,

        }}>
            <View style={{
                flexDirection:'row',
                gap:l.spacing.l,
                borderColor:cl.basic.white,
                borderWidth:2,
                borderRadius:8,
                padding:l.spacing.s,
                alignSelf:'center'
            }}>
                <SocialIcons icon={'facebook'} fill={cl.basic.white} size={40}/>
                <SocialIcons icon={'instagram'} fill={cl.basic.white} size={40}/>
                <SocialIcons icon={'x'} fill={cl.basic.white} size={40}/>
            </View>

        </View>
    )
}

const RSVP_OPTIONS = [
    { status: 'going', label: 'Going' },
    { status: 'maybe', label: 'Maybe' },
    { status: 'declined', label: "Can't go" },
]

function RsvpControls({ currentStatus, onRespond }) {
    return(
        <View style={{flexDirection:'row', gap:l.spacing.xs, justifyContent:'center'}}>
            {RSVP_OPTIONS.map(({ status, label }) => (
                <SquareButton
                    key={status}
                    label={label}
                    size={'small'}
                    fill={currentStatus === status}
                    onPress={() => onRespond(status)}
                />
            ))}
        </View>
    )
}

export default function Page() {
    const { id } = useLocalSearchParams();
    const { session } = useAuth();

    const { event, loading: loadingEvent } = useEvent(id);
    const { attendees, refetch: refetchAttendees } = useEventAttendees(id);
    const { attendance, respond } = useMyAttendance(id);

    if (loadingEvent) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
                <ActivityIndicator/>
            </View>
        )
    } else if (!event) {
        return <Redirect href="../" />
    }

    const isHost = session?.user.id === event.host_id

    const onRespond = async (status) => {
        await respond(status)
        refetchAttendees()
    }

    return(

        <View style={[mainStyles.page,{paddingHorizontal:l.margins.page}]}>
            <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{paddingBottom:l.spacing.xl}}>
                <PageHeader close={true} onClosePress={()=>{router.navigate('../')}} label={event.title}/>
            </View>

                <View style={{
                    alignItems:'center',
                    gap:l.spacing.s
                    }}>
                    <EventsIcon size={'large'} eventImage={event.image_url} userImage={event.host?.avatar_url} />

                    <View style={{gap:l.spacing.xs2}}>
                        <Text style={[bS.h4,{color:cl.basic.white, textAlign:'center'}]}>{event.formatted_address}</Text>
                        <Text style={[bS.h5,{color:cl.basic.white, textAlign:'center'}]}>{formatEventDate(event.start_date, event.end_date)}</Text>
                    </View>

                    { (event.description !== null && event.description !== undefined )&&
                    <View>
                        <Description Description={event.description}/>
                    </View>
                    }

                    <View style={{
                        width:(l.screen.width - (2 * l.margins.page)),
                        gap:l.spacing.xs
                        }}
                    >
                        <Text style={[bS.h5,{color:cl.basic.white, textDecorationLine:'underline'}]}>{"Who's coming?"}</Text>
                        <GuestIconDisplay eventId={id} attendees={attendees} />
                        {isHost &&
                            <View style={{alignContent:'center', alignSelf:'center', paddingTop:l.spacing.s}}>
                                <SquareButton size={'medium'} label={'Add People'}  fill={true} onPress={()=>router.push({pathname:'/guestListModal', params:{id}})}/>
                            </View>}

                        {!isHost && attendance &&
                            <View style={{paddingTop:l.spacing.s}}>
                                <RsvpControls currentStatus={attendance.status} onRespond={onRespond} />
                            </View>}

                        {!isHost && !attendance && event.visibility === 'public' &&
                            <View style={{paddingTop:l.spacing.s}}>
                                <RsvpControls currentStatus={null} onRespond={onRespond} />
                            </View>}

                        {(isHost || attendance?.status === 'going') &&
                            <View style={{alignContent:'center', alignSelf:'center', paddingTop:l.spacing.s}}>
                                <SquareButton size={'medium'} label={'Chat'} fill={false} onPress={()=>router.push(`/chatContainer/channel/messaging:${id}`)}/>
                            </View>}

                        {(isHost || attendance) &&
                            <View style={{alignContent:'center', alignSelf:'center', paddingTop:l.spacing.s}}>
                                <SquareButton size={'medium'} label={'Photos'} fill={false} onPress={()=>router.push(`/event/${id}/photos`)}/>
                            </View>}

                        {isHost && new Date(event.start_date) > new Date() &&
                            <View style={{alignContent:'center', alignSelf:'center', paddingTop:l.spacing.s}}>
                                <SquareButton size={'medium'} label={'Edit'} fill={false} onPress={()=>router.push(`/event/${id}/edit`)}/>
                            </View>}

                    </View>



                    <ShareIconContainer/>
                </View>
            </ScrollView>


        </View>
    )

}
