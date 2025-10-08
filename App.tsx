import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Navigation from './src/Navigation';

// 🟢 Create notification channel once
async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

// 🟢 Request user permission for notifications
async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log(enabled ? 'Notification permission granted ✅' : 'Permission denied ❌');
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    requestPermission();
    createDefaultChannel();

    // ✅ Foreground message handler (only one listener)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📬 Foreground message received:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Hi 👋',
        body: remoteMessage.notification?.body || 'You have a new message!',
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
