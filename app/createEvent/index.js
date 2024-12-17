import { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { PageHeader } from '@components/pageGeneral/pageHeader'
import { mainStyles } from '@src/theme/Styles';
import { router } from "expo-router";
import { bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'
import { Text } from '@src/components/Text';
import { MiscIcons } from '@theme/Icons'
import Edit from '@assets/ButtonIcons/border_color_24px_outlined.svg'





export default function CreateEventPage() {



    return(
        <View style={[mainStyles.page]}>
        
            <View style={{marginHorizontal:l.margins.page, gap:l.spacing.xl3}}>
                <View style={{paddingBottom:l.spacing.l}} >
                    <PageHeader label={'Create Event'} back={true} onBackPress={()=>{router.navigate('../')}}/>
                </View>


                

                <View style={{alignSelf:'stretch', gap:l.spacing.xs}}>
                            <Text style={[bS.body2,{color:cl.basic.white}]}>{'Where are you going?'} </Text>
                            <View style={{
                            borderWidth:l.spacing.xs3,
                            paddingHorizontal:l.spacing.s,
                            paddingVertical:l.spacing.s,
                            borderRadius:l.spacing.xs,
                            borderColor:cl.basic.white,
                            color:cl.basic.white,
                            alignSelf:'stretch',
                            flexDirection:'row',
                            justifyContent:'flex-start',
                            gap:l.spacing.xs
                        }}>
                                <MiscIcons icon={'search'} fill={cl.red.light_thirty}/>
                                <TextInput
                                style={[bS.h7,{color:cl.basic.white}]}
                                editable={true}
                                label="Email"
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                //value={}
                                placeholder="Search"
                                placeholderTextColor={cl.grey.twenty}
                                autoCapitalize={'none'}
                                />
                                <View style={{height:l.spacing.m}}/>

                            
                            </View>


                </View>


                <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        color:cl.basic.white,
                    }}>
                    <Text style={[bS.body2,{color:cl.basic.white}]}>{'When are you going?'} </Text>
                    <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                </View>


                <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        borderWidth:l.spacing.xs3,
                        paddingHorizontal:l.spacing.s,
                        paddingVertical:l.spacing.s,
                        borderRadius:l.spacing.xs,
                        borderColor:cl.basic.white,
                        color:cl.basic.white,
                    }}>
                    <Text style={[bS.body2,{color:cl.basic.white}]}>{"Who's invited?"} </Text>
                    <Edit width={l.spacing.m} height={l.spacing.m} fill={cl.red.light_thirty}/>
                </View>


            </View>

        </View>

    )
}