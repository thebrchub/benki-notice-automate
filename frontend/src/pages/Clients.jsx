// src/pages/Clients.jsx
import React from 'react';
import { Users, Plus, MoreHorizontal, Phone, Mail } from 'lucide-react';

const Clients = () => {
  const clients = [
    { name: 'Tech Solutions Ltd', contact: 'Ramesh Gupta', email: 'ramesh@techsol.in', cases: 12 },
    { name: 'Global Ventures', contact: 'Sarah Jenkins', email: 's.jenkins@global.com', cases: 5 },
    { name: 'Alpha Constructions', contact: 'Vikram Singh', email: 'vikram@alpha.co', cases: 8 },
  ];

  return (
    <div className="p-8 w-full animate-in fade-in duration-500">
       <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Client Directory</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage client profiles and case associations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90">
            <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
            <div key={index} className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
                        <Users size={24} />
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{client.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">{client.cases} Active Cases</p>
                
                <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <UserIcon size={16} /> {client.contact}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <Mail size={16} /> {client.email}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// Simple helper component for the icon
const UserIcon = ({size}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default Clients;