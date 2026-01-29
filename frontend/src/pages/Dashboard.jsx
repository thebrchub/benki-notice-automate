import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  
  // ✅ FIX: Use useRef instead of useState for scroll tracking
  // This prevents the component from re-rendering on every pixel scroll
  const lastScrollY = useRef(0);
  
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Always show at the very top
      if (currentScrollY < 10) {
        setShowNavbar(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determine direction
      if (currentScrollY > lastScrollY.current) {
        // Scrolling DOWN -> Hide Navbar
        setShowNavbar(false);
      } else {
        // Scrolling UP -> Show Navbar
        setShowNavbar(true);
      }

      // Update ref (Does NOT trigger re-render)
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar);

    // Fetch User Details on Mount
    const fetchUserDetails = async () => {
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error("Failed to load user profile");
        }
    };
    fetchUserDetails();

    return () => window.removeEventListener('scroll', controlNavbar);
  }, []); // Empty dependency array is safe here because we use refs

  const getHeaderTitle = () => {
    if (location.pathname === '/dashboard') return 'Overview';
    if (location.pathname.includes('portal')) return 'ITAT Portal';
    if (location.pathname.includes('analysis')) return 'Analysis';
    if (location.pathname.includes('settings')) return 'Settings';
    if (location.pathname.includes('repository')) return 'Repository';
    if (location.pathname.includes('clients')) return 'Clients';
    if (location.pathname.includes('about')) return 'About & Guide';
    return 'Dashboard';
  };

  const getDisplayName = () => {
      if (!currentUser) return '...';
      if (currentUser.role === 'ADMIN') return 'ADMIN';
      return currentUser.username; 
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">

      {/* Sidebar */}
      <div className="sticky top-0 h-screen shrink-0 z-40">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header
          className={`sticky top-0 z-30 px-8 py-5 bg-gray-100/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-between border-b transition-transform duration-300 ${
            showNavbar ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {getHeaderTitle()}
            </h2>
            <p className="text-xs text-zinc-500">Welcome back</p>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase">
                    {getDisplayName()}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md inline-block">
                    {currentUser?.role || 'GUEST'}
                </p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                <UserCircle size={24} />
            </div>
          </div> 

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;