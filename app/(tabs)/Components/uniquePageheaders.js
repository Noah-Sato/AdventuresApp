import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@components/Text'
import { View, TouchableOpacity,StyleSheet  } from 'react-native';
import Close from '@assets/ButtonIcons/close_24px_outlined.svg'
import Add from '@assets/MiscIcons/Add.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'








function EventPageHeader(props) {
    const insets = useSafeAreaInsets()

    const label = props.label ? props.label : 'Header Placeholder'
    const AddIcon = props.create ? props.create : false
    const backIcon = props.back ? props.back : false

    const fontSize = props.fontSize ? props.fontSize: bS.h1

    
    const onBackPressHandler = () => props.onBackPress();
    const onCreatePressHandler = () => props.onCreatePress();

    return(
        <View style={[{
            flexDirection:'row',
            paddingTop:insets.top + l.spacing.s,
            paddingBottom:l.spacing.l,
            justifyContent:'space-between',
            alignItems:'center',
       
            width:'100%',
            paddingHorizontal:l.margins.page
                
        } ]}>

            <View style={{width:l.spacing.l}}>
            {backIcon && 
            <TouchableOpacity onPress={onBackPressHandler}  >
                <Back width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>}
            </View>



            <Text numberOfLines={1}  ellipsizeMode={'tail'} style={[fontSize,{color:cl.basic.white, width:l.screen.width /2, textAlign:'center' }]}>{label}</Text>
            
            <View style={{width:l.spacing.l}}>
            {AddIcon && 
            <TouchableOpacity onPress={onCreatePressHandler}  >
                <Add width={l.spacing.l} height={l.spacing.l} fill={cl.maroon.sixty}/>
            </TouchableOpacity>
            }
            </View>
        </View>

    )
    


}

export {EventPageHeader}