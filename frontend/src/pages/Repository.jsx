// src/pages/Repository.jsx
import React from 'react';
import { Search, Filter, FolderOpen, Calendar, ChevronRight } from 'lucide-react';

const Repository = () => {
  // Mock Data for History
  const historyData = [
    { id: '101', case: 'ITAT/MUM/2024/45', client: 'Reliance Ind.', date: 'Oct 24, 2024', status: 'Won' },
    { id: '102', case: 'ITAT/DEL/2024/89', client: 'Tata Motors', date: 'Nov 02, 2024', status: 'Remanded' },
    { id: '103', case: 'ITAT/BEN/2025/12', client: 'Infosys Ltd', date: 'Jan 10, 2025', status: 'Pending' },
  ];

  return (
    <div className="p-8 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Case Repository</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Archive of all analyzed tribunal orders.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <FolderOpen size={16} /> New Folder
            </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-3.5 text-zinc-400" />
        <input 
            type="text" 
            placeholder="Search by Case Number, Client, or Keyword..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#121214] text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
      </div>

      {/* Archive Grid */}
      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Case ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Client Tag</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Analysis Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase">Outcome</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {historyData.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 text-sm font-mono font-medium text-zinc-900 dark:text-white">{item.case}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">{item.client}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 flex items-center gap-2">
                            <Calendar size={14} /> {item.date}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                item.status === 'Won' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                                item.status === 'Remanded' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800' :
                                'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                            }`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white" />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Repository;