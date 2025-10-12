import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import VoiceRecorder from "../components/VoiceInput";
import { callCanvasAPI } from "../components/MT";
import { callCanvasTTSAPI } from "../components/TTS";
import Sound from "react-native-sound";

export const playAudioFromUrl = (url: string) => {
  const sound = new Sound(url, null, (error) => {
    if (error) {
      console.error("🔴 Failed to load sound", error);
      Alert.alert("Playback Error", "Failed to play audio file.");
      return;
    }
    sound.play((success) => {
      if (success) console.log("✅ Audio played successfully");
      else console.error("🔴 Playback failed");
      sound.release();
    });
  });
};

const generateTTS = async (inputText: string, targetLang: string) => {
  if (!inputText.trim()) return;
  try {
    const response = await callCanvasTTSAPI(inputText.trim(), "male", targetLang);
    const audioUrl = response?.data?.s3_url;
    if (audioUrl) playAudioFromUrl(audioUrl);
  } catch (err: any) {
    console.error("TTS Error:", err);
  }
};

const SpeechToSpeech = () => {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  const languageLabels: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
  };

  const handleVoiceResult = async (recognizedText: string) => {
    try {
      console.log("🎧 Partial Recognized Text:", recognizedText);

      let translatedText = "";
      if (sourceLang !== targetLang) {
        const response = await callCanvasAPI(recognizedText, sourceLang, targetLang);
        translatedText = response?.data?.output_text || "";
      } else {
        translatedText = recognizedText;
      }

      if (translatedText) {
        generateTTS(translatedText, targetLang);
      }
    } catch (err) {
      console.error("Speech chain error:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>🎤 Have a Continuous Conversation with Locals</Text>
        <View style={styles.languageBox}>
          <Text style={styles.languageText}>
            {languageLabels[sourceLang]} → {languageLabels[targetLang]}
          </Text>
        </View>

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

        {/* 🎙️ Continuous voice input */}
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
    fontSize: 18,
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