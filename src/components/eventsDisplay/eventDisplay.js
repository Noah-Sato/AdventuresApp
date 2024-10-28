import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@components/Text'
import { View, TouchableOpacity,StyleSheet, FlatList  } from 'react-native';


import { UserIcon } from '@components/userIcons';
import { EventsIcon } from '@components/eventsDisplay/eventIcons';

import { format, isSameDay, isTomorrow, parse, parseISO,  } from 'date-fns'
import { useState } from 'react';
import RightArrowButton from '@assets/ButtonIcons/chevron_right_24px_outlined.svg'

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
    
    let size
    let eventImage
    let userImage
    let Title
    let startDate
    let endDate
    let location
    let Guests


    if (!props.eventData){

    size = props.size ? props.size : 'large'
    eventImage = props.eventImage ? props.eventImage : undefined
    userImage = props.userImage ? props.userImgae : undefined //may have an API call in here for user data this is a placeholder peice of code 
    Title = props.eventTitle ? props.eventTitle : 'Title Placeholder'
    startDate = props.startDate ? props.startDate : "2025-01-01T12:09:00"
    location = props.location ? props.location : 'Location Placeholder'
    endDate = props.endDate ? props.endDate : "2025-01-01T15:12:00"
    Guests = props.guestList ? props.guestList: dummyGuestList

    }

    

    let displayStartDate = ''
    let dateTextColor


    if (endDate !== undefined){
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
        console.log(length,'guestList')

        const DisplayedGuests = guestList.slice(0,maxShown)
        console.log(DisplayedGuests)
        
        
        return (
            <View style={{flexDirection:'row',gap:l.spacing.xs2, alignItems:'center' }}>
                {DisplayedGuests.map((item) => {
                    console.log('make APi call her to access user images')
                    return<UserIcon/>
                })}

                {(length > maxShown) && <Text style={[bS.body3, {color:cl.basic.white}]}>{`+${length-maxShown}`}</Text>}
            </View>
        )
    }
    

    if (size == 'large') {
        return(
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
                <View>
                    <EventsIcon size={'large'}eventImage={eventImage} userImage={userImage}/>
                </View>

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
                        <Text style={[bS.body3,{color:dateTextColor}]}>{location}</Text>
                    
                    
                    </View>
                    <GuestIconsDisplay size={size} guestList={Guests}/>
                    
                </View>

                <RightArrowButton width={24} height={24} fill={cl.basic.white}/>
                    
            </View>

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
                        <GuestIconsDisplay size={size} guestList={Guests}/>
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