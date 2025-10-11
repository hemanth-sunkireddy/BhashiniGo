import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Make sure this is installed
import VoiceRecorder from "../components/VoiceInput";

const SpeechToSpeech = ({ navigation }: any) => {
  const [recognizedText, setRecognizedText] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [destLang, setDestLang] = useState("English");

  const handleVoiceResult = (result: any) => {
    console.log("Voice result:", result);
    setRecognizedText(result?.text || "No text found");
  };

  // 🧠 Placeholder logic for later translation handling
  const handleLanguageSelection = () => {
    if (sourceLang === "English" && destLang === "Hindi") {
      // logic for English → Hindi
    } else if (sourceLang === "Hindi" && destLang === "Telugu") {
      // logic for Hindi → Telugu
    } else if (sourceLang === "Telugu" && destLang === "English") {
      // logic for Telugu → English
    } else {
      // default or same-language logic
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Speech</Text>

      {/* 🎙️ Voice Recorder */}
      <VoiceRecorder onResult={handleVoiceResult} />

      {/* 🌐 Language Selectors */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Source Language:</Text>
        <Picker
          selectedValue={sourceLang}
          onValueChange={(itemValue) => {
            setSourceLang(itemValue);
            handleLanguageSelection();
          }}
          style={styles.picker}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Hindi" value="Hindi" />
          <Picker.Item label="Telugu" value="Telugu" />
        </Picker>
        <Text style={styles.selectedText}>Selected: {sourceLang}</Text>
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Destination Language:</Text>
        <Picker
          selectedValue={destLang}
          onValueChange={(itemValue) => {
            setDestLang(itemValue);
            handleLanguageSelection();
          }}
          style={styles.picker}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Hindi" value="Hindi" />
          <Picker.Item label="Telugu" value="Telugu" />
        </Picker>
        <Text style={styles.selectedText}>Selected: {destLang}</Text>
      </View>

      {/* 📝 Recognized Text */}
      {recognizedText ? (
        <View style={styles.outputBox}>
          <Text style={styles.outputLabel}>Recognized Text:</Text>
          <Text style={styles.outputText}>{recognizedText}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default SpeechToSpeech;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectedText: {
    marginTop: 8,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  outputBox: {
    marginTop: 30,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  outputLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  outputText: {
    fontSize: 16,
    color: "#333",
  },
});
