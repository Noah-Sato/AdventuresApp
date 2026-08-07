import { View, TextInput, TouchableOpacity, Modal, Animated } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";


import { useStore } from '@store'

import { mainStyles, bS } from '@theme/Styles'
import cl from '@theme/Colours'
import l from '@theme/Layout'


import { Calendar, toDateId, CalendarTheme, useDateRange } from "@marceloterreiro/flash-calendar";



import { PageHeader } from '@components/pageGeneral/pageHeader'
import { Text } from '@src/components/Text';
import { SquareButton } from '@components/Buttons';
import { useMemo, useState } from "react";

const linearAccent = cl.basic.white;

// `hasRangeEnd` is false until a second date is picked, so a lone selected
// day (isStartOfRange but no endId yet) still needs its trailing corners rounded.
const getLinearTheme = (hasRangeEnd) => ({
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgba(255, 255, 255, 0.5)" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 8,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: isPressed ? 8 : 30,
        backgroundColor: isPressed ? linearAccent : "transparent",
      },
      content: {
        color: cl.basic.white,
      },
    }),
    disabled: () => ({
      container: {
        backgroundColor: "transparent",
      },
      content: {
        color: "rgba(255, 255, 255, 0.2)",
      },
    }),
    active: ({ isEndOfRange, isStartOfRange, isPressed }) => {
      const isSingleDay = isStartOfRange && !hasRangeEnd;
      return {
        container: {
          backgroundColor: cl.basic.white,
          borderTopLeftRadius: isStartOfRange ? 8 : 0,
          borderBottomLeftRadius: isStartOfRange ? 8 : 0,
          borderTopRightRadius: isEndOfRange || isSingleDay ? 8 : 0,
          borderBottomRightRadius: isEndOfRange || isSingleDay ? 8 : 0,
          
        },
        content: {
          color: cl.maroon.ninty,
        },
      };
    },
  },
});



export default function CalendarPage() {
    const setGlobalDateRange = useStore((state) => state.setDateRange)

    const today = toDateId(new Date());

    const {
        calendarActiveDateRanges,
        onCalendarDayPress,
        dateRange,
    } = useDateRange();

    const linearTheme = useMemo(
        () => getLinearTheme(!!dateRange.endId),
        [dateRange.endId]
    );

    const onConfirm = () => {
        if (!dateRange.startId) return
        setGlobalDateRange(dateRange)
        router.navigate('../')
    }

    return(

        <View style={[mainStyles.page, {height:l.screen.height, width:l.screen.width }]}>


            <View style={{paddingBottom:l.spacing.l,}} >
                    <PageHeader fontSize={bS.h3} label={'Choose Dates'} back={true} onBackPress={()=>{router.navigate('../')}}/>
                </View>


                <View style={{
                    borderWidth:l.spacing.xs3,
                    paddingHorizontal:l.spacing.s,
                    paddingVertical:l.spacing.l,
                    borderRadius:l.spacing.xs,
                    borderColor:cl.basic.white,
                    backgroundColor:cl.maroon.dark_95,

                }}>

                    <Calendar
                        calendarMonthId={today}
                        calendarMinDateId={today}
                        calendarActiveDateRanges={calendarActiveDateRanges}
                        onCalendarDayPress={onCalendarDayPress}
                        theme={linearTheme}
                    />
                </View>

                <View style={{paddingTop:l.spacing.l, alignItems:'center'}}>
                    <SquareButton label={'Confirm'} fill={true} size={'medium'} onPress={onConfirm}/>
                </View>

        </View>
    )

}