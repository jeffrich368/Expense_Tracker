import { Text, View, FlatList, TouchableOpacity, ActivityIndicator, Animated, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useMemo, useState, useEffect, useRef } from 'react'; 
import tailwind from 'twrnc';
import { useExpense } from '../context/ExpenseContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../constant';

import EmptyList from '../components/EmptyList';
import ExpenseItemCard from '../components/ExpenseItemCard';

// This tracks if the splash/loading has happened in this app session
let hasLaunched = false;

const Home = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { expenses, deleteExpense, userName, monthlyIncome, updateIncome } = useExpense();  
  
  const [isLoading, setIsLoading] = useState(!hasLaunched);
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeframe, setTimeframe] = useState('Monthly'); 
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [incomeInput, setIncomeInput] = useState(monthlyIncome ? monthlyIncome.toString() : '');

  // FIX: Initialize values based on hasLaunched so they aren't invisible by default
  const fadeAnim = useRef(new Animated.Value(hasLaunched ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(hasLaunched ? 1 : 0.9)).current;

  useEffect(() => {
    if (!hasLaunched) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
      ]).start();

      const timer = setTimeout(() => { 
        hasLaunched = true; 
        setIsLoading(false); 
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setIncomeInput(monthlyIncome ? monthlyIncome.toString() : '');
  }, [monthlyIncome]);

  const handleLongPressDelete = (item) => {
    Alert.alert(
      "Remove Expense",
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteExpense(item.id) }
      ]
    );
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(exp => {
      const itemDate = new Date(exp.date);
      const categoryName = typeof exp.category === 'object' ? exp.category.name : exp.category;
      const matchesCategory = activeCategory === 'All' || categoryName === activeCategory;
      
      let matchesTime = false;
      if (timeframe === 'Monthly') {
        matchesTime = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      } else {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesTime = itemDate >= oneWeekAgo && itemDate <= now;
      }
      return matchesCategory && matchesTime;
    });
  }, [expenses, activeCategory, timeframe]);

  const displayTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  }, [filteredExpenses]);

  const ListHeader = () => {
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const progress = monthlyIncome > 0 ? (displayTotal / monthlyIncome) : 0;

    return (
      <View style={tailwind`px-5`}>
        {/* ANIMATED HEADER SECTION */}
        <Animated.View 
          style={[
            tailwind`pt-6 pb-4 flex-row justify-between items-center`,
            { 
              opacity: fadeAnim, 
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        > 
            <View>
              <Text style={tailwind`text-gray-400 text-sm font-medium`}>Welcome back,</Text>
              <Text style={tailwind`text-3xl font-bold text-black`}>
                {userName ? userName.split(' ')[0] : 'User'} 😊
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle" size={45} color="black" />
            </TouchableOpacity>
        </Animated.View>
        
        {/* MAIN CARD SECTION */}
        <View style={tailwind`bg-black rounded-[35px] p-7 mb-5 shadow-2xl`}>
            <View style={tailwind`flex-row justify-between items-start mb-6`}>
                <View>
                    <Text style={tailwind`text-gray-500 text-xs font-bold uppercase tracking-widest mb-1`}>
                        {timeframe === 'Monthly' ? `${currentMonthName} Spending` : "Weekly Spending"}
                    </Text>
                    <Text style={tailwind`text-4xl font-bold text-white`}>
                        ₵{displayTotal.toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => timeframe === 'Weekly' ? navigation.navigate('Insights') : setIsIncomeModalVisible(true)} 
                  style={tailwind`bg-white/10 p-3 rounded-2xl`}
                >
                    <Ionicons 
                      name={timeframe === 'Monthly' ? (monthlyIncome > 0 ? "pencil" : "add-circle") : "stats-chart"} 
                      size={22} 
                      color="white" 
                    />
                </TouchableOpacity>
            </View>

            {timeframe === 'Monthly' && monthlyIncome > 0 ? (
                <View>
                    <View style={tailwind`w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3`}>
                        <View style={[tailwind`h-full ${progress > 0.9 ? 'bg-red-500' : 'bg-green-400'}`, { width: `${Math.min(progress * 100, 100)}%` }]} />
                    </View>
                    <Text style={tailwind`text-gray-500 text-[10px] font-bold uppercase tracking-tighter`}>
                      Budget: ₵{monthlyIncome.toFixed(2)} • {Math.round(progress * 100)}% Used
                    </Text>
                </View>
            ) : timeframe === 'Monthly' && (
              <TouchableOpacity onPress={() => setIsIncomeModalVisible(true)}>
                <Text style={tailwind`text-green-400 font-bold text-xs`}>+ Set monthly budget</Text>
              </TouchableOpacity>
            )}
        </View>

        {/* TIME & CATEGORY FILTERS */}
        <View style={tailwind`flex-row bg-gray-100 p-1 rounded-2xl mb-6 shadow-sm`}>
          {['Weekly', 'Monthly'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTimeframe(item)}
              style={tailwind`flex-1 py-3 rounded-xl items-center ${timeframe === item ? 'bg-white shadow-sm' : ''}`}
            >
              <Text style={tailwind`font-bold text-sm ${timeframe === item ? 'text-black' : 'text-gray-400'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={tailwind`flex-row justify-between items-center mb-4`}>
          <Text style={tailwind`text-xl font-bold text-black`}>Breakdown</Text>
          <Text style={tailwind`text-gray-400 text-xs font-bold`}>{filteredExpenses.length} Records</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tailwind`mb-6`}>
            {['All', ...CATEGORIES.slice(0, 8).map(c => c.name)].map((catName) => (
                <TouchableOpacity 
                    key={catName}
                    onPress={() => setActiveCategory(catName)}
                    style={tailwind`mr-3 px-6 py-2.5 rounded-2xl border ${activeCategory === catName ? 'bg-black border-black' : 'bg-gray-100 border-gray-200'}`}
                >
                    <Text style={tailwind`${activeCategory === catName ? 'text-white' : 'text-gray-700'} font-bold`}>{catName}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 bg-black items-center justify-center`}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={[tailwind`flex-1 bg-white`, { paddingTop: insets.top }]}>
      <FlatList 
        data={filteredExpenses} 
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPressDelete(item)} activeOpacity={0.7}>
            <ExpenseItemCard item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={tailwind`pb-28`}
        showsVerticalScrollIndicator={false}
      />

      <Modal transparent visible={isIncomeModalVisible} animationType="slide" onRequestClose={() => setIsIncomeModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={tailwind`flex-1 bg-black/60 justify-end`}>
            <View style={tailwind`bg-white rounded-t-[40px] p-9`}>
                <View style={tailwind`flex-row justify-between items-center mb-8`}>
                    <Text style={tailwind`text-2xl font-bold text-black`}>Monthly Budget</Text>
                    <TouchableOpacity onPress={() => setIsIncomeModalVisible(false)}>
                        <Ionicons name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <TextInput 
                    autoFocus 
                    keyboardType="decimal-pad"
                    placeholder="₵0.00"
                    style={tailwind`text-5xl font-bold text-black bg-gray-50 p-6 rounded-3xl mb-8`}
                    value={incomeInput} 
                    onChangeText={setIncomeInput}
                />
                <TouchableOpacity 
                  onPress={() => {
                    const val = parseFloat(incomeInput);
                    if (!isNaN(val)) {
                      updateIncome(val);
                      setIsIncomeModalVisible(false);
                    } else {
                      Alert.alert("Invalid Amount", "Please enter a valid number.");
                    }
                  }} 
                  style={tailwind`bg-black p-6 rounded-2xl items-center`}
                >
                    <Text style={tailwind`text-white font-bold text-lg`}>Save Budget</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default Home;