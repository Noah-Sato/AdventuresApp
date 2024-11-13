

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';
import ChatProvider from '~/contexts/ChatProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'chatContainer',
};

export default function ChatLayout() {
  

  
  return (
    <ChatProvider>
      <Stack>
      
        <Stack.Screen name="users" options={{ headerShown: false  }} />
        <Stack.Screen name="channel/[cid]" options={{headerShown: false}}/>
        
      
      
     
      </Stack>
    </ChatProvider>
  );
}
