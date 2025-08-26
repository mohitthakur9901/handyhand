import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '@/src/components/Container';
import GigForm from '@/src/components/GigForm';
import Applications from '@/src/components/Applications';
import MyGigs from '@/src/components/MyGigs';


const Gig = () => {
  const [activeTab, setActiveTab] = useState<'gigs' | 'mygigs' | 'applications'>('gigs');

  const TabButton = ({ label, tab }: { label: string; tab: 'gigs' | 'mygigs' | 'applications' }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`flex-1 py-3 rounded-xl ${activeTab === tab ? 'bg-orange-500' : ''}`}
    >
      <Text
        className={`text-center font-semibold ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Container>
      {/* Header Tabs */}
      <View className="flex-row bg-gray-100 rounded-2xl mt-6 mx-4 p-1">
        <TabButton label="New Gig" tab="gigs" />
        <TabButton label="My Gigs" tab="mygigs" />
        <TabButton label="Applications" tab="applications" />
      </View>

      {/* Page Content */}
      <View className="mt-6 px-4">
        {activeTab === 'gigs' && <GigForm />}
        {activeTab === 'mygigs' && <MyGigs />}
        {activeTab === 'applications' && <Applications />}
      </View>
    </Container>
  );
};

export default Gig;
