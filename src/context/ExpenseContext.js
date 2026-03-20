import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [userName, setUserName] = useState('Kofi Arhin');
    const [monthlyIncome, setMonthlyIncome] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Load from Storage
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const savedName = await AsyncStorage.getItem('user_name');
                const savedExpenses = await AsyncStorage.getItem('user_expenses');
                const savedIncome = await AsyncStorage.getItem('user_income'); 

                if (savedName) setUserName(savedName);
                if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
                if (savedIncome) setMonthlyIncome(parseFloat(savedIncome));
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredData();
    }, []);

    // 2. HELPER: Get Previous Month Summary
    const getPreviousMonthSummary = () => {
        const now = new Date();
        // Sets date to the last day of the previous month
        const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const prevMonthNum = lastDayPrevMonth.getMonth();
        const prevYearNum = lastDayPrevMonth.getFullYear();
        const prevMonthName = lastDayPrevMonth.toLocaleString('default', { month: 'long' });

        const prevTotal = expenses.reduce((sum, item) => {
            const itemDate = new Date(item.date);
            if (itemDate.getMonth() === prevMonthNum && itemDate.getFullYear() === prevYearNum) {
                return sum + parseFloat(item.amount || 0);
            }
            return sum;
        }, 0);

        return {
            total: prevTotal,
            monthName: prevMonthName,
            savings: monthlyIncome > 0 ? (monthlyIncome - prevTotal) : null
        };
    };

    // 3. THE FIX: Monthly Reset Logic with Summary
    useEffect(() => {
        const checkMonthlyReset = async () => {
            if (isLoading) return;

            try {
                const now = new Date();
                const currentMonthKey = now.toLocaleString('default', { month: 'long', year: 'numeric' });
                const lastResetMonth = await AsyncStorage.getItem('last_reset_month');

                if (lastResetMonth && lastResetMonth !== currentMonthKey) {
                    const summary = getPreviousMonthSummary();
                    
                    let message = `In ${summary.monthName}, you spent ₵${summary.total.toFixed(2)}.`;
                    
                    if (summary.savings !== null) {
                        message += summary.savings >= 0 
                            ? `\n\nAwesome! You saved ₵${summary.savings.toFixed(2)} last month. 🚀`
                            : `\n\nYou went over budget by ₵${Math.abs(summary.savings).toFixed(2)}. Let's aim for green this month! 📈`;
                    }

                    Alert.alert(`Summary for ${summary.monthName}`, message);
                }
                
                await AsyncStorage.setItem('last_reset_month', currentMonthKey);
            } catch (error) {
                console.error("Failed to check monthly reset", error);
            }
        };

        checkMonthlyReset();
    }, [isLoading, expenses, monthlyIncome]); // Re-run if these change to ensure summary is accurate

    // 4. Persistence for Expenses
    useEffect(() => {
        const saveExpenses = async () => {
            if (!isLoading) {
                try {
                    await AsyncStorage.setItem('user_expenses', JSON.stringify(expenses));
                } catch (error) {
                    console.error("Failed to save expenses", error);
                }
            }
        };
        saveExpenses();
    }, [expenses, isLoading]);

    const updateIncome = async (newIncome) => {
        try {
            setMonthlyIncome(newIncome);
            await AsyncStorage.setItem('user_income', newIncome.toString());
        } catch (error) {
            console.error("Failed to save income", error);
        }
    };

    const updateName = async (newName) => {
        setUserName(newName);
        await AsyncStorage.setItem('user_name', newName);
    };

    const addExpense = (expenseData) => {
        const newExpense = {
            id: Math.random().toString(36).substr(2, 9),
            title: expenseData.title,
            amount: expenseData.amount,
            category: expenseData.category.name,
            color: expenseData.category.color,
            icon: expenseData.category.icon,
            date: new Date().toISOString().split('T')[0],
        };
        setExpenses(prev => [newExpense, ...prev]);
    };

    const deleteExpense = (id) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => {
                        setExpenses(prev => prev.filter(item => item.id !== id));
                    } 
                }
            ]
        );
    };

    return (
        <ExpenseContext.Provider value={{ 
            expenses, 
            userName, 
            monthlyIncome,
            updateName, 
            updateIncome, 
            addExpense, 
            deleteExpense, 
            getPreviousMonthSummary, // Export if you want to use it on the Home screen too
            isLoading 
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpense = () => useContext(ExpenseContext);