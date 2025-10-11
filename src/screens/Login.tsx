import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { saveFcmToken } from '../components/FCMToken';


const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // Firebase Auth login
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      console.log("Logged in user:", userCredential.user.email);
      Alert.alert("Success", "Logged in successfully!");
      await saveFcmToken();
      navigation.navigate("BottomTabs"); // Navigate to home screen
    } catch (error: any) {
      console.error("Error logging in:", error);

      // Handle common Firebase Auth errors
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "User not found. Please register.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else {
        Alert.alert("Error", error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        value={email}
        autoCapitalize="none"
        autoComplete="off"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.registerText}>Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#007BFF",
    fontWeight: "600",
  },
});
