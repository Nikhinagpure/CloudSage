import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const LineChart = ({ data, dataKey = "value", xAxisKey = "name", height = 300, yAxisPrefix = "₹", yAxisSuffix = "" }) => {
  const color = '#3b82f6'; // Deep blue accent from mockup

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a314b" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
            tickFormatter={(val) => {
               if (typeof val === 'string' && val.length >= 10) return val.substring(5); // e.g. "03-01"
               return val;
            }}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${yAxisPrefix}${value}${yAxisSuffix}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e2436',
              borderColor: '#2a314b',
              color: '#f8fafc',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            dot={{ r: 4, strokeWidth: 2, fill: '#1e2436' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
