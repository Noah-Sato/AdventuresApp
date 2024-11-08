import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@components/Text'
import { View, TouchableOpacity,StyleSheet  } from 'react-native';
import Close from '@assets/ButtonIcons/close_24px_outlined.svg'
import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'









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

            <View style={{
            flexDirection:'row',
            gap:l.spacing.s,
            alignItems:'center',
            alignSelf:'center'
        }}>
            {backIcon && 
            <TouchableOpacity onPress={onBackPressHandler}  >
                <Back width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>}

            <Text numberOfLines={1}  ellipsizeMode={'tail'} style={[bS.h1,{color:cl.basic.white, width:l.screen.width /2, }]}>{label}</Text>
            </View>

            {closeIcon && 
            <TouchableOpacity onPress={onClosePressHandler}  >
                <Close width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>
            }
        </View>

    )
    


}

export { PageHeader }