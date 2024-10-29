

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

export default function AuthLayout() {
  const  { isAuthenticated } = useAuth();

  if ( isAuthenticated ) {
    return <Redirect href="/" />
  }
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false  }} />
      <Stack.Screen name="userDetails" options={{ headerShown: false  }} />
    </Stack>
  );
}
