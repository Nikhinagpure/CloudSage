import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import api from '../../services/api';

const AnalyticsPieChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#3b82f6']; // Blue, Green, Red, Blue for Lambda 
  return (
    <div style={{ width: '100%', height: 200 }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={90}
            paddingAngle={2}
            dataKey="cost"
            nameKey="service"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
             contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }}
             formatter={(value) => `₹${value.toLocaleString()}`}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
         <span className="text-2xl font-bold text-white">44%</span>
         <span className="text-[10px] text-muted-foreground uppercase mt-0.5">Most Used</span>
      </div>
    </div>
  );
};

export default function AnalysisPage() {
  const [costOverview, setCostOverview] = useState(null);
  const [costTrend, setCostTrend] = useState([]);
  const [costForecast, setCostForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const topServices = [
    { service: 'EC2', cost: 2000, color: '#f59e0b', trend: '↑ 12%', trendColor: 'text-red-400' },
    { service: 'RDS', cost: 1200, color: '#10b981', trend: '↓ 5%', trendColor: 'text-green-400' },
    { service: 'S3', cost: 600, color: '#ef4444', trend: '↑ 2%', trendColor: 'text-red-400' },
    { service: 'Lambda', cost: 300, color: '#3b82f6', trend: '— 0%', trendColor: 'text-slate-400' }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, trendRes, forecastRes] = await Promise.all([
          api.get('/api/costs'),
          api.get('/api/costs/trend'),
          api.get('/api/costs/forecast')
        ]);
        setCostOverview(overviewRes.data);
        setCostTrend(trendRes.data);
        setCostForecast(forecastRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading || !costOverview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-0">Cost Analytics</h2>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setCostTrend([...costTrend].slice(-3))}
             className="px-4 py-1.5 text-xs font-medium bg-white/10 text-white rounded shadow-sm hover:bg-white/20 transition-colors focus:bg-primary focus:text-primary-foreground focus:outline-none"
           >
             7 Days
           </button>
           <button 
             onClick={() => api.get('/api/costs/trend').then(res => setCostTrend(res.data))}
             className="px-4 py-1.5 text-xs font-medium bg-primary shadow shadow-primary/20 text-primary-foreground rounded focus:outline-none"
           >
             30 Days
           </button>
           <button 
             onClick={() => setCostTrend([...costTrend].slice(1, 4))}
             className="px-4 py-1.5 text-xs font-medium bg-white/10 text-white rounded shadow-sm hover:bg-white/20 transition-colors focus:bg-primary focus:text-primary-foreground focus:outline-none"
           >
             Custom Range
           </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: This Month Cost */}
        <Card className="bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#8b5cf6] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32">
          {/* Subtle bottom mountain pattern via CSS */}
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 bg-[linear-gradient(to_right_bottom,rgba(255,255,255,0.1)_50%,transparent_50%),linear-gradient(to_right_top,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[length:60px_100%]"></div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-4">
             <div className="flex items-baseline gap-2 text-white">
               <span className="text-3xl font-bold tracking-tight">₹4,500</span>
               <span className="text-sm font-medium text-white/90">This Month</span>
             </div>
          </CardHeader>
        </Card>

        {/* Card 2: Today Cost */}
        <Card className="bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32">
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 bg-[linear-gradient(to_right_bottom,rgba(255,255,255,0.1)_50%,transparent_50%),linear-gradient(to_right_top,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[length:60px_100%] scale-x-[-1]"></div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-4">
             <div className="flex items-baseline gap-2 text-white">
               <span className="text-3xl font-bold tracking-tight">₹120</span>
               <span className="text-sm font-medium text-white/90">Today</span>
             </div>
          </CardHeader>
        </Card>

        {/* Card 3: Next Month Forecast */}
        <Card className="bg-gradient-to-br from-[#2f8373] via-[#a89045] to-[#c78238] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32">
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 bg-[linear-gradient(to_right_bottom,rgba(255,255,255,0.1)_50%,transparent_50%),linear-gradient(to_right_top,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[length:80px_100%]"></div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-3">
             <div className="flex items-baseline gap-2 text-white">
               <span className="text-3xl font-bold tracking-tight">₹5,200</span>
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-white/90">Next Month</span>
                 <span className="text-[10px] font-medium text-white/70 -mt-1">(Forecast)</span>
               </div>
             </div>
          </CardHeader>
        </Card>
      </div>

      {/* Budget Tracker */}
      <Card className="bg-card border-border shadow-md">
         <CardContent className="p-5 flex items-center justify-between gap-8 flex-wrap">
            <div className="flex flex-col min-w-[150px]">
               <span className="text-sm font-medium text-white mb-1">Monthly Budget Tracker</span>
               <span className="text-xs text-muted-foreground tracking-wide font-medium">₹4,500 <span className="text-white/40 font-normal">used of</span> ₹6,000</span>
            </div>
            <div className="flex-1 min-w-[200px]">
               <div className="h-2.5 w-full bg-[#1e2436] rounded-full overflow-hidden border border-[#2a314b]">
                  <div className="h-full bg-gradient-to-r from-primary to-[#0ea5e9] rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
               </div>
            </div>
            <div className="text-sm font-bold text-white bg-primary/20 px-3 py-1 rounded-md text-primary text-center min-w-[60px]">75%</div>
         </CardContent>
      </Card>

      <Card className="shadow-xl bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Cost Trend by Service</CardTitle>
          <div className="flex gap-4 text-xs font-medium text-muted-foreground">
             <div className="flex items-center gap-1.5">Stacked Daily View</div>
          </div>
        </CardHeader>
        <CardContent className="pl-0 pb-0 pt-2">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={costTrend} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a314b" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} tickFormatter={(val) => val.length >= 10 ? val.substring(5) : val} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <RechartsTooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#1e2436', borderColor: '#2a314b', color: '#f8fafc', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="EC2" stackId="a" fill="#f59e0b" maxBarSize={45} />
                <Bar dataKey="RDS" stackId="a" fill="#10b981" maxBarSize={45} />
                <Bar dataKey="S3" stackId="a" fill="#ef4444" maxBarSize={45} />
                <Bar dataKey="Other" stackId="a" fill="#3b82f6" maxBarSize={45} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-xl bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Cost by Service</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-col space-y-4">
               {['EC2', 'RDS', 'S3', 'Other'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-sm`} style={{backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'][i]}}/>
                     <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
               ))}
            </div>
            <div className="flex-1 max-w-[220px]">
               <AnalyticsPieChart data={topServices} />
            </div>
            <div className="flex flex-col space-y-4 text-right">
               {['5%', '5%'].map((s, i) => ( 
                 <span key={i} className={`text-xs text-muted-foreground ${i === 0 ? '-mt-4' : 'mt-16'}`}>{s}</span>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Top Services Cost</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
             <div className="space-y-0">
                <div className="flex items-center justify-between py-2 border-b border-[#2a314b] px-2 text-xs font-medium text-muted-foreground">
                   <div className="w-1/3">Service Name</div>
                   <div className="w-1/3 text-center">MoM Trend</div>
                   <div className="w-1/3 text-right">Total Cost</div>
                </div>
                {topServices.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 w-1/3">
                         <div className="w-3 h-3 rounded-sm opacity-90 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color }} />
                         <span className="font-medium text-white group-hover:text-primary transition-colors">{item.service}</span>
                      </div>
                      <span className={`text-xs w-1/3 text-center font-bold tracking-widest ${item.trendColor}`}>{item.trend}</span>
                      <span className="text-white font-mono w-1/3 text-right tracking-tight">₹{item.cost.toLocaleString()}</span>
                   </div>
                ))}
             </div>
             <div className="mt-6 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 opacity-60"><span className="text-green-500 font-bold truncate">✓</span> CloudSage Dashboard MS</div>
                <div>Update: 15 min ago</div>
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
