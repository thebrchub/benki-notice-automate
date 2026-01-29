import React, { useState, useEffect } from 'react';
import { User, Lock, UserPlus, CheckCircle, AlertTriangle, Trash2, Key, RefreshCw, X, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [users, setUsers] = useState([]);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);

  // Form State
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // --- MODAL STATES ---
  const [resetModal, setResetModal] = useState({ show: false, username: '', newPassword: '' });
  const [adminConfirmModal, setAdminConfirmModal] = useState({ show: false });
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });
  const [addUserModal, setAddUserModal] = useState({ show: false });
  
  // NEW: Delete Confirmation Modal
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, username: '' });

  // Admin Password Form State
  const [myPassword, setMyPassword] = useState({ new: '', confirm: '' });
  const [myPwStatus, setMyPwStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUsers();
    fetchMyDetails();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await authService.getAllUsers();
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setUsers(sorted);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMyDetails = async () => {
    try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
    } catch (e) {
        console.error("Failed to fetch current user");
    }
  }

  // --- HANDLERS ---

  const initiateAddUser = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    if (!newUser.username || !newUser.password) {
        setStatus({ type: 'error', message: 'Please fill in all fields.' });
        return;
    }
    setAddUserModal({ show: true });
  };

  const executeAddUser = async () => {
    setAddUserModal({ show: false });
    setLoadingAction(true);
    setStatus({ type: '', message: '' });
    
    try {
      await authService.createUser(newUser);
      setStatus({ type: 'success', message: `Staff member "${newUser.username}" added successfully!` });
      loadUsers(); 
      setNewUser({ username: '', password: '', role: 'USER' }); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create user.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoadingAction(false);
    }
  };

  // 1. Initiate Delete (Opens Modal)
  const initiateDeleteUser = (username) => {
    setDeleteConfirmModal({ show: true, username });
  };

  // 2. Execute Delete (After Confirmation)
  const executeDeleteUser = async () => {
    const usernameToDelete = deleteConfirmModal.username;
    setDeleteConfirmModal({ show: false, username: '' }); // Close modal immediately

    try {
      await authService.deleteUser(usernameToDelete);
      setUsers(users.filter(u => u.username !== usernameToDelete)); 
      // Show Success
      setSuccessModal({ show: true, message: `User "${usernameToDelete}" removed successfully.` });
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleChangeUserPassword = async () => {
    try {
      await authService.changePassword(resetModal.username, resetModal.newPassword);
      setResetModal({ show: false, username: '', newPassword: '' });
      setSuccessModal({ show: true, message: 'Staff password updated successfully!' });
    } catch (error) {
      alert("Failed to update password.");
    }
  };

  const initiateAdminPasswordUpdate = (e) => {
    e.preventDefault();
    setMyPwStatus({type: '', message: ''});

    if(myPassword.new !== myPassword.confirm) {
        setMyPwStatus({type: 'error', message: 'Passwords do not match'});
        return;
    }
    setAdminConfirmModal({ show: true });
  }

  const executeAdminPasswordUpdate = async () => {
      setAdminConfirmModal({ show: false });
      if(!currentUser?.username) return;

      try {
          await authService.changePassword(currentUser.username, myPassword.new);
          setMyPassword({new: '', confirm: ''});
          setSuccessModal({ show: true, message: 'Your admin password has been changed.' });
      } catch (err) {
          setMyPwStatus({type: 'error', message: 'Failed to update password.'});
      }
  }

  const activeTeamMembers = users.filter(u => u.role === 'USER');
  const role = localStorage.getItem('role');

  if (role !== 'ADMIN') {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-500">
        <div className="text-center">
          <Lock size={48} className="mx-auto mb-4 text-zinc-300" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Access Denied</h2>
          <p>Restricted to Administrators.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Team Management', icon: User },
    { id: 'security', label: 'Admin Security', icon: Shield },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500 flex flex-col min-h-[85vh]">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage access controls and team configurations.
        </p>
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 transition-all ${
                        isActive 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            )
        })}
      </div>

      <div className="space-y-6 flex-1">
          
          {/* TAB 1: TEAM MANAGEMENT */}
          {activeTab === 'account' && (
            <>
               <div className="bg-white dark:bg-[#121214] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <UserPlus size={20} className="text-blue-500"/> Add Team Member
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create a new account for your staff to access the portal.</p>
                  </div>
                  
                  {status.message && (
                    <div className={`mb-5 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border ${
                        status.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800 dark:text-emerald-400' 
                        : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400'
                    }`}>
                        {status.type === 'success' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                        {status.message}
                    </div>
                  )}

                  <form onSubmit={initiateAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Username</label>
                        <input 
                          type="text" required value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all"
                          placeholder="e.g. staff_member"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Temporary Password</label>
                        <div className="flex gap-3">
                            <input 
                            type="text" required value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="flex-1 h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all"
                            placeholder="Set password"
                            />
                            <button 
                                type="submit" 
                                disabled={loadingAction} 
                                className="h-11 px-6 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap flex items-center justify-center gap-2 shadow-sm"
                            >
                                {loadingAction ? <Loader2 size={16} className="animate-spin"/> : 'Add User'}
                            </button>
                        </div>
                      </div>
                  </form>
               </div>

               <div className="bg-white dark:bg-[#121214] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[300px]">
                  <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-900/30">
                      <h2 className="text-base font-bold text-zinc-900 dark:text-white">Active Team Members</h2>
                      <span className="text-xs font-medium px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
                          {activeTeamMembers.length} Users
                      </span>
                  </div>
                  
                  {loadingUsers ? (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
                        <Loader2 size={32} className="animate-spin text-blue-500"/>
                        <p className="text-sm font-medium">Loading team information...</p>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 uppercase text-xs tracking-wider">
                            <tr>
                            <th className="px-6 py-3 font-semibold">Username</th>
                            <th className="px-6 py-3 font-semibold">Role</th>
                            <th className="px-6 py-3 font-semibold">Joined</th>
                            <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {activeTeamMembers.length > 0 ? (
                            activeTeamMembers.map((user) => (
                                <tr key={user.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{user.username}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                    {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button 
                                        onClick={() => setResetModal({ show: true, username: user.username, newPassword: '' })} 
                                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Reset Password">
                                        <Key size={16} />
                                        </button>
                                        <button 
                                        onClick={() => initiateDeleteUser(user.username)} 
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Account">
                                        <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 max-w-sm mx-auto">
                                        <User size={32} className="opacity-20 mb-3"/>
                                        <p className="text-sm">No active staff members found.</p>
                                    </div>
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                  )}
               </div>
            </>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#121214] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Lock size={20} className="text-purple-500"/>
                        Admin Credentials
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Update the master password for <span className="font-semibold text-zinc-900 dark:text-white">@{currentUser?.username || 'Admin'}</span>
                    </p>
                </div>

                {myPwStatus.message && (
                    <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border ${
                        myPwStatus.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800 dark:text-emerald-400' 
                        : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400'
                    }`}>
                        {myPwStatus.type === 'success' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                        {myPwStatus.message}
                    </div>
                )}

                <form onSubmit={initiateAdminPasswordUpdate} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                        <input 
                            type="password" 
                            className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-purple-500 outline-none transition-all"
                            value={myPassword.new}
                            onChange={(e) => setMyPassword({...myPassword, new: e.target.value})}
                            required
                            placeholder="Enter a strong new password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-4 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-purple-500 outline-none transition-all"
                            value={myPassword.confirm}
                            onChange={(e) => setMyPassword({...myPassword, confirm: e.target.value})}
                            required
                            placeholder="Repeat new password"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="h-11 px-8 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-sm">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
          )}
      </div>

      <div className="mt-16 mb-4 text-center">
        <p className="text-[10px] sm:text-xs text-zinc-300 dark:text-zinc-600 font-medium tracking-wide">
          An AI enabled initiative by <span className="text-zinc-400 dark:text-zinc-500 font-semibold">Sanket Milind Joshi & Co</span> <span className="mx-1.5 opacity-50">|</span> Designed and Developed by <span className="text-zinc-400 dark:text-zinc-500 font-semibold">BRC HUB LLP</span> <span className="mx-1.5 opacity-50">|</span> <span className="text-zinc-400 dark:text-zinc-500 font-semibold">Benk-Y Architecture</span>
        </p>
      </div>

      {/* --- MODAL 1: ADD USER CONFIRMATION --- */}
      {addUserModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Confirm New Member</h3>
            
            <div className="space-y-4 mb-6">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Username</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{newUser.username}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Password</p>
                    <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{newUser.password}</p>
                </div>
                
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20">
                    <span className="font-bold text-amber-700 dark:text-amber-500 block mb-1">⚠️ Important Security Note:</span>
                    Only 3 staff members can be added. Please remember or securely record this password now. For security purposes, it will be hidden after creation. If forgotten, an Admin must reset it.
                </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setAddUserModal({ show: false })}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeAddUser}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90 transition-colors shadow-sm"
              >
                Confirm & Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: STAFF PASSWORD RESET --- */}
      {resetModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-500"/> Reset Credentials
              </h3>
              <button onClick={() => setResetModal({ ...resetModal, show: false })} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Target Account</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{resetModal.username}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                <input 
                  type="text" 
                  value={resetModal.newPassword}
                  onChange={(e) => setResetModal({...resetModal, newPassword: e.target.value})}
                  className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-black px-3 text-sm text-zinc-900 dark:text-white focus:ring-2 ring-blue-500 outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setResetModal({ ...resetModal, show: false })}
                  className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleChangeUserPassword}
                  disabled={!resetModal.newPassword}
                  className="h-10 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADMIN PASSWORD CONFIRM --- */}
      {adminConfirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Update</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to change your admin password? You will need to use the new password next time you login.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setAdminConfirmModal({ show: false })}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeAdminPasswordUpdate}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                Yes, Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: DELETE USER CONFIRM (NEW) --- */}
      {deleteConfirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Delete</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to remove <span className="font-bold text-zinc-900 dark:text-white">{deleteConfirmModal.username}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ show: false, username: '' })}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDeleteUser}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: SUCCESS MESSAGE --- */}
      {successModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#18181b] w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 text-center animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Success!</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    {successModal.message}
                </p>
                <button 
                    onClick={() => setSuccessModal({ show: false, message: '' })}
                    className="w-full h-10 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all text-xs"
                >
                    Done
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default Settings;