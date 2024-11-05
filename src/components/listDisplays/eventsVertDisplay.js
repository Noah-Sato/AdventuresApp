import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'



import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator  } from 'react-native';
import { EventsDisplay, EventListDisplay } from '@components/eventsDisplay/eventDisplay';
import { useEffect, useState } from 'react';


import { supabase } from '~/utils/supabase'



function EventsPageDisplay(props) {
    const [data, setData ] = useState([])
    const [loading, setLoading] = useState(false)

    const id = props.id//this is for only calling the correct events in the future


    useEffect(() => {
        fetchEvents();
    },[])


    


    const fetchEvents = async () => {
        // fetch invited events only... changes to come
        setLoading(true)
        const {data, error} = await supabase.from('events').select('*');
        
        setData(data)
        setLoading(false)
        
    }


    if (loading) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'centerr'}}>
                <ActivityIndicator/>
            </View>
        )
       
    }


    return( 
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                horizontal={false}
                data={data}
                renderItem={({item,index}) =>( <EventsDisplay  id={item.id} userID={item.user_id} startDate={item.date} location={item.location} key={index} eventTitle={item.title} eventImage={item.image_uri}/> )}
                keyExtractor={item=>item.id}
            />

        </View>

    )
}

export { EventsPageDisplay }