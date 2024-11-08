import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import {compareAsc  } from "date-fns";


import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator  } from 'react-native';
import { EventsDisplay, EventListDisplay } from '@components/eventsDisplay/eventDisplay';
import { useEffect, useState } from 'react';


import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';



function EventsPageDisplay(props) {
    const [data, setData ] = useState([])
    const [loading, setLoading] = useState(false)
    

    const { session } = useAuth()

    const userID =  session?.user.id

    useEffect(() => {
        
        fetchEvents();
        
        
        
    },[])


    

    const fetchEvents = async () => {
        // fetch invited events only... changes to come
        setLoading(true)


        const {data, error} = await supabase.from('attendance').select('id,events(*)').eq('user_id', userID) 
        
       
        
        setData(data)
        setLoading(false)
        
    }

    


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
                data={data}
                renderItem={({item,index}) =>( <EventsDisplay  id={item.events.id} userID={item.events.user_id} startDate={item.events.date} location={item.events.location} key={index} eventTitle={item.events.title} eventImage={item.events.image_uri}/> )}
                keyExtractor={item => item.id}
            />

        </View>

    )
}



function YourEventsDisplay(props) {

    const [data, setData ] = useState([])
    const [loading, setLoading] = useState(false)
    

    const { session } = useAuth()

    const userID =  session?.user.id

    useEffect(() => {
        
        fetchYourEvents();
        
        
        
    },[])

    const fetchYourEvents = async () => {
        // fetch invited events only... changes to come
        setLoading(true)


        const {data, error} = await supabase.from('events').select('*').eq('user_id', userID) 
        
        
        
        setData(data)
        setLoading(false)
        
    }


    if (loading) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
                <ActivityIndicator/>
            </View>
        )
       
    }


    return( 
        <View>
            <View style={{paddingBottom:l.spacing.xl3}}>
                <FlatList
                    style={{paddingBottom:l.spacing.xl3}}       
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    data={data}
                    renderItem={({item,index}) =>( <EventsDisplay  id={item.id} userID={item.user_id} startDate={item.date} location={item.location} key={index} eventTitle={item.title} eventImage={item.image_uri}/> )}
                    keyExtractor={item => item.id}
                />

                
            </View>
            <View style={{height:l.spacing.xl3}}/>
        </View>
    )

}

export { EventsPageDisplay, YourEventsDisplay }