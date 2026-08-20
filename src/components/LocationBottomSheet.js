import { forwardRef, useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';


import cl from '@theme/Colours'
import l from '@theme/Layout'
import { bS } from '@theme/Styles'

import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';
import { UserIcon } from '@components/userIcons';
import { MiscIcons } from '@theme/Icons'

export default LocationBottomSheet = forwardRef(function LocationBottomSheet({ locationSelected="", onDone}, ref) {

    const [selected, setSelected] = useState(locationSelected);
    const [myLat, setMyLat] = useState(null);
    const [myLong, setMyLong] = useState(null); 

    
    const {height: windowHeight} = useWindowDimensions();
    const maxSheetHeight = windowHeight * 0.7


    

    /*
    const handleDone = useCallback((profileId) => {
        onDone?.(selected);
        ref?.current?.close();
        
    }, [onDone, selected, ref]);
    


    const 

    const LocationItem = ({data}) => {
        return(
            <View>

            </View>
        )
    }
    */


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
                        backgroundColor: cl.maroon.dark_95,
                        gap: l.spacing.xs
                    }}>
                        <MiscIcons icon={'map'} fill={cl.basic.white} />
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={[bS.h7, { color: cl.basic.white, width: l.screen.width - (l.spacing.m * 7) }]}>{data.description}</Text>
                    </View>
                )}
                styles={{
                    container: { width: '100%' },
                    listView: { width: '100%' },
                    separator: { backgroundColor: cl.maroon.dark_95 },
                    row: { backgroundColor: cl.maroon.dark_95, width: '100%' },
                    textInputContainer: { backgroundColor: cl.maroon.dark_95 },
                    textInput: {
                        height: 38,
                        fontFamily: 'tenor-sans',
                        fontStyle: 'normal',
                        color: cl.basic.white,
                        fontSize: 16,
                        backgroundColor: cl.maroon.dark_95,
                    },
                    predefinedPlacesDescription: { color: cl.grey.fourty },
                }}
            />
        );


        const LocationSelector = () => {
        if (!selected?.place_id) {
            return <GooglePlacesInput />
        }
        return (
            <TouchableOpacity style={{ paddingVertical: l.spacing.xs - l.spacing.xs3 }} onPress={() => {
                setSelected(null)
                //setEventLocation({})
            }}>
                <Text style={[bS.body1, { color: cl.basic.white }]}>{selected.name}</Text>
            </TouchableOpacity>
        )
    }






    return (
        <BottomSheet ref={ref} index={-1} snapPoints={[maxSheetHeight]} enablePanDownToClose style={[{alignContent:'center',justifyContent:'center',alignItems:'center'}]}>
            <View style={styles.header}>

                 <Text style={[bS.h5, { color: cl.maroon.ninty }]}>{'Where are you going?'}</Text>
            
            </View>

            <LocationSelector/>

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
