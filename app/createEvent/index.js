import { useState, useEffect, useRef, useCallback } from "react";
import { View, TextInput, TouchableOpacity, Modal, Animated } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { router, useFocusEffect } from "expo-router";

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';


import { mainStyles } from '@src/theme/Styles';
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@src/components/Text';
import { SquareButton }from '@components/Buttons';
import { MiscIcons } from '@theme/Icons'


import Edit from '@assets/ButtonIcons/border_color_24px_outlined.svg'
import { useEventsStore } from "../../src/store/useStore";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY


export default function CreateEventPage() {

    const globalLocation = useEventsStore((state) => state.location)
    const setGlobalLocation = useEventsStore((state) => state.setLocation)
    const resetGlobalLocation = useEventsStore((state) => state.resetLocation)

    const globalStartDate = useEventsStore((state) => state.startDate)
    const setGlobalStartDate = useEventsStore((state) => state.setStartDate)
    const resetGlobalStartDate = useEventsStore((state) => state.resetStartDate)

    
    

    const [startDate, setStartDate] = useState(undefined)
    const [eventLocation, setEventLocation] = useState({})
    const [guests, setGuests] = useState(undefined)
    const [dateModalShow, setDateModalShow] = useState(false)
    
    const [myLat, setMyLatitude] = useState(null)
    const [myLong, setMyLongitude] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false)

    const openDateModal = () => {
        setDateModalShow(true)
    }

    const closeDateModal = () => {
        setDateModalShow(false)
    }


    
    

    useEffect(() => {


        //console.log(globalLocation, 'hhhhhhh')
        

        async function getCurrentLocation() {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        
        
        setMyLatitude(location.coords.latitude)
        setMyLongitude(location.coords.longitude)
        }

        getCurrentLocation();
        
        console.log('use bottomSheet for whos invited friends selector')
    }, []);


    useFocusEffect(
        
        useCallback(() => {
          // Invoked whenever the route is focused.
          console.log('Hello, Im focused!', globalLocation);


         if (globalLocation !== null && globalLocation !== undefined) {
            setEventLocation(globalLocation)
            setLocationSelected(true)
         } else {
            setLocationSelected(false)
         }
    
          // Return function is invoked whenever the route gets out of focus.
          return () => {
            console.log('This route is now unfocused.');

          };
        }, [globalLocation])
       );



    


    const DateModal = () => {
        const [ eventSoon, setEventSoon ] = useState()


        return(
            <Modal
                transparent={true}
                visible={dateModalShow}
                onRequestClose={() => {
                    closeDateModal()
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent:'center',    
                    alignContent:'center',
                    backgroundColor:cl.grey.overlayEighty,
                    
                }}>
                    <View style={{
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.l,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        backgroundColor:cl.maroon.dark_95,
                        marginHorizontal:l.margins.page * 2
                        
                    }}>

                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between'
                        }}>
                            <Text style={[bS.h5,{color:cl.basic.white}]}>{`When are you going?`}</Text>
                            <TouchableOpacity onPress={()=>{closeDateModal()}}>
                                <MiscIcons icon={'close'} fill={cl.red.light_thirty} size={28}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            alignItems:'center',
                            paddingTop:l.spacing.l,
                            gap:l.spacing.s

                        }}>
                            <SquareButton label={`In the Next Week`} fill={true} size={'medium'} />
                            <SquareButton label={`Further in the future`} fill={true} size={'medium'} onPress={()=>{
                                closeDateModal()
                                setGlobalLocation(eventLocation)
                                router.navigate('/createEvent/largeCalendar')
                            }} />

                        </View>
                        
                        
                    </View>
                </View>
            </Modal>
        )
    }


    const GooglePlacesInput = () => {
        
        

        return (
          <GooglePlacesAutocomplete
            value={'yo'}
            placeholder='Search'
            placeholderTextColor={cl.red.light_thirty}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true

            const location = {
                name: details.name,
                id: data.place_id,
                address: details.formatted_address,
                geometry: details.geometry
            }

            setEventLocation(location)
            setLocationSelected(true)
            


            }}
            query={{
              key: API_KEY,
              language: 'en',
              types: 'establishment',
              locationbias:`circle:5000@${myLat},${myLong}`,
              //rankby:'distance',
              maxResultCount: 5,

            }}
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            renderRow={(data, index) => {


                    //console.log(data)
                return(
                <View style={{
                    flex:1,
                    width:'100%',
                    flexDirection:'row',
                    backgroundColor:cl.maroon.dark_95,
                    gap:l.spacing.xs
                }}>
                    <MiscIcons icon={'map'} fill={cl.basic.white

                    }/>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[bS.h7,{color:cl.basic.white, width:l.screen.width - (l.spacing.m * 7)}]}>{data.description}</Text>
                </View>
                
                )
            }}
            styles={{
                container:{
                    width:'100%',
                    backgroundColor:'red'
                },

                listView:{
                    width:'100%'
                },
                separator:{
                    backgroundColor:cl.maroon.dark_95
                },
                row:{
                    backgroundColor:cl.maroon.dark_95,
                    width:'100%',
                    

                },
                textInputContainer: {
                backgroundColor: cl.maroon.dark_95,
                
                
                },
                textInput: {
                height: 38,
                fontFamily: 'tenor-sans', 
                fontStyle: 'normal',
                color: cl.basic.white,
                fontSize: 16,
                
                backgroundColor: cl.maroon.dark_95,
                
                
                

                },
                predefinedPlacesDescription: {
                color: cl.grey.fourty,
                },


                
            }}
          />
        );
      };



    const locationSelectable = () => {
        setLocationSelected(false)
    }

    const locationNotSelectable = () => {
        setLocationSelected(true)
    }
    

    const LocationSelector = () => {



        console.log(locationSelected, 'selected ?')

        if (!locationSelected) {
            return <GooglePlacesInput/>
        } else {

            return(
                <TouchableOpacity style={{paddingVertical:l.spacing.xs - l.spacing.xs3}} onPress={()=>{
                    setLocationSelected(false)
                    setEventLocation({})}}>
                    <Text style={[bS.body1,{color:cl.basic.white}]}>{eventLocation.name}</Text>
                </TouchableOpacity>
            )

        }
        



    }


    return(
        <View style={[mainStyles.page, {height:l.screen.height, width:l.screen.width }]}>
        
        
                
            <View style={{marginHorizontal:l.margins.page, gap:l.spacing.xl3, height:l.screen.height, width:l.screen.width - l.margins.page*2}}>
                <View style={{paddingBottom:l.spacing.l,}} >
                    <PageHeader fontSize={bS.h3} label={'Plan An Adventure'} close={true} onClosePress={()=>{router.navigate('../')}}/>
                </View>

                
                
                

                <View style={{alignSelf:'stretch', gap:l.spacing.xs}}>
                            <Text style={[bS.body2,{color:cl.basic.white}]}>{'Where are you going?'} </Text>
                            <View style={{
                            borderWidth:l.spacing.xs3,
                            paddingHorizontal:l.spacing.s,
                            paddingVertical:l.spacing.s,
                            borderRadius:l.spacing.xs,
                            borderColor:cl.basic.white,
                            color:cl.basic.white,
                            alignSelf:'stretch',
                            flexDirection:'row',
                            justifyContent:'flex-start',
                            gap:l.spacing.xs,
                            
                        }}>
                                <View style={{paddingTop:l.spacing.xs - l.spacing.xs3}}>
                                    <MiscIcons icon={'search'} fill={cl.red.light_thirty}/>
                                </View>
                                <LocationSelector/>
                                <View style={{height:l.spacing.m}}/>

                            
                            </View>


                </View>

                <TouchableOpacity style={{alignSelf:'stretch', gap:l.spacing.xs}} onPress={()=>{openDateModal()}}>
                    <Text style={[bS.body2,{color:cl.basic.white}]}>{'When are you going?'} </Text>
                    <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            borderWidth:l.spacing.xs3,
                            paddingHorizontal:l.spacing.s,
                            paddingVertical:l.spacing.s,
                            borderRadius:l.spacing.xs,
                            borderColor:cl.basic.white,
                            color:cl.basic.white,
                        }}>
                        {!startDate && <Text style={[bS.body2,{color:cl.grey.eighty}]}>{'When are you going?'} </Text>}
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                    </View>
                </TouchableOpacity>
                <DateModal/>

                <TouchableOpacity style={{alignSelf:'stretch', gap:l.spacing.xs}}>
                    <Text style={[bS.body2,{color:cl.basic.white}]}>{"Who's invited?"} </Text>
                    <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            borderWidth:l.spacing.xs3,
                            paddingHorizontal:l.spacing.s,
                            paddingVertical:l.spacing.s,
                            borderRadius:l.spacing.xs,
                            borderColor:cl.basic.white,
                            color:cl.basic.white,
                        }}>
                        {guests == undefined && <Text style={[bS.body2,{color:cl.grey.eighty}]}>{"Who's invited?"} </Text>}
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                    </View>
                </TouchableOpacity>
            
            
                
            </View>
            
            
            

        </View>

    )
}