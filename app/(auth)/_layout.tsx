

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  return (
    <Stack>
      
      <Stack.Screen name="login" options={{ headerShown: false  }} />
      <Stack.Screen name="userDetails" options={{ headerShown: false  }} />
    </Stack>
  );
}
