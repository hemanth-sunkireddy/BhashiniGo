import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

// Import your API function
import { callCanvasAPI } from "../components/MT";

const Home = ({ navigation }: any) => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    console.log("HI");
    if (!inputText.trim()) {
      Alert.alert("Please enter some English text");
      return;
    }

    setLoading(true);
    setTranslatedText("");
    console.log("HELLO");
    try {
      const response = await callCanvasAPI(inputText);
      console.log("RESPONSE: ", response);
      // Assuming response looks like { output_text: "हिंदी अनुवाद" }
      setTranslatedText(response.data.output_text || "No translation found");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>English → Hindi Translator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter text in English"
        placeholderTextColor="#000"
        value={inputText}
        onChangeText={setInputText}
        multiline
      />

      <Button title="Translate" onPress={handleTranslate} />

      {loading && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />}

      {translatedText ? (
        <View style={styles.outputBox}>
          <Text style={styles.outputLabel}>Translated Text:</Text>
          <Text style={styles.outputText}>{translatedText}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Home;

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: "top",
  },
  outputBox: {
    marginTop: 20,
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
