/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';


import awsExports from './src/aws-exports';

const isAuthConfigured =
  !!awsExports &&
  (typeof awsExports === 'object' || typeof awsExports === 'function') &&
  // classic `aws-exports.js` keys:
  !!(awsExports as any).aws_project_region &&
  !!(awsExports as any).aws_user_pools_id &&
  !!(awsExports as any).aws_user_pools_web_client_id;

// Only configure Amplify when we have real outputs; otherwise we show an actionable message.
if (awsExports && typeof awsExports === 'object' && Object.keys(awsExports).length > 0) {
  Amplify.configure(awsExports);
} else if (__DEV__) {
  // eslint-disable-next-line no-console
  console.warn('[Amplify] `src/aws-exports.js` not found / empty. Run `npm run amplify:pull`.');
}


import { HomeNavigation } from './src/navigation/Home';
import { flexChild } from './src/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
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
          {isAuthConfigured ? (
            <Authenticator.Provider>
              <Authenticator signUpAttributes={["name"]}>
                  <HomeNavigation />
              </Authenticator>
            </Authenticator.Provider>
          ) : (
            <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                Amplify Auth is not configured
              </Text>
              <Text style={{ fontSize: 14, opacity: 0.8 }}>
                This app expects a generated {'`src/aws-exports.js`'} with Cognito User Pool settings.
                {'\n\n'}
                Run: {'`cd cab-expense && npm run amplify:pull`'}
                {'\n'}
                Then restart Expo (or press "r" to reload).
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
