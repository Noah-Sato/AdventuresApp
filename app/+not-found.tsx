import { Link, Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={bS.h4}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={[bS.body2, styles.linkText]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: l.spacing.l,
  },
  link: {
    marginTop: l.spacing.m,
    paddingTop: l.spacing.m,
  },
  linkText: {
    color: cl.maroon.standard_seventy,
  },
});
