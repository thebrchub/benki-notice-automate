import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Globe,
  FileText,
  Settings,
  LogOut,
  Moon,
  Sun,
  Info,
  Loader2,
  ChevronLeft, 
  ChevronRight,
  Menu, // ✅ Import Hamburger Icon
  X     // ✅ Import Close Icon
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Desktop: Mini-sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false); 
  
  // ✅ Mobile: Slide-over menu state
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  const currentPath = location.pathname;
  const userRole = localStorage.getItem('role') || 'USER';

  const allMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'USER'] },
    { id: 'portal', label: 'Live Portal', icon: Globe, path: '/dashboard/portal', roles: ['ADMIN', 'USER'] },
    { id: 'analysis', label: 'Case Analysis', icon: FileText, path: '/dashboard/analysis', roles: ['ADMIN', 'USER'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings', roles: ['ADMIN'] },
    { id: 'about', label: 'About & Guide', icon: Info, path: '/dashboard/about', roles: ['ADMIN', 'USER'] }
  ];

  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  // ✅ Auto-close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate('/login');
    }
  };

  return (
    <>
      {/* ✅ MOBILE: Hamburger Button (Visible only on mobile) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
      >
        <Menu size={24} />
      </button>

      {/* ✅ MOBILE: Backdrop Overlay (Click to close) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- 
          - Mobile: Fixed position, slides in/out using translate
          - Desktop: Relative position, flows with layout, uses width transition
      */}
      <div 
        className={`
            h-screen flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition-all duration-300
            
            /* MOBILE STYLES */
            fixed inset-y-0 left-0 z-50 w-72
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}

            /* DESKTOP STYLES (Overrides Mobile) */
            md:relative md:translate-x-0 
            ${isCollapsed ? 'md:w-20' : 'md:w-72'}
        `}
      >
        
        {/* DESKTOP: Toggle Button (Hidden on Mobile) */}
        <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block absolute -right-3 top-9 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white shadow-sm z-50 transition-colors cursor-pointer"
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* MOBILE: Close Button (Hidden on Desktop) */}
        <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden absolute right-4 top-6 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
            <X size={20} />
        </button>

        {/* --- BRAND HEADER --- */}
        <div className={`p-6 pb-4 flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-start'}`}>
          {/* On mobile, we always show full logo. On Desktop, we check isCollapsed */}
          {isCollapsed ? (
             // Collapsed Logo (Desktop Only)
             <div className="hidden md:flex w-10 h-10 bg-blue-600 rounded-xl items-center justify-center text-white font-bold text-lg shadow-lg">
                IT
             </div>
          ) : null}

          {/* Full Logo (Visible on Mobile OR Desktop Expanded) */}
          <div className={`${isCollapsed ? 'md:hidden' : 'block'}`}>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                ITAT Order<span className="opacity-50"> Analyser</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
                {userRole === 'ADMIN' ? 'Admin Console' : 'Team Workspace'}
            </p>
          </div>
        </div>

        {/* --- MENU ITEMS --- */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium w-full transition-all group relative
                  ${isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white' 
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }
                  ${isCollapsed ? 'md:justify-center' : 'justify-start'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={20} className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                
                {/* Text Label: Always visible on Mobile, Hidden on Desktop Collapsed */}
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'md:hidden' : 'block'}`}>
                    {item.label}
                </span>

                {/* Desktop Tooltip for Collapsed State */}
                {isCollapsed && (
                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                        {item.label}
                    </div>
                )}
              </button>
            );
          })}
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${isCollapsed ? 'md:justify-center' : ''}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className={`${isCollapsed ? 'md:hidden' : 'block'}`}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center gap-3 px-3 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${isCollapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={20} />
            <span className={`${isCollapsed ? 'md:hidden' : 'block'}`}>
                Log Out
            </span>
          </button>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL (Same as before) --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Logout</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Are you sure you want to end your session?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLogoutConfirm(false)} disabled={isLoggingOut} className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoggingOut ? <><Loader2 size={16} className="animate-spin" /> Signing out...</> : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;