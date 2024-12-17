import { Redirect, router, Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import l from '@theme/Layout'
import IconTest from '@assets/tabBarIcons/contact_mail_24px.svg'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';
import { useEffect, useState } from 'react';
import { SquareButton }from '@components/Buttons';
import { UserIcon } from '@components/userIcons';
import { useAuth } from '~/contexts/AuthProvider';


export default function Page() {
    const insets = useSafeAreaInsets()
    const [isLogged, setIsLogged ] = useState()

    
  

  

    
    return( 
        <View style={[mainStyles.page,{paddingTop:insets.top,}]}>
            
           
            
            {true && 
            <View style={{gap:l.spacing.s, alignItems:'center'}}>
                
                <SquareButton size={'large'} label={'Home Page'}  fill={true} />

                <SquareButton size={'large'} label={'Create an event'}  fill={true} onPress={()=>{router.navigate('/createEvent')}}/>
                

                

                
                
                
            </View>
            }
        </View>
    )
}