import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Search, Filter, Clock, BellRing, Settings } from 'lucide-react';
import api from '../../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/api/alerts');
        setAlerts(res.data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleAction = (id, action) => {
     // if resolve, remove from UI
     if(action === 'Resolve') {
        setAlerts(prev => prev.filter(a => a.id !== id));
     } else if (action === 'Acknowledge') {
        setAlerts(prev => prev.map(a => a.id === id ? {...a, status: 'Acknowledged'} : a));
     }
  };

  const filteredAlerts = alerts.filter(a => {
     if(filterSeverity !== 'All' && a.severity.toLowerCase() !== filterSeverity.toLowerCase()) return false;
     if(searchQuery && !a.message.toLowerCase().includes(searchQuery.toLowerCase()) && !a.resource.toLowerCase().includes(searchQuery.toLowerCase())) return false;
     return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'Resolved').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
             <BellRing className="w-6 h-6 text-primary" /> Incident Hub
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time infrastructure monitoring and automated incident response.</p>
        </div>
        <div className="flex items-center gap-4 bg-[#1e2436] p-4 rounded-lg border border-border shadow-lg">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                 <div className={`w-2.5 h-2.5 rounded-full ${criticalCount > 0 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-500/20'}`} />
              </div>
              <div>
                 <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Critical</div>
                 <div className="text-lg font-bold text-white leading-tight">{criticalCount} Active</div>
              </div>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <button className="text-muted-foreground hover:text-white transition-colors"><Settings className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1a2133] p-2 rounded-lg border border-border shadow-md gap-4">
          <div className="flex gap-2 p-1 bg-black/20 rounded-md overflow-x-auto w-full sm:w-auto">
             {['All', 'Critical', 'Warning', 'Info'].map(f => (
               <button 
                  key={f}
                  onClick={() => setFilterSeverity(f)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap ${filterSeverity === f ? 'bg-[#2a314b] text-white shadow border border-white/10' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          <div className="relative w-full sm:w-72">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search alerts or resources..." 
                className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
             />
          </div>
      </div>

      {/* Incident List */}
      <div className="bg-[#1a2133] border border-[#2a314b] rounded-xl shadow-xl overflow-hidden">
         {filteredAlerts.length === 0 ? (
           <div className="p-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No active incidents</h3>
              <p className="text-muted-foreground">Your infrastructure is running smoothly with no alerts matching these filters.</p>
           </div>
         ) : (
           <div className="divide-y divide-[#2a314b]">
              {filteredAlerts.map(alert => (
                 <div key={alert.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                       
                       {/* Context Part */}
                       <div className="flex items-start gap-4 flex-1">
                          <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                             alert.severity === 'critical' ? 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 
                             alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                             'bg-blue-500/10 text-blue-400'
                          }`}>
                            {alert.severity === 'critical' ? <AlertCircle className="w-5 h-5" /> : 
                             alert.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                             <Info className="w-5 h-5" />}
                          </div>
                          <div>
                             <div className="flex flex-wrap items-center gap-2 mb-1">
                               <span className="font-mono text-xs text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded border border-white/5">{alert.id}</span>
                               <span className="font-bold text-white text-base">{alert.message}</span>
                             </div>
                             <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
                               <span className="flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                 <span className="font-medium text-slate-300">{alert.type}</span>
                               </span>
                               <span>&bull;</span>
                               <span className="font-mono">{alert.resource}</span>
                               <span>&bull;</span>
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {alert.time}</span>
                             </div>
                          </div>
                       </div>

                       {/* Action Part */}
                       <div className="flex items-center gap-4 w-full lg:w-auto lg:justify-end border-t border-white/5 lg:border-t-0 pt-4 lg:pt-0">
                          
                          {/* Status Badge */}
                          <div className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider flex-shrink-0 border ${
                             alert.status === 'Active' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                             alert.status === 'Acknowledged' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                             {alert.status}
                          </div>

                          {/* Quick Actions */}
                          {alert.status !== 'Resolved' && (
                             <div className="flex items-center gap-2">
                               {alert.status === 'Active' && (
                                  <button onClick={() => handleAction(alert.id, 'Acknowledge')} className="px-3 py-1.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors">
                                     Ack
                                  </button>
                               )}
                               <button onClick={() => handleAction(alert.id, 'Resolve')} className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/20 hover:bg-primary/30 rounded transition-colors border border-primary/20">
                                  Resolve
                               </button>
                             </div>
                          )}
                       </div>

                    </div>
                 </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
