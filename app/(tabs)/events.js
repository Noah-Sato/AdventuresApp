

import { View } from 'react-native';
import { router } from 'expo-router';

import { Dictionary } from '@config/Dictionary'

import cl from '@theme/Colours'
import l from '@theme/Layout'

import  { EventsPageDisplay, YourEventsDisplay }  from '@components/listDisplays/eventsVertDisplay';
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { EventPageHeader } from '@components/pageGeneral/uniquePageheaders';
import { SquareButton } from '@components/Buttons';

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
    return(
        <View style={[{backgroundColor:cl.maroon.dark_95,alignItems:'center',paddingBottom:l.spacing.xl}]}>

        <View style={{paddingBottom:l.spacing.s}}>
            <EventPageHeader label={Dictionary.tabs.Events.Title} create={true} onCreatePress={()=>{router.navigate('/createEvent')}}/>
        </View>

        <TabDisplay tabData={profileSliderConfig}  />
       
            



           

            
       
        
        
    </View>
    )
}