import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const BarChart = ({ data, dataKey = "value", xAxisKey = "name", height = 300 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const color = isDark ? '#818cf8' : '#4f46e5';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke={isDark ? '#94a3b8' : '#64748b'} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke={isDark ? '#94a3b8' : '#64748b'} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
             contentStyle={{ 
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              color: isDark ? '#f8fafc' : '#0f172a',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
            }} 
            cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
