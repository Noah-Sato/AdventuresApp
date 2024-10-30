import { Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

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
import { IconContainer } from '../src/components/IconContainer';


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

  async function updateProfile({
    username,
    full_name,
    website,
    avatar_url,
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }



    return( 
        <View style={[mainStyles.page,]}>
            
                
                <View style={{
                    marginHorizontal:l.margins.page,
                    
                    alignSelf:'stretch'
                }}>
                <ScrollView>
                
                    <View style={{gap:l.spacing.m}}>

                    <PageHeader label={Dictionary.tabs.Profile} back={true} onBackPress={()=>{router.navigate('../')}}/>
                    
                    
                    <View>
                        <UserIcon size={'profile'}/>

                        <Pressable onPress={()=>{console.log('profile to edit')}}style={{
                            position:'absolute',
                            bottom:-l.spacing.xs2,
                            right:l.spacing.xl2 * 2 - l.spacing.xs2,
                            padding:l.spacing.xs2
                            
                        }}>
                            <IconContainer size={'small'} icon={Edit}/>
                        </Pressable>
                    </View>


                    <View style={{
                        alignSelf:'stretch',
                        gap:l.spacing.m
                    }}>
                
                    <View style={{alignSelf:'stretch'}}>
                        <Text style={[bS.body3,{color:cl.basic.white}]}>{'Your email'} </Text>
                        <View style={{
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        color:cl.basic.white,
                        alignSelf:'stretch',
                        flexDirection:'row',
                        justifyContent:'space-between',
                    }}>
                        <TextInput
                        style={[bS.h7,{color:cl.basic.white}]}
                        editable={false}
                        label="Email"
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        value={session.user.email}
                        placeholder="email address"
                        autoCapitalize={'none'}
                        />
                        <View style={{height:l.spacing.m}}/>
                        </View>
                    </View>

                    <View style={{alignSelf:'stretch'}}>
                        <Text style={[bS.body3,{color:cl.basic.white}]}>{'Your username'} </Text>
                        <View style={{
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        color:cl.basic.white,
                        alignSelf:'stretch',
                        flexDirection:'row',
                        justifyContent:'space-between',
                    }}>
                        <TextInput
                        style={[bS.h7,{color:cl.basic.white}]}
                        label="Username"
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        value={username}
                        placeholder="Please add an username"
                        placeholderTextColor={cl.red.light_thirty}
                        autoCapitalize={'none'}
                        cursorColor={cl.basic.white}
                        keyboardType='default'
                        keyboardAppearance='light'  
                        onChangeText={(text) => setUsername(text)}
                        />
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                        </View>
                    </View>

                
                
                
                
                
                
                
                
                
                    <View style={{alignSelf:'stretch'}}>
                        <Text style={[bS.body3,{color:cl.basic.white}]}>{'Your name'} </Text>
                        <View style={{
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        color:cl.basic.white,
                        alignSelf:'stretch',
                        flexDirection:'row',
                        justifyContent:'space-between',
                    }}>
                        <TextInput
                        style={[bS.h7,{color:cl.basic.white}]}
                        label="Full Name"
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        value={fullName}
                        placeholder="Please add your full name"
                        placeholderTextColor={cl.red.light_thirty}
                        autoCapitalize={'none'}
                        cursorColor={cl.basic.white}
                        keyboardType='default'
                        keyboardAppearance='light'  
                        onChangeText={(text) => setFullName(text)}
              
                        />
                        <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                        
                        </View>
                    </View>
            
                    </View>
        
                    <View style={{alignSelf:'center'}}>
                    <SquareButton size={'large'} label={'save'}  fill={true} onPress={()=>updateProfile({username, website, avatar_url:avatarUrl, full_name:fullName})}/>
                    </View>
                </View>
            </ScrollView>
        </View>
    </View>
        
    )
}