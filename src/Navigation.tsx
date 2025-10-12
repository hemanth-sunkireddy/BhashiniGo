import React from "react";
import { TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Minimal screen imports
import Welcome from "./screens/Welcome";
import Home from './screens/Home';
import Login from "./screens/Login";
import Register from './screens/Register';
import TextTranslator from './screens/TextTranslator';
import Profile from "./screens/Profile";
import BottomTabs from "./BottomTabs";
import SpeechToSpeech from "./screens/Speech-to-Speech";
import ImageToText from "./screens/Image-to-Text";
import TextToSpeech from "./screens/Text-to-Speech";
import LanguageIcon from "./assets/Language.svg";
import { getHeaderRight } from "./components/Header";
import LanguageSelector from "./components/LanguageSelector";
import i18next from "../lang/i18n";
import { useTranslation } from "react-i18next";
import CallTranslation from "./screens/CallTranslation";
import AudioToSpeech from "./screens/AudioToSpeech";

const Stack = createNativeStackNavigator();

function Navigation(): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="WelcomeScreen"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={Register}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{
            title: "Home", headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="TextTranslator"
          component={TextTranslator}
          options={{ title: "Text Translator" }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{ title: "Profile", headerBackVisible: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{
            title: t('Bhasini Go'),
            headerShown: true,
            // headerRight: () => (
            //   <View style={{ marginRight: 15 }}>
            //     <LanguageSelector />
            //   </View>
            // ),
            headerBackVisible: false
          }}
        />
        <Stack.Screen
          name="SpeechToSpeechScreen"
          component={SpeechToSpeech}
          options={{ title: "Speech To Speech" }}
        />
        <Stack.Screen
          name="ImageToTextScreen"
          component={ImageToText}
          options={{ title: "Image To Text" }}
        />
        <Stack.Screen
          name="TextToSpeechScreen"
          component={TextToSpeech}
          options={{ title: "Text to Speech" }}
        />
        <Stack.Screen
          name="CallScreen"
          component={CallTranslation}
          options={{ title: "Voice/Video Call" }}
        />
         <Stack.Screen
          name="AudioToSpeech"
          component={AudioToSpeech}
          options={{ title: "Audio To Speech" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
