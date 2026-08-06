import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@components/Text'
import { View, TouchableOpacity,StyleSheet  } from 'react-native';
import RightArrowButton from '@assets/ButtonIcons/chevron_right_24px_outlined.svg'


function SquareButton( props ) {
    const filled = props.fill ? props.fill : false
    const size = props.size ? props.size : 'small'
    const iconRight = props.iconR ? props.iconR : false
    const label = props.label ? props.label : 'Placeholder'
    const fullsize = props.full ? props.full : false
    
    
    
    
    
    
    
    
    const onPressHandler = () => (props.onPress ? props.onPress() : console.log('button pressed'));
    
    

    let paddingHorizontal
    let paddingVertical
    let textStyle
    let iconSize
    let textPadding = l.sizeFromHeight(1)
    let color = {}
    let outlineColor = {}
    let alignment

    if ( fullsize == true ) {
        alignment = { alignSelf:'stretch'}
      } else {
        alignment = { alignSelf: 'flex-start'}
      };
    
    switch(size) {
        case 'small':
            
            paddingHorizontal = l.buttonSpacing.medium
            paddingVertical = l.buttonSpacing.small
            textStyle = bS.BTN_label_s
            iconSize = 12
            textPadding = l.sizeFromHeight(1)
        break;
        case 'medium':
            
            paddingHorizontal = l.buttonSpacing.large
            paddingVertical = l.buttonSpacing.medium
            textStyle = bS.BTN_label_m
            iconSize = 14
            textPadding = l.sizeFromHeight(2)
        break;
        case 'large':
            
            paddingHorizontal = l.buttonSpacing.xlarge
            paddingVertical = l.buttonSpacing.large
            textStyle = bS.BTN_label_l
            iconSize = 16
            textPadding = l.sizeFromHeight(3)
        break;
    }

    if (filled == true) {
        color = cl.maroon.standard_seventy; 
        outlineColor = 'transparent';
      } else {
        outlineColor = cl.basic.white; 
        color = cl.maroon.dark_95; 
      };

    return(
        <TouchableOpacity onPress={onPressHandler} >
            <View style={[alignment,{
                paddingHorizontal,
                paddingVertical,
                backgroundColor: color,
                borderColor: outlineColor,
                alignItems: 'center', 
                justifyContent: 'center', 
                alignContent: 'center',
                flexDirection:'row',
                gap:l.spacing.xs2,
                borderWidth: 1, 
                borderRadius:l.spacing.xs
                
                
                
                
                }]}>
                
                    <Text style={[textStyle,{color:cl.basic.white, paddingTop: textPadding}]}>{label}</Text>
                
                    {iconRight && <RightArrowButton width={iconSize} hieght={iconSize} fill={cl.basic.white}/>}
            </View>
        </TouchableOpacity>
    )
}




export { SquareButton,  }