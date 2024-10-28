import { StyleSheet, View } from 'react-native';


import Home from '@assets/tabBarIcons/home_24px.svg'
import Chats from '@assets/tabBarIcons/chats_24px.svg'
import Profile from '@assets/tabBarIcons/contact_mail_24px.svg'
import Events from '@assets/tabBarIcons/whatshot_24px.svg'
import Settings from '@assets/tabBarIcons/settings_24px.svg'


import RightArrowButton from '@assets/ButtonIcons/arrow_forward_24px.svg'


const tabBarIcons = {
    home: {
        component:Home,
        size:24,
    },
    chats: {
        component:Chats,
        size:24,
    },
    profile: {
        component: Profile,
        size:24,
    },
    events: {
        component: Events,
        size:24,
    },
    settings: {
        component: Settings,
        size:24,
    }
};



  
export function TabBarIcons ( props ) {
    const iconInfo = tabBarIcons[props.icon]
    const size = props.size ? props.size: (iconInfo.size)
    const fill = props.fill ? props.fill: 'black'
    const BookingIcons = iconInfo.component;
    return(
        <View style={{paddingTop:8}}>
            <BookingIcons width={size} height={size} fill={fill}/>
        </View>
    )
  
};


