
import { supabase } from '~/utils/supabase'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import l from '@theme/Layout'

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';
import { useEffect, useState } from 'react';
import { SquareButton }from '@components/Buttons';



export default function Page() {
    const insets = useSafeAreaInsets()


    return( 
        <ScrollView style={[mainStyles.page,{paddingTop:insets.top,}]}>
            
           
        
        <View >
        
            <SquareButton label={'sign out'} onPress={() => supabase.auth.signOut()}/>
            
            
        </View>
        
    </ScrollView>
    )
}