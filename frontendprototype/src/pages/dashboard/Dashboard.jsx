import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { LineChart } from '../../components/charts/LineChart';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const DashboardModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-[#1e2436] border border-[#2a314b] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
             <h3 className="text-lg font-bold text-white">{title}</h3>
             <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>
          <div className="p-6">
             {children}
          </div>
       </div>
    </div>
  );
};

const DashboardPieChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
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
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
         <span className="text-2xl font-bold text-white">45%</span>
         <span className="text-[10px] text-muted-foreground uppercase">Most Used</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [costOverview, setCostOverview] = useState(null);
  const [utilizationTrend, setUtilizationTrend] = useState([]);
  const [costServices, setCostServices] = useState([]);
  const [idleInstances, setIdleInstances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, overViewRes, trendRes, servicesRes, idleRes] = await Promise.all([
          api.get('/api/dashboard/summary'),
          api.get('/api/costs'),
          api.get('/api/utilization/trend'),
          api.get('/api/costs/services'),
          api.get('/api/ec2/idle')
        ]);
        
        setSummary(summaryRes.data);
        setCostOverview(overViewRes.data);
        setUtilizationTrend(trendRes.data);
        setCostServices(servicesRes.data);
        setIdleInstances(idleRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !summary || !costOverview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Total Active Resources */}
        <Card 
           onClick={() => setActiveModal('resources')}
           className="bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#8b5cf6] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32 text-white cursor-pointer hover:scale-[1.02] hover:shadow-primary/20 transition-all duration-300 group"
        >
          {/* Subtle bottom mountain pattern via CSS */}
          <div className="absolute inset-x-0 bottom-0 h-12 opacity-30 bg-[linear-gradient(to_right_bottom,rgba(255,255,255,0.1)_50%,transparent_50%),linear-gradient(to_right_top,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[length:40px_100%] group-hover:opacity-40 transition-opacity"></div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-4">
             <div className="flex flex-col text-white">
               <span className="text-4xl font-bold tracking-tight">84</span>
               <span className="text-sm font-medium text-white/90 mt-1">Total Active Resources</span>
             </div>
          </CardHeader>
        </Card>

        {/* Card 2: Critical Alerts */}
        <Card 
           onClick={() => setActiveModal('alerts')}
           className="bg-gradient-to-br from-[#ef4444] via-[#f11151] to-[#ca1453] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32 text-white cursor-pointer hover:scale-[1.02] hover:shadow-red-500/20 transition-all duration-300 group"
        >
          <div className="absolute right-6 bottom-8 text-white opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-300">
             <AlertCircle className="w-10 h-10" />
          </div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-4">
             <div className="flex flex-col text-white">
               <span className="text-4xl font-bold tracking-tight">2</span>
               <span className="text-sm font-medium text-white/90 mt-1">Critical Alerts</span>
             </div>
          </CardHeader>
        </Card>

        {/* Card 3: This Month Cost */}
        <Card 
           onClick={() => setActiveModal('costs')}
           className="bg-gradient-to-br from-[#2f8373] via-[#a89045] to-[#c78238] flex flex-col justify-center overflow-hidden relative shadow-lg border-none h-32 text-white cursor-pointer hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 group"
        >
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-48 h-32 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent group-hover:opacity-30 transition-opacity"></div>
          <CardHeader className="pb-2 relative z-10 px-6 mt-4">
             <div className="flex items-baseline gap-2 text-white">
               <span className="text-3xl font-bold tracking-tight">₹4,500</span>
             </div>
             <span className="text-sm font-medium text-white/90 mt-1">This Month's Cost</span>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-xl bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Resource Utilization</CardTitle>
           <div className="flex gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> CPU %</div>
           </div>
        </CardHeader>
        <CardContent className="pl-0 pb-0">
          <LineChart data={utilizationTrend} dataKey="cpu" xAxisKey="time" height={220} yAxisPrefix="" yAxisSuffix="%" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-3 shadow-xl bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Idle Instances Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 font-medium">Instance ID</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">CPU Usage</th>
                    <th className="px-4 py-3 font-medium">Saving</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3].map((_, idx) => (
                    <tr key={idx} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-4 font-mono text-white text-xs">i-123456</td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-1.5 text-xs">
                           <div className="w-2 h-2 rounded-sm bg-green-500" />
                           <span className="text-muted-foreground">Running</span>
                         </div>
                      </td>
                      <td className="px-4 py-4 font-mono font-medium text-white">{[5,3,3][idx]}%</td>
                      <td className="px-4 py-4">
                        <button className="bg-primary hover:bg-primary/90 text-white text-[10px] font-medium px-3 py-1.5 rounded uppercase tracking-wider transition-colors">
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-xl bg-card border-border">
          <CardHeader>
             <CardTitle className="text-sm font-medium text-white">System Health Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      </div>
                      <div>
                         <div className="text-white font-medium text-sm">Database Cluster</div>
                         <div className="text-green-400 text-xs mt-0.5">Healthy &bull; 14ms latency</div>
                      </div>
                   </div>
                   <div className="text-xs text-muted-foreground font-mono">100% Uptime</div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                      </div>
                      <div>
                         <div className="text-white font-medium text-sm">Authentication API</div>
                         <div className="text-green-400 text-xs mt-0.5">Healthy &bull; 45ms latency</div>
                      </div>
                   </div>
                   <div className="text-xs text-muted-foreground font-mono">99.9% Uptime</div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                      </div>
                      <div>
                         <div className="text-white font-medium text-sm">Background Workers</div>
                         <div className="text-amber-400 text-xs mt-0.5">Degraded &bull; Queue building</div>
                      </div>
                   </div>
                   <div className="text-xs text-muted-foreground font-mono">98.5% Uptime</div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DashboardModal isOpen={activeModal === 'resources'} onClose={() => setActiveModal(null)} title="Active Resources Breakdown">
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                <span className="text-white font-medium">EC2 Instances</span>
                <span className="text-primary font-bold">32</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                <span className="text-white font-medium">RDS Databases</span>
                <span className="text-green-400 font-bold">4</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                <span className="text-white font-medium">S3 Buckets</span>
                <span className="text-red-400 font-bold">12</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                <span className="text-white font-medium">VPC Networks</span>
                <span className="text-amber-400 font-bold">6</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded text-sm">
                <span className="text-white font-medium">Other Services (Lambda, ECS, etc.)</span>
                <span className="text-blue-400 font-bold">30</span>
             </div>
             <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-muted-foreground font-medium">Total Active Elements</span>
                <span className="text-white font-bold text-lg">84</span>
             </div>
          </div>
      </DashboardModal>

      <DashboardModal isOpen={activeModal === 'alerts'} onClose={() => setActiveModal(null)} title="Critical Alerts Details">
          <div className="space-y-3">
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                   <h4 className="text-red-400 font-bold text-sm">Database Cluster Degraded</h4>
                   <p className="text-xs text-white/80 mt-1">RDS Instance 'prod-db-cluster' is experiencing sustained latency over 150ms. High query load detected.</p>
                   <span className="text-[10px] text-muted-foreground mt-2 block">10 mins ago &bull; Needs Action</span>
                </div>
             </div>
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                   <h4 className="text-red-400 font-bold text-sm">Background Worker Queue Overflow</h4>
                   <p className="text-xs text-white/80 mt-1">SQS Queue 'email-delivery' size has exceeded 10,000 messages. Processing delays expected across organization.</p>
                   <span className="text-[10px] text-muted-foreground mt-2 block">45 mins ago &bull; Needs Action</span>
                </div>
             </div>
          </div>
      </DashboardModal>

      <DashboardModal isOpen={activeModal === 'costs'} onClose={() => setActiveModal(null)} title="Month-to-Date Spend Breakdown">
          <div className="space-y-4">
             <p className="text-xs text-muted-foreground">Detailed overview of your accumulated ₹4,500 spend this month.</p>
             <div className="h-4 w-full flex rounded-full overflow-hidden">
                <div style={{width: '45%'}} className="bg-[#f59e0b]"></div>
                <div style={{width: '25%'}} className="bg-[#10b981]"></div>
                <div style={{width: '15%'}} className="bg-[#ef4444]"></div>
                <div style={{width: '15%'}} className="bg-[#3b82f6]"></div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/5 p-3 rounded">
                   <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]" /><span className="text-xs text-muted-foreground">EC2</span></div>
                   <span className="text-white font-bold text-sm">₹2,025</span>
                </div>
                <div className="bg-white/5 p-3 rounded">
                   <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#10b981]" /><span className="text-xs text-muted-foreground">RDS</span></div>
                   <span className="text-white font-bold text-sm">₹1,125</span>
                </div>
                <div className="bg-white/5 p-3 rounded">
                   <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /><span className="text-xs text-muted-foreground">S3</span></div>
                   <span className="text-white font-bold text-sm">₹675</span>
                </div>
                <div className="bg-white/5 p-3 rounded">
                   <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /><span className="text-xs text-muted-foreground">Other</span></div>
                   <span className="text-white font-bold text-sm">₹675</span>
                </div>
             </div>
             <div className="pt-2">
                <button onClick={() => window.location.href = '/analysis'} className="w-full py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium rounded text-sm">
                   View Full Cost Analytics
                </button>
             </div>
          </div>
      </DashboardModal>
    </div>
  );
}
