import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";

 const CustomAlert = ({ visible, onClose, title, message } : { visible: boolean; onClose: () => void; title: string; message: string }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          <Text className="text-gray-600 mt-2">{message}</Text>

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-orange-500 rounded-lg py-2 px-4"
          >
            <Text className="text-white text-center font-semibold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert
