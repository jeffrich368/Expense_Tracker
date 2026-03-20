import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import tailwind from 'twrnc';
import { useExpense } from '../context/ExpenseContext';
import { PieChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const getHexColor = (twClass) => {
  const colorMap = {
    'bg-orange-100': '#FFEDD5', 'bg-blue-100': '#DBEAFE', 'bg-purple-100': '#F3E8FF',
    'bg-yellow-100': '#FEF9C3', 'bg-red-100': '#FEE2E2', 'bg-green-100': '#DCFCE7',
    'bg-indigo-100': '#E0E7FF', 'bg-teal-100': '#CCFBF1', 'bg-pink-100': '#FCE7F3',
    'bg-gray-100': '#F3F4F6', 'bg-cyan-100': '#CFFAFE', 'bg-violet-200': '#DDD6FE',
  };
  return colorMap[twClass] || '#000000';
};

const Insights = () => {
  const insets = useSafeAreaInsets();
  const { expenses, setExpenses } = useExpense(); 

  // --- 1. DATA CLEARING LOGIC ---
  const handleClearData = () => {
    Alert.alert(
      "Reset All Data?",
      "This will permanently delete all your expenses. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Everything", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user_expenses');
              setExpenses([]); 
              Alert.alert("Success", "All data has been cleared.");
            } catch (e) {
              Alert.alert("Error", "Failed to clear data.");
            }
          } 
        }
      ]
    );
  };

  const chartData = useMemo(() => {
    const totals = expenses.reduce((acc, exp) => {
      const categoryName = typeof exp.category === 'object' ? exp.category.name : exp.category;
      acc[categoryName] = (acc[categoryName] || 0) + parseFloat(exp.amount || 0);
      return acc;
    }, {});

    return Object.keys(totals).map((name) => {
      const expenseItem = expenses.find(e => (typeof e.category === 'object' ? e.category.name : e.category) === name);
      const rawColor = typeof expenseItem?.category === 'object' ? expenseItem.category.color : expenseItem?.color;
      return {
        name,
        population: totals[name],
        color: getHexColor(rawColor), 
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    });
  }, [expenses]);

  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <View style={[tailwind`flex-1 bg-white`, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={tailwind`p-5 pb-24`}>
        <Text style={tailwind`text-3xl font-bold text-black mb-1`}>Insights</Text>
        <Text style={tailwind`text-base text-gray-500 mb-8`}>Where your money goes.</Text>

        {/* Total Spent Card */}
        <View style={tailwind`bg-black p-6 rounded-3xl mb-8 shadow-lg`}>
          <Text style={tailwind`text-gray-400 text-sm font-bold uppercase tracking-widest mb-1`}>Total Spent</Text>
          <Text style={tailwind`text-4xl font-bold text-white`}>₵{totalSpent.toFixed(2)}</Text>
        </View>

        {/* Chart Section */}
        <View style={tailwind`items-center justify-center bg-gray-50 rounded-3xl p-4 mb-8`}>
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute={false} 
            />
        </View>

        {/* Breakdown List */}
        <Text style={tailwind`text-xl font-bold text-black mb-4`}>Breakdown</Text>
        {chartData.map((item, index) => (
          <View key={index} style={tailwind`flex-row items-center justify-between mb-4 bg-white p-4 rounded-2xl border border-gray-100`}>
             <View style={tailwind`flex-row items-center`}>
              <View style={tailwind`w-4 h-4 rounded-full mr-3 ${expenses.find(e => (typeof e.category === 'object' ? e.category.name : e.category) === item.name)?.category?.color || 'bg-black'}`} />
              <Text style={tailwind`text-base font-medium text-gray-800`}>{item.name}</Text>
            </View>
            <Text style={tailwind`text-base font-bold text-black`}>₵{item.population.toFixed(2)}</Text>
          </View>
        ))}

        {/* DATA MANAGEMENT SECTION */}
        <View style={tailwind`mt-8 mb-6`}>
          <Text style={tailwind`text-lg font-bold text-black mb-3`}>Data Management</Text>

          {/* Reset Button */}
          <TouchableOpacity 
            onPress={handleClearData}
            style={tailwind`bg-white border border-red-50 p-5 rounded-3xl flex-row items-center justify-between shadow-sm`}
          >
            <View style={tailwind`flex-row items-center`}>
              <View style={tailwind`bg-red-50 p-2 rounded-xl mr-4`}>
                <Ionicons name="trash" size={24} color="#ef4444" />
              </View>
              <View>
                <Text style={tailwind`text-red-600 font-bold`}>Reset All Data</Text>
                <Text style={tailwind`text-gray-400 text-xs`}>Permanently delete all logs</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fee2e2" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Insights;