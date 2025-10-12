import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity } from "react-native";
import ProfileScreen from "./screens/Profile";
import Home from "./screens/Home";
import HomeIcon from "./assets/Home.svg";
import ProfileIcon from "./assets/Profile.svg";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarInactiveBackgroundColor: "transparent",
        tabBarButton: (props) => {
          // Remove nulls from props to avoid TouchableOpacity type errors
          const filteredProps = Object.fromEntries(
            Object.entries(props).filter(([_, v]) => v !== null)
          );
          return <TouchableOpacity {...filteredProps} activeOpacity={1} />;
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
          paddingHorizontal: 0,
          margin: 0,
          borderColor: "white",
        },
        tabBarStyle: {
          paddingHorizontal: 20,
          paddingTop: 0,
          paddingBottom: 0,
          borderColor: "#FFFFFF",
          borderTopWidth: 5,
          height: 65,
          backgroundColor: "#fffaf7",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        tabBarLabelPosition: "below-icon",
        tabBarIcon: ({ focused }) => {
          const iconSize = { width: 30, height: 30 };
          let IconComponent = null;

          if (route.name === "Home") {
            IconComponent = HomeIcon;
          } else if (route.name === "Profile") {
            IconComponent = ProfileIcon;
          }

          return (
            <View>
              {IconComponent && (
                <IconComponent {...iconSize} opacity={focused ? 1 : 0.5} />
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              fontWeight: focused ? "700" : "600",
              fontFamily: "Gilroy-Regular",
              color: focused ? "black" : "#666",
              paddingTop: 4,
            }}
          >
            {t(route.name)}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
