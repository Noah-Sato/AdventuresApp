

import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from 'expo-router';

import { mainStyles } from '@src/theme/Styles';
import { supabase } from '~/utils/supabase'
import { Dictionary } from '@config/Dictionary'

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import  { EventsPageDisplay }  from '@components/listDisplays/eventsVertDisplay';
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@src/components/Text';



export default function Page() {
    const insets = useSafeAreaInsets()
    const [events, setEvents] = useState([])

    useEffect(() => {
        fetchEvents();
    },[])


    const fetchEvents = async () => {
        // fetch invited events only... changes to come
        const {data, error} = await supabase.from('events').select('*');
        setEvents(data)
        
    }



    return( 
        <View style={[mainStyles.page,{alignItems:'center',}]}>

        <View style={{paddingBottom:l.spacing.s}}>
            <PageHeader label={Dictionary.tabs.Events.Title}/>
        </View>    
           
        
        
        
            <EventsPageDisplay />
            
            
        
        
    </View>
    )
}