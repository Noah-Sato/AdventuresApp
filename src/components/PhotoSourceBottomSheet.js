import { forwardRef, useCallback, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

import cl from '@theme/Colours'
import l from '@theme/Layout'
import { bS } from '@theme/Styles'

import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';

// Lets the user choose where a photo comes from (camera vs library) before any
// ImagePicker call is made -- unlike FriendsBottomSheet/LocationBottomSheet this has
// no list or selection state, just two one-shot actions that close the sheet immediately.
const PhotoSourceBottomSheet = forwardRef(function PhotoSourceBottomSheet({ onSelect }, ref) {
    const { height: windowHeight } = useWindowDimensions();
    const maxSheetHeight = windowHeight * 0.4;

    const HANDLE_HEIGHT = 24;
    const [contentHeight, setContentHeight] = useState(0);
    const sheetHeight = contentHeight > 0
        ? Math.min(HANDLE_HEIGHT + contentHeight, maxSheetHeight)
        : maxSheetHeight;

    const handleSelect = useCallback((source) => {
        onSelect?.(source);
        ref?.current?.close();
    }, [onSelect, ref]);

    return (
        <BottomSheet ref={ref} index={-1} snapPoints={[sheetHeight]} enablePanDownToClose enableDynamicSizing={false}>
            <View
                style={styles.content}
                onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
            >
                <Text style={[bS.h5, { color: cl.maroon.ninty, paddingBottom: l.spacing.s }]}>{'Add Photo'}</Text>
                <SquareButton label={'Take Photo'} fill={true} size={'medium'} full={true} onPress={() => handleSelect('camera')} />
                <SquareButton label={'Choose from Library'} size={'medium'} full={true} onPress={() => handleSelect('library')} />
            </View>
        </BottomSheet>
    );
});

export default PhotoSourceBottomSheet;

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: l.margins.page,
        paddingBottom: l.spacing.l,
        gap: l.spacing.s,
    },
})
