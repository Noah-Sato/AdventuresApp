// Must be the first import: patches crypto.getRandomValues, which uuid-generation code
// elsewhere in the app (e.g. stream-chat's client-side message ids) depends on globally.
import 'react-native-get-random-values';

import {  Stack } from 'expo-router';
import AuthProvider from '~/contexts/AuthProvider';
import ChatProvider from '~/contexts/ChatProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name='createEvent' options={{headerShown: false}} />
              <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="editUserModal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="guestListModal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="addFriend" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="friends" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="memoryBank" options={{ headerShown: false }} />
              <Stack.Screen name="chatContainer" options={{ headerShown: false  }} />
            </Stack>
        </ChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
