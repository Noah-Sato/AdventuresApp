import { forwardRef, useCallback, useState } from "react";
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

export default LocationBottomSheet = forwardRef(function LocationBottomSheet({ selectedLocation="", onDone}, ref) {

    const [selected, setSelected] = useState(selectedLocation);
    const {height: windowHeight} = useWindowDimensions();
    const maxSheetHeight = windowHeight * 0.8


    const HANDLE_HEIGHT = 24;
    const [headerHeight, setHeaderHeight] = useState(null);
    const [footerHeight, setFooterHeight] = useState(null);
    const [listContentHeight, setListContentHeight] = useState(0);


    const isChromeMeasured = headerHeight !== null && footerHeight !== null;
    const chromeHeight = (headerHeight ?? 0) + (footerHeight ?? 0);
    const availableForList = Math.max(0, maxSheetHeight - HANDLE_HEIGHT - chromeHeight);
    const listHeight = Math.min(listContentHeight, availableForList);
    const sheetHeight = isChromeMeasured
        ? Math.max(
            HANDLE_HEIGHT + chromeHeight,
            Math.min(HANDLE_HEIGHT + chromeHeight + listHeight, maxSheetHeight)
        )
        : maxSheetHeight;


    const handleDone = useCallback((profileId) => {
        onDone?.(selected);
        ref?.current?.close();
        
    }, [onDone, selected, ref]);

    const LocationItem = ({data}) => {
        return(
            <View>

            </View>
        )
    }





    return (
        <BottomSheet ref={ref} index={-1} snapPoints={[sheetHeight]} enablePanDownToClose style={[{alignContent:'center',justifyContent:'center',alignItems:'center'}]}>
            <View
                style={styles.header}
                onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
                 <Text style={[bS.h5, { color: cl.maroon.ninty }]}>{'Where are you going?'}</Text>
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
