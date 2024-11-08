import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from '../theme/Colours'
import Layout from '../theme/Layout'



export const mainStyles = StyleSheet.create({
    
    page:{
        backgroundColor:Colors.maroon.dark_95,
        height:'100%',
        
        
    },

    
})


export const bS =  {


  

    h1: {
      textTransform: 'uppercase',
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(26,true,1.1),
      lineHeight: Layout.sizeFromHeight(32,true,1.1),
      letterSpacing: 0.25, // TODO
      color: Colors.basic.black,
  
    },
  
    h2: {
      textTransform: 'uppercase',
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(22,true,1.2),
      lineHeight: Layout.sizeFromHeight(26,true,1.2),
      letterSpacing: 0.25, // TODO
      color: Colors.basic.black,  
    },
  
    h3: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(24,true,1.3),
      lineHeight: Layout.sizeFromHeight(30,true,1.3),
      color: Colors.basic.black,  
    },
  
    h4: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(21,true,1.4),
      lineHeight: Layout.sizeFromHeight(25,true,1.4),
      color: Colors.basic.black,  
    },
  
    h5: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(19,true,1.4),
      lineHeight: Layout.sizeFromHeight(22,true,1.4), 
      color: Colors.basic.black,  
    },
  
    h6: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(17,true,1.2),
      lineHeight: Layout.sizeFromHeight(23,true,1.2), 
      color: Colors.basic.black,  
    },
    h7:{
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(16,true,1.2),
      lineHeight: Layout.sizeFromHeight(20,true,1.2), 
      color: Colors.basic.black,    },
  
    body1: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(16,true,1.2),
      lineHeight: Layout.sizeFromHeight(24,true,1.2), 
      color: Colors.basic.black,  
    },
    body1Input: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(16,true,1.1),
      lineHeight: Layout.sizeFromHeight(16,true,1.1), 
      color: Colors.basic.black,    },
  
    body1_bold: {
      fontFamily: 'AvenirLTPro-Heavy', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(16,true,1.2),
      lineHeight: Layout.sizeFromHeight(24,true,1.2), 
      letterSpacing: 0.25, // TODO
      color: Colors.basic.black,  
    },
  
    body2: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(16,true,1.2),
      lineHeight: Layout.sizeFromHeight(22,true,1.2), 
      color: Colors.basic.black,    },
  
    body3: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(14,false,1.1),
      lineHeight: Layout.sizeFromHeight(18,false,1.1), 
      color: Colors.basic.black,    },
    body3Input: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(14,true,1.2),
      lineHeight: Layout.sizeFromHeight(14,true,1.2), 
      color: Colors.basic.black,    },
  
    body4: {
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(12,true,1.2),
      lineHeight: Layout.sizeFromHeight(14,true,1.2), 
      color: Colors.basic.black,    },
  
    BTN_label_l: {
      textTransform: 'uppercase',
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(14,true,1.2),
      lineHeight: Layout.sizeFromHeight(14,true,1.2), 
      letterSpacing: 0.5, // TODO
      color: Colors.basic.black,    },
  
    BTN_label_m: {
      textTransform: 'uppercase',
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(11,true,1.2),
      lineHeight: Layout.sizeFromHeight(13,true,1.2), 
      letterSpacing: 1, // TODO
      color: Colors.basic.black,    },
  
    BTN_label_s: {
      textTransform: 'uppercase',
      fontFamily: 'tenor-sans', 
      fontStyle: 'normal',
      fontSize: Layout.sizeFromHeight(10,true,1.2),
      lineHeight: Layout.sizeFromHeight(12,true,1.2), 
      letterSpacing: 0.5, // TODO
      color: Colors.basic.black,    },
  
  
    /*fullscreen: {
      position:'absolute',
      top:0,
      left:0,
      right:0,
      height:Layout.screen.height+100,
      backgroundColor:'transparent'
    },
    columns: {
      flexDirection:"row",
      width:"100%",
      justifyContent:"space-around",
      marginBottom: Layout.margins.m,
    },
    panel: {
      backgroundColor:Colors.colors.toast,
      borderWidth: 0.5,
      borderColor: Colors.colors.honey,
      borderRadius: Layout.bRadiusL,
      paddingBottom:Layout.margins.m,
      justifyContent:"center",
      alignItems:"center",
      paddingTop:Layout.margins.m
    },
    shadow: {
      shadowColor: Colors.black,
      shadowOffset: {
        width: 2,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 2.84,
      elevation: 4,
    },*/
  }

