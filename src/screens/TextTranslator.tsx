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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>🌐 Text Translator</Text>
        <Text style={styles.subtitle}>
          {languageLabels[sourceLang]} → {languageLabels[targetLang]}
        </Text>

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

        <TextInput
          style={styles.input}
          placeholder={`Enter text in ${languageLabels[sourceLang]}...`}
          placeholderTextColor="#777"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleTranslate}>
          <Text style={styles.buttonText}>Translate</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 15 }} />}

        {translatedText ? (
          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>Translated Text</Text>
            <Text style={styles.outputText}>{translatedText}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default TextTranslator;

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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
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
    height: 50,
    color: "#000"
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
