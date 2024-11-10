

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(event/[id])',
};

export default function EventLayout() {
  

  
  return (
    <Stack>

      <Stack.Screen name="index" options={{ headerShown: false  }} />
      
      
     
    </Stack>
  );
}
