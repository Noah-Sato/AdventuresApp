import { useEffect, useState } from "react";
import { FlatList, View, TouchableOpacity, TextInput } from "react-native";
import { Text } from '@src/components/Text';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';
import { router } from "expo-router";

import { bS, mainStyles } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem } from "@components/listDisplays/UserListItem";
import { useFriends } from '@hooks/useFriends'

import Close from '@assets/ButtonIcons/close_24px_outlined.svg'
import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'




function PageHeader(props) {
    const insets = useSafeAreaInsets()

    const label = props.label ? props.label : 'Header Placeholder'
    const closeIcon = props.close ? props.close : false
    const backIcon = props.back ? props.back : false

    
    const onBackPressHandler = () => props.onBackPress();
    const onClosePressHandler = () => props.onClosePress();

    return(
        <View style={[{
            flexDirection:'row',
            paddingTop:insets.top + l.spacing.s,
            justifyContent:'space-between',
            alignItems:'center',
                
        } ]}>
            
            {backIcon && 
            <TouchableOpacity onPress={onBackPressHandler}  >
                <Back width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>}

            <View style={{
            flexDirection:'row',
            gap:l.spacing.s,
            alignItems:'center',
            alignSelf:'center',
            alignContent:'center'
        }}>
            

            <Text numberOfLines={1}  ellipsizeMode={'tail'} style={[bS.h1,{color:cl.basic.white, width:l.screen.width /2, textAlign:'center' }]}>{label}</Text>
            </View>

            <View style={{width:l.spacing.l}}/>

            
        </View>

    )
    


}


export default function UsersScreen() {
    const [users, setUsers] = useState([])
    const { user } = useAuth()
    const [query, setQuery] = useState('');
    const { friends } = useFriends();

    const filtered = friends.filter(f => 
        (f.profile.full_name ?? f.profile.username ?? '').toLowerCase().includes(query.toLowerCase())
    )


    useEffect(()=>{
        const fetchUsers = async() => {
            let {data: profiles, error} = await supabase.from('profiles').select('*').neq('id', user.id);
            setUsers(profiles);
        }

        fetchUsers();
    }, [])

    return(
        <View style={[mainStyles.page]}>

            <View style={{paddingHorizontal:l.margins.page,}}>
                <PageHeader back={true} onBackPress={()=>{router.navigate('../')}} label={'users'} />
            </View>

            <View style={{paddingHorizontal:l.margins.page, paddingVertical:l.spacing.m}}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={'Search Friends'}
                    placeholderTextColor={cl.grey.eighty}
                    autoCapitalize={'none'}
                    style={{
                        borderWidth: l.spacing.xs3,
                        borderColor: cl.basic.white,
                        borderRadius: l.spacing.xs,
                        paddingHorizontal: l.spacing.s,
                        paddingVertical: l.spacing.s,
                        color: cl.basic.white,
                        fontFamily: 'tenor-sans'
                    }}
                />
            </View>

            <FlatList
                style={{paddingTop:l.spacing.m}}
                //contentContainerStyle={{}}
                data={filtered}
                keyExtractor={item => item.profile.id}
                renderItem={({item}) => <ListItem user={item.profile}/>}
            />
        </View>
    )
}