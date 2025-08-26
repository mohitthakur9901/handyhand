import Container from '@/src/components/Container';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import GigList from '@/src/components/GigList';
import * as Location from "expo-location";

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [location, setLocation] = useState(12);

  return (
    <Container>
      {/* Search bar and filter button */}
      <View className="flex-row items-center justify-between mb-4 mt-6 border-b-2  rounded-lg px-2">
        <TextInput
          placeholder="Search"
          value={search}
          placeholderTextColor="black"

          onChangeText={setSearch}
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
            elevation: 4, // ✅ for Android
          }}
        >
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>

      </View>

      {/* Modal with slider */}
      <Modal visible={filter} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-4 rounded-2xl">
            <Text className="text-lg font-semibold mb-2">Set Range</Text>
            <Slider
              minimumValue={12}
              maximumValue={50}
              step={1}
              value={location}
              onValueChange={setLocation}
              minimumTrackTintColor="#00a2ff"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#00a2ff"
            />
            <Text className="mt-2">Selected: {location} km</Text>

            <TouchableOpacity
              onPress={() => setFilter(false)}
              className="bg-orange-500 px-6 py-3 shadow-md mt-4 rounded-lg"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* List down the gigs and helper based on user role nad location */}
      <GigList range={location} />
    </Container>
  );
}
