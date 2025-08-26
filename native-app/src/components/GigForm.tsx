import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import React, { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { GigTypes } from "../constants/data";
import CustomAlert from "./CustomAlert"; // ✅ make sure it's a default export

const GigForm = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const pickerRef = useRef<Picker<string>>(null);

  const handlePostGig = () => {
    console.log({ title, desc, type, price, location });
    setAlertMessage("✅ Gig posted successfully!");
    setShowAlert(true);
  };

  const HandleAlertPostButton = () => {
    if (title === "" || desc === "" || type === "" || price === "" || location === "") {
      setAlertMessage("⚠️ Please fill all the fields");
      setShowAlert(true);
    } else {
      handlePostGig();
    }
  };

  const getPlaceName = async (latitude: number, longitude: number) => {
    try {
      let [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (place) {
        return `${place.name || ""} ${place.street || ""}, ${place.city || ""}, ${place.region || ""}, ${place.country || ""}`;
      }
      return "Unknown location";
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Error getting location";
    }
  };

  const handleFetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Permission denied to access location.");
      setShowAlert(true);
      return;
    }
    let current = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = current.coords;
    const placeName = await getPlaceName(latitude, longitude);
    setLocation(placeName);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // ✅ adjust for header/navbar height
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="mt-10">
          <View className="bg-white p-4 rounded-2xl shadow-md space-y-6 gap-y-4">

            {/* Title */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
                placeholderTextColor="gray"
                className="bg-gray-100 text-black px-4 py-3 rounded-xl"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Description</Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Describe your gig..."
                placeholderTextColor="gray"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-100 text-black px-4 py-3 rounded-xl"
              />
            </View>

            {/* Type */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Type</Text>
              <View className="bg-gray-100 rounded-xl">
                <Picker
                  ref={pickerRef}
                  selectedValue={type}
                  onValueChange={(value) => setType(value)}
                >
                  <Picker.Item label="Select type..." value="" />
                  {Object.entries(GigTypes).map(([key, label]) => (
                    <Picker.Item key={key} label={label} value={key} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Price */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                placeholderTextColor="gray"
                keyboardType="numeric"
                className="bg-gray-100 text-black px-4 py-3 rounded-xl"
              />
            </View>

            {/* Location */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Location</Text>
              <View className="flex-row items-center gap-2">
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter location or use GPS"
                  placeholderTextColor="gray"
                  className="flex-1 bg-gray-100 text-black px-4 py-3 rounded-xl"
                />
                <TouchableOpacity
                  onPress={handleFetchLocation}
                  className="bg-gray-100 px-4 py-3 rounded-xl"
                >
                  <Text className="text-white text-lg">📍</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={HandleAlertPostButton}
              className="p-4 rounded-xl bg-orange-500"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Post Gig
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* ✅ Custom Alert */}
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title="Gig Form"
        message={alertMessage}
      />
    </KeyboardAvoidingView>
  );
};

export default GigForm;
