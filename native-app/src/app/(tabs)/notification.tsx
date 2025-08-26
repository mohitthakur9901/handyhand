import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import Container from "@/src/components/Container";
import { fakeNotifications } from "@/src/constants/data";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const Notification = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "APPLICATION":
        return <Ionicons name="document-text-outline" size={24} color="#f97316" />;
      case "STATUS_UPDATE":
        return <Ionicons name="checkmark-done-circle-outline" size={24} color="#16a34a" />;
      case "GIG_UPDATE":
        return <Ionicons name="briefcase-outline" size={24} color="#2563eb" />;
      case "MESSAGE":
        return <Ionicons name="chatbubble-ellipses-outline" size={24} color="#9333ea" />;
      case "REMINDER":
        return <Ionicons name="alarm-outline" size={24} color="#eab308" />;
      default:
        return <Ionicons name="notifications-outline" size={24} color="#6b7280" />;
    }
  };

  return (
    <Container>
      <FlatList
        data={fakeNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            className={`flex-row items-center justify-between bg-white rounded-2xl p-4 mb-3 shadow-sm ${
              !item.read ? "border-l-4 border-orange-500" : ""
            }`}
          >
            {/* Left: Icon + Text */}
            <View className="flex-row items-start gap-3 flex-1">
              {getIcon(item.type)}
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">{item.title}</Text>
                <Text className="text-gray-600 mt-1">{item.message}</Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {item.createdAt.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Right: Mark as Read */}
            {!item.read && (
              <TouchableOpacity className="ml-2 bg-orange-500 p-2 rounded-full shadow">
                <AntDesign name="check" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </Container>
  );
};

export default Notification;
