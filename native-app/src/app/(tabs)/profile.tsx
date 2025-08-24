import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Location from "expo-location";
import Container from "@/src/components/Container";

const Profile = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    getCurrentLocation();
  }, []);

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          {/* Profile Image */}
          <View className="items-center mb-8 relative">
            <Image
              source={image ? { uri: image } : require("../../assets/images/helmet.jpeg")}
              className="w-36 h-36 rounded-full shadow-lg"
            />

          </View>

          {/* Profile Details */}
          <View className="px-6 space-y-4 gap-y-4">
            <Text  className="bg-white px-4 py-3 rounded-xl shadow-sm" >
                Username
            </Text>
            <Text  className="bg-white px-4 py-3 rounded-xl shadow-sm" >
                Email
            </Text>
            <Text  className="bg-white px-4 py-3 rounded-xl shadow-sm" >
                Phone
            </Text>
            <Text  className="bg-white px-4 py-3 rounded-xl shadow-sm" >
                Institution Name
            </Text>

            <View className="flex-row space-x-4 gap-x-2">
              <Text className="flex-1 bg-white px-4 py-3 rounded-xl shadow-sm" >
                Country
              </Text>
              <Text  className="flex-1 bg-white px-4 py-3 rounded-xl shadow-sm" >
                City
              </Text>
            </View>

            <View className="flex-row space-x-4 gap-x-2">
              <Text  className="flex-1 bg-white px-4 py-3 rounded-xl shadow-sm" >
                Address
              </Text>
              <Text   className="flex-1 bg-white px-4 py-3 rounded-xl shadow-sm" >
                Pin Code
              </Text>
            </View>

            <Text
            
              className="bg-white px-4 py-3 rounded-xl shadow-sm"
             
              numberOfLines={4}
            >
              Bio Description
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-center mt-6 space-x-6 gap-x-4">
            <TouchableOpacity
              className="bg-[#FF9B00] px-6 py-3 rounded-2xl shadow-md border-2 border-white flex-row items-center space-x-2 gap-2"
              onPress={() => setEditModalVisible(true)}
            >
              <Text><AntDesign name="edit" size={24} color="white" /></Text>
              <Text className="text-white font-bold text-center">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#FF9B00] px-6 py-3 rounded-2xl shadow-md border-2 border-white flex-row items-center space-x-2 gap-2"
              onPress={() => setSettingModalVisible(true)}
            >
              <Text><AntDesign name="setting" size={24} color="white" /></Text>
              <Text className="text-white font-bold text-center">Settings</Text>

            </TouchableOpacity>
          </View>

          {/* Edit Modal pass default values  */}
          <Modal
            visible={editModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setEditModalVisible(false)}
          >
            {/* Semi-transparent overlay */}
            <View className="flex-1 bg-white bg-opacity-40 justify-center items-center">
              {/* Modal content */}
              <View className="bg-white p-6 rounded-3xl w-11/12 ">
                {/* Header */}
                <Text className="text-2xl font-bold mb-6 text-center">Edit Profile</Text>

                {/* Profile Image */}
                <View className="items-center mb-6 relative">
                  <Image
                    source={image ? { uri: image } : require("../../assets/images/helmet.jpeg")}
                    className="w-36 h-36 rounded-full shadow-md"
                  />
                  <TouchableOpacity
                    onPress={pickImage}
                    className="absolute bottom-0 right-20 bg-white p-3 rounded-full shadow-md"
                  >
                    <AntDesign name="edit" size={20} color="black" />
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="space-y-4 gap-y-4">
                  <TextInput
                    placeholder="Username"
                    className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                  />
                  <TextInput
                    placeholder="Email"
                    className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                  />
                  <TextInput
                    placeholder="Phone"
                    className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                  />
                  <TextInput
                    placeholder="Institution"
                    className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                  />

                  <View className="flex-row space-x-4 gap-x-2">
                    <TextInput
                      placeholder="Country"
                      className="flex-1 bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                    />
                    <TextInput
                      placeholder="City"
                      className="flex-1 bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                    />
                  </View>

                  <View className="flex-row space-x-4 gap-x-2">
                    <TextInput
                      placeholder="Address"
                      className="flex-1 bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                    />
                    <TextInput
                      placeholder="Postal Code"
                      keyboardType="number-pad"
                      className="flex-1 bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                    />
                  </View>

                  <TextInput
                    placeholder="Bio"
                    className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-around mt-6">
                  <TouchableOpacity
                    className="bg-orange-500 px-6 py-3 rounded-2xl shadow-md"
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text className="text-white font-bold text-lg text-center">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-300 px-6 py-3 rounded-2xl shadow-md"
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text className="text-black font-bold text-lg text-center">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>


          {/* Settings Modal */}
          <Modal
            visible={settingModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setSettingModalVisible(false)}
          >
            <View className="flex-1 bg-white bg-opacity-50 justify-center items-center">
              <View className="bg-white p-6 rounded-2xl w-4/5 items-center">
                <Text className="text-lg font-bold mb-4">Settings</Text>
                {/* Buttons for app Adjustment */}
                <TouchableOpacity onPress={() => setSettingModalVisible(false)}>
                  <Text className="text-orange-500 font-bold mt-4">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ScrollView>
    </Container>
  );
};

export default Profile;
