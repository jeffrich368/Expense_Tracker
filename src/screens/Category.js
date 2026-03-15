import { Pressable, Text, View, FlatList, TextInput, Animated } from 'react-native';
import React, { useRef, memo, useState } from 'react';
import tailwind from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../constant'; 

const CategoryTile = memo(({ item, onSelect }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSelect(item);
    });
  };

  return (
    <Animated.View style={[tailwind`flex-1`, { transform: [{ scale: scaleValue }] }]}>
      <Pressable 
        // Using dynamic tailwind class for the background color
        style={tailwind`m-2 p-5 rounded-3xl ${item.color} items-center justify-center border border-black/5`}
        onPress={handlePress}
      >
        <Text style={tailwind`text-4xl mb-2`}>{item.icon}</Text>
        <Text style={tailwind`text-xs font-bold text-gray-800 text-center uppercase tracking-tight`}>
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const Category = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filteredCategories = CATEGORIES.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    // Navigating back to Create screen inside the Tabs
    navigation.navigate('BottomTabs', {
      screen: 'Create',
      params: { selectedCategory: item },
    });
  };

  return (
    <View style={[tailwind`flex-1 bg-white`, { paddingTop: insets.top + 10 }]}>
      {/* Custom Header Section */}
      <View style={tailwind`px-6 mb-2`}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={tailwind`w-10 h-10 justify-center bg-gray-100 rounded-full items-center`}
        >
          <Text style={tailwind`text-lg font-bold text-black`}>✕</Text>
        </Pressable>

        <View style={tailwind`mt-6`}>
          <Text style={tailwind`text-3xl font-bold text-black`}>Select Category</Text>
          <View style={tailwind`mt-4 mb-2`}>
            <View style={tailwind`bg-gray-100 flex-row items-center px-4 rounded-2xl`}>
               <Text style={tailwind`mr-2`}>🔍</Text>
               <TextInput
                placeholder="Search categories..."
                style={tailwind`flex-1 py-4 text-base text-black`}
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Grid of Categories */}
      <FlatList 
        data={filteredCategories} 
        renderItem={({ item }) => (
          <CategoryTile item={item} onSelect={handleSelect} />
        )} 
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={tailwind`px-4 pb-24`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Category;