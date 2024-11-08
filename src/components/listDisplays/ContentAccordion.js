import React from 'react';
import { Text } from '@components/Text';
import { bS } from "@theme/Styles";
import l from '@theme/Layout'
import cl from "@theme/Colours"
import Back from '@assets/ButtonIcons/arrow_back_ios_24px_outlined.svg'

import { StyleSheet, View, Button, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';







function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 250,
}) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

function Item({item, index}) {
  //        <HTMLText style={[bS.body1, {color: cl.grey.eighty}]} htmlContent={item} />
//        <Text style={[bS.body1, {color: cl.grey.eighty}]}>{item}</Text>

    return(
      <Text style={[bS.body1, {color: cl.basic.white}]} >{item}</Text>
      
 
)}

function Parent({ open, content }) {
  return (
    <View style={styles.parent}>
      <AccordionItem isExpanded={open} viewKey="Accordion">
      {content}
      </AccordionItem>
    </View>
  );
}



function AccordionButton( props ) {
  const Hotelname = props.name ? props.name: 'placeholder'
  const open = props.isExpanded
  const label = props.label ? props.label: `Read more about ${Hotelname}`


  const upStyle = useAnimatedStyle(() => {
    const opacity = interpolate(open.value, [0, 1], [0, 1]);
    return {
      transform: [{ scale: opacity }]    
    }
  })

  const rightStyle = useAnimatedStyle(() => {
    const opacity = interpolate(open.value, [0, 1], [1, 0]);
    const rotation = interpolate(open.value, [0, 1], [0, 90]);
    return {
      position: 'absolute',
      transform: [{ scale: opacity,   }] 
    }
  })

  const iconStyle = useAnimatedStyle(()=>{
    const rotation = interpolate(open.value, [0, 1], [0, 90]);
    return {
      position: 'absolute',
      transform: [{ rotate: `${rotation}deg` }] 
    }
  })
  

  const onPressHandler = () => {
    props.onPress();
  };
  
  const buttonStyle = {position:'absolute',  gap: l.spacing.xs2, color: cl.red.light_thirty, alignContent:'center', alignItems:'center', flex:1, flexDirection:'row'}
    

  return(
    <View >
    <TouchableWithoutFeedback onPress={onPressHandler} style={{}}>
      <View>
        <Animated.View style={[buttonStyle,upStyle]}>
          <View style={{transform:'rotate(90deg)'}}>
            <Back width={16} height={16} fill={cl.red.light_thirty}/>
          </View>
          <Text style={[bS.body3, {color: cl.red.light_thirty,}]}>{`Show less`}</Text>
        </Animated.View>
        <Animated.View style={[buttonStyle,rightStyle, {transform:'rotate(180deg)'}]}>
          <View style={{transform:'rotate(180deg)'}}>
            <Back  width={16} height={16} fill={cl.red.light_thirty}/>
          </View>
          <Text style={[bS.h6, {color: cl.red.light_thirty,}]}>{'Event Description'}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
    
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    paddingTop: 24,
    width:'auto'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    width: 'auto',
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    //alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
  
  ul: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  li: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    //justifyContent:'center'
  },
  liBullet: {
    fontWeight: 'bold',
    fontSize: l.sizeFromHeight(24),
    lineHeight: l.sizeFromHeight(24),
    color: cl.grey.eighty,
  },
  liText: {
    fontSize: 18,
  },
  Color: {
   color: cl.grey.eighty,
  }
});



export { Parent, AccordionButton, Item };