import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, Modal, TextInput, Switch, Platform } from 'react-native';
import tailwind from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpense } from '../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { userName, updateName } = useExpense();
  const [profileImage, setProfileImage] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => { loadProfileImage(); }, []);

  const loadProfileImage = async () => {
    const savedImage = await AsyncStorage.getItem('user_profile_image');
    if (savedImage) setProfileImage(savedImage);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('user_profile_image', uri);
    }
  };

  const handleSaveName = () => {
    updateName(tempName);
    setModalVisible(false);
  };

  return (
    <View style={[tailwind`flex-1 bg-gray-50`, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={tailwind`px-6 pt-10 pb-8 items-center`}>
          <View style={tailwind`relative`}>
            <Pressable onPress={pickImage} style={tailwind`w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200 justify-center items-center`}>
              {profileImage ? <Image source={{ uri: profileImage }} style={tailwind`w-full h-full`} /> : <Ionicons name="person" size={50} color="#9ca3af" />}
            </Pressable>
            <Pressable onPress={pickImage} style={tailwind`absolute bottom-0 right-0 bg-black p-2 rounded-full border-2 border-white`}>
              <Ionicons name="camera" size={16} color="white" />
            </Pressable>
          </View>
          <Text style={tailwind`text-2xl font-bold text-black mt-4`}>{userName}</Text>
          <Text style={tailwind`text-gray-400 text-sm`}>Expense Tracker Member</Text>
        </View>

        {/* Account Section */}
        <View style={tailwind`px-6 mb-6`}>
          <Text style={tailwind`text-sm font-bold text-gray-400 uppercase ml-2 mb-2`}>Account Settings</Text>
          <View style={tailwind`bg-white rounded-3xl overflow-hidden shadow-sm`}>
            
            {/* Edit Name Option */}
            <Pressable 
              onPress={() => { setTempName(userName); setModalVisible(true); }}
              style={({ pressed }) => [tailwind`flex-row items-center justify-between p-4`, pressed && tailwind`bg-gray-50`]}
            >
              <View style={tailwind`flex-row items-center`}>
                <View style={tailwind`w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-4`}>
                  <Ionicons name="person-outline" size={20} color="#3b82f6" />
                </View>
                <Text style={tailwind`text-base font-medium text-gray-700`}>Display Name</Text>
              </View>
              <View style={tailwind`flex-row items-center`}>
                <Text style={tailwind`text-gray-400 mr-2`}>{userName}</Text>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </View>
            </Pressable>

            <View style={tailwind`h-[1px] bg-gray-50 mx-4`} />

            {/* Notifications Toggle */}
            <View style={tailwind`flex-row items-center justify-between p-4`}>
              <View style={tailwind`flex-row items-center`}>
                <View style={tailwind`w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-4`}>
                  <Ionicons name="notifications-outline" size={20} color="#a855f7" />
                </View>
                <Text style={tailwind`text-base font-medium text-gray-700`}>Push Notifications</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e5e7eb", true: "#000000" }}
                thumbColor={Platform.OS === 'ios' ? '#ffffff' : notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={tailwind`px-6 mb-12`}>
          <Text style={tailwind`text-sm font-bold text-gray-400 uppercase ml-2 mb-2`}>Preferences</Text>
          <View style={tailwind`bg-white rounded-3xl overflow-hidden shadow-sm`}>
            <View style={tailwind`flex-row items-center justify-between p-4`}>
              <View style={tailwind`flex-row items-center`}>
                <View style={tailwind`w-10 h-10 rounded-xl bg-green-50 items-center justify-center mr-4`}>
                  <Ionicons name="globe-outline" size={20} color="#22c55e" />
                </View>
                <Text style={tailwind`text-base font-medium text-gray-700`}>Language</Text>
              </View>
              <Text style={tailwind`text-gray-400`}>English</Text>
            </View>
          </View>
        </View>

        <Text style={tailwind`text-center text-gray-300 text-xs mb-10`}>App Version 1.0.4</Text>

        {/* Edit Name Modal */}
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          <View style={tailwind`flex-1 justify-center items-center bg-black/60 px-6`}>
            <View style={tailwind`bg-white w-full p-8 rounded-3xl shadow-2xl`}>
              <Text style={tailwind`text-xl font-bold mb-2 text-black text-center`}>What should we call you?</Text>
              <Text style={tailwind`text-gray-400 text-center mb-6`}>Your name will be visible on the Home screen.</Text>
              
              <TextInput 
                style={tailwind`bg-gray-100 p-4 rounded-2xl mb-6 text-black border border-gray-200 text-center text-lg font-bold`}
                value={tempName}
                onChangeText={setTempName}
                autoFocus
                placeholder="Enter your name"
              />
              
              <View style={tailwind`flex-row gap-4`}>
                <Pressable onPress={() => setModalVisible(false)} style={tailwind`p-4 flex-1 items-center`}>
                  <Text style={tailwind`text-gray-400 font-bold`}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleSaveName} style={tailwind`bg-black p-4 flex-1 rounded-2xl items-center`}>
                  <Text style={tailwind`text-white font-bold`}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </View>
  );
};

export default Profile;