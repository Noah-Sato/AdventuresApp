
import { StyleSheet, View } from 'react-native';
import { Text } from '@src/components/Text';


import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';





export default function Page() {
    return(
        <View style={[ { gap:20 }]}>
            <StatusBar backgroundColor="transparent"   translucent={true} hidden={true} />

            <Text>hi</Text>
        </View>
    )
}