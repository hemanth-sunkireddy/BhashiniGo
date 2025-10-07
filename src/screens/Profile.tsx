import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
      } else {
        navigation.replace("LoginScreen"); // redirect if not logged in
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {user?.displayName || "User"}</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>

      <Button
        title="Logout"
        onPress={async () => {
          await auth().signOut();
          navigation.replace("LoginScreen");
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
