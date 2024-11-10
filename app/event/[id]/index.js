import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { mainStyles } from '@src/theme/Styles';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';
import { Dictionary } from '@config/Dictionary'

import { View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Button  } from 'react-native';
import { useEffect, useState } from 'react';
import { format, isSameDay, isTomorrow, parse, parseISO,  } from 'date-fns'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, router, useLocalSearchParams } from 'expo-router';




import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'
import { EventsIcon } from '@components/eventsDisplay/eventIcons';
import { UserIcon } from '@components/userIcons';
import { SquareButton }from '@components/Buttons';
import { SocialIcons } from '@theme/Icons'

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
    const [attendees, setAttendees ] = useState([])
    const [userImage, setUserImage] = useState()
    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(false)
    

    const { session } = useAuth();

    useEffect(()=>{
        fetchEventData();
        fetchAttendees();
        
        
        
    },[])

    

    const fetchEventData = async () => {
        // fetch invited events only... changes to come

        const fetchUserData = async ({user_id}) => {
            setLoading(true)
            const {data, error} = await supabase.from('profiles').select('*').eq('id', user_id ).single()
            setUserImage(data.avatar_url)
            setUserData(data)
            setLoading(false)
        }
         
        setLoading(true)
        const {data, error} = await supabase.from('events').select('*').eq('id', id).single()
        if (data.user_id) {fetchUserData({user_id:data.user_id})}
        setData(data)      
        
        
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

    const fetchAttendees = async () => {
        setLoading(true)
        const {data, error } = await supabase.from('attendance').select('*, profiles(*)').eq('event_id', id);
        
        let useAttendees
        if (data !== null ) {
            useAttendees = data.map((x) => {
                return {
                id: x.profiles.id,
                image: x.profiles.avatar_url,
                coming: x.comfirmed

                }
            })
        }
        //organiserInfo = {id:data.user_id, image:userImage}
        //newAttendeesArray = useAttendees.unshift(organiserInfo)
        setAttendees(useAttendees)
        setLoading(false)
        
        
        
    }
    
    function GuestIconDisplay({guestList, userImage}) {
        let DisplayedGuests
        if (guestList) { 
            if (guestList.length > 5) {
                DisplayedGuests = guestList.slice(0,4)
            } else {
                DisplayedGuests = guestList
            }
        }
    
        return(
            <TouchableOpacity onPress={()=>(router.push({
                pathname:'/guestListModal',
                params:{
                    id:id
                }
            }))}>
                <View style={{paddingLeft:l.margins.page, flexDirection:'row', gap:l.spacing.s}}>
    
                    <View style={{flexDirection:'column', alignSelf:'flex-start',gap:l.spacing.xs}}>
                        <Text style={[bS.h7,{color:cl.basic.white}]}>{'Organiser:'}</Text>
                        <UserIcon size={'small'} userImage={userImage} borderColor={cl.green.light_thirty}/>
                    </View>
    
                    <View style={{flexDirection:'column', alignSelf:'flex-start',gap:l.spacing.xs }}>
                        <Text style={[bS.h7,{color:cl.basic.white}]}>{'Guests:'}</Text>
                            <View style={{flexDirection:'row', gap:l.spacing.xs, paddingLeft:l.spacing.s}}>
                                {DisplayedGuests.map((item)=>{
                                    let borderColor 
                                    
                                    if (item.coming == true) {
                                        borderColor = cl.green.light_thirty
                                    } else if (item.coming == false) {
                                        borderColor = cl.red.light_thirty
                                    }else {
                                        borderColor = cl.basic.white
                                    }

                                    return(
                                        <UserIcon borderColor={borderColor} key={item.id} size={'small'} userImage={item.image}/>
                                    )
                                })}
                            {(guestList.length > 5) && <Text style={[bS.body3, {color:cl.basic.white}]}>{`+${guestList.length-5}`}</Text>}
                            </View>
                            
                        
                    </View>
    
    
                </View>
            </TouchableOpacity>
    
        )
    
    
    
    
    
    }


    function ShareIconContainer(){
        return(
            <View style={{
                gap:l.spacing.xs,
                paddingHorizontal:l.spacing.s,
                paddingTop:l.spacing.m,
                
            }}>
                <View style={{
                    flexDirection:'row',
                    gap:l.spacing.l,
                    borderColor:cl.basic.white,
                    borderWidth:2,
                    borderRadius:8,
                    padding:l.spacing.s,
                    alignSelf:'center'
                }}>
                    <SocialIcons icon={'facebook'} fill={cl.basic.white} size={40}/>
                    <SocialIcons icon={'instagram'} fill={cl.basic.white} size={40}/>
                    <SocialIcons icon={'x'} fill={cl.basic.white} size={40}/>
                </View>
                
            </View>
        )
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
            <ScrollView showsVerticalScrollIndicator={false}>

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

                    { (data.description !== null && data.description !== undefined )&& 
                    <View>
                        <Description Description={data.description}/>
                    </View>
                    }
                
                    <View style={{
                        width:(l.screen.width - (2 * l.margins.page)),
                        gap:l.spacing.xs
                        }}
                    >
                        <Text style={[bS.h5,{color:cl.basic.white, textDecorationLine:'underline'}]}>{"Who's coming?"}</Text>
                        <GuestIconDisplay guestList={attendees} userImage={userImage} />
                        {session?.user.id == data.user_id && 
                            <View style={{alignContent:'center', alignSelf:'center', paddingTop:l.spacing.s}}>
                                <SquareButton size={'medium'} label={'Add People'}  fill={true} onPress={()=>console.log('make when freidns are a thing')  }/>
                            </View>}


                    </View>



                    
                    <ShareIconContainer/>
                </View>
            </ScrollView>


        </View>
    )
    
}