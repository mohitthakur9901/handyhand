import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const GigDetails = () => {
    const { id } = useLocalSearchParams();
    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-2xl'>{
                id
            }</Text>
        </View>
    )
}

export default GigDetails