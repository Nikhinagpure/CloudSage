import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  Check, X, AlertTriangle, Lightbulb, Search, Filter, 
  TrendingDown, Clock, ThumbsUp, ThumbsDown, BrainCircuit, Activity 
} from 'lucide-react';
import api from '../../services/api';

export default function RecommendationsPage() {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // History state for UI rendering only
  const [history, setHistory] = useState([
    { action: 'Stopped EC2 i-4xyz', effect: 'Saved ₹1200', success: true },
    { action: 'Deleted unused gp2 volume', effect: 'Saved ₹800', success: true },
    { action: 'Rejected resize suggestion', effect: 'Feedback recorded', success: false }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, recRes] = await Promise.all([
          api.get('/api/ai/summary'),
          api.get('/api/ai/recommendations')
        ]);
        setSummary(sumRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredRecs = recommendations.filter(rec => {
     if (filterPriority !== 'All' && rec.priority !== filterPriority) return false;
     if (searchQuery && !rec.resource.toLowerCase().includes(searchQuery.toLowerCase()) && !rec.action.toLowerCase().includes(searchQuery.toLowerCase())) return false;
     return true;
  });

  const handleApprove = (id) => {
     alert(`Approving AI Action for ${id}. Submitting API Request to Backend...`);
     setRecommendations(prev => prev.filter(r => r.id !== id));
     setHistory(prev => [{ action: `Approved suggestion ${id}`, effect: 'Processing...', success: true }, ...prev]);
  };

  const handleReject = (id) => {
     alert(`Rejecting Action for ${id}. Storing implicit feedback for model training.`);
     setRecommendations(prev => prev.filter(r => r.id !== id));
     setHistory(prev => [{ action: `Rejected suggestion ${id}`, effect: 'Feedback recorded', success: false }, ...prev]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
       
       <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
               <BrainCircuit className="w-7 h-7 text-primary" />
               AI Control Center
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Review intelligent recommendations across your infrastructure.</p>
          </div>
       </div>

       {/* Top Summary Cards */}
       <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#1e2436] to-[#2a314b] shadow-lg border-border">
             <CardHeader className="pb-2 pt-4 px-4">
               <div className="text-xs text-muted-foreground font-medium flex items-center gap-2"><TrendingDown className="w-4 h-4 text-green-400"/> Total Savings Opportunity</div>
             </CardHeader>
             <CardContent className="px-4 pb-4">
               <div className="text-2xl text-white font-bold">{summary.totalSavings}</div>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1e2436] to-[#2a314b] shadow-lg border-border">
             <CardHeader className="pb-2 pt-4 px-4">
               <div className="text-xs text-muted-foreground font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Issues Detected</div>
             </CardHeader>
             <CardContent className="px-4 pb-4">
               <div className="text-2xl text-white font-bold">{summary.issuesDetected}</div>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1e2436] to-[#2a314b] shadow-lg border-border">
             <CardHeader className="pb-2 pt-4 px-4">
               <div className="text-xs text-muted-foreground font-medium flex items-center gap-2"><Activity className="w-4 h-4 text-primary"/> Auto Actions Done</div>
             </CardHeader>
             <CardContent className="px-4 pb-4">
               <div className="text-2xl text-white font-bold">{summary.autoActionsDone}</div>
             </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#1e2436] to-[rgba(16,185,129,0.1)] shadow-lg border-border relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-16 h-16"/></div>
             <CardHeader className="pb-2 pt-4 px-4 relative z-10">
               <div className="text-xs text-muted-foreground font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4 text-green-400"/> Confidence Score</div>
             </CardHeader>
             <CardContent className="px-4 pb-4 relative z-10">
               <div className="text-2xl text-green-400 font-bold">{summary.confidenceScore}</div>
             </CardContent>
          </Card>
       </div>

       {/* Filters */}
       <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1e2436] p-2 rounded-lg border border-border shadow-sm gap-4">
          <div className="flex gap-2 p-1 bg-black/20 rounded-md">
             {['All', 'High', 'Medium', 'Low'].map(f => (
               <button 
                  key={f}
                  onClick={() => setFilterPriority(f)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors ${filterPriority === f ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search (e.g. EC2, RDS)" 
                   className="w-full bg-black/20 border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
             </div>
             <button className="flex items-center gap-2 bg-black/20 border border-white/10 px-3 rounded-md text-xs font-medium text-white hover:bg-white/5 transition-colors">
                <Filter className="w-3 h-3" /> Sort By
             </button>
          </div>
       </div>

       {/* Main Grid: Split Logic */}
       <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
          
          {/* Left Column (AI Recommendation Cards) */}
          <div className="lg:col-span-2 xl:col-span-3 space-y-4">
             {filteredRecs.length === 0 ? (
                <div className="text-center py-10 bg-[#1e2436] rounded-xl border border-border">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-green-500" />
                   </div>
                   <h3 className="text-white font-medium">All clear!</h3>
                   <p className="text-muted-foreground text-sm">No active recommendations for this filter.</p>
                </div>
             ) : (
                filteredRecs.map(rec => (
                   <Card key={rec.id} className="bg-[#1a2035] shadow-xl border border-[#2a314b] relative overflow-hidden">
                      {/* Left Priority Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${rec.priorityColor}`}></div>
                      
                      <CardContent className="p-0">
                         <div className="flex flex-col md:flex-row items-stretch">
                            
                            {/* Main Content Info */}
                            <div className="flex-1 p-5 lg:p-6 pr-6 md:border-r border-white/5">
                               {/* Badge Row */}
                               <div className="flex items-center justify-between mb-4">
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${rec.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : rec.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                     {rec.priority} Priority
                                  </span>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {rec.timeDetected}</span>
                                     <span className="text-[10px] text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Risk: <span className={rec.riskColor}>{rec.riskLevel}</span></span>
                                  </div>
                               </div>

                               <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                  <Lightbulb className="w-5 h-5 text-amber-400" /> {rec.action}
                               </h3>
                               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                                  <div className="text-sm text-slate-300 font-mono bg-black/20 px-2 py-0.5 rounded border border-white/5">{rec.resource}</div>
                                  <div className="text-xs text-muted-foreground">Region: {rec.region}</div>
                               </div>

                               {/* Reason Bar */}
                               <div className="bg-red-500/5 border border-red-500/10 rounded-md p-3 mb-4">
                                  <span className="text-xs text-muted-foreground block mb-1">📊 Technical Reason:</span>
                                  <span className="text-sm text-white/90">{rec.reason}</span>
                               </div>

                               {/* Brain Box (AI Explanation) */}
                               <div className="bg-primary/5 border border-primary/20 rounded-md p-4 relative">
                                  <div className="absolute -top-3 left-3 bg-[#1a2035] px-2 text-xs font-bold text-primary flex items-center gap-1">
                                     <BrainCircuit className="w-3 h-3" /> AI Explanation
                                  </div>
                                  <p className="text-sm text-primary/80 mt-1 italic">"{rec.aiExplanation}"</p>
                                  
                                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/10">
                                     <span className="text-xs text-muted-foreground">Is this helpful?</span>
                                     <div className="flex gap-2">
                                        <button className="text-muted-foreground hover:text-green-400 transition-colors p-1"><ThumbsUp className="w-3.5 h-3.5"/></button>
                                        <button className="text-muted-foreground hover:text-red-400 transition-colors p-1"><ThumbsDown className="w-3.5 h-3.5"/></button>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            {/* Right Action Bar */}
                            <div className="w-full md:w-56 bg-black/20 p-5 lg:p-6 flex flex-col justify-between">
                               <div>
                                  <span className="text-xs text-muted-foreground block text-center mb-1">Estimated Savings</span>
                                  <span className="text-2xl font-black text-white text-center block mb-4">{rec.savings}</span>
                                  
                                  <div className="flex items-center justify-center gap-2 bg-[#1e2436] rounded-full py-1.5 px-3 border border-white/5 mb-6">
                                     <TrendingDown className="w-3.5 h-3.5 text-primary" />
                                     <span className="text-xs font-bold text-white">Confidence: {rec.confidence}%</span>
                                  </div>
                               </div>
                               
                               <div className="space-y-2">
                                  <button onClick={() => handleApprove(rec.id)} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                                     <Check className="w-4 h-4"/> Approve
                                  </button>
                                  <button onClick={() => handleReject(rec.id)} className="w-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 border border-white/5">
                                     <X className="w-4 h-4"/> Reject
                                  </button>
                               </div>
                            </div>

                         </div>
                      </CardContent>
                   </Card>
                ))
             )}
          </div>

          {/* Right Column (Insights Panel + History) */}
          <div className="space-y-6">
             <Card className="bg-gradient-to-b from-[#1e2436] to-[#1a2030] shadow-xl border-[#2a314b]">
                <CardHeader className="border-b border-white/5">
                   <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-primary" /> AI Insights
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                   <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                         Most cost originated from EC2 (65%)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                         3 idle instances actively burning compute credits
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                         Cost increased 18% contextually this week
                      </li>
                   </ul>
                   <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded text-center">
                      <span className="text-xs text-primary font-bold uppercase tracking-wider block mb-1">Impact Preview</span>
                      <div className="flex items-center justify-center gap-2 my-1">
                         <span className="text-muted-foreground line-through">₹25,000</span>
                         <TrendingDown className="w-4 h-4 text-green-400" />
                         <span className="text-white font-bold">₹12,500</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">If all approved</span>
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-[#1e2436] shadow-xl border-[#2a314b]">
                <CardHeader className="border-b border-white/5">
                   <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" /> Actions History
                   </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                   <div className="space-y-4">
                      {history.map((item, idx) => (
                         <div key={idx} className="flex gap-3">
                            <div className="mt-0.5">
                               {item.success ? (
                                  <div className="w-4 h-4 rounded bg-green-500/20 text-green-400 flex items-center justify-center"><Check className="w-3 h-3"/></div>
                               ) : (
                                  <div className="w-4 h-4 rounded bg-red-500/20 text-red-400 flex items-center justify-center"><X className="w-3 h-3"/></div>
                               )}
                            </div>
                            <div>
                               <p className="text-sm text-white">{item.action}</p>
                               <p className="text-xs text-muted-foreground mt-0.5">{item.effect}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </div>

       </div>
    </div>
  );
}
