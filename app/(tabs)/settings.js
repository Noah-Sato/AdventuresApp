import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';

import { Text } from '@src/components/Text';
import { SquareButton }from '@components/Buttons';

import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';



export default function App() {
    const insets = useSafeAreaInsets()

    return( 
        <ScrollView style={[mainStyles.page,{paddingTop:insets.top,}]}>
            
           
        
        <View >
        
            <SquareButton label={'sign out'} onPress={() => supabase.auth.signOut()}/>
            
            
        </View>
        
    </ScrollView>
    )
}