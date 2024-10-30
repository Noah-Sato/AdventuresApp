import { bS } from '../theme/Styles'
import cl from '../theme/Colours'
import l from '../theme/Layout'
import { Text } from './Text'
import { View, TouchableOpacity, StyleSheet  } from 'react-native';
import Person from '@assets/profileIcons/person_24px.svg'
import { Image } from 'expo-image';



function IconContainer( props ) {
    const size = props.size ? props.size : 'small'
    const useIcon = props.icon ? props.icon : Person
    
    const iconSizes = {
        small: {
            padding:l.spacing.xs,
            iconSize:l.spacing.m - l.spacing.xs2,
            
        },

        medium: {
            padding:l.spacing.s,
            iconSize:l.spacing.m,
            
        },
        large:{
            padding:l.spacing.xs + l.spacing.s,
            iconSize:l.spacing.l ,
            
        },
       
    }
    let iconSize 
    let iconStyles = {}
    let pictureStyles = {}

    switch( size ) {
        case 'small':
            iconStyles={padding:iconSizes.small.padding}
            iconSize = iconSizes.small.iconSize
            
            break;

        case 'medium':
            iconStyles={padding:iconSizes.medium.padding}
            iconSize = iconSizes.medium.iconSize
            
            break;

        case 'large':
            iconStyles={padding:iconSizes.large.padding}
            iconSize = iconSizes.large.iconSize
           
            break;

        

    }


    const Icon =  (props) => {
        const UseIcon = props.icon;
        const size = props.size
        const fill = props.fill
        return(
            <UseIcon width={size} height={size} fill={fill}/>
        )
    }
    
    

    let borderColor 

    

        borderColor = cl.red.light_thirty
        return(
            <View style={[{
                alignSelf:'center',
                backgroundColor:cl.maroon.dark_95,
                borderRadius:l.roundness.max,
                borderWidth:l.spacing.xs3,
                borderColor:borderColor,
                
                }, iconStyles]}>
                <Icon icon={useIcon} size={iconSize} fill={cl.red.light_thirty}/>
            </View>
        )
    
}

export {IconContainer}

