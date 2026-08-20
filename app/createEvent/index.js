import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { router, useFocusEffect } from "expo-router";
import * as Location from 'expo-location';
import { format, parseISO } from 'date-fns';

import { mainStyles, bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';
import { MiscIcons } from '@theme/Icons'
import { useStore } from '@store'
import { useCreateEvent } from '@hooks/useEvents'
import FriendsBottomSheet from '@components/FriendsBottomSheet'

import LocationBottomSheet from "@components/LocationBottomSheet";

import Edit from '@assets/ButtonIcons/border_color_24px_outlined.svg'

// Calendar selection is date-only (no time-of-day picker built yet) -- events default to
// noon on the selected day. Revisit if events need precise start times.
const DEFAULT_TIME = 'T12:00:00'

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY




function formatDateRangeLabel(dateRange) {
    if (!dateRange?.startId) return null
    const start = format(parseISO(dateRange.startId), 'do MMM yyyy')
    if (dateRange.endId && dateRange.endId !== dateRange.startId) {
        return `${start} - ${format(parseISO(dateRange.endId), 'do MMM yyyy')}`
    }
    return start
}

export default function CreateEventPage() {
    const globalLocation = useStore((state) => state.location)
    const setGlobalLocation = useStore((state) => state.setLocation)
    const resetGlobalLocation = useStore((state) => state.resetLocation)
    const globalDateRange = useStore((state) => state.dateRange)
    const resetGlobalDateRange = useStore((state) => state.resetDateRange)
    const { createEvent } = useCreateEvent()

    const [eventLocation, setEventLocation] = useState({})
    const [locationSelected, setLocationSelected] = useState(false)
    const [dateModalShow, setDateModalShow] = useState(false)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [visibility, setVisibility] = useState('private')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [guests, setGuests] = useState([])

    const [myLat, setMyLatitude] = useState(null)
    const [myLong, setMyLongitude] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);

    const openDateModal = () => setDateModalShow(true)
    const closeDateModal = () => setDateModalShow(false)

    const guestsSheetRef = useRef(null)
    const locationSheetRef = useRef(null)

    useEffect(() => {
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
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (globalLocation) {
                setEventLocation(globalLocation)
                setLocationSelected(true)
            } else {
                setLocationSelected(false)
            }
        }, [globalLocation])
    );

    const canSubmit = title.trim().length > 0 && locationSelected && !!globalDateRange?.startId

    const onSubmit = async () => {
        if (!canSubmit || submitting) return
        setSubmitting(true)
        setSubmitError(null)

        const { data, error } = await createEvent({
            title: title.trim(),
            description: description.trim() || null,
            visibility,
            start_date: `${globalDateRange.startId}${DEFAULT_TIME}`,
            end_date: globalDateRange.endId ? `${globalDateRange.endId}${DEFAULT_TIME}` : null,
            place_id: eventLocation.place_id,
            formatted_address: eventLocation.formatted_address,
            lat: eventLocation.lat,
            lng: eventLocation.lng,
        })

        setSubmitting(false)

        if (error) {
            setSubmitError(error.message)
            console.log(error.message)
            return
        }

        resetGlobalLocation()
        resetGlobalDateRange()
        // Cover/description photos are optional and skippable from here (the edit screen's
        // "Done" button goes to the event detail page, where inviting guests happens next).
        router.replace(`/event/${data.id}/edit`)
    }

    const DateModal = () => (
        <Modal
            transparent={true}
            visible={dateModalShow}
            onRequestClose={() => closeDateModal()}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: cl.grey.overlayEighty,
            }}>
                <View style={{
                    borderWidth: l.spacing.xs3,
                    paddingHorizontal: l.spacing.s,
                    paddingVertical: l.spacing.l,
                    borderRadius: l.spacing.xs,
                    borderColor: cl.basic.white,
                    backgroundColor: cl.maroon.dark_95,
                    marginHorizontal: l.margins.page * 2
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[bS.h5, { color: cl.basic.white }]}>{`When are you going?`}</Text>
                        <TouchableOpacity onPress={() => closeDateModal()}>
                            <MiscIcons icon={'close'} fill={cl.red.light_thirty} size={28} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', paddingTop: l.spacing.l, gap: l.spacing.s }}>
                        <SquareButton label={`Choose Dates`} fill={true} size={'medium'} onPress={() => {
                            closeDateModal()
                            router.navigate('/createEvent/largeCalendar')
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    )


    const InviteFriends = () => (
        <View>
          <SquareButton label={'Invite Friends'} fill={true} size={'large'} onPress={()=>{
            guestsSheetRef.current?.expand()
          }} />
        </View>
    )

    const SelectLocation = () => {
        const LocationButton = ( props ) => {

            const onPressHandler = () => (props.onPress ? props.onPress() : console.log('button pressed'));
            const label = props.label ? props.label : 'PlaceHolder'

            return(
                <TouchableOpacity onPress={onPressHandler} >
                    <View style={[{
                        alignSelf:'stretch',
                        paddingHorizontal: l.buttonSpacing.xlarge,
                        paddingVertical: l.buttonSpacing.large,
                        backgroundColor: cl.maroon.dark_95,
                        borderColor: cl.basic.white,
                        alignItems:'center',
                        justifyContent: 'flex-start', 
                        alignContent: 'center',
                        flexDirection:'row',
                        gap:l.spacing.xs2,
                        borderWidth: 2, 
                        borderRadius:l.spacing.xs,
                        gap:l.spacing.l
                        
                        
                        
                        
                        }]}>
                            <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty} />
                            <Text style={[bS.body2,, {color:cl.grey.eighty, paddingTop: l.sizeFromHeight(3)}]}>{label}</Text>
                            
                        
                        
                    </View>
            </TouchableOpacity>
            )

        }    


        
        return(
            <View style={{gap:l.spacing.xs}}>
                <Text style={[bS.body2, { color: cl.basic.white }]}>{'Where are you going?'} </Text>
               <LocationButton  label={'Where are you going?'} onPress={()=>{
                    locationSheetRef.current?.expand()
                }}/>
            </View>

         )
    }





    
    const textInputStyle = {
        borderWidth: l.spacing.xs3,
        paddingHorizontal: l.spacing.s,
        paddingVertical: l.spacing.s,
        borderRadius: l.spacing.xs,
        borderColor: cl.basic.white,
        color: cl.basic.white,
        fontFamily: 'tenor-sans',
    }

    return (
        <View style={[mainStyles.page, { width: l.screen.width, paddingBottom: l.spacing.l}]}>
            <ScrollView style={{ marginHorizontal: l.margins.page, gap: l.spacing.l * 2, width: l.screen.width - l.margins.page * 2 }}>
                <View style={{ paddingBottom: l.spacing.xs }}>
                    <PageHeader fontSize={bS.h3} label={'Plan An Adventure'} close={true} onClosePress={() => { router.navigate('../') }} />
                </View>

                <View style={styles.entryFields}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Title'} </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={'Give it a name'}
                        placeholderTextColor={cl.grey.eighty}
                        style={textInputStyle}
                    />
                </View>

                <View style={styles.entryFields}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Description'} </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder={'Optional'}
                        placeholderTextColor={cl.grey.eighty}
                        multiline={true}
                        style={[textInputStyle, { minHeight: l.spacing.xl2 }]}
                    />
                </View>

                <View style={styles.entryFields}>
                     <SelectLocation />
                </View>
               

                <TouchableOpacity style={styles.entryFields} onPress={() => { openDateModal() }}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'When are you going?'} </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        borderWidth: l.spacing.xs3,
                        paddingHorizontal: l.spacing.s,
                        paddingVertical: l.spacing.s,
                        borderRadius: l.spacing.xs,
                        borderColor: cl.basic.white,
                        color: cl.basic.white,
                        gap:l.spacing.l
                    }}>
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty} />
                        <Text style={[bS.body2, { color: globalDateRange?.startId ? cl.basic.white : cl.grey.eighty }]}>
                            {formatDateRangeLabel(globalDateRange) ?? 'When are you going?'}
                        </Text>
                        
                    </View>
                </TouchableOpacity>
                <DateModal />

                <View style={{gap:l.spacing.s}}>
                <View style={styles.entryFields}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Who can see this?'} </Text>
                    <View style={{ flexDirection: 'row', gap: l.spacing.xs }}>
                        <SquareButton
                            label={'Private'}
                            size={'small'}
                            fill={visibility === 'private'}
                            onPress={() => setVisibility('private')}
                        />
                        <SquareButton
                            label={'Public'}
                            size={'small'}
                            fill={visibility === 'public'}
                            onPress={() => setVisibility('public')}
                        />
                    </View>
                </View>

                

                <InviteFriends />
              
                

                </View>

                {submitError && (
                    <Text style={[bS.body3, { color: cl.red.light_thirty }]}>{submitError}</Text>
                )}

                <View style={{ alignItems: 'center', paddingTop: l.spacing.xs }}>
                    <SquareButton
                        label={submitting ? 'Creating...' : 'Create Event'}
                        fill={canSubmit}
                        size={'medium'}
                        full={true}
                        onPress={onSubmit}
                    />
                </View>
            </ScrollView>

            <LocationBottomSheet ref={locationSheetRef} selectedLocation={eventLocation} onDone={setEventLocation}/>
            <FriendsBottomSheet ref={guestsSheetRef} selectedIds={guests} onDone={setGuests} />
        </View>
    )
}


const styles = StyleSheet.create({

    entryFields: {
        alignSelf: 'stretch', 
        gap: l.spacing.xs,
        paddingTop:l.spacing.l 
    }

})