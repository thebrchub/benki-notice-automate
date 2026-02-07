import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  
  // Ref for scroll tracking
  const lastScrollY = useRef(0);
  
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', controlNavbar);

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
  }, []);

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
      return currentUser.username; 
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">

      {/* Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 z-40">
        <Sidebar />
      </div>
      
      <div className="md:hidden">
          <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ✅ HEADER UPDATED: Restored border but made it super subtle (thinner look) */}
        <header
          className={`sticky top-0 z-30 px-4 md:px-8 py-4 md:py-5 bg-gray-100/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-between transition-transform duration-300 ${
            showNavbar ? 'translate-y-0' : '-translate-y-full'
          }
          /* Subtle bottom border + Small shadow for depth */
          border-b border-gray-200/50 dark:border-zinc-800/50 shadow-sm
          `}
        >
          
          {/* Title Section */}
          <div className="flex-1 text-center md:text-left md:pl-0 pl-12"> 
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">
              {getHeaderTitle()}
            </h2>
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
            
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 shadow-sm shrink-0">
                <UserCircle size={20} className="md:w-6 md:h-6" />
            </div>
          </div> 

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;