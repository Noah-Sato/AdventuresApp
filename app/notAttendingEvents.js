import { router } from 'expo-router';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { mainStyles } from '@theme/Styles';
import l from '@theme/Layout';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { EventsDisplay } from '@components/eventsDisplay/eventDisplay';
import { useDeclinedEvents } from '@hooks/useEvents';

export default function notAttendingEventsScreen() {
    const { events, loading } = useDeclinedEvents();

    return(
        <View style={[mainStyles.page, { height:l.screen.height}]}>
            <View style={{ paddingHorizontal: l.margins.page, paddingBottom:l.spacing.l}}>
                <PageHeader label={'not Attending'} back={true} onBackPress={() => router.navigate('../')}/> 
            </View>

            {loading ? (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><ActivityIndicator/></View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EventsDisplay
                            id={item.id}
                            userID={item.host_id}
                            startDate={item.start_date}
                            endDate={item.end_date}
                            location={item.formatted_address}
                            eventTitle={item.title}
                            eventImage={item.image_url}
                        />
                    )}
                />

            )}

        </View>

    )
}