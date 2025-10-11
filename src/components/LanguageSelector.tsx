import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import HindiIcon from "../assets/Hindi.svg";
import TeluguIcon from "../assets/Telugu.svg";
import EnglishIcon from "../assets/English.svg";
import i18next from "../../lang/i18n";

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { name: "Hindi", langCode: "hi", icon: <HindiIcon width={50} height={50} /> },
    { name: "English", langCode: "en", icon: <EnglishIcon width={50} height={50} /> },
    { name: "Telugu", langCode: "te", icon: <TeluguIcon width={50} height={50} /> },
  ];

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    console.log("Selected Language:", langCode);
    console.log("i18n Current Language:", i18next.language);

    await i18next.changeLanguage(langCode);

    console.log("i18n Current Language:", i18next.language);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.langCode}
          style={styles.iconContainer}
          onPress={() => handleLanguageChange(lang.langCode)}
        >
          {lang.icon}
          {selectedLanguage === lang.langCode && <Text style={styles.tick}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly", // ✅ evenly distribute across full row
    width: "100%", // ✅ occupy full width
    paddingHorizontal: 16,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // ✅ each icon takes equal space
  },
  tick: {
    position: "absolute",
    bottom: -8,
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LanguageSelector;
