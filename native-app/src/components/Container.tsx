import React from "react";
import {
  SafeAreaView,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Container = ({ children, style }: ContainerProps) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 16,
            ...style,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#FFD700", "#FFB347"]}
            style={{ borderRadius: 16, flex: 1, padding: 16 }}
          >
            {children}
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Container;
