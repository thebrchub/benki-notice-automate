import React, { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import Logo from './Logo';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ✅ NEW: State for the Floating Tooltip
  const [hoveredItem, setHoveredItem] = useState(null); // { label, top, left }

  const currentPath = location.pathname;
  const userRole = localStorage.getItem("role") || "USER";

  const allMenuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["ADMIN", "USER"] },
    { id: "portal", label: "Live Portal", icon: Globe, path: "/dashboard/portal", roles: ["ADMIN", "USER"] },
    { id: "analysis", label: "Case Analysis", icon: FileText, path: "/dashboard/analysis", roles: ["ADMIN", "USER"] },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings", roles: ["ADMIN"] },
    { id: "about", label: "About & Guide", icon: Info, path: "/dashboard/about", roles: ["ADMIN", "USER"] },
  ];

  const visibleMenuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // ✅ Clear tooltip when scrolling or leaving
  useEffect(() => {
    const handleScroll = () => setHoveredItem(null);
    window.addEventListener('scroll', handleScroll, true); // Capture phase to catch sidebar scroll
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate("/login");
    }
  };

  // ✅ Tooltip Logic
  const handleMouseEnter = (e, label) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({
      label,
      top: rect.top + (rect.height / 2) - 14, // Center vertically
      left: rect.right + 10, // Offset to right
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
      >
        <Menu size={24} />
      </button>

      {/* MOBILE BACKDROP */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR CONTAINER */}
      <div
        className={`
          h-screen flex flex-col flex-shrink-0
          border-r border-zinc-200 dark:border-zinc-800
          bg-white dark:bg-[#09090b]
          
          /* ✅ FIX: Overflow Visible allows Toggle Button & Tooltip to show */
          overflow-visible
          
          transition-[width] duration-300 relative
          
          /* Mobile */
          fixed inset-y-0 left-0 z-50 w-72
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop */
          md:relative md:translate-x-0
          ${isCollapsed ? "md:w-20" : "md:w-72"}
        `}
      >
        {/* ✅ TOGGLE BUTTON (Visible & Floating) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            hidden md:flex items-center justify-center
            absolute -right-3 top-9
            w-6 h-6
            bg-white dark:bg-zinc-800
            border border-zinc-200 dark:border-zinc-700
            rounded-full
            text-zinc-500 hover:text-zinc-900 dark:hover:text-white
            shadow-md
            z-50
            cursor-pointer
            transition-colors
          "
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute right-4 top-6 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* --- INNER CONTENT WRAPPER --- */}
        <div className="flex flex-col w-full h-full overflow-hidden">
            
            {/* BRAND HEADER */}
<div
  className={`flex items-center transition-all duration-300 ${
    isCollapsed ? "p-4 justify-center" : "p-6 justify-start gap-3"
  }`}
>
  {/* ✅ DYNAMIC LOGO: Switches between 2.png (Dark) and 3.png (Light) */}
  <img 
    src={theme === 'dark' ? "/logo/2.png" : "/logo/3.png"} 
    alt="LawWise Logo" 
    className="w-10 h-10 object-contain shrink-0" 
  />

  {/* TEXT LABELS (Hidden when Collapsed on Desktop) */}
  <div className={`${isCollapsed ? "md:hidden" : "block"} overflow-hidden`}>
    <h1 className="text-lg font-bold text-zinc-900 dark:text-white whitespace-nowrap">
      LawWise<span className="opacity-50"> Workspace</span>
    </h1>
    <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
      {userRole === "ADMIN" ? "Admin Console" : "Team Workspace"}
    </p>
  </div>
</div>

            {/* ✅ MENU ITEMS (Scrollable Area) */}
            {/* Note: We removed overflow-visible here. Standard overflow-y-auto is fine because tooltip is now OUTSIDE. */}
            <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
            {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    // ✅ Add Mouse Listeners for Tooltip
                    onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium w-full transition-all group relative
                    ${
                        isActive
                        ? "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }
                    ${isCollapsed ? "md:justify-center" : "justify-start"}
                    `}
                >
                    <Icon
                    size={20}
                    className={`${isActive ? "text-blue-600 dark:text-blue-400" : ""} shrink-0`}
                    />

                    <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                        isCollapsed ? "hidden opacity-0" : "block opacity-100"
                    }`}
                    >
                    {item.label}
                    </span>
                    
                    {/* ❌ NO TOOLTIP INSIDE HERE ANYMORE */}
                </button>
                );
            })}
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <button
                onClick={toggleTheme}
                onMouseEnter={(e) => handleMouseEnter(e, theme === "dark" ? "Light Mode" : "Dark Mode")}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${
                isCollapsed ? "md:justify-center" : ""
                }`}
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span className={`${isCollapsed ? "hidden" : "block"} whitespace-nowrap`}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
            </button>

            <button
                onClick={() => setShowLogoutConfirm(true)}
                onMouseEnter={(e) => handleMouseEnter(e, "Log Out")}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center gap-3 px-3 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors ${
                isCollapsed ? "md:justify-center" : ""
                }`}
            >
                <LogOut size={20} />
                <span className={`${isCollapsed ? "hidden" : "block"} whitespace-nowrap`}>
                Log Out
                </span>
            </button>
            </div>
        </div>
      </div>

      {/* ✅ FLOATING TOOLTIP (Rendered Outside the Scroll Container) */}
      {hoveredItem && isCollapsed && (
        <div
            className="fixed z-[9999] bg-zinc-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-100"
            style={{ 
                top: hoveredItem.top, 
                left: hoveredItem.left 
            }}
        >
            {hoveredItem.label}
            {/* Little triangle pointer (Optional) */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-zinc-900"></div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Logout</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Are you sure you want to end your session?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLogoutConfirm(false)} disabled={isLoggingOut} className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
              <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2">
                {isLoggingOut ? <><Loader2 size={16} className="animate-spin" /> Signing out...</> : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;