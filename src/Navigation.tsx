import React from "react";
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

const Stack = createNativeStackNavigator();

function Navigation(): React.JSX.Element {
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
          options={{ title: "Home", headerBackVisible: false }}
        />
        <Stack.Screen
          name="TextTranslator"
          component={TextTranslator}
          options={{ title: "Text Translator", headerBackVisible: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{ title: "Profile", headerBackVisible: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
          options={{ headerShown: false }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
