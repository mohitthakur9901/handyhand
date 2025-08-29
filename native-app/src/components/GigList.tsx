// GigList.tsx
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { GIGS } from "../constants/data";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

// Helper function to calculate distance in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

const GigList = ({
  range,
  search,
  setSearch,
  setFilter,
}: {
  range: number;
  search: string;
  setSearch: (val: string) => void;
  setFilter: (val: boolean) => void;
}) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      let current = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="orange" />
        <Text className="mt-2">Fetching your location...</Text>
      </View>
    );
  }

  // ✅ filter gigs based on range
  const filteredGigs = GIGS.filter((item) => {
    if (!userLocation || !item.latitude || !item.longitude) return false;
    const distance = haversine(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude
    );
    return distance <= range;
  });

  if (filteredGigs.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-gray-500 text-lg">No gigs found within {range} km 🚫</Text>
      </View>
    );
  }

 return (
    <FlatList
      data={filteredGigs.filter((gig) =>
        gig.title.toLowerCase().includes(search.toLowerCase())
      )}
      keyExtractor={(item) => item.giverId}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className="flex-row items-center justify-between mb-4">
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="gray"
            className="bg-white m-2 rounded-xl flex-1 px-3"
          />
          <TouchableOpacity
            onPress={() => setFilter(true)}
            className="p-2 bg-white rounded-lg shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <AntDesign name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <View className="bg-white p-4 mb-4 rounded-xl shadow-md">
          <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
          <Text className="text-gray-600 mt-1">{item.description}</Text>
          <Text className="text-green-600 mt-2 font-bold">${item.price}</Text>
          <View className="flex-row justify-between items-center mt-2">
            {userLocation && (
              <Text className="text-sm text-gray-500">📍 {haversine(
                userLocation.latitude,
                userLocation.longitude,
                item.latitude,
                item.longitude
              ).toFixed(1)} km away</Text>
            )}
            <TouchableOpacity
              onPress={() => router.push(`/gigs/${item.giverId}`)}
              className="bg-orange-500 px-6 py-2 rounded-3xl"
            >
              <Text className="text-sm text-white">View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default GigList;
