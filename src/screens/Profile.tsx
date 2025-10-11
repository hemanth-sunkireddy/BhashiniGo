import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import auth from "@react-native-firebase/auth";
import LanguageSelector from "../components/LanguageSelector";
import i18next from '../../lang/i18n';
import firestore from "@react-native-firebase/firestore";
import { useTranslation } from 'react-i18next';

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
        fetchUserData(usr.email); // 🔹 Fetch Firestore data
      } else {
        navigation.replace("LoginScreen");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserData = async (email: string) => {
    try {
      const doc = await firestore().collection("users").doc(email).get();
      if (doc.exists) {
        console.log("Fetched user data:", doc.data());
        setUserData(doc.data());
      } else {
        console.log("No user document found for:", email);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

   return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>👤 {t("Profile")}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>{t("Name")}</Text>
          <Text style={styles.value}>
            {userData?.name || user?.displayName || "User"}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>{t("Email")}</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t("Language")}</Text>
        <LanguageSelector />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await auth().signOut();
            navigation.replace("LoginScreen");
          }}
        >
          <Text style={styles.logoutText}>{t("Logout")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafc",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
