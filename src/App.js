import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Components/ui/card';
import { Input } from './Components/ui/input';
import { Button } from './Components/ui/';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Calendar, Tag, Plus, Trash2 } from 'lucide-react';


const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category) return;
    
    setExpenses(prev => [...prev, {
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount)
    }]);
    
    setNewExpense({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getChartData = () => {
    const groupedByDate = expenses.reduce((acc, expense) => {
      const date = expense.date;
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(groupedByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      {/* Add Expense Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gray-500" />
            <Input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Input
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <Button onClick={handleAddExpense} className="w-full">
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Total Spent: ${totalExpenses.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Graph Card */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{expense.category}</div>
                    <div className="text-sm text-gray-500">{expense.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-medium">${expense.amount.toFixed(2)}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;



