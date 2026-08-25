import { bS } from '../theme/Styles'
import cl from '../theme/Colours'
import l from '../theme/Layout'
import { Text } from './Text'
import { View, TouchableOpacity, StyleSheet  } from 'react-native';
import Person from '@assets/profileIcons/person_24px.svg'
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getAvatarPublicUrl } from '~/utils/avatarUrl'



function UserIcon( props ) {
    const size = props.size ? props.size : 'small'
    const useImage = props.userImage ? props.userImage : undefined

    const [image, setImage] = useState()



    useEffect(()=>{
        if(useImage !== undefined){
            fetchImage(useImage)
        }
        
    },[useImage])

    const fetchImage = (useImage) => {
        setImage(getAvatarPublicUrl(useImage))
    }


    if (useImage) {

    }
    
    
    const iconSizes = {
        small: {
            padding:l.spacing.xs,
            iconSize:l.spacing.m - l.spacing.xs2,
            size:l.spacing.m - l.spacing.xs2 + (l.spacing.xs * 2)
        },

        medium: {
            padding:l.spacing.xs,
            iconSize:l.spacing.l * 2,
            size:(l.spacing.l * 2)+ (l.spacing.xs * 2)
        },
        large:{
            padding:l.spacing.xs + l.spacing.s,
            iconSize:l.spacing.l * 3,
            size:(l.spacing.l * 3)+ (l.spacing.xs * 2)
        },
        profile:{
            padding:l.spacing.xs + l.spacing.l,
            iconSize:l.spacing.l * 4,
            size:(l.spacing.l * 6)+ (l.spacing.xs + l.spacing.s * 2)
        },
    }
    let iconSize 
    let iconStyles = {}
    let pictureStyles = {}

    switch( size ) {
        case 'small':
            iconStyles={padding:iconSizes.small.padding}
            iconSize = iconSizes.small.iconSize
            pictureStyles={width:iconSizes.small.size, height:iconSizes.small.size,}
            break;

        case 'medium':
            iconStyles={padding:iconSizes.medium.padding}
            iconSize = iconSizes.medium.iconSize
            pictureStyles={width:iconSizes.medium.size, height:iconSizes.medium.size,}
            break;

        case 'large':
            iconStyles={padding:iconSizes.large.padding}
            iconSize = iconSizes.large.iconSize
            pictureStyles={width:iconSizes.large.size, height:iconSizes.large.size,}
            break;

        case 'profile':
            iconStyles={padding:iconSizes.profile.padding}
            iconSize = iconSizes.profile.iconSize
            pictureStyles={width:iconSizes.profile.size, height:iconSizes.profile.size,}
            break;

    }
    
    

    let borderColor 

    if (useImage == undefined) {

        borderColor = props.borderColor ? props.borderColor: cl.maroon.standard_seventy
        return(
            <View style={[{
                alignSelf:'center',
                backgroundColor:cl.basic.white,
                borderRadius:l.roundness.max,
                borderWidth:l.spacing.xs3,
                borderColor:borderColor,
                
                }, iconStyles]}>
                <Person width={iconSize} height={iconSize} fill={cl.maroon.standard_seventy}/>
            </View>
        )
    } else {

        borderColor = props.borderColor ? props.borderColor: cl.basic.white
        return(
            <View style={{
                alignSelf:'center',
                backgroundColor:cl.basic.white,
                            borderRadius:l.roundness.max,
                            borderWidth:l.spacing.xs3,
                            borderColor:borderColor,
                }}>

                    <Image 
                        style={[pictureStyles, {borderRadius:l.roundness.max,}]}
                        source={{uri:image}}
                        contentFit="cover"
                        transition={1000}
                    />
            </View>
        )
    }
}

export {UserIcon}

