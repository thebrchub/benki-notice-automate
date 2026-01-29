import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, Loader2, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  
  // State
  const [loginType, setLoginType] = useState('ADMIN'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Toggle Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      
      if (loginType === 'ADMIN' && response.role !== 'ADMIN') {
        throw new Error("Access Denied: You do not have Admin privileges.");
      }

      if (loginType === 'USER' && response.role === 'ADMIN') {
         throw new Error("Please use the Admin login tab.");
      }

      navigate('/dashboard');

    } catch (err) {
      console.error("Login Failed:", err);
      let displayMsg = 'Unable to connect to server. Please try again later.';

      if (err.response) {
          if (err.response.status === 401) {
              displayMsg = 'Incorrect username or password. Please try again.';
          } else if (err.response.data?.message) {
              displayMsg = err.response.data.message;
          }
      } else if (err.message) {
          displayMsg = err.message;
      }

      setError(displayMsg);
      
      if (err.message && (err.message.includes('Access Denied') || err.message.includes('Admin login tab'))) {
        authService.logout(); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-[#09090b] transition-colors duration-300">
      
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#121214] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
            <LayoutDashboard size={24} className="text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">AuditFlow</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Professional Audit Workspace</p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="mb-6 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl flex">
          <button
            type="button"
            onClick={() => setLoginType('ADMIN')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              loginType === 'ADMIN' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Shield size={16} /> Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginType('USER')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
              loginType === 'USER' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Users size={16} /> Team
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Username</label>
            <input 
              type="text" 
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:ring-0 transition-all outline-none" 
              placeholder={loginType === 'ADMIN' ? "admin_user" : "staff_member"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-4 pr-12 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:ring-0 transition-all outline-none" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-md"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              `Sign In as ${loginType === 'ADMIN' ? 'Admin' : 'Team Member'}`
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {loginType === 'ADMIN' 
            ? 'Restricted to System Administrators.' 
            : 'Access limited to assigned dashboard modules.'}
        </p>
      </div>
    </div>
  );
};

export default Login;