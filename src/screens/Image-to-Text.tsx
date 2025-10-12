import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from "react-native";
import DocumentPicker, { pick, types } from "@react-native-documents/picker";
import { Picker } from "@react-native-picker/picker";
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
      // ✅ Extract the correct OCR text
      setOcrResult(data?.data?.decoded_text || "No text found");
    } catch (error: any) {
      setOcrResult("OCR failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.heading}>Image to Text (OCR)</Text>
      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={lang}
          onValueChange={setLang}
          style={styles.picker}
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
  );
};

export default ImageToText;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#444",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f7fafc",
    overflow: "hidden",
    width: 220,
  },
  picker: {
    height: 44,
    color: "#222",
    width: 220,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  loadingText: {
    marginTop: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  outputBox: {
    marginTop: 24,
    backgroundColor: '#e6f0fa',
    padding: 16,
    borderRadius: 8,
    maxWidth: 320,
  },
  outputLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007BFF',
  },
  outputText: {
    color: '#222',
    fontSize: 16,
  },
});
