import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'createEvent',
};

export default function CreationLayout() {
  

  
  return (
    <Stack>

      <Stack.Screen name="index" options={{ headerShown: false  }} />
      <Stack.Screen name="largeCalendar" options={{headerShown : false}}/>
      
      
     
    </Stack>
  );
} 
