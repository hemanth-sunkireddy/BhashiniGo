import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";

const Welcome = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in → redirect after short delay
        setTimeout(() => {
          navigation.navigate("BottomTabs");
        }, 1000); // optional delay to show welcome message
      } else {
        // User not logged in → redirect to login
        navigation.replace("LoginScreen");
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
        <Text style={styles.text}>Welcome Home! Redirecting...</Text>
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
});
