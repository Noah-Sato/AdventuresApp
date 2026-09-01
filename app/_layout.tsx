// The real first-import guarantee lives in index.js (this file isn't the true entry point --
// Expo Router's route discovery can require other files, and therefore this polyfill, before
// this one runs). Kept here too as a harmless, self-documenting no-op via Metro's module cache.
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
