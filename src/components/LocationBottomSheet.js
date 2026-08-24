import { useRef, forwardRef, useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';


import cl from '@theme/Colours'
import l from '@theme/Layout'
import { mainStyles, bS } from '@theme/Styles'

import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';
import { UserIcon } from '@components/userIcons';
import { MiscIcons } from '@theme/Icons'

export default LocationBottomSheet = forwardRef(function LocationBottomSheet({ locationSelected="", onDone}, ref) {

    const [selected, setSelected] = useState(locationSelected);
    const [myLat, setMyLat] = useState(null);
    const [myLong, setMyLong] = useState(null); 
    const placesRef = useRef(null);

    
    const {height: windowHeight} = useWindowDimensions();
    const maxSheetHeight = windowHeight * 0.5


    

   


    useEffect(()=> {
        async function getCurrentLocation() { 
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setMyLat(location.coords.latitude)
            
            setMyLong(location.coords.longitude)
            
        }
        getCurrentLocation();
    }, []);


    


    const GooglePlacesInput = () => (
            <GooglePlacesAutocomplete
                ref={(placesRef)}
                /*renderRightButton={() => (
                    <TouchableOpacity 
                    style={{
                        justifyContent:'center'}}
                    onPress={()=>{
                        placesRef.current?.setAddressText('')
                    }}>
                    
                        <View style={{backgroundColor: cl.maroon.sixty, borderRadius:999, padding: l.spacing.xs2}}>
                            <MiscIcons icon={'close'} fill={cl.basic.white}/>
                        </View>
                    
                    </TouchableOpacity>
                )}*/
                placeholder='Search'
                placeholderTextColor={cl.red.light_thirty}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    const location = {
                        name: details.name,
                        place_id: data.place_id,
                        formatted_address: details.formatted_address,
                        lat: details.geometry?.location?.lat,
                        lng: details.geometry?.location?.lng,
                    }
                    setSelected(location);
                    onDone?.(location)
                    ref?.current?.close()
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
                    language: 'en',
                    //types: 'establishment',
                    ...(myLat != null && myLong != null ? { location: `${myLat},${myLong}`, radius: 5000 } : {}),
                
                }}
                onFail={(error) => console.log('Google Places error:', error)}
                onNotFound={() => console.log('Google Places: zero results for this query')}
                onTimeout={() => console.log('Google Places: request timed out')}
                minLength={1}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                renderRow={(data) => (
                    <View style={{
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        backgroundColor: cl.basic.white,
                        gap: l.spacing.xs,
                   
                        
                        //paddingHorizontal:l.spacing.l
                    }}>
                        <MiscIcons icon={'map'} fill={cl.maroon.dark_95} />
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={[bS.h7, { color: cl.maroon.dark_95, width: l.screen.width - (l.spacing.m * 7) }]}>{data.description}</Text>
                    </View>
                )}
                styles={{
                    container: { width:'85%', alignItems:'center'},
                    listView: {  },
                    separator: { backgroundColor: cl.basic.white },
                    row: { backgroundColor: cl.basic.white,  },
                    textInputContainer: { backgroundColor: cl.basic.white, paddingVertical:l.spacing.xs2, paddingHorizontal:l.buttonSpacing.small, borderWidth: 2, borderRadius:l.spacing.xs, },
                    textInput: {
                        height: 38,
                        fontFamily: 'tenor-sans',
                        fontStyle: 'normal',
                        color: cl.maroon.dark_95,
                        fontSize: 16,
                        backgroundColor: cl.basic.white,
                    },
                    predefinedPlacesDescription: { color: cl.grey.fourty },
                }}
            />
        );


        






    return (
        <BottomSheet 
        ref={ref} 
        index={-1} 
        snapPoints={[maxSheetHeight]} 
        enablePanDownToClose
        onChange={(index) => {
            if(index >=0) placesRef.current?.setAddressText(selected?.name ?? "") 
        }} 
        style={[{
            alignContent:'center',
            justifyContent:'center',
            alignItems:'center'
        }]}>
            
            <View style={[mainStyles.page, 
            { 
            width: l.screen.width,
            marginHorizontal:l.margins.page,
            backgroundColor:cl.basic.white,
            alignContent:'center',
            justifyContent:'center',
            alignItems:'center' 
            }]}>
                <View style={styles.header}>

                    <Text style={[bS.h5, { color: cl.maroon.ninty }]}>{'Where are you going?'}</Text>
                
                </View>

                <GooglePlacesInput/>
            </View>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: l.margins.page,
        paddingBottom: l.spacing.s,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: l.margins.page,
        //paddingBottom: l.spacing.l,
        
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: l.spacing.s,
        paddingVertical: l.spacing.xs,
    },
    checkbox: {
        width: l.spacing.m,
        height: l.spacing.m,
        borderRadius: l.roundness.xs2,
        borderWidth: l.spacing.xs3,
        borderColor: cl.basic.black,
    },
    checkboxSelected: {
        backgroundColor: cl.green.light_thirty,
    },
    footer: {
        backgroundColor: cl.basic.white,
        paddingHorizontal: l.margins.page,
        paddingTop: l.spacing.s,
        paddingBottom: l.spacing.l,
    },
})
