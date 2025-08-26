import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/src/components/HapticTab";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
/*
render tabs based on user role 
giver will have on gigs creating page 
seeker will have on gigs finding page
*/

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: "#FF9B00", // active color
        tabBarInactiveTintColor: "#888", // inactive color
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopWidth: 0,
          },
          default: {
            backgroundColor: "white",
            borderTopWidth: 0.5,
            borderTopColor: "#ddd",
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      {/* show only for giver */}
      <Tabs.Screen
        name="gig"
        options={{
          title: "Gig",
          tabBarIcon: ({ color }) => (

            <FontAwesome5 name="hands-helping" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => (
            <AntDesign name="notification" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
