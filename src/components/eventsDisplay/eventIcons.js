import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'

import { View, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import Person from '@assets/tabBarIcons/whatshot_24px.svg'
import { supabase } from '~/utils/supabase'
import { useEffect, useState } from 'react';




function EventsIcon( props ) {
    const size = props.size ? props.size : 'small'
    const eventImage = props.eventImage ? props.eventImage : undefined
    const userImage = props.userImage ? props.userImage : undefined

    const [userUseImage, setUserUseImage] = useState()



    
    
    
    const iconSizes = {
        /*small: {
            padding:l.spacing.xs,
            iconSize:l.spacing.l,
            size:l.spacing.l + (l.spacing.xs * 2)
        },*/

        small: {
            padding:l.spacing.xs,
            iconSize:l.spacing.l * 2,
            size:(l.spacing.l * 2)+ (l.spacing.xs * 2),
            userPadding:l.spacing.xs,
            userIconSize:l.spacing.s,
            userSize:l.spacing.s + (l.spacing.xs * 2),
        },
        medium: {
            padding:l.spacing.xs + l.spacing.s, 
            iconSize:l.spacing.l * 2,
            size:(l.spacing.l * 3)+ (l.spacing.xs * 2),
            userPadding:l.spacing.xs + l.spacing.xs2,
            userIconSize:l.spacing.s,
            userSize:l.spacing.s + ((l.spacing.xs + l.spacing.xs2) * 2),
        },
        large:{
            padding:l.spacing.xs + l.spacing.s,
            iconSize:l.spacing.l * 3,
            size:(l.spacing.l * 4)+ (l.spacing.xs * 2),
            userPadding:l.spacing.s,
            userIconSize:l.spacing.s,
            userSize:l.spacing.s + (l.spacing.s * 2),
            
        },
        
        
        /*profile:{
            padding:l.spacing.xs + l.spacing.l,
            iconSize:l.spacing.l * 4,
            size:(l.spacing.l * 6)+ (l.spacing.xs * 2)
        },*/
    }
    let iconSize 
    let iconStyles = {}
    let pictureStyles = {}
    let userIconStyles = {}
    let userIconSize
    let userPictureStyles = {}

    switch( size ) {
        case 'small':
            iconStyles={padding:iconSizes.small.padding}
            iconSize = iconSizes.small.iconSize
            pictureStyles={width:iconSizes.small.size, height:iconSizes.small.size,}
            userIconStyles={padding:iconSizes.small.userPadding}
            userIconSize = iconSizes.small.userIconSize
            userPictureStyles={width:iconSizes.small.userSize, height:iconSizes.small.userSize,}
            userIconOffset = -4
            break;

        case 'medium':
            iconStyles={padding:iconSizes.medium.padding}
            iconSize = iconSizes.medium.iconSize
            pictureStyles={width:iconSizes.medium.size, height:iconSizes.medium.size,}
            userIconStyles={padding:iconSizes.medium.userPadding}
            userIconSize = iconSizes.medium.userIconSize
            userPictureStyles={width:iconSizes.medium.userSize, height:iconSizes.medium.userSize,}
            break;

        case 'large':
            iconStyles={padding:iconSizes.large.padding}
            iconSize = iconSizes.large.iconSize
            pictureStyles={width:iconSizes.large.size, height:iconSizes.large.size,}
            userIconStyles={padding:iconSizes.large.userPadding}
            userIconSize = iconSizes.large.userIconSize
            userPictureStyles={width:iconSizes.large.userSize, height:iconSizes.large.userSize,}
            userIconOffset = -4
            break;

        

    }
    

    const UserIcon = ({userImage,iconSize,pictureStyles,iconStyles}) => {
        if (userImage == undefined || userImage == "") {

            

            borderColor = cl.maroon.standard_seventy
            return(
                <View style={[{
                    alignSelf:'flex-start',
                    backgroundColor:cl.basic.white,
                    borderRadius:l.roundness.max,
                    borderWidth:l.spacing.xs3,
                    borderColor:borderColor,
                    
                    }, iconStyles]}>
                    <Person width={iconSize} height={iconSize} fill={cl.maroon.standard_seventy}/>
                </View>
            )
        } else {
    
            borderColor = cl.basic.white
            return(
                <View style={{
                    alignSelf:'flex-start',
                    backgroundColor:cl.basic.white,
                                borderRadius:l.roundness.max,
                                borderWidth:l.spacing.xs3,
                                borderColor:borderColor,
                    }}>
    
                        <Image 
                            style={[pictureStyles, {
                                borderRadius:l.roundness.max,
                                   
                            }]}
                            source={{uri:userImage}}
                            contentFit="cover"
                            transition={1000}
                        />
                </View>
            )
        }
    }
    

    let borderColor 

    if (eventImage == undefined) {
        borderColor = cl.basic.white
        return(
            <View style={{alignSelf:'center'}}>
                <View style={[{
                    alignSelf:'flex-start',
                    backgroundColor:cl.basic.white,
                    borderRadius:l.roundness.max,
                    borderWidth:l.spacing.xs3,
                    borderColor:borderColor,
                    
                    }, iconStyles]}>
                    <Person width={iconSize} height={iconSize} fill={cl.maroon.standard_seventy}/>
                </View>
                {userImage && 
                <View style={{alignSelf:'flex-start', position:'absolute',bottom:userIconOffset,right:userIconOffset}}>
                    <UserIcon  userImage={userImage} iconStyles={userIconStyles} iconSize={userIconSize} pictureStyles={userPictureStyles}/>
                </View>
                }
            </View>
        )
    } else {

        borderColor = cl.basic.white
        return(
            <View style={{alignSelf:'center'}}>
                <View style={{
                    alignSelf:'flex-start',
                    backgroundColor:cl.basic.white,
                    borderRadius:l.roundness.max,
                    borderWidth:l.spacing.xs3,
                    borderColor:borderColor,
                    }}>

                        <Image 
                            style={[pictureStyles, {borderRadius:l.roundness.max,}]}
                            source={{uri: eventImage}}
                            contentFit="cover"
                            transition={1000}
                        />
                </View>
                {userImage && 
                <View style={{
                    alignSelf:'flex-start', 
                    position:'absolute',
                    bottom:userIconOffset,
                    right:userIconOffset}}>
                    <UserIcon userImage={userImage} iconStyles={userIconStyles} iconSize={userIconSize} pictureStyles={userPictureStyles}/>
                </View>
                }
            </View>
        )
    }
}

export {EventsIcon}

