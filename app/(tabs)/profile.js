import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles } from '@src/theme/Styles';
import { Dictionary } from '@config/Dictionary'

import { Text } from '@src/components/Text';
import { SquareButton }from '@components/Buttons';
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { UserIcon } from '@components/userIcons'
import Edit from '@assets/ButtonIcons/border_color_24px_outlined.svg'

import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';
import { router } from 'expo-router';


export default function Page() {
    const insets = useSafeAreaInsets()
    
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [fullName, setFullName] = useState('')

    const { session } = useAuth();

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        console.log(data.avatar_url)
        setFullName(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
        <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center',alignContent:'center'}}>
            <ActivityIndicator/>
        </View>
    )
   
}


    return( 
        <View style={[mainStyles.page,]}>
            
                
                <View style={{
                    marginHorizontal:l.margins.page,
                    alignItems:'center',
                    gap:l.spacing.m
                }}>
                
                <PageHeader label={Dictionary.tabs.Profile}/>
                
                
                
        
        
            <SquareButton size={'large'} label={'Edit Profile'}  fill={true} onPress={()=>{
              router.navigate('/editUserModal')
              getProfile()}}/>

            <SquareButton label={'sign out'} onPress={() => supabase.auth.signOut()}/>
        </View>
    </View>
        
    )
}