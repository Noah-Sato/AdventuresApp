import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Modal, Animated } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { router } from "expo-router";

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { mainStyles } from '@src/theme/Styles';
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@src/components/Text';
import { SquareButton }from '@components/Buttons';
import { MiscIcons } from '@theme/Icons'


import Edit from '@assets/ButtonIcons/border_color_24px_outlined.svg'





export default function CreateEventPage() {

    const [startDate, setStartDate] = useState(undefined)
    const [location, setLocation] = useState(undefined)
    const [guests, setGuests] = useState(undefined)
    const [dateModalShow, setDateModalShow] = useState(false)

    const openDateModal = () => {
        setDateModalShow(true)
    }

    const closeDateModal = () => {
        setDateModalShow(false)
    }



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
                            <SquareButton label={`In the Next Week`} fill={true} size={'medium'}/>
                            <SquareButton label={`Further in the future`} fill={true} size={'medium'}/>

                        </View>
                        
                        
                    </View>
                </View>
            </Modal>
        )
    }


    const GooglePlacesInput = () => {
        return (
          <GooglePlacesAutocomplete
            placeholder='Search'
            placeholderTextColor={cl.red.light_thirty}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: 'AIzaSyA5jpsrHdv3Xrx3fWexVtht9qadBsxLI0A',
              language: 'en',
              types: 'establishment',
              maxResultCount: 9
            }}
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            styles={{
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


    return(
        <View style={[mainStyles.page, {height:l.screen.heigh, width:l.screen.width }]}>
        
        
                
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
                                <GooglePlacesInput/>
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