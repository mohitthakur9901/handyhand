import {
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { useSocialAuth } from "@/src/hooks/useSocicalAuth";
import Container from "@/src/components/Container";

const Login = () => {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <Container>
      <View className="flex-1 justify-between">
        {/* Scrollable middle content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo */}
          <Image
            source={require("../../assets/images/login.jpeg")}
            className="w-40 h-40 rounded-full mb-8 self-center shadow-lg"
          />

          {/* Title */}
          <Text className="text-4xl font-extrabold text-white text-center mb-10">
            Login to Your Account
          </Text>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={() => handleSocialAuth("oauth_google")}
            disabled={isLoading}
            className="flex-row items-center gap-4 border border-white p-4 rounded-full bg-white/80 self-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("@/src/assets/images/google.jpeg")}
                  className="size-10 mr-3 rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-black font-medium text-base">
                  Continue with Google
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Footer (always fixed at bottom) */}
        <View className="items-center justify-center p-4">
          <Text className="text-gray-600 text-center">
            <Text className="text-white">Terms of Service</Text> and{" "}
            <Text className="text-white">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default Login;
