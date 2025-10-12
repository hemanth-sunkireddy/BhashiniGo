import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import LinearGradient from "react-native-linear-gradient"; // ✅ Added
import EnglishIcon from "../assets/English.svg";
import TalkIcon from "../assets/Talk.svg";
import GlobeIcon from "../assets/Globe.svg";
import CameraIcon from "../assets/Camera.svg";
import SpeakerIcon from "../assets/Speaker.svg";
import { useTranslation } from "react-i18next";

const features = [
  {
    key: "TextTranslator",
    icon: GlobeIcon,
    mainText: "Travel Phrase Translator",
    subText: "Text to Text Translator",
  },
  {
    key: "SpeechToSpeechScreen",
    icon: TalkIcon,
    mainText: "Talk to Locals",
    subText: "Speech to Speech",
  },
  {
    key: "ImageToTextScreen",
    icon: CameraIcon,
    mainText: "Snap and Translate",
    subText: "Extract text from images",
  },
  {
    key: "TextToSpeechScreen",
    icon: SpeakerIcon,
    mainText: "Hear it in Local Accent",
    subText: "Text to Speech",
  },
  {
    key: "AudioToSpeech",
    icon: SpeakerIcon,
    mainText: "Instant Voice Translate",
    subText: "Speech To Speech",
  },
  {
    key: "CallTranslation",
    icon: SpeakerIcon,
    mainText: "Call Translation",
    subText: "Call Translation",
  }
];

const Home = ({ navigation }: any) => {
  const [name, setName] = useState<string>("");
  const { t } = useTranslation();
  useEffect(() => {
    const fetchName = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection("users")
            .doc(user.email)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setName(userData?.name || "");
          } else {
            console.log("User document not found");
          }
        } else {
          console.log("No user signed in");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchName();
  }, []);

  const handlePress = (featureKey: string) => {
    if (featureKey === "TextTranslator") {
      navigation.navigate("TextTranslator");
    } else if (featureKey === "SpeechToSpeechScreen") {
      navigation.navigate("SpeechToSpeechScreen");
    } else if (featureKey === "ImageToTextScreen") {
      navigation.navigate("ImageToTextScreen");
    } else if (featureKey === "TextToSpeechScreen") {
      navigation.navigate("TextToSpeechScreen");
    }
    else if (featureKey === "AudioToSpeech") {
      navigation.navigate("AudioToSpeech");
    }
    else if (featureKey === "CallTranslation") {
      navigation.navigate("CallScreen");
    }
  };

  const renderItem = ({ item }: any) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity style={styles.box} onPress={() => handlePress(item.key)}>
        <View style={styles.boxContent}>
          <View style={styles.iconContainer}>
            <Icon width={50} height={50} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>{t(item.mainText)}</Text>
            <Text style={styles.subText}>{t(item.subText)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#A7C7E7", "#E0F7FA", "#D6F0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{t('Hello')}, {name}</Text>
        <FlatList
          data={features}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.boxContainer}
        />
      </View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#245C84", // 🩵 matches translator theme
  },
  boxContainer: {
    alignItems: "center",
  },
  box: {
    width: 280,
    height: 100,
    backgroundColor: "#EAF4FC", // 🎨 soft blue tone to blend with gradient
    borderRadius: 16,
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C8E0F4",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#245C84", // same deep teal-blue as label in translator
  },
  subText: {
    fontSize: 14,
    color: "#4F7FA1",
    marginTop: 4,
  },
});
