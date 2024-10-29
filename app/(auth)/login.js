import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TextInput, Button } from 'react-native'
import { supabase } from '~/utils/supabase'
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SquareButton, SquareButtonFull } from '@components/Buttons'
import { Dictionary } from '@config/Dictionary'
import { router, Stack } from 'expo-router'
import { Text } from '@components/Text'
import { PageHeader } from '@components/pageGeneral/pageHeader'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={{
      paddingHorizontal:l.margins.page, 
      
      backgroundColor:cl.maroon.dark_95,
      width:'100%',
      height:'100%',
      gap:l.spacing.xl
      }}>

      <PageHeader label={Dictionary.userAccount.Login}/>

        

      <View style={{gap:l.spacing.m, paddingTop:l.spacing.xl3+ l.spacing.m}}>
        
        
        <View style={{gap:l.spacing.xs}}>
          <Text style={[bS.body4,{color:cl.basic.white}]}>{'Please enter your email'} </Text>
          <View style={{
            borderWidth:l.spacing.xs3,
            paddingHorizontal:l.spacing.s,
            paddingVertical:l.spacing.s,
            borderRadius:l.spacing.xs,
            borderColor:cl.basic.white,
            color:cl.basic.white,




          }}>
            <TextInput
              style={{color:cl.basic.white}}
              label="Email"
              placeholderTextColor={cl.grey.sixty}
              cursorColor={cl.basic.white}
              numberOfLines={1}
              keyboardType='email-address'
              keyboardAppearance='light'
              ellipsizeMode='tail'
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Please enter your email address"
              autoCapitalize={'none'}
            />
          </View>
        
        </View>
        
        <View style={{gap:l.spacing.xs}}>
          <Text style={[bS.body4,{color:cl.basic.white}]}>{'Please enter your password'} </Text>
          <View style={{
            borderWidth:l.spacing.xs3,
            paddingHorizontal:l.spacing.s,
            paddingVertical:l.spacing.s,
            borderRadius:l.spacing.xs,
            borderColor:cl.basic.white,
            color:cl.basic.white



          }}>
              
            <TextInput
              style={{color:cl.basic.white}}
              label="Password"
              placeholderTextColor={cl.grey.sixty}
              cursorColor={cl.basic.white}
              numberOfLines={1}
              keyboardAppearance='light'
              ellipsizeMode='tail'
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={'none'}
            />
          </View>
        </View>
      </View>
      
        
      <View style={{
        paddingHorizontal:l.spacing.m,
        gap:l.spacing.s,
        
      }}>
        <SquareButton onPress={() => signInWithEmail()} full={true} size={'large'} fill={true} label ={Dictionary.userAccount.In}/>
        <View style={{
          alignSelf:'center'
        }}>
        <SquareButton onPress={() => router.navigate('/userDetails')} size={'large'} fill={true} label ={Dictionary.userAccount.Up}/>
        </View>
      </View>
        
        
      
    </View>
  )
}

