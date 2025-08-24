import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSocialAuth } from "@/src/hooks/useSocicalAuth";


const Login = () => {
  const { handleSocialAuth, isLoading } = useSocialAuth();


  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#FFD700", "#FFB347"]}
            className="flex-1 items-center justify-center px-8"
          >
            {/* App Logo */}
            <Image
              source={require("../../assets/images/login.jpeg")}
              className="w-40 h-40 rounded-full mb-8 shadow-lg"
            />

            {/* Title */}
            <Text className="text-4xl font-extrabold text-white mb-10">
              Welcome Back 👋
            </Text>

            <TouchableOpacity
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={isLoading}
              className="flex-row items-center gap-4 border border-white p-4 rounded-full">
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("@/src/assets/images/google.jpeg")}
                    className="size-10 mr-3 rounded-full"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">Continue with Google</Text>
                </View>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
