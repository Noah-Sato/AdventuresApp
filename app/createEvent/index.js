import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
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
    const [capacity, setCapacity] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [guests, setGuests] = useState([])

    const [myLat, setMyLatitude] = useState(null)
    const [myLong, setMyLongitude] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);

    const openDateModal = () => setDateModalShow(true)
    const closeDateModal = () => setDateModalShow(false)

    const guestsSheetRef = useRef(null)

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
            capacity: capacity ? parseInt(capacity, 10) : null,
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
          <SquareButton label={'Invite Friends'} fill={true} size={'medium'} onPress={()=>{
            guestsSheetRef.current?.expand()
          }} />
        </View>
    )




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
                setEventLocation(location)
                setLocationSelected(true)
            }}
            query={{
                key: API_KEY,
                language: 'en',
                types: 'establishment',
                locationbias: `circle:5000@${myLat},${myLong}`,
                maxResultCount: 5,
            }}
            minLength={2}
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
        if (!locationSelected) {
            return <GooglePlacesInput />
        }
        return (
            <TouchableOpacity style={{ paddingVertical: l.spacing.xs - l.spacing.xs3 }} onPress={() => {
                setLocationSelected(false)
                setEventLocation({})
            }}>
                <Text style={[bS.body1, { color: cl.basic.white }]}>{eventLocation.name}</Text>
            </TouchableOpacity>
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
        <View style={[mainStyles.page, { height: l.screen.height + 60, width: l.screen.width }]}>
            <ScrollView style={{ marginHorizontal: l.margins.page, gap: l.spacing.l, height: l.screen.height, width: l.screen.width - l.margins.page * 2 }}>
                <View style={{ paddingBottom: l.spacing.xs }}>
                    <PageHeader fontSize={bS.h3} label={'Plan An Adventure'} close={true} onClosePress={() => { router.navigate('../') }} />
                </View>

                <View style={{ alignSelf: 'stretch', gap: l.spacing.xs }}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Title'} </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={'Give it a name'}
                        placeholderTextColor={cl.grey.eighty}
                        style={textInputStyle}
                    />
                </View>

                <View style={{ alignSelf: 'stretch', gap: l.spacing.xs }}>
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

                <View style={{ alignSelf: 'stretch', gap: l.spacing.xs }}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Where are you going?'} </Text>
                    <View style={{
                        borderWidth: l.spacing.xs3,
                        paddingHorizontal: l.spacing.s,
                        paddingVertical: l.spacing.s,
                        borderRadius: l.spacing.xs,
                        borderColor: cl.basic.white,
                        color: cl.basic.white,
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: l.spacing.xs,
                    }}>
                        <View style={{ paddingTop: l.spacing.xs - l.spacing.xs3 }}>
                            <MiscIcons icon={'search'} fill={cl.red.light_thirty} />
                        </View>
                        <LocationSelector />
                        <View style={{ height: l.spacing.m }} />
                    </View>
                </View>

                <TouchableOpacity style={{ alignSelf: 'stretch', gap: l.spacing.xs }} onPress={() => { openDateModal() }}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'When are you going?'} </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderWidth: l.spacing.xs3,
                        paddingHorizontal: l.spacing.s,
                        paddingVertical: l.spacing.s,
                        borderRadius: l.spacing.xs,
                        borderColor: cl.basic.white,
                        color: cl.basic.white,
                    }}>
                        <Text style={[bS.body2, { color: globalDateRange?.startId ? cl.basic.white : cl.grey.eighty }]}>
                            {formatDateRangeLabel(globalDateRange) ?? 'When are you going?'}
                        </Text>
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty} />
                    </View>
                </TouchableOpacity>
                <DateModal />

                <View style={{ alignSelf: 'stretch', gap: l.spacing.xs }}>
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

                <View style={{ alignSelf: 'stretch', gap: l.spacing.xs }}>
                    <Text style={[bS.body2, { color: cl.basic.white }]}>{'Capacity'} </Text>
                    <TextInput
                        value={capacity}
                        onChangeText={setCapacity}
                        placeholder={'Optional'}
                        placeholderTextColor={cl.grey.eighty}
                        keyboardType={'number-pad'}
                        style={textInputStyle}
                    />
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

            <FriendsBottomSheet ref={guestsSheetRef} selectedIds={guests} onDone={setGuests} />
        </View>
    )
}
