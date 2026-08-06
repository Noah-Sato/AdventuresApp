import { StyleSheet, View } from 'react-native';
import l from '@theme/Layout'

import Home from '@assets/tabBarIcons/home_24px.svg'
import Chats from '@assets/tabBarIcons/chats_24px.svg'
import Profile from '@assets/tabBarIcons/contact_mail_24px.svg'
import Events from '@assets/tabBarIcons/whatshot_24px.svg'
import Settings from '@assets/tabBarIcons/settings_24px.svg'
import Friends from '@assets/profileIcons/person_24px.svg'

//Social Icons
import Facebook from "@assets/Social/Ico_Facebook_24.svg"
import X from "@assets/Social/Ico_x_24.svg"
import Pinterest from "@assets/Social/Ico_Pinterest_24.svg"
import Instagram from "@assets/Social/Ico_Instagram_24.svg"
import Linkedin from "@assets/Social/Ico_Linkedin_24.svg"
import YouTube from "@assets/Social/Ico_Youtube_24.svg"



//Misc Icons 
import Search from '@assets/MiscIcons/SearchIcon.svg'
import Close from '@assets/ButtonIcons/close_24px_outlined.svg'
import MapPin from '@assets/MiscIcons/MapPin.svg'



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
    },
    friends: {
        // TODO: no dedicated multi-person/friends icon asset exists yet -- reusing the
        // single-person icon as a placeholder until a proper one is added.
        component: Friends,
        size:24,
    }
};



  
function TabBarIcons ( props ) {
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




const social = {
    facebook: {
      component: Facebook,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    },
    x:{
      component: X,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    }, 
    pinterest:{
      component: Pinterest,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    },
    instagram:{
      component: Instagram,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    },
    linkedin:{
      component: Linkedin,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    },
    youtube:{
      component: YouTube,
      size: Math.min( l.sizeFromWidth(28) , 38 ) ,
    }
  }
  
  function SocialIcons ( props ) {
    const iconInfo = social[props.icon]
    const size = props.size ? props.size: (iconInfo.size)
    const fill = props.fill ? props.fill: 'black'
  const SocialIcon = iconInfo.component;
  return <SocialIcon width={size} height={size} fill={fill}/>;
  };







const misc = {
    search:{
      component:Search,
      size:24,
    },

    close:{
      component: Close,
      size:24,
    },

    map:{
      component:MapPin,
      size:24,

    }
}

function MiscIcons ( props ) {
  const iconInfo = misc[props.icon]
  const size = props.size ? props.size: (iconInfo.size)
  const fill = props.fill ? props.fill: 'black'
const SocialIcon = iconInfo.component;
return <SocialIcon width={size} height={size} fill={fill}/>;
}; 




export {SocialIcons, TabBarIcons, MiscIcons}