import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';
import { EventsDisplay, EventListDisplay } from '../../src/components/eventsDisplay/eventDisplay';

export default function Page() {
    const insets = useSafeAreaInsets()

    return( 
        <ScrollView style={[mainStyles.page,{paddingTop:insets.top,}]}>
            
           
        
        <View >
        
            <EventsDisplay size={'large'}/>
            <EventsDisplay size={'large'}/>
            <EventsDisplay size={'large'}/>
            
            
            
        </View>
        
    </ScrollView>
    )
}