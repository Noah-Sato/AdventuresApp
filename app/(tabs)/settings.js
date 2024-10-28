import { Stack } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import l from '@theme/Layout'
import IconTest from '@assets/tabBarIcons/contact_mail_24px.svg'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';
import { useEffect, useState } from 'react';
import { SquareButton }from '@components/Buttons';
import { UserIcon } from '@components/userIcons';
import { EventsIcon } from '@components/eventsDisplay/eventIcons';
import { EventsDisplay, EventListDisplay } from '../../src/components/eventsDisplay/eventDisplay';



export default function Page() {
    const insets = useSafeAreaInsets()


    return( 
        <ScrollView style={[mainStyles.page,{paddingTop:insets.top,}]}>
            
           
        
        <View >
        
            
            
            
        </View>
        
    </ScrollView>
    )
}