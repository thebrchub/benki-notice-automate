import React from 'react';
import { LayoutDashboard, Globe, FileText, Settings, LogOut, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom'; // <--- Import this

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // <--- Initialize Hook

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portal', label: 'Live Portal', icon: Globe },
    { id: 'analysis', label: 'Case Analysis', icon: FileText },
  ];

  const handleSignOut = () => {
    // Optional: Clear any auth tokens here
    // localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <div className="h-screen w-72 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition-colors duration-300">
      
      {/* Brand */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Audit<span className="opacity-50">Flow</span>
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium pl-10">Professional Edition</p>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-1">
        <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-black dark:text-white' : 'text-zinc-400 group-hover:text-black dark:group-hover:text-white'} />
                <span>{item.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></div>}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Sign Out Button - UPDATED */}
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;