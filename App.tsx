/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';


import awsExports from './src/aws-exports';
Amplify.configure(awsExports);


import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { HomeNavigation } from './src/navigation/Home';
import { flexChild } from './src/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={flexChild}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={flexChild}>
          <Authenticator.Provider>
            <Authenticator signUpAttributes={["name"]}>
                <HomeNavigation />
            </Authenticator>
          </Authenticator.Provider>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
