import { View, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { mainStyles, bS  } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';

import { PageHeader } from '@components/pageGeneral/pageHeader';
import { EventsIcon } from '@components/eventsDisplay/eventIcons';
import { UserIcon } from'@components/userIcons';

import { useEvent } from '@hooks/useEvents'
import { useEventAttendees } from '@hooks/useAttendance';
import { useEventPhotos } from '@hooks/useEventPhotos';

import { formatEventDate} from 'app/event/[id]/index.js'
import { PhotoGrid } from './photos';
import Page from '.';


export default function PastEventScreen() {
    const { id } = useLocalSearchParams();
    const { event, loading } = useEvent(id);
    const { attendees } = useEventAttendees(id);
    const { photos } = useEventPhotos(id);


    if (loading) {
        return <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center'}}><ActivityIndicator/></View>
    }
    if (!event) return <Redirect href='../'/>

    const wentTogether = attendees.filter(a => a.status === "going");

    return(
        <View style={[mainStyles.page, {paddingHorizontal:l.margins.page}]}>
            <PageHeader back={true} onBackPress={() => router.back()} label={event.title}/>

            <View style={{alignItems:'center', gap:l.spacing.s, paddingTop:l.spacing.l}}>
                <EventsIcon size={'large'} eventImage={event.image_url} userImage={event.host?.avatar_url} />
                <Text style={[bS.h4, {color:cl.basic.white, textAlign:'center'}]}>
                    {event.formatted_address}
                </Text>
                <Text style={[bS.h5, {color:cl.basic.white, textAlign:'center'}]}>
                    {formatEventDate(event.start_date, event.end_date)}
                </Text>

                <View style={{width: l.screen.width - (2*l.margins.page), gap:l.spacing.xs}}>
                    <Text style={[bS.h5, {color:cl.basic.white, textDecorationLine:'underline'}]}>
                        {'who was there'}
                    </Text>
                    <View style={{flexDirection:'row', gap:l.spacing.xs}}>
                        {wentTogether.map(a => (
                            <TouchableOpacity key={a.id} onPress={() => router.push(`/user/${a.profile.id}`)}>
                                <UserIcon size={'small'} userImage={a.profile.avatar_url}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{width: l.screen.width - (2*l.margins.page), gap:l.spacing.xs, paddingTop:l.spacing.l}}>
                    <Text style={[bS.h5, {color:cl.basic.white, textDecorationLine:'underline'}]}>
                        {'Photos'}
                    </Text>
                </View>
            </View>

            <View style={{flex:1}}>
                <PhotoGrid photos={photos} showsVerticalScrollIndicator={false}/>
            </View>
        </View>
    )
}
