import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Sound from "react-native-sound";
import { callCanvasTTSAPI } from "../components/TTS";

Sound.setCategory("Playback");


const TextToSpeech = () => {
  const [inputText, setInputText] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(false);

  const playAudioFromUrl = (url: string) => {
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

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert("Empty Input", "Please enter some text before submitting.");
      return;
    }

    try {
      setLoading(true);
      console.log("🗣️ Sending TTS request...");

      const response = await callCanvasTTSAPI(inputText.trim(), gender);
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#333",
          marginBottom: 20,
        }}
      >
        🗣️ Text to Speech
      </Text>

      <TextInput
        placeholder="Enter text here..."
        placeholderTextColor="#888"
        value={inputText}
        onChangeText={setInputText}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "#fff",
          fontSize: 16,
          marginBottom: 20,
        }}
        multiline
      />

      {/* Gender toggle */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setGender("male")}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: gender === "male" ? "#007BFF" : "#ccc",
            width: "45%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGender("female")}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: gender === "female" ? "#007BFF" : "#ccc",
            width: "45%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#28A745",
          padding: 14,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            🔊 Generate & Play
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TextToSpeech;
