import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { mainStyles } from '@theme/Styles';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import l from '@theme/Layout';

// Real settings content is out of scope for now -- this is just the relocated stub,
// reachable from Profile instead of the tab bar.

export default function SettingsScreen() {
    return (
        <ScrollView style={[mainStyles.page]}>
            <View style={{ paddingHorizontal: l.margins.page }}>
                <PageHeader label={'Settings'} back={true} onBackPress={() => router.navigate('../')} />
            </View>
        </ScrollView>
    )
}
