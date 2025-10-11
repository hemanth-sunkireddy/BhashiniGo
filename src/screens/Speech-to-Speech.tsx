import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import VoiceRecorder from "../components/VoiceInput";
import { callCanvasAPI } from "../components/MT";
import { callCanvasTTSAPI } from "../components/TTS";

import Sound from "react-native-sound";

export const playAudioFromUrl = (url: string) => {
  console.log("🎧 Playing audio:", url);

  const sound = new Sound(url, null, (error) => {
    if (error) {
      console.error("🔴 Failed to load sound", error);
      Alert.alert("Playback Error", "Failed to play audio file.");
      return;
    }

    sound.play((success) => {
      if (success) {
        console.log("✅ Audio played successfully");
      } else {
        console.error("🔴 Playback failed");
      }
      sound.release(); // cleanup
    });
  });
};

const generateTTS = async (inputText: string, gender: "male" | "female" = "male", targetLang: string, setLoading: (val: boolean) => void) => {
  if (!inputText.trim()) {
    Alert.alert("Error", "Input text is empty.");
    return;
  }

  try {
    setLoading(true);
    console.log("🗣️ Sending TTS request...");

    const response = await callCanvasTTSAPI(inputText.trim(), gender, targetLang);
    const audioUrl = response?.data?.s3_url;

    if (audioUrl) {
      console.log("🎧 Generated Audio URL:", audioUrl);
      playAudioFromUrl(audioUrl);
    } else {
      Alert.alert("Error", "No audio URL returned from server.");
    }
  } catch (err: any) {
    console.error("TTS Error:", err);
    Alert.alert("Error", err.message || "Failed to generate TTS audio.");
  } finally {
    setLoading(false);
  }
};

const SpeechToSpeech = ({ navigation }: any) => {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);

  const languageLabels: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
  };

  const handleVoiceResult = async (recognizedText: string) => {
    console.log("Recognized Text:", recognizedText);
let translatedText = "";
    // ✅ Handle all language combinations
    if (sourceLang === "en" && targetLang === "hi") {
      console.log("English → Hindi:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
      translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);

 
      
      // TODO: call translation API for English → Hindi
    } else if (sourceLang === "en" && targetLang === "te") {
      console.log("English → Telugu:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
       translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);

    } else if (sourceLang === "hi" && targetLang === "en") {
      console.log("Hindi → English:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
       translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);
    } else if (sourceLang === "hi" && targetLang === "te") {
      console.log("Hindi → Telugu:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
       translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);
    } else if (sourceLang === "te" && targetLang === "en") {
      console.log("Telugu → English:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
     translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);
    } else if (sourceLang === "te" && targetLang === "hi") {
      console.log("Telugu → Hindi:", recognizedText);
      const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
       translatedText = response?.data?.output_text;
      console.log("Translated Text:", translatedText);
    } else if (sourceLang === "en" && targetLang === "en") {
      // generateTTS(recognizedText, "male", setLoading);
      console.log("English → English (no translation needed):", recognizedText);
      
      
    } else if (sourceLang === "hi" && targetLang === "hi") {
      console.log("Hindi → Hindi (no translation needed):", recognizedText);
      
    } else if (sourceLang === "te" && targetLang === "te") {
      console.log("Telugu → Telugu (no translation needed):", recognizedText);

    } else {
      console.log("Unsupported combination:", sourceLang, targetLang);
    }

     if (translatedText) {
    // Call your TTS function, pass gender and setLoading if needed
    generateTTS(translatedText, "male", targetLang, setLoading);
  } else {
    console.warn("No translated text returned from API");
  }
    // Optional: show in alert
    Alert.alert(
      "Recognized Text",
      `${languageLabels[sourceLang]} → ${languageLabels[targetLang]}:\n${recognizedText}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>🎤 Speech to Speech</Text>

        {/* 🌐 Selected languages display */}
        <View style={styles.languageBox}>
          <Text style={styles.languageText}>
            {languageLabels[sourceLang]} → {languageLabels[targetLang]}
          </Text>
        </View>

        {/* 🈯 Pickers for source and target */}
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>From</Text>
            <Picker
              selectedValue={sourceLang}
              onValueChange={(value) => setSourceLang(value)}
              style={styles.picker}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Hindi" value="hi" />
              <Picker.Item label="Telugu" value="te" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>To</Text>
            <Picker
              selectedValue={targetLang}
              onValueChange={(value) => setTargetLang(value)}
              style={styles.picker}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Hindi" value="hi" />
              <Picker.Item label="Telugu" value="te" />
            </Picker>
          </View>
        </View>

        {/* 🎙️ Voice recording component */}
       <VoiceRecorder sourceLang={sourceLang} onResult={handleVoiceResult} />
      </View>
    </ScrollView>
  );
};

export default SpeechToSpeech;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E9F3FF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 15,
  },
  languageBox: {
    backgroundColor: "#F0F7FF",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCE0FF",
    marginBottom: 15,
  },
  languageText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#F5F8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 5,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
    color: "#333",
  },
  picker: {
    height: 50,
    color: "#000",
  },
});
