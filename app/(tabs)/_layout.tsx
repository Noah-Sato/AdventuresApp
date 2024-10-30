import { Link, Redirect, Tabs } from 'expo-router';
import cl from '../../../AdventuresApp/src/theme/Colours'
import { supabase } from '~/utils/supabase'

import { HeaderButton } from '../../../AdventuresApp/src/components/HeaderButton';
import { TabBarIcon } from '../../../AdventuresApp/src/components/TabBarIcon';
import { TabBarIcons } from '../../../AdventuresApp/src/theme/Icons';
import { useAuth } from '~/contexts/AuthProvider';


export default function TabLayout() {


  const  { isAuthenticated  } = useAuth();

  if ( !isAuthenticated ){

  return <Redirect href='/(auth)/login'/>

  } 

  
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: cl.maroon.dark_95,
          tabBarInactiveTintColor:cl.maroon.standard_seventy,
          tabBarShowLabel:false,
          
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcons icon={'home'} fill={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <HeaderButton />
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => <TabBarIcons icon={'chats'} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcons icon={'profile'} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Events',
            tabBarIcon: ({ color }) => <TabBarIcons icon={'events'} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <TabBarIcons icon={'settings'} fill={color} />,
          }}
        />
      </Tabs>
    );
  
}
