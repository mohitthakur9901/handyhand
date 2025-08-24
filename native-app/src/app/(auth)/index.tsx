import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";

// Reusable Animated Button
const AnimatedButton = ({
  label,
  image,
  onPress
}: {
  label: string;
  image: any;
  onPress: () => void
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View
        style={animatedStyle}
        className="bg-[#FF9B00] p-6 w-36 h-36 rounded-2xl items-center justify-center shadow-lg"
      >
        <Image source={image} className="w-16 h-16 mb-3 rounded-md" />
        <Text className="font-bold text-lg">{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const Index = () => {


  const router = useRouter();



  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#FFD700", "#FFB347"]}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-4xl font-extrabold mb-16">HandyHand</Text>

        <View className="flex-row gap-8">

          <AnimatedButton
            label="Find Help"
            image={require("../../assets/images/helmet.jpeg")}
            onPress={() => {
              router.push({
                pathname: "/(auth)/login",
                params: {
                  role: "GIVER"
                }
              })
            }}
          />

          <AnimatedButton

            label="Find Work"
            image={require("../../assets/images/money.jpeg")}
            onPress={() => {
              router.push({
                pathname: "/(auth)/login",
                params: {
                  role: "SEEKER"
                }
              })
            }}
          />

        </View>
      </LinearGradient>
      {/* already have an account */}
      <Link href="/(auth)/login" className="absolute bottom-16">
        <Text className="text-lg font-bold text-white">Already have an account? Sign In</Text>
      </Link>
    </SafeAreaView>
  );
};

export default Index;
