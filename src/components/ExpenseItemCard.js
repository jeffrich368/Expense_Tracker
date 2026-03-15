import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import tailwind from 'twrnc';
import { useExpense } from '../context/ExpenseContext';

const ExpenseItemCard = ({ item }) => {
  const { deleteExpense } = useExpense();

  return (
    <Pressable 
      onLongPress={() => deleteExpense(item.id)}
      style={({ pressed }) => [
        tailwind`flex-row items-center bg-white p-4 mb-3 rounded-3xl shadow-sm mx-5`,
        pressed && tailwind`opacity-70 scale-[0.98]` // Visual feedback
      ]}
    >
      <View style={tailwind`w-12 h-12 bg-gray-100 rounded-2xl items-center justify-center mr-4`}>
        <Text style={tailwind`text-2xl`}>{item.icon}</Text>
      </View>
      
      <View style={tailwind`flex-1`}>
        <Text style={tailwind`text-base font-bold text-black mb-1`}>{item.title}</Text>
        <View style={tailwind`flex-row`}>
          <View style={tailwind`px-3 py-1 rounded-full ${item.color}`}>
            <Text style={tailwind`text-[10px] font-bold text-gray-700 uppercase`}>
              {item.category}
            </Text>
          </View>
        </View>
      </View>

      <View style={tailwind`items-end`}>
        <Text style={tailwind`text-lg font-bold text-black`}>
          ₵{parseFloat(item.amount).toFixed(2)}
        </Text>
        <Text style={tailwind`text-[10px] text-gray-400 mt-1`}>{item.date}</Text>
      </View>
    </Pressable>
  );
};

export default ExpenseItemCard;