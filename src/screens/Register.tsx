import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import auth from '@react-native-firebase/auth';
import { saveFcmToken } from "../components/FCMToken";
import { Picker } from "@react-native-picker/picker";
import Down from '../assets/Down.svg';

const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState("en");


  const handleRegister = async () => {
    setErrorText(null);
    if (!email || !password || !confirmPassword || !name) {
      setErrorText("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Password Don't Match");
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
      // Alert.alert("Success", "User registered successfully!");
      setErrorText("Successsfully logged in");
      await saveFcmToken(name, preferredLanguage);
      navigation.navigate("BottomTabs");
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorText("Email already in use");

      } else if (error.code === 'auth/invalid-email') {
        setErrorText("Invalid Email Address");
      } else if (error.code === 'auth/weak-password') {
        setErrorText("Password should be atleast 6 characters");
      } else {
        setErrorText("Error" + error.message);

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
        placeholder="Name"
        placeholderTextColor="#000"
        value={name}
        onChangeText={(text) => {
          setName(text.trim());
          if (errorText) setErrorText(null);
        }}
        autoCapitalize="none"
        autoComplete="off"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        value={email}
        onChangeText={(text) => {
          setEmail(text.trim());
          if (errorText) setErrorText(null);
        }}
        autoCapitalize="none"
        autoComplete="off"
      />

      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={preferredLanguage}
          onValueChange={(value) => setPreferredLanguage(value)}
          style={styles.picker}
        // dropdownIconColor="#000"
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="हिन्दी (Hindi)" value="hi" />
          <Picker.Item label="తెలుగు (Telugu)" value="te" />
        </Picker>

        {/* Small dropdown arrow */}
        {/* <View style={styles.iconContainer}>
          <Down />
        </View> */}
      </View>

      <TextInput
        style={[styles.input, { color: "#000" }]}
        placeholder="Password"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorText) setErrorText(null);
        }}
      />

      <TextInput
        style={[styles.input, { color: "#000" }]}
        placeholder="Confirm Password"
        placeholderTextColor="#000"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errorText) setErrorText(null);
        }}
      />
      {errorText && <Text style={styles.errorText}>{errorText}</Text>}

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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "500",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  picker: {
    // height: 40,
    color: "#000",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    pointerEvents: "none",
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    position: "relative",
    justifyContent: "center",
  },
});
