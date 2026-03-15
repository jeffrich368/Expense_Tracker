import { Pressable, ScrollView, TextInput, Text, View, Alert, Switch, Modal, ActivityIndicator, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import tailwind from 'twrnc'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useExpense } from '../context/ExpenseContext'
import { Ionicons } from '@expo/vector-icons'

const Create = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { addExpense, updateExpense } = useExpense();
  
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [recurring, setRecurring] = useState(false);

  // Animation States
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route.params?.selectedCategory) {
      setCategory(route.params.selectedCategory);
      navigation.setParams({ selectedCategory: undefined });
    }
    
    if (route.params?.editExpense) {
      const e = route.params.editExpense;
      setTitle(e.title || '');
      setAmount(e.amount ? String(e.amount) : '');
      setCategory({ name: e.category, color: e.color, icon: e.icon });
      setRecurring(!!e.recurring);
    }
  }, [route.params]);

  const handleAddExpense = () => {
    if (!amount || !title || !category) {
      Alert.alert("Missing Info", "Please fill in all fields and select a category.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid number greater than 0.");
      return;
    }

    // START LOADING ANIMATION
    setIsSaving(true);

    const editId = route.params?.editExpense?.id;

    // Simulate "Processing" for premium feel
    setTimeout(() => {
      if (editId) {
        updateExpense(editId, { title, amount: numericAmount, category, recurring });
      } else {
        addExpense({
          title: title,
          amount: numericAmount, 
          category: category,
          recurring,
          date: new Date().toISOString(),
        });
      }

      // SHOW SUCCESS CHECKMARK
      setIsSuccess(true);
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

      // --- THE FIX STARTS HERE ---
      setTimeout(() => {
        // 1. Clear all local states so the form is empty next time
        setAmount('');
        setTitle('');
        setCategory(null);
        setRecurring(false);

        // 2. Reset Animation States
        setIsSaving(false);
        setIsSuccess(false);
        checkScale.setValue(0);

        // 3. Clear navigation params to prevent Edit Mode from re-triggering
        navigation.setParams({ editExpense: undefined });

        // 4. Go Home
        navigation.navigate('Home');
      }, 1200);
      // --- THE FIX ENDS HERE ---
      
    }, 1200);
  };

  return (
    <View style={[tailwind`flex-1 bg-white`, { paddingTop: insets.top }]}> 
      <ScrollView 
        contentContainerStyle={tailwind`p-5`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tailwind`text-3xl font-bold text-black`}>
            {route.params?.editExpense ? 'Edit expense' : 'Add new expense'}
        </Text>
        <Text style={tailwind`text-base text-gray-500 mt-2 mb-8`}>Keep your budget on track.</Text>

        {/* Amount Input */}
        <View style={tailwind`mb-5 p-4 bg-white rounded-3xl shadow-sm border border-gray-100`}>
          <Text style={tailwind`mb-2 text-sm font-bold text-gray-400 uppercase tracking-widest`}>Amount</Text>
          <TextInput 
            placeholder="0.00" 
            keyboardType="decimal-pad"
            style={tailwind`text-3xl font-bold text-black p-2`} 
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#d1d5db"
          />
        </View>

        {/* Description Input */}
        <View style={tailwind`mb-5 p-4 bg-white rounded-3xl shadow-sm border border-gray-100`}>
          <Text style={tailwind`mb-2 text-sm font-bold text-gray-400 uppercase tracking-widest`}>Description</Text>
          <TextInput 
            placeholder="e.g. Weekly Groceries" 
            style={tailwind`text-lg text-black p-2`} 
            value={title} 
            onChangeText={setTitle} 
            placeholderTextColor="#d1d5db"
          />
        </View>

        {/* Category Selector */}
        <View style={tailwind`mb-5 p-4 bg-white rounded-3xl shadow-sm border border-gray-100`}>
          <Text style={tailwind`mb-4 text-sm font-bold text-gray-400 uppercase tracking-widest`}>Category</Text>
          <Pressable 
            style={tailwind`flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl`}
            onPress={() => navigation.navigate('Category')}
          >
            <View style={tailwind`flex-row items-center`}>
              <View style={tailwind`w-10 h-10 bg-white rounded-xl items-center justify-center mr-3 shadow-sm`}>
                <Text style={tailwind`text-xl`}>{category ? category.icon : '❓'}</Text>
              </View>
              <Text style={tailwind`text-lg font-medium ${category ? 'text-black' : 'text-gray-400'}`}>
                {category ? category.name : "Choose a category"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Recurring Toggle */}
        <View style={tailwind`mb-8 p-4 bg-white rounded-3xl shadow-sm border border-gray-100`}> 
          <View style={tailwind`flex-row justify-between items-center`}> 
            <View style={tailwind`flex-1 pr-4`}>
              <Text style={tailwind`mb-1 text-sm font-bold text-gray-400 uppercase tracking-widest`}>Recurring</Text>
              <Text style={tailwind`text-xs text-gray-400`}>Repeat this expense every 30 days</Text>
            </View>
            <Switch 
                value={recurring} 
                onValueChange={setRecurring} 
                trackColor={{ false: "#eeeeee", true: "#000000" }}
                thumbColor="#ffffff"
            />
          </View>
        </View>

        <Pressable 
          onPress={handleAddExpense}
          style={({ pressed }) => [
            tailwind`bg-black p-5 rounded-3xl items-center shadow-lg`,
            pressed && tailwind`opacity-80 scale-95`
          ]}
        >
          <Text style={tailwind`text-lg text-white font-bold`}>
            {route.params?.editExpense ? 'Update Expense' : 'Save Expense'}
          </Text>
        </Pressable>
      </ScrollView>

      {/* SUCCESS MODAL ANIMATION */}
      <Modal transparent visible={isSaving} animationType="fade">
        <View style={tailwind`flex-1 bg-black/60 items-center justify-center px-10`}>
          <View style={tailwind`bg-white p-10 rounded-3xl items-center shadow-2xl w-full`}>
            {!isSuccess ? (
              <>
                <ActivityIndicator size="large" color="#000" />
                <Text style={tailwind`mt-4 font-bold text-gray-800`}>Securing Transaction...</Text>
              </>
            ) : (
              <Animated.View style={{ transform: [{ scale: checkScale }], alignItems: 'center' }}>
                <View style={tailwind`bg-green-100 p-4 rounded-full`}>
                  <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
                </View>
                <Text style={tailwind`mt-4 font-bold text-gray-800 text-lg`}>
                   {route.params?.editExpense ? 'Updated!' : 'Added!'}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Create;