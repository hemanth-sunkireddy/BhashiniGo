import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient"; // ✅ Added
import { callCanvasAPI } from "../components/MT";

const TextTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  const languageLabels: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert("Please enter some text");
      return;
    }
    if (sourceLang === targetLang) {
      Alert.alert("Please select different languages for translation");
      return;
    }

    setLoading(true);
    setTranslatedText("");

    try {
      const response = await callCanvasAPI(inputText, sourceLang, targetLang);
      setTranslatedText(response.data.output_text || "No translation found");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#A7C7E7", "#E0F7FA", "#D6F0FF"]} // 🌍 Soft blue globe feel
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Your Language</Text>
            <Picker
              selectedValue={sourceLang}
              onValueChange={(value) => setSourceLang(value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Hindi" value="hi" />
              <Picker.Item label="Telugu" value="te" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Local Language</Text>
            <Picker
              selectedValue={targetLang}
              onValueChange={(value) => setTargetLang(value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Hindi" value="hi" />
              <Picker.Item label="Telugu" value="te" />
            </Picker>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder={`Tell what do you want to say...`}
          placeholderTextColor="#777"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleTranslate}>
          <Text style={styles.buttonText}>Get Translation</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 15 }} />
        )}

        {translatedText ? (
          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>Translated Text</Text>
            <Text style={styles.outputText}>{translatedText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
};

export default TextTranslator;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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
    height: 55,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#F8FAFF",
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  outputBox: {
    marginTop: 20,
    backgroundColor: "#F0F7FF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCE0FF",
  },
  outputLabel: {
    fontWeight: "700",
    color: "#007BFF",
    marginBottom: 5,
  },
  outputText: {
    fontSize: 16,
    color: "#333",
  },
});
