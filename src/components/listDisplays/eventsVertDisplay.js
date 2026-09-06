import l from '@theme/Layout'
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'

import { View, FlatList, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import { EventsDisplay } from '@components/eventsDisplay/eventDisplay';

import { Text } from '@components/Text';
import { useUpcomingEvents, useMyEvents } from '@hooks/useEvents';
import { router } from 'expo-router'
import { SquareButton } from '@components/Buttons'


function EventsPageDisplay() {
    const { events, loading } = useUpcomingEvents()

    if (loading) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
                <ActivityIndicator/>
            </View>
        )
    }

    return(
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={false}
                data={events}
                renderItem={({item}) =>( <EventsDisplay id={item.id} userID={item.host_id} startDate={item.start_date} endDate={item.end_date} location={item.formatted_address} eventTitle={item.title} eventImage={item.image_url}/> )}
                keyExtractor={item => item.id}
            />
        </View>
    )
}



function YourEventsDisplay() {
    const { events, loading } = useMyEvents()

    if (loading) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
                <ActivityIndicator/>
            </View>
        )
    }

    return(
        <View style={{paddingBottom:l.spacing.xl3}}>
            <View style={{paddingBottom:l.spacing.xl3}}>
                <View style={{alignItems:'center', paddingBottom:l.spacing.m}}>
                    <SquareButton label={' Not Attending'} size={'small'} onPress={()=> router.navigate('/notAttendingEvents')}/>

                    <TouchableOpacity onPress={()=> router.navigate('/notAttendingEvents')} style={{
                        width:'100%', 
                        borderTopWidth:1,
                        borderBottomWidth:1,
                        borderColor:cl.basic.white, 
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s}}
                        >
                        <Text style={[bS.h7, {color:cl.grey.fourty}]}>{'Not Attending'}</Text>
                        
                    </TouchableOpacity>
                </View>


                <FlatList
                    style={{paddingBottom:l.spacing.xl3}}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    data={events}
                    renderItem={({item}) =>( <EventsDisplay id={item.id} userID={item.host_id} startDate={item.start_date} endDate={item.end_date} location={item.formatted_address} eventTitle={item.title} eventImage={item.image_url}/> )}
                    keyExtractor={item => item.id}
                />
            </View>
            <View style={{height:l.spacing.xl3}}/>
        </View>
    )

}

export { EventsPageDisplay, YourEventsDisplay }
