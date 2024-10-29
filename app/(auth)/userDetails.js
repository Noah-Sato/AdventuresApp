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
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@components/Text'



AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })


export default function Auth({ navigation }) {
    const insets = useSafeAreaInsets()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUserName] = useState('')



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

      

      return(
        <View style={{
            paddingHorizontal:l.margins.page, 
            
            backgroundColor:cl.maroon.dark_95,
            width:'100%',
            height:'100%',
            gap:l.spacing.l
            }}>

            
            <PageHeader back={true} onBackPress={()=>router.navigate('../')} label={Dictionary.userAccount.Login}/>



           <View style={{gap:l.spacing.l, paddingTop:l.spacing.xl3+ l.spacing.l}}>

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
            
            </View>

        </View>


      )



}