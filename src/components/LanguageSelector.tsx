import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import HindiIcon from "../assets/Hindi.svg";
import TeluguIcon from "../assets/Telugu.svg";
import EnglishIcon from "../assets/English.svg";
import i18next from "../../lang/i18n";

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { name: "Hindi", langCode: "hi", icon: <HindiIcon width={30} height={30} /> },
    { name: "English", langCode: "en", icon: <EnglishIcon width={30} height={30} /> },
    { name: "Telugu", langCode: "te", icon: <TeluguIcon width={30} height={30} /> },
  ];

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    console.log("Selected Language:", langCode);
    console.log("i18n Current Language:", i18next.language);

    await i18next.changeLanguage(langCode); // ✅ use langCode, not selectedLanguage

    console.log("i18n Current Language:", i18next.language); // ✅ print current language after change
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
    justifyContent: "space-around",
    width: 140,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
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
