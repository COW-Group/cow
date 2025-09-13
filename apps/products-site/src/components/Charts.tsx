import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Data for the charts
const assetData = [
  { name: 'Aviation Assets', value: 60, color: '#0EA5E9' },
  { name: 'Physical Gold', value: 20, color: '#EAB308' },
  { name: 'Crude Oil', value: 20, color: '#6366F1' },
];

const growthData = [
  { name: 'Year 0 (Q1 2025)', 'Asset Backing (Billions USD)': 9.78 },
  { name: 'Year 5 (Q4 2029)', 'Asset Backing (Billions USD)': 58.66 },
];

export function AssetBreakdownChart() {
  return (
    <div className="my-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800 flex flex-col items-center">
      <h3 className="text-2xl font-mono text-white mb-4 tracking-wide">Asset Backing Breakdown</h3>
      <p className="text-gray-300 mb-4">Each $7.50 AuAERO token is backed by:</p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={assetData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {assetData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              color: '#f9fafb',
              borderRadius: '8px'
            }} 
          />
          <Legend wrapperStyle={{ color: '#f9fafb' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrowthProjectionsChart() {
  return (
    <div className="my-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800 flex flex-col items-center">
      <h3 className="text-2xl font-mono text-white mb-4 tracking-wide">Aggressive Growth Projections</h3>
      <p className="text-gray-300 mb-4">Projected Asset Backing (Billions USD)</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={growthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              color: '#f9fafb',
              borderRadius: '8px'
            }} 
          />
          <Bar 
            dataKey="Asset Backing (Billions USD)" 
            fill="#0EA5E9" 
            radius={[10, 10, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">Targeting $58.66B by Year 5 (Q4 2029)</p>
    </div>
  );
}