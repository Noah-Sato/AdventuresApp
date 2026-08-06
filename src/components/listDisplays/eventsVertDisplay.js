import l from '@theme/Layout'

import { View, FlatList, ActivityIndicator } from 'react-native';
import { EventsDisplay } from '@components/eventsDisplay/eventDisplay';

import { useUpcomingEvents, useMyEvents } from '@hooks/useEvents';


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
