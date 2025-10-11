import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import VoiceRecorder from "../components/VoiceInput";

const SpeechToSpeech = ({ navigation }: any) => {

  // 🧠 Assume this function already exists elsewhere and handles recording
  const recordVoice = async () => {
    try {
      // Call your existing recording logic here
      await recordVoice();
      Alert.alert("Recording started!");
    } catch (error) {
      console.error("Error recording voice:", error);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Speech</Text>

      {/* 🎙️ Button to record voice */}
      <VoiceRecorder />
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
});
