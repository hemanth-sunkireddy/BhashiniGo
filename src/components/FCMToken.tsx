import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export async function saveFcmToken() {
  const user = auth().currentUser;
  if (!user) return;

  try {
    // Request permission if not granted
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Push notifications not authorized.');
      return;
    }

    // Get the device token
    const token = await messaging().getToken();

    // Save token to a separate collection
    await firestore()
      .collection('fcmTokens')
      .doc(user.email)
      .set(
        {
          email: user.email,
          uid: user.uid,
          fcmToken: token,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    console.log('✅ FCM Token saved to fcmTokens for:', user.email);
  } catch (err) {
    console.error('Error saving FCM token:', err);
  }
}
