

import { Stack } from 'expo-router';
import AuthProvider from '~/contexts/AuthProvider';
import { OverlayProvider } from 'stream-chat-expo'
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-expo';


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


export default function RootLayout() {



  const client = StreamChat.getInstance('4wdb6xkueecd');

  useEffect(()=>{
    const connect = async () => {
      await client.connectUser(
        {
          id: 'jDoe',
          name: 'John Doe',
          image: ''
        },
        client.devToken('jDoe'),
      );
      
      const channel = client.channel('messaging', 'the_park', {
        name: 'The Park',
      });
      await channel.create();
    }


    connect();
  },[])

  return (
    
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OverlayProvider>
          <Chat client={client}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="channel"  />
              <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="editUserModal" options={{ presentation: 'modal', headerShown: false  }} />
              <Stack.Screen name="guestListModal" options={{ presentation: 'modal', headerShown: false  }} />
            </Stack>
          </Chat>
        </OverlayProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
