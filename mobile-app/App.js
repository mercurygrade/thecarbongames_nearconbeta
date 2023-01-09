import 'react-native-gesture-handler';
import React, {  } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { Platform, UIManager } from 'react-native'
import Providers, {  } from './src/Providers'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/Navigation/RootStack';
const humanizeDuration = require("humanize-duration");
import { ToastProvider } from 'react-native-toast-notifications'
import LoadingModal from './src/Common/LoadingModal';
import { navigationRef } from './src/Navigation';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

// LogBox.ignoreAllLogs(true)

export default App = () => {

  return (
    <SafeAreaProvider>
      <Providers>
        <ToastProvider>
          <NavigationContainer ref={navigationRef} >
            <RootStack />
            <LoadingModal />
          </NavigationContainer>
        </ToastProvider>
      </Providers>
    </SafeAreaProvider>
  )
}