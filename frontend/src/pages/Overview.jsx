import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card'; 
import { caseService } from '../services/caseService';
import { FileText, Clock, AlertCircle, ArrowRight, Activity, BarChart3, Search, Plus, RefreshCw, Database, Server, Lightbulb } from 'lucide-react';

// --- CONFIGURATION ---
const CACHE_KEY = 'dashboard_overview_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minutes

const StatCard = ({ title, value, subtext, icon: Icon, trend, color }) => (
  <Card className="p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color || 'bg-zinc-100 dark:bg-zinc-800'}`}>
        <Icon size={22} className="text-zinc-900 dark:text-white" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="mt-6">
      <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">{title}</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{subtext}</p>
    </div>
  </Card>
);

const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, failed: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // ✅ NEW: Fake Live Latency State
  const [latency, setLatency] = useState(24);

  // ✅ NEW: Check User Role
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';

  // 1. Live Latency Effect
  useEffect(() => {
    const interval = setInterval(() => {
        // Randomize between 18ms and 65ms
        const newLatency = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
        setLatency(newLatency);
    }, 2000); // Updates every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // 2. Data Loading (Cache Logic)
  useEffect(() => {
    loadDashboardData(false); 
  }, []);

  const loadDashboardData = async (forceRefresh = false) => {
    setLoading(true);

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (!forceRefresh && cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (now - timestamp < CACHE_DURATION) {
          setStats(data.stats);
          setRecentCases(data.recentCases);
          setLastUpdated(timestamp);
          setLoading(false);
          return; 
        }
      }

      const [completedRes, pendingRes, failedRes] = await Promise.all([
        caseService.getCases('COMPLETED', 1, 5), 
        caseService.getCases('PENDING', 1, 1),   
        caseService.getCases('FAILED', 1, 1)     
      ]);

      const completedCount = completedRes.total || 0;
      const pendingCount = pendingRes.total || 0;
      const failedCount = failedRes.total || 0;

      const newStats = {
        total: completedCount + pendingCount + failedCount,
        pending: pendingCount,
        failed: failedCount
      };
      
      const newRecentCases = completedRes.data || [];

      setStats(newStats);
      setRecentCases(newRecentCases);
      setLastUpdated(now);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: now,
        data: { stats: newStats, recentCases: newRecentCases }
      }));

    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 flex items-center gap-2">
              Real-time insights from your scraping engine.
              {lastUpdated && (
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                  Updated: {new Date(lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              )}
            </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => loadDashboardData(true)} 
                className="p-2.5 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group" 
                title="Force Refresh Data"
            >
                <RefreshCw size={20} className={loading ? "animate-spin text-blue-500" : "group-hover:rotate-180 transition-transform duration-500"} />
            </button>
            <button onClick={() => navigate('/dashboard/portal')} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:opacity-90 transition-all shadow-sm">
                <Search size={16} /> Open Live Portal
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Processed" value={loading ? '...' : stats.total} subtext="Cumulative analysis count" icon={FileText} trend={stats.total > 0 ? '+Live' : ''} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <StatCard title="Pending Review" value={loading ? '...' : stats.pending} subtext="Currently in extraction queue" icon={Clock} color="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" />
        <StatCard title="Critical Flags" value={loading ? '...' : stats.failed} subtext="Failed or halted jobs" icon={AlertCircle} color="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" />
        
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard/analysis')}>
          <div className="relative z-10">
            <h3 className="text-lg font-bold">Analysis Hub</h3>
            <p className="text-zinc-400 text-sm mt-1">View detailed reports & export data.</p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">Go to Analysis <ArrowRight size={16} /></div>
          <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity"><BarChart3 size={120} /></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Recent Activity</h3>
            <button onClick={() => navigate('/dashboard/analysis')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white uppercase tracking-wider">View All</button>
          </div>
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3"><div className="w-6 h-6 border-2 border-zinc-300 border-t-blue-500 rounded-full animate-spin"></div><p className="text-sm">Syncing data...</p></div>
            ) : recentCases.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentCases.map((item) => (
                  <div key={item.id} onClick={() => navigate('/dashboard/analysis')} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : item.status === 'FAILED' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}><FileText size={18} /></div>
                        <div><p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.citation_number || `Case #${item.id}`}</p><p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.bench_name} Bench</p></div>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800'}`}>{item.status}</span>
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 block mt-1">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4"><Search size={32} className="text-zinc-300 dark:text-zinc-600" /></div>
                <h3 className="text-zinc-900 dark:text-white font-bold mb-1">No Recent Activity</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto mb-6">Processed cases will appear here. Start extraction in the Live Portal.</p>
                <button onClick={() => navigate('/dashboard/portal')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"><Plus size={16} /> Start New Analysis</button>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: System Health */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Server size={18} className="text-emerald-500"/> System Health
            </h3>
            <div className="space-y-4">
              
              {/* 1. Fluctating Latency Row */}
              <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 transition-all duration-300">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Activity size={14} className={latency > 50 ? "text-amber-500" : "text-emerald-500"}/> 
                    API Latency
                </span>
                <span className={`font-mono text-sm font-bold ${latency > 50 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {latency}ms
                </span>
              </div>

              {/* 2. Files Queued */}
              <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <FileText size={14} /> Files Queued
                </span>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{stats.pending}</span>
              </div>

              {/* 3. Database Status */}
              <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Database size={14} /> Database
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Connected</span>
              </div>

            </div>
          </Card>

          {/* ✅ DYNAMIC "DID YOU KNOW" BOX */}
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
            <h4 className="font-bold text-zinc-900 dark:text-white text-lg relative z-10">Did you know?</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 relative z-10 leading-relaxed">
              {isAdmin 
                ? "You can manually edit any case details in the Analysis tab if the AI misses something." 
                : "You can filter cases by specific criteria and export detailed reports to Excel directly from the Analysis tab."}
            </p>
            <div className="absolute -bottom-2 -right-2 text-zinc-200 dark:text-zinc-800 opacity-50 rotate-12"><Lightbulb size={80} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;