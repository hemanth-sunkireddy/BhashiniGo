import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";

const Welcome = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // User is logged in → redirect after short delay
        setTimeout(() => {
          navigation.navigate("BottomTabs");
        }, 1000); // optional delay to show welcome message
      } else {
        // User not logged in → redirect to login
        // navigation.replace("LoginScreen");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.text}>Loading...</Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>Welcome Home!</Text>

          {!user && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          )}
        </>

      )}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
