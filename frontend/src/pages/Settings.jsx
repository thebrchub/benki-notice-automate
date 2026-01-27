import React, { useState, useEffect } from 'react';
import { Bell, User, Lock, UserPlus, CheckCircle, AlertTriangle, Trash2, Key, RefreshCw, X } from 'lucide-react';
import { authService } from '../services/authService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State - Role is strictly 'USER' now
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Modal State for Password Reset
  const [resetModal, setResetModal] = useState({ show: false, username: '', newPassword: '' });

  // 1. Load Users on Mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await authService.getAllUsers();
      // Sort by newest first just for better UX
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setUsers(sorted);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  // 2. Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // API call
      await authService.createUser(newUser);
      
      setStatus({ type: 'success', message: `Staff member "${newUser.username}" added!` });
      
      // Refresh list from API to be safe, or append locally
      loadUsers(); 
      setNewUser({ username: '', password: '', role: 'USER' }); // Reset form
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create user.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete User Handler
  const handleDeleteUser = async (username) => {
    if (!window.confirm(`Are you sure you want to remove ${username}? This cannot be undone.`)) return;
    try {
      await authService.deleteUser(username);
      setUsers(users.filter(u => u.username !== username)); // Update UI
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  // 4. Change Password Handler
  const handleChangePassword = async () => {
    try {
      await authService.changePassword(resetModal.username, resetModal.newPassword);
      setResetModal({ show: false, username: '', newPassword: '' });
      alert("Password updated successfully!");
    } catch (error) {
      alert("Failed to update password. Try again.");
    }
  };

// FILTER: Only show USER role, hide ADMINs [cite: 5]
  const activeTeamMembers = users.filter(u => u.role === 'USER');

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 relative">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Settings</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">Admin Control Panel</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'account', label: 'Team Management', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm min-h-[500px]">
          
          {activeTab === 'account' && (
            <div className="space-y-8">
               
               {/* SECTION 1: CREATE USER (Role locked to USER) */}
               <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <UserPlus size={20} className="text-blue-500"/> Add Team Member
                  </h2>
                  
                  {status.message && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {status.type === 'success' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                        {status.message}
                    </div>
                  )}

                  <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Username</label>
                        <input 
                          type="text" required value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          className="w-full mt-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none"
                          placeholder="e.g. staff_member"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Initial Password</label>
                        <input 
                          type="text" required value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="w-full mt-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black px-3 py-2 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none"
                          placeholder="Set password"
                        />
                      </div>
                      
                      {/* Hidden Role Input (Logic enforces USER) */}
                      
                      <button type="submit" disabled={loading} className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors h-[42px]">
                        {loading ? 'Saving...' : 'Create Account'}
                      </button>
                  </form>
               </div>

               {/* SECTION 2: USER LIST (Filters out Admin) */}
               <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Active Team Members</h2>
                  <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Username</th>
                          <th className="px-6 py-3 font-semibold">Role</th>
                          <th className="px-6 py-3 font-semibold">Joined</th>
                          <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {activeTeamMembers.length > 0 ? (
                          activeTeamMembers.map((user) => (
                            <tr key={user.id} className="bg-white dark:bg-[#121214] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{user.username}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button 
                                  onClick={() => setResetModal({ show: true, username: user.username, newPassword: '' })}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition-colors"
                                >
                                  <Key size={14} /> Reset
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.username)}
                                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-zinc-400">
                              No active staff members found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'notifications' && <div className="text-zinc-500">Notifications coming soon.</div>}
          {activeTab === 'security' && <div className="text-zinc-500">Security settings coming soon.</div>}

        </div>
      </div>

      {/* PASSWORD RESET MODAL */}
      {resetModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-500"/> Update Credentials
              </h3>
              <button onClick={() => setResetModal({ ...resetModal, show: false })} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                Updating password for staff: <span className="font-bold text-zinc-900 dark:text-white">{resetModal.username}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
                <input 
                  type="text" 
                  value={resetModal.newPassword}
                  onChange={(e) => setResetModal({...resetModal, newPassword: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setResetModal({ ...resetModal, show: false })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleChangePassword}
                  disabled={!resetModal.newPassword}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;