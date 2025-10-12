import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import DocumentPicker, { pick, types } from "@react-native-documents/picker";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient"; // ✅ Added
import { callBhasaniOCR } from "../components/OCR";

const languageLabels: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
};

const ImageToText = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [ocrResult, setOcrResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<string>("en");

  const handlePickFile = async () => {
    try {
      const doc = await pick({
        allowMultiSelection: false,
        type: [types.images],
      });
      if (doc && doc[0]) {
        const file = doc[0];
        setSelectedFile(file);
        setOcrResult("");
        await handleOcr(file);
      }
    } catch (err: any) {
      console.error("File Picker Error:", err);
    }
  };

  const handleOcr = async (file: any) => {
    setLoading(true);
    setOcrResult("");
    try {
      const data = await callBhasaniOCR(file, lang);
      setOcrResult(data?.data?.decoded_text || "No text found");
    } catch (error: any) {
      setOcrResult("OCR failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#A7C7E7", "#E0F7FA", "#D6F0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Snap and Translate</Text>
          <Text style={styles.subHeading}>Extract text from images</Text>

          <Text style={styles.label}>Select Language:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={lang}
              onValueChange={setLang}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Hindi" value="hi" />
              <Picker.Item label="Telugu" value="te" />
            </Picker>
          </View>

          <TouchableOpacity onPress={handlePickFile} style={styles.button}>
            <Text style={styles.buttonText}>📂 Choose Image</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Image
                source={{ uri: selectedFile.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}

          {loading && (
            <Text style={styles.loadingText}>Processing image...</Text>
          )}

          {ocrResult ? (
            <View style={styles.outputBox}>
              <Text style={styles.outputLabel}>OCR Output:</Text>
              <Text style={styles.outputText}>{ocrResult}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ImageToText;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  container: {
    width: "90%",
    alignItems: "center",
    // backgroundColor: "rgba(255,255,255,0.7)", // subtle transparency to blend with gradient
    borderRadius: 16,
    padding: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#245C84", // 🩵 matches Home screen theme
    textAlign: "center",
  },
  subHeading: {
    fontSize: 15,
    color: "#4F7FA1",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#245C84",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#C8E0F4",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#EAF4FC",
    overflow: "hidden",
    width: 220,

  },
  picker: {
    height: 55,
    color: "#222",
    width: 220,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8E0F4",
  },
  loadingText: {
    marginTop: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  outputBox: {
    marginTop: 24,
    backgroundColor: "#EAF4FC",
    padding: 16,
    borderRadius: 10,
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#C8E0F4",
  },
  outputLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#245C84",
  },
  outputText: {
    color: "#222",
    fontSize: 15,
  },
});
