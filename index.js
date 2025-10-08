/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ✅ Add this — must be outside of any component
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Message handled in the background!', remoteMessage);
  // (optional) You can show a local notification here if needed
});

AppRegistry.registerComponent(appName, () => App);
