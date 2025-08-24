import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

// Prevent auto-hide before manually hiding
SplashScreen.preventAutoHideAsync()

const Splash = () => {
  useEffect(() => {
    const prepare = async () => {
      // Simulate loading or setup (e.g., fonts, API call, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Hide the splash screen once setup is done
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Splash Screen</Text>
    </View>
  )
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
