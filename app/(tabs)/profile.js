import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';

export default function Page() {
    const insets = useSafeAreaInsets()


    return( 
        <View style={[mainStyles.page,{paddingTop:insets.top}]}>
            <Text>hello world</Text>
        </View>
    )
}