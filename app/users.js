import { useEffect, useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { Text } from '@src/components/Text';
import { supabase } from '~/utils/supabase'
import { useAuth } from '~/contexts/AuthProvider';
import { router } from "expo-router";

import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { mainStyles } from "../src/theme/Styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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


    useEffect(()=>{
        const fetchUsers = async() => {
            let {data: profiles, error} = await supabase.from('profiles').select('*').neq('id', user.id);
            setUsers(profiles);
        }

        fetchUsers();
    }, [])

    return(
        <View style={[mainStyles.page]}>

            <View style={{paddingHorizontal:l.margins.page}}>
                <PageHeader back={true} onBackPress={()=>{router.navigate('../')}} label={'users'} />
            </View>


            <FlatList
                data={users}
                renderItem={({item}) => <Text style={{color:cl.basic.white}}>{item.full_name}</Text>}
            />
        </View>
    )
}