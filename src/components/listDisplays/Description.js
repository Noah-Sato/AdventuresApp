import { View, StyleSheet,  } from 'react-native'
import { Text } from '@components/Text';

import cl from '@theme/Colours'
import l from '@theme/Layout'
import  {

    useSharedValue,
  
  } from 'react-native-reanimated';
  import { Parent, AccordionButton, Item } from '@components/listDisplays/ContentAccordion';






function Description( { Title, Description } ) {
    
    const openDesc = useSharedValue(false);

    const onPressDesc = () => {
        openDesc.value = !openDesc.value; 
        
      };

    

   
    
        return(
            <View style={{gap: l.spacing.xs, paddingBottom: l.spacing.m}}>    
            {Title && <Text numberOfLines={1} style={styles.first_title}>{Title}</Text>}
            <View style={{gap:l.spacing.xs, width:l.screen.width - ( 2 * l.margins.page) }}>
            <View>
                <Parent open={openDesc} content={
                        <Item item={Description}/>

                    } />
                </View>    
                <View >
                <AccordionButton  onPress={onPressDesc} name={'button placeholder'} isExpanded={openDesc} />
                </View>
            </View>
        </View> 
        )
   
      }
    


const styles = StyleSheet.create({


    first_title: {
      fontFamily: 'Clearface', 
      fontStyle: 'normal',
      fontSize: l.sizeFromHeight(21,true,1.3),
      lineHeight: l.sizeFromHeight(26,true,1.3),
      color: cl.basic.white,
  
    },
  

  });
  



export { Description };