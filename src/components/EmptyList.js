import { Text, View } from 'react-native';
import React from 'react';
import tailwind from 'twrnc';

const EmptyList = ({ title, message }) => {
  return (
    // We use items-center and justify-center to poke it into the middle
    <View style={tailwind`flex-1 justify-center items-center p-8 mt-10`}>
      
      {/* Big Emoji Icon */}
      <Text style={tailwind`text-6xl mb-4`}>📝</Text>

      {/* Title */}
      <Text style={tailwind`text-xl font-bold text-black text-center`}>
        {title || "No expenses to display"}
      </Text>

      {/* Sub-message */}
      <Text style={tailwind`text-base text-gray-500 text-center mt-2`}>
        {message || "Add a new expense to see it in your list"}
      </Text>
      
    </View>
  );
}

export default EmptyList;