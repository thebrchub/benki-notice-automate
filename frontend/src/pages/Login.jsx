import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(email && password) {
      // Logic: In a real app, you would save a token here
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-[#09090b] transition-colors duration-300">
      
      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#121214] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        
        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
            <LayoutDashboard size={24} className="text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Sign in to your audit workspace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email address</label>
            <input 
              type="email" 
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:ring-0 transition-all outline-none" 
              placeholder="admin@ca-agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button 
            type="submit" 
            className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold py-3 text-sm hover:opacity-90 transition-opacity"
          >
            Sign In
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