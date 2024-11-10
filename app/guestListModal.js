import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator  } from 'react-native';

import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';

import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@components/Text'


import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { mainStyles } from '@src/theme/Styles';




export default function Page() {
    const {id} = useLocalSearchParams();
    const [loading, setLoading] = useState(false)
    const [attendees, setAttendees ] = useState([])
    const [userImage, setUserImage] = useState()
    const [userData, setUserData] = useState()

    const { session } = useAuth();


    useEffect(()=>{
        fetchAttendees()
        fetchUserId()
    }, [])
    
    
    
    const fetchAttendees = async () => {
        setLoading(true)
        const {data, error } = await supabase.from('attendance').select('*, profiles(*)').eq('event_id', id);
        
        let useAttendees = []
        if (data !== null ) {
            data.map((x) => {
                useAttendees.push( {
                id: x.profiles.id,
                image: x.profiles.avatar_url,
                coming: x.comfirmed

                })
            })
        }
        console.log(useAttendees)
        setAttendees(useAttendees)
        setLoading(false)
        
        
    }
    
    const fetchUserId = async () => {

        const fetchUserData = async ({user_id}) => {
            setLoading(true)
            const {data, error} = await supabase.from('profiles').select('*').eq('id', user_id ).single()
            setUserImage(data.avatar_url)
            setUserData(data)
            setLoading(false)
        }

        setLoading(true)
        
        const {data, error} = await supabase.from('events').select('user_id').eq('id', id ).single()
        
        fetchUserData({user_id:data.user_id})      
        setUserData(data)
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
        <View style={[mainStyles.page,{}]}>


            <View style={{paddingBottom:l.spacing.xl, paddingHorizontal:l.margins.page}}>
                <PageHeader close={true} onClosePress={()=>{router.navigate('../')}} label={'Guest List'}/>
            </View> 


            



        </View>

    )
}

