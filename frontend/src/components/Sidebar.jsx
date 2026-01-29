import React, { useState } from 'react'; // Import useState
import {
  LayoutDashboard,
  Globe,
  FileText,
  Settings,
  LogOut,
  Moon,
  Sun,
  Info,
  Loader2 // Import Loader for animation
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE FOR LOGOUT FLOW ---
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentPath = location.pathname;
  const userRole = localStorage.getItem('role') || 'USER';

  const allMenuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['ADMIN', 'USER']
    },
    {
      id: 'portal',
      label: 'Live Portal',
      icon: Globe,
      path: '/dashboard/portal',
      roles: ['ADMIN', 'USER']
    },
    {
      id: 'analysis',
      label: 'Case Analysis',
      icon: FileText,
      path: '/dashboard/analysis',
      roles: ['ADMIN', 'USER']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      roles: ['ADMIN']
    },
    {
      id: 'about',
      label: 'About & Guide',
      icon: Info, // Changed to Info icon to match About
      path: '/dashboard/about',
      roles: ['ADMIN', 'USER']
    }
  ];

  const visibleMenuItems = allMenuItems.filter(item =>
    item.roles.includes(userRole)
  );

  // --- NEW LOGOUT HANDLER ---
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true); // Start Loading Animation
    try {
      // Call your API
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Whether API succeeds or fails, we redirect the user
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate('/login');
    }
  };

  return (
    <>
      <div className="h-screen w-72 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">

        {/* Brand */}
        <div className="p-8 pb-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            ITAT Order<span className="opacity-50"> Analyser</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {userRole === 'ADMIN' ? 'Admin Console' : 'Team Workspace'}
          </p>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-all
                  ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Triggers the Modal */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to end your session?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing out...
                  </>
                ) : (
                  'Log Out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;