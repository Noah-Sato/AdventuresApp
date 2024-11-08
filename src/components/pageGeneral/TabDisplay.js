import React from 'react';
import { View, 
    StyleSheet, 
    Animated, 
    Image, 
    TouchableOpacity,
} from 'react-native';

import { parseISO, format } from "date-fns";

import l from '@theme/Layout'
import cl from '@theme/Colours'








const Tab = React.forwardRef(({ item, onItemPress, scrollX, idx, noOfTabs }, ref) => {
    const inputRange = [(idx-1)*l.screen.width, idx * l.screen.width, (idx+1)* l.screen.width];
                            
                            const variableHeight = scrollX.interpolate({
                                inputRange,
                                outputRange: [1, 2, 1],
                                extrapolate: 'clamp',
                            });

                            
                            const variableColor = scrollX.interpolate({
                                inputRange,
                                outputRange: [cl.basic.white, cl.red.light_thirty, cl.basic.white],
                                extrapolate: 'clamp',
                            });
    return(
        <TouchableOpacity accessibilityLabel={`Navigate`} 
        onPress={onItemPress}>
            
                    

                  
                        <Animated.View ref={ref} 
                        style={{
                            justifyContent:'flex-start', 
                            width:((l.screen.width - (l.margins.page * 2))/noOfTabs),
                            height: l.pfHDP(21),
                            borderBottomWidth: variableHeight,
                            borderColor: variableColor,
                            

                        }}>
                            <Animated.Text style={{
                                color: variableColor,
                                textTransform: 'uppercase',
                                fontFamily: 'AvenirLTPro-Heavy', 
                                fontStyle: 'normal',
                                fontSize: l.sizeFromHeight(11,false,1),
                                lineHeight: l.sizeFromHeight(13,false,1), 
                                letterSpacing: 1    
                                }}> {item.title}</Animated.Text>
                        </Animated.View>
                    
                 
        </TouchableOpacity>
    )
});





const Tabs = ({data, scrollX, onItemPress}) => {
    const containerRef = React.useRef();

    return(
        <View style={{position: 'absolute', top: -l.pfHDP(21), width:l.screen.width}}>
            <View ref={containerRef} style={{justifyContent:'space-evenly', flexDirection:'row', flex:1}}>
                {data.map((item, index) => {
                    return <Tab noOfTabs={data.length} idx={index} key={item.key} item={item} ref={item.ref} onItemPress={() => onItemPress(index)} scrollX={scrollX} />
                })}
            </View>
            
        </View>
    )
};

function TabDisplay({tabData}) {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [activeItem, setActiveItem] = React.useState(0);
    const ref = React.useRef();
    const onItemPress = React.useCallback(itemIndex => {
        ref?.current?.scrollToOffset({
            offset: itemIndex * l.screen.width,
            
        })
    })


    

    const data = tabData.map((element,i) => ({
        key: i,
        title: element.title,
        content: element.content,
        height: element.height,
        ref: React.createRef()
      }));

    const inputRange = data.map((e,i)=>{
        return (i)*l.screen.width
    })
    const outputRange = data.map((e,i)=>{
        return e.height
    })
    const contentHeight = scrollX.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp',
    });
   
    
    
    return (
        <Animated.View style={[styles.container,{height:contentHeight}]}>
        
        <View style={{height:l.spacing.xs}}/>
        <Animated.FlatList
            ref={ref}
            data={data}
            keyExtractor={(item) => item.key}
            horizontal
            onMomentumScrollEnd={(event) => {
                const index = Math.floor(
                    event.nativeEvent.contentOffset.x /
                        event.nativeEvent.layoutMeasurement.width
                );
                setActiveItem(index)
                
            }}
            pagingEnabled
            onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                { useNativeDriver: false},
            )}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index}) => {
                const ContentComponent = item.content
                
                return (
                    <View style={[styles.content]}>
                        <ContentComponent 
                            activeItem={activeItem} 
                            index={index} 
                            
                        />
                    </View>
                )
            }}
        
        />
        <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
      </Animated.View>
    );
  }


const styles = StyleSheet.create({
    container: {
      //flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
      
    },
    content: {
        width: l.screen.width,
        justifyContent:'flex-start',
        
        
    }
});

export { TabDisplay };



