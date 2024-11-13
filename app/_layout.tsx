

import { Redirect, Stack } from 'expo-router';
import AuthProvider from '/Users/main/Documents/Work/Projects/socialMediaProject/AdventuresApp/contexts/AuthProvider';
import { OverlayProvider } from 'stream-chat-expo'
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-expo';


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import ChatProvider from '/Users/main/Documents/Work/Projects/socialMediaProject/AdventuresApp/contexts/ChatProvider';
import { useAuth } from '~/contexts/AuthProvider';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


export default function RootLayout() {

  

  console.log('root')
    
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>       
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              
              <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="editUserModal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="guestListModal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="chatContainer" options={{ headerShown: false  }} />
            </Stack>
            
      </AuthProvider>  
    </GestureHandlerRootView>
  );
}
