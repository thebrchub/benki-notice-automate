import React, { useState, useEffect } from 'react';
import ITATViewer from '../components/ITATViewer';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card'; // Importing the shared Card component

// IMPORT PAGES
import AnalysisPage from './AnalysisPage';
import Settings from './Settings';
import Repository from './Repository';
import Clients from './Clients';

// API SERVICE
import { caseService } from '../services/caseService';

import { Activity, FileText, ArrowRight, Search, Bell, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <Card className="p-6 flex flex-col justify-between h-full">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{title}</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{subtext}</p>
    </div>
  </Card>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(45);
  
  // --- REAL DATA STATE ---
  const [stats, setStats] = useState({ total: 0, pending: 0, failed: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- SCROLL LOGIC ---
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY < 10) { setShowNavbar(true); setLastScrollY(window.scrollY); return; }
      if (window.scrollY > lastScrollY) setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    if (activeTab === 'overview') {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // We fetch 3 things in parallel: Total count, Pending count, Failed count, and Recent list
      const [allRes, pendingRes, failedRes, recentRes] = await Promise.all([
        caseService.getCases('', 1, 1),       // Get Total
        caseService.getCases('PENDING', 1, 1), // Get Pending
        caseService.getCases('FAILED', 1, 1),  // Get Failed
        caseService.getCases('', 1, 5)         // Get Recent 5
      ]);

      setStats({
        total: allRes.total || 0,
        pending: pendingRes.total || 0,
        failed: failedRes.total || 0
      });

      setRecentCases(recentRes.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useTheme();

  const getHeaderTitle = () => {
    switch(activeTab) {
        case 'overview': return 'Overview';
        case 'portal': return 'ITAT Portal';
        case 'analysis': return 'Analysis';
        case 'repository': return 'Case Repository';
        case 'clients': return 'Client Directory';
        case 'settings': return 'Settings';
        default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#000000] font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <div className="sticky top-0 h-screen shrink-0 z-40">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header 
          className={`sticky top-0 z-30 px-8 py-5 bg-gray-100/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-between border-b border-transparent dark:border-zinc-800/50 transition-transform duration-300 ease-in-out ${
            showNavbar ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {getHeaderTitle()}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Welcome back, Admin</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 w-64 shadow-sm dark:shadow-none focus-within:ring-2 ring-zinc-500/20 transition-all">
                <Search size={16} className="text-zinc-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none ml-2 text-sm text-zinc-900 dark:text-zinc-200 w-full placeholder-zinc-400"/>
            </div>
            <button className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-black"></span>
            </button>
            <div className="w-9 h-9 bg-gradient-to-tr from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 rounded-full border-2 border-white dark:border-zinc-800"></div>
          </div>
        </header>

        <main className="flex-1 p-8 pt-4">
          
          {/* --- VIEW 1: OVERVIEW --- */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Analyzed" 
                  value={loading ? "..." : stats.total} 
                  subtext="Across all benches" 
                  icon={FileText} 
                  trend={stats.total > 0 ? "+Live" : ""} 
                />
                <StatCard 
                  title="Pending Review" 
                  value={loading ? "..." : stats.pending} 
                  subtext="Processing queue" 
                  icon={Clock} 
                />
                <StatCard 
                  title="Critical Flags" 
                  value={loading ? "..." : stats.failed} 
                  subtext="Requires attention" 
                  icon={AlertCircle} 
                />
                <div className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col justify-between text-white dark:text-black shadow-lg">
                   <div>
                      <h3 className="text-lg font-bold">Quick Search</h3>
                      <p className="text-zinc-400 dark:text-zinc-600 text-sm mt-1">Access ITAT portal directly</p>
                   </div>
                   <button onClick={() => setActiveTab('portal')} className="mt-4 w-full py-3 bg-white dark:bg-black text-black dark:text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm">
                      Open Portal <ArrowRight size={16} />
                   </button>
                </div>
              </div>

              {/* Layout Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                   <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Recent Analysis</h3>
                    <button onClick={() => setActiveTab('analysis')} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">View All</button>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {loading ? (
                       <div className="p-8 text-center text-zinc-400">Loading activity...</div>
                    ) : recentCases.length > 0 ? (
                      recentCases.map((item, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${item.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500'}`}>
                               <FileText size={18} />
                             </div>
                             <div>
                               <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate max-w-[200px] md:max-w-md">{item.citation_number || `Case #${item.id}`}</p>
                               <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">{item.bench_name}</p>
                             </div>
                          </div>
                          <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-zinc-400">No recent activity found.</div>
                    )}
                  </div>
                </Card>

                {/* Status Cards */}
                <div className="flex flex-col gap-6">
                   <Card className="p-6">
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">System Status</h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500 dark:text-zinc-400">API Latency</span>
                             <span className="font-mono text-emerald-500">24ms</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500 dark:text-zinc-400">Files Queued</span>
                             <span className="font-mono text-zinc-900 dark:text-white">{stats.pending}</span>
                          </div>
                      </div>
                   </Card>
                   <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-zinc-800">
                      <div className="relative z-10">
                        <h4 className="font-bold text-lg">Pro Tip</h4>
                        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                            Use the 'Batch Export' feature in the Analysis tab.
                        </p>
                      </div>
                      <div className="absolute -bottom-4 -right-4 text-zinc-800 dark:text-zinc-700 opacity-20"><Activity size={120} /></div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW 2: PORTAL --- */}
          <div className={`${activeTab === 'portal' ? 'block' : 'hidden'} h-[calc(100vh-8rem)] w-full p-2`}>
             <ITATViewer />
          </div>

          {/* --- VIEW 3: ANALYSIS --- */}
          <div className={`${activeTab === 'analysis' ? 'block' : 'hidden'}`}>
             {isProcessing && (
                <Card className="mb-6 p-6 border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                             <Activity size={16} className="text-blue-500 animate-spin" /> 
                             Analysis in Progress
                        </span>
                        <span className="font-mono text-sm text-blue-500">{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </Card>
             )}
             
             {/* THE NEW MODULAR PAGE */}
             <AnalysisPage />
          </div>

          {/* --- VIEW 4: REPOSITORY --- */}
          {activeTab === 'repository' && <Repository />}

          {/* --- VIEW 5: CLIENTS --- */}
          {activeTab === 'clients' && <Clients />}

          {/* --- VIEW 6: SETTINGS --- */}
          {activeTab === 'settings' && <Settings />}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;