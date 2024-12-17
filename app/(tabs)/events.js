

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

import  { EventsPageDisplay, YourEventsDisplay }  from '@components/listDisplays/eventsVertDisplay';
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { SquareButton }from '@components/Buttons';

import { TabDisplay } from '@components/pageGeneral/TabDisplay';



const profileSliderConfig=[
    
  
    {
      title: 'Upcoming Events',
      content: EventsPageDisplay,
      height: l.screen.height
    },
  
    {
      title: 'Your Events',
      content: YourEventsDisplay,
      height: l.screen.height * 2,
    },
    //need to figure out a way to pass data to the content through the tab display

  ];


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

    // add plus icon to page header for adding events. 

    return( 
        <View style={[{backgroundColor:cl.maroon.dark_95,alignItems:'center',paddingBottom:l.spacing.xl}]}>

        <View style={{paddingBottom:l.spacing.xl}}>
            <PageHeader label={Dictionary.tabs.Events.Title}/>
        </View>   

        
          <TabDisplay tabData={profileSliderConfig}  />
       
            



           

            
       
        
        
    </View>
    )
}