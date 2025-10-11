import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export async function saveFcmToken(user_name: string, preferredLanguage: string) {
  const user = auth().currentUser;
  if (!user) return;

  try {
    const userData = {
      uid: user.uid,
      name: user_name || user.displayName || "Unnamed User",
      email: user.email || "",
      updatedAt: firestore.FieldValue.serverTimestamp(),
      preferredLanguage: preferredLanguage
    };


    // Get the device token
    const token = await messaging().getToken();

    // Save token to a separate collection
     await firestore()
      .collection("users")
      .doc(userData.email) // use UID instead of email (safer for Firestore keys)
      .set(userData, { merge: true });

    console.log('updated user data:', user.email);
  } catch (err) {
    console.error('Error saving user details:', err);
  }
}
