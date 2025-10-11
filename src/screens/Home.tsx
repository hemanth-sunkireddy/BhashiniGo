import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const features = [
  { key: "TextTranslator", label: "Text Translator" },
  { key: "SpeechToSpeechScreen", label: "Speech To Speech" },
  { key: "ImageToTextScreen", label: "Image To Text" },
  // Add more features here as needed
];

const Home = ({ navigation }: any) => {
  const handlePress = (featureKey: string) => {
    if (featureKey === "TextTranslator") {
      navigation.navigate("TextTranslator");
    }
    else if (featureKey === "SpeechToSpeechScreen") {
      navigation.navigate("SpeechToSpeechScreen");
    }
    else if (featureKey === "ImageToTextScreen") {
      navigation.navigate("ImageToTextScreen");
    }
    // Add more navigation logic for other features
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Choose a Feature:</Text>
      <FlatList
        data={features}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() => handlePress(item.key)}
          >
            <Text style={styles.boxText}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.boxContainer}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  boxContainer: {
    alignItems: "center",
  },
  box: {
    width: 250,
    height: 100,
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  boxText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
