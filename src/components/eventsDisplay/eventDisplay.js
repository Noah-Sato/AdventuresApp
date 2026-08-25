import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@components/Text'
import {  View, TouchableOpacity,StyleSheet, FlatList, Pressable  } from 'react-native';


import { UserIcon } from '@components/userIcons';
import { EventsIcon } from '@components/eventsDisplay/eventIcons';

import { format, isSameDay, isTomorrow, parse, parseISO,  } from 'date-fns'
import { useEffect, useState } from 'react';
import RightArrowButton from '@assets/ButtonIcons/chevron_right_24px_outlined.svg'
import { supabase } from '~/utils/supabase'
import { getAvatarPublicUrl } from '~/utils/avatarUrl'
import { Link } from 'expo-router';

//Api call take users name/Id and request all/spesific info based on the 


const dummyGuestList = [
    'ID000001',
    'ID000002',
    'ID000003',
    'ID000005',
    'ID000006',
    'ID000007',
    'ID000008',



]


function EventsDisplay(props) {

    const [attendees, setAttendees ] = useState([])
    const [userImage, setUserImage ] = useState(undefined)

    const [attendeeImage, setAttendeeImage ] = useState()




    
    
    


    

    const size = props.size ? props.size : 'large'
    const eventImage = props.eventImage ? props.eventImage : undefined
    const userID = props.userID ? props.userID : undefined //may have an API call in here for user data this is a placeholder peice of code 
    const Title = props.eventTitle ? props.eventTitle : 'Title Placeholder'
    const startDate = props.startDate ? props.startDate : "2025-01-01T12:09:00"
    const location = props.location ? props.location : 'Location Placeholder'
    const  endDate = props.endDate ? props.endDate : "2025-01-01T15:12:00"
    const Guests = props.guestList ? props.guestList: dummyGuestList
    const eventID = props.id ? props.id: undefined


    useEffect(() => {
        fetchUserImage({userID:userID})
        fetchAttendees()
    },[])

    

    const fetchAttendees = async () => {

        const fetchAttendeeImages = async (path) => {
            if (!path) return null

            const {data, error} = await supabase.storage.from('avatars').getPublicUrl(path);

            console.log(data.publicUrl, 'data')


            const returnImage = data.publicUrl

            return(returnImage)
        }



        const {data, error } = await supabase.from('attendance').select('*, profiles(*)').eq('event_id', eventID);

        let useAttendees

        if (data !== null ) {
            useAttendees = data.map((x) => {
                return {
                id: x.profiles.id,
                image: x.profiles.avatar_url,
                confirmed: x.status === 'going' ? true : x.status === 'declined' ? false : null
                }
            })
        }
        setAttendees(useAttendees)
        
    }

    const fetchUserImage = async ({userID}) => {
        const {data: data, error}= await supabase.from('profiles').select('avatar_url').eq('id',userID).single()
        if (data !== null && data.avatar_url){
            setUserImage(getAvatarPublicUrl(data.avatar_url))
        }
    }

    


    let displayStartDate = ''
    let dateTextColor


    
        if (isTomorrow(startDate)){

            if (isSameDay(startDate,endDate)) {
                displayStartDate = 'Tomorrow ' + format(startDate,'p ' )
                         
            } else {
                displayStartDate = 'Tomorrow ' + format(startDate,'p ' )
                 
            }

            
            dateTextColor = cl.red.light_thirty
        } else {
            
            dateTextColor = cl.basic.white

            if (isSameDay(startDate,endDate)) {
                displayStartDate =format(startDate,'do MMM, p' )
                           
            } else {
                displayStartDate = format(startDate,'do MMM, p' )
                
            }
        }
    

    const GuestIconsDisplay = ({guestList,size}) => {
        let maxShown
        switch(size) {
            case 'large':
                maxShown = 3
            break;
            
            case 'medium':
                maxShown = 2
            break;

            case 'small':
                maxShown = 0
            break;
        }


        
        const length = guestList.length
        

        const DisplayedGuests = guestList.slice(0,maxShown)
        
        
        let borderColor
        return (
            <View style={{flexDirection:'row',gap:l.spacing.xs2, alignItems:'center' }}>
                {DisplayedGuests.map((item, index) => {

                    if ( item.confirmed == true ) {
                        borderColor = cl.green.light_thirty
                    } else if ( item.confirmed == false ) {
                        borderColor = cl.red.light_thirty
                    } else {
                        borderColor = cl.basic.white
                    }
                    
                    return <UserIcon  borderColor={borderColor} userImage={item.image} key={index}/>
                })}

                {(length > maxShown) && <Text style={[bS.body3, {color:cl.basic.white}]}>{`+${length-maxShown}`}</Text>}
            </View>
        )
    }
    

    if (size == 'large') {
        return(
            <Link href={`/event/${eventID}`} asChild>
                <Pressable>
                    <View style={{
                        paddingHorizontal:l.spacing.xs,
                        paddingVertical:l.spacing.s,
                        borderBottomWidth:l.spacing.xs3,
                        borderTopWidth:l.spacing.xs3,
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center',
                        borderColor:cl.basic.white,
                        width:l.screen.width

                    }}>
                        <View style={{gap:l.spacing.xs, flexDirection:'row'}}>
                            <View>
                                <EventsIcon size={'large'} eventImage={eventImage} userImage={userImage}/>
                            </View>

                            <View style={{
                                paddingVertical:l.buttonSpacing.large,
                                paddingHorizontal:l.spacing.xs,
                                borderRadius:l.spacing.xs,
                                //borderWidth:l.spacing.xs3,
                                borderColor:cl.basic.white,
                                alignSelf:'center'

                            }}>
                                <View style={{paddingBottom:l.spacing.xs, width:(l.screen.width / 2.5)}}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[bS.body3 , {color:cl.basic.white,  }]}>{Title}</Text>
                                    <Text style={[bS.body3,{color:dateTextColor}]}>{`${displayStartDate}`}</Text>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[bS.body3,{color:cl.basic.white}]}>{location}</Text>
                                
                                
                                </View>
                                
                                {attendees !== undefined &&<GuestIconsDisplay size={size} guestList={attendees}/>}
                                
                            </View>
                        </View>

                        <RightArrowButton width={24} height={24} fill={cl.basic.white}/>
                            
                    </View>
                </Pressable>
            </Link>

        )
    }else if(size == 'medium') {
        return (

            <View style={{
                paddingHorizontal:l.spacing.xs,
                paddingVertical:l.spacing.s,
                borderBottomWidth:l.spacing.xs3,
                borderTopWidth:l.spacing.xs3,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                borderColor:cl.basic.white

            }}>

                <View style={{flexDirection:'row', gap:l.spacing.xs}}>
                    <EventsIcon size={'medium'} eventImage={eventImage} userImage={userImage}/>
                    
                    
                    <View style={{
                        paddingVertical:l.buttonSpacing.large,
                        paddingHorizontal:l.spacing.xs,
                        borderRadius:l.spacing.xs,
                        borderWidth:l.spacing.xs3,
                        borderColor:cl.basic.white,
                        alignSelf:'center'

                    }}>
                        
                        
                        <View style={{paddingBottom:l.spacing.xs}}>
                            <Text style={[bS.body3,{color:cl.basic.white}]}>{Title}</Text>
                            <Text style={[bS.body3,{color:dateTextColor}]}>{`${displayStartDate}`}</Text>
                            
                        
                        
                        
                        </View>
                        {attendees !== undefined &&<GuestIconsDisplay size={size} guestList={attendees}/>}
                    </View>
                </View>

                <RightArrowButton width={24} height={24} fill={cl.basic.white}/>    

            </View>
        )
    } else if(size == 'small'){

        return (

            <View style={{
                paddingHorizontal:l.spacing.xs,
                paddingVertical:l.spacing.s,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
            

            }}>

                <View style={{flexDirection:'row', gap:l.spacing.xs}}>
                    <EventsIcon size={'small'} eventImage={eventImage} userImage={userImage}/>
                    
                    
                    <View style={{
                        paddingVertical:l.buttonSpacing.large,
                        paddingHorizontal:l.spacing.xs,
                        borderRadius:l.spacing.xs,
                        borderWidth:l.spacing.xs3,
                        borderColor:cl.basic.white,
                        alignSelf:'center'

                    }}>
                        
                        
                        <View >
                            <Text style={[bS.body3,{color:cl.basic.white}]}>{Title}</Text>
                            <Text style={[bS.body3,{color:dateTextColor}]}>{`${displayStartDate}`}</Text>
                            
                        
                        
                        
                        </View>
                        
                    </View>
                </View>

                <RightArrowButton width={24} height={24} fill={cl.basic.white}/>    

            </View>
        )

    }
}






function EventListDisplay(props) {
    const eventImage = props.eventImage ? props.eventImage : undefined
    const userImage = props.userImage ? props.userImgae : undefined //may have an API call in here for user data this is a placeholder peice of code 
    const Title = props.eventTitle ? props.eventTitle : 'Title Placeholder'
    const startDate = props.startDate ? props.startDate : "2025-01-01T12:09:00Z"
    const location = props.location ? props.location : 'Location Placeholder'
    const endDate = props.endDate ? props.endDate : "2025-01-01T15:12:00Z"
    const Guests = props.guestList ? props.guestList: dummyGuestList

    let displayStartDate = ''
    let displayEndDate = ''
    let dateTextColor
    if (isTomorrow(startDate)){

        if (isSameDay(startDate,endDate)) {
            displayStartDate = 'Tomorrow ' + format(startDate,'p - ' )
            displayEndDate = format(endDate,'p')
        } else {
            displayStartDate = 'Tomorrow ' + format(startDate,'p - ' )
            displayEndDate = format(endDate,'do MMM, p')
        }

        
        dateTextColor = cl.maroon.light_fourty
    } else {
        
        dateTextColor = cl.basic.white

        if (isSameDay(startDate,endDate)) {
            displayStartDate =format(startDate,'do MMM, p' )
            displayEndDate = format(endDate,'p')            
        } else {
            displayStartDate = format(startDate,'do MMM, p' )
            displayEndDate = format(endDate,'do MMM, p') 
        }
    }

    return(
        <View style={{
            paddingVertical:l.spacing.s,
            paddingHorizontal:l.spacing.s,
            borderRadius:l.spacing.xs,
            borderWidth:l.spacing.xs3,
            borderColor:cl.basic.white,
            alignSelf:'flex-start',
            gap:l.spacing.s,
            justifyContent:'center'

        }}>

            
            <EventsIcon size={'medium'} eventImage={eventImage} userImage={userImage}/>


            <View style={{
                        paddingVertical:l.buttonSpacing.large,
                        paddingHorizontal:l.spacing.xs,
                        borderRadius:l.spacing.xs,
                        borderWidth:l.spacing.xs3,
                        borderColor:cl.basic.white,
                        alignSelf:'center'

                    }}>
                        
                        
                        <View >
                            <Text style={[bS.body3,{color:cl.basic.white}]}>{Title}</Text>
                            <Text style={[bS.body3,{color:dateTextColor}]}>{`${displayStartDate}`}</Text>
                            
                        
                        
                        
                        </View>
                        
                    </View>

        </View>
    )




}


export {EventsDisplay, EventListDisplay}