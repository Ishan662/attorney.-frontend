import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const IncomeChart = ({ data, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Case</h3>
                <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Case</h3>
                <div className="flex items-center justify-center h-80 text-red-500">
                    <p>Error loading chart data: {error}</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Case</h3>
                <div className="flex items-center justify-center h-80 text-gray-500">
                    <p>No income data available</p>
                </div>
            </div>
        );
    }

    // Format data for the chart
    const chartData = data.map((item, index) => ({
        name: `Case ${index + 1}`,
        caseId: item.caseId,
        amount: item.amount || 0,
    })).filter(item => item.amount > 0); // Only show cases with income

    // Colors for the chart
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-green-600">
                        Income: ${(data.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                        Case ID: {data.caseId}
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalIncome = chartData.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Income by Case</h3>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total Income</p>
                    <p className="text-xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                </div>
            </div>

            {chartData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Bar Chart */}
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Income Distribution</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis 
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Income Breakdown</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="amount"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-80 text-gray-500">
                    <p>No income data to display</p>
                </div>
            )}
        </div>
    );
};

export default IncomeChart;