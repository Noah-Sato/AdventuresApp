import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { mainStyles } from '@src/theme/Styles';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';
import { Dictionary } from '@config/Dictionary'

import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator  } from 'react-native';
import { useEffect, useState } from 'react';
import { format, isSameDay, isTomorrow, parse, parseISO,  } from 'date-fns'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, router, useLocalSearchParams } from 'expo-router';




import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'
import { EventsIcon } from '@components/eventsDisplay/eventIcons';
import { Text } from '@components/Text'
import { dataCleaner } from '../../../src/utilities';
import { Description } from '../../../src/components/listDisplays/Description';

function PageHeader(props) {
    const insets = useSafeAreaInsets()

    const label = props.label ? props.label : 'Header Placeholder'
    const closeIcon = props.close ? props.close : false
    

    
    const onBackPressHandler = () => props.onBackPress();
    const onClosePressHandler = () => props.onClosePress();

    return(
        <View style={[{
            
            paddingTop:insets.top ,
            justifyContent:'space-between',
            alignItems:'center',
            
                
        } ]}>
            {closeIcon && 
            <TouchableOpacity style={{width:'100%', alignItems:'flex-start'}} onPress={onClosePressHandler}  >
                <Back width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>
            }

            <View style={{
            paddingTop:l.spacing.xs3,
            alignItems:'center',
            alignSelf:'center',
            width:l.screen.width - (4* l.margins.page)
            
        }}>
            

            <Text numberOfLines={2} t ellipsizeMode={'tail'} style={[bS.h1,{color:cl.basic.white, textAlign:'center' }]}>{label}</Text>
            </View>

            
        </View>

    )
    


}


export default function Page() {
    const insets = useSafeAreaInsets()
    const { id } = useLocalSearchParams();
    const [data, setData ] = useState([])
    const [displayDate, setDisplayDate] = useState()
    const [dateColour, setDateColour] = useState()
    
    const [userImage, setUserImage] = useState()
    const [loading, setLoading] = useState(false)
    

    useEffect(()=>{
        fetchEventData();
        
    },[])

    const fetchUserData = async ({user_id}) => {
        const {data, error} = await supabase.from('profiles').select('avatar_url').eq('id', user_id ).single()
        setUserImage(data.avatar_url)
    }

    const fetchEventData = async () => {
        // fetch invited events only... changes to come
         
        setLoading(true)
        const {data, error} = await supabase.from('events').select('*').eq('id', id).single()
        setData(data)      
        fetchUserData({user_id:data.user_id})
        
        let displayStartDate
        let displayEndDate
        

        if (data.end_date == null || data.end_date == undefined) {

            if (isTomorrow(data.date)){

                if (isSameDay(data.date,data.end_date)) {
                    displayStartDate = 'Tomorrow, ' + format(data.date,'p ' )
                             
                } else {
                    displayStartDate = 'Tomorrow, ' + format(data.date,'p ' )
                     
                }
    
                
                setDateColour(cl.maroon.light_fourty)
            } else {
                
                setDateColour(cl.basic.white)
    
                if (isSameDay(data.date,data.end_date)) {
                    displayStartDate =format(data.date,'do MMM, p' )
                               
                } else {
                    displayStartDate = format(data.date,'do MMM, p' )
                    
                }
            }
            setDisplayDate(displayStartDate)
        } else {
            if (isTomorrow(data.date)){

                if (isSameDay(data.date,data.end_date)) {
                    displayStartDate = 'Tomorrow, ' + format(data.date,'p ' )
                    displayEndDate = format(data.end_date,'p' )
                             
                } else {
                    displayStartDate = 'Tomorrow, ' + format(data.date,'p ' )
                    displayEndDate = format(data.end_date,'do MMM, p' )
                     
                }
    
                
                setDateColour(cl.red.light_thirty)
            } else {
                
                setDateColour(cl.basic.white)
    
                if (isSameDay(data.date,data.end_date)) {
                    displayStartDate =format(data.date,'do MMM, p' )
                    displayEndDate = format(data.end_date,'p' )
                               
                } else {
                    displayStartDate = format(data.date,'do MMM, p' )
                    displayEndDate = format(data.end_date,'do MMM, p' )
                    
                }
            }
            setDisplayDate(`${displayStartDate} - ${displayEndDate}`)
        }

        

        setLoading(false)
    }

    
    

    if (loading) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
                <ActivityIndicator/>
            </View>
        )
       
    } else if (data == undefined) {
            return <Redirect href="../" />
        }

    return( 

        <View style={[mainStyles.page,{paddingHorizontal:l.margins.page}]}>

        <View style={{paddingBottom:l.spacing.xl}}>
            <PageHeader close={true} onClosePress={()=>{router.navigate('../')}} label={data.title}/>
        </View> 

            <View style={{
                alignItems:'center',
                gap:l.spacing.s
                }}>
                <EventsIcon size={'large'} eventImage={data.image_uri} userImage={userImage} />
                
                <View style={{gap:l.spacing.xs2}}>
                    <Text style={[bS.h4,{color:cl.basic.white, textAlign:'center'}]}>{data.location}</Text>
                    <Text style={[bS.h5,{color:dateColour, textAlign:'center'}]}>{displayDate}</Text>
                </View>

                <View>
                    <Description Description={data.description}/>
                </View>
            </View>


        </View>
    )
    
}