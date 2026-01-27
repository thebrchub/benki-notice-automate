import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/authService'; // Import the real auth service

const Login = () => {
  const navigate = useNavigate();
  
  // Changed 'email' to 'username' to match API contract
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Call the Real API
      await authService.login(username, password);
      
      // 2. If successful, redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Failed:", err);
      // Show error message from API or a default one
      setError(err.response?.data?.message || 'Invalid username or password');
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Sign in to your audit workspace</p>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertCircle size={18} />
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
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:ring-0 transition-all outline-none" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Protected by enterprise-grade security.
        </p>
      </div>
    </div>
  );
};

export default Login;