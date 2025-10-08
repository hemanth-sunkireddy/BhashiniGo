import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import auth from '@react-native-firebase/auth';
import { saveFcmToken } from "../components/FCMToken";

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Firebase Auth registration
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      console.log("Registered user:", userCredential.user.email);
      Alert.alert("Success", "User registered successfully!");
       await saveFcmToken();
      navigation.navigate("BottomTabs");
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "Email already in use");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email address");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Error", "Password should be at least 6 characters");
      } else {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
        autoCapitalize="none"
        autoComplete="off"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Back to Login"
          color="#888"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
