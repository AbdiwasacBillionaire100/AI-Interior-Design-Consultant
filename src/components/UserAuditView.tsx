import React, { useState, useEffect } from 'react';
import { X, Users, ShieldCheck, Activity, Search, RefreshCw, KeyRound, Clock, Laptop, Filter, Sparkles, UserCheck } from 'lucide-react';
import { User, AuditLog } from '../types';

interface UserAuditViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const UserAuditView: React.FC<UserAuditViewProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'audits'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/audit-logs');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAuditData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search filtering
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.preferredStyle.toLowerCase().includes(q)
    );
  });

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      log.userName.toLowerCase().includes(q) ||
      log.userEmail.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.ipAddress.toLowerCase().includes(q)
    );
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl h-[85vh] flex flex-col overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-stone-100">
                  Registered Members & Security Audit Logs
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Encrypted DB
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Live audit trail tracking user registrations, salted PBKDF2 logins, and session history.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAuditData}
              disabled={loading}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5"
              title="Refresh Audit Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-stone-800 bg-stone-950/80 text-xs divide-x divide-stone-800">
          <div className="p-3.5 flex items-center space-x-3">
            <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Registered Users</p>
              <p className="text-base font-bold text-stone-100">{users.length} Members</p>
            </div>
          </div>
          <div className="p-3.5 flex items-center space-x-3">
            <Activity className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Audit Log Events</p>
              <p className="text-base font-bold text-amber-300">{auditLogs.length} Records</p>
            </div>
          </div>
          <div className="p-3.5 flex items-center space-x-3">
            <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Password Hash</p>
              <p className="text-xs font-mono font-semibold text-emerald-300">PBKDF2 SHA-512</p>
            </div>
          </div>
          <div className="p-3.5 flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Current Session</p>
              <p className="text-xs font-semibold text-stone-200 truncate">
                {currentUser ? currentUser.fullName : 'Guest Inspector'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-stone-800/80 bg-stone-900 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Tabs */}
          <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-amber-500 text-stone-950 shadow font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Registered Members ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'audits'
                  ? 'bg-amber-500 text-stone-950 shadow font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Security & Login Trail ({auditLogs.length})
            </button>
          </div>

          {/* Search & Action Filter Inputs */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {activeTab === 'audits' && (
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Actions</option>
                <option value="REGISTER">REGISTER</option>
                <option value="LOGIN">LOGIN</option>
              </select>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, style, or IP..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

        </div>

        {/* Tab 1: Registered Users Directory */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                <Users className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                <p>No registered members match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 hover:border-amber-500/40 transition-all flex items-start space-x-3.5 shadow-md"
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-stone-100 text-sm truncate">
                          {u.fullName}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          {u.role}
                        </span>
                      </div>

                      <p className="text-stone-400 font-mono text-[11px] truncate">
                        {u.email}
                      </p>

                      <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-[10px] text-stone-400 gap-2">
                        <span className="text-stone-300 font-medium">
                          Aesthetic: <strong className="text-amber-300">{u.preferredStyle}</strong>
                        </span>
                        <span>
                          Sessions: <strong className="text-stone-200">{u.loginCount}</strong> logins
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                        <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                        <span>Last Active: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Security & Login Activity Audit Logs */}
        {activeTab === 'audits' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                <Activity className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                <p>No audit events match your filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredLogs.map((log) => {
                  const isRegister = log.action === 'REGISTER';
                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider shrink-0 border ${
                            isRegister
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {log.action}
                        </span>

                        <div className="min-w-0">
                          <p className="font-semibold text-stone-100 text-xs truncate">
                            {log.userName} <span className="text-stone-400 font-normal">({log.userEmail})</span>
                          </p>
                          <p className="text-[11px] text-stone-400 truncate mt-0.5">
                            {log.details || 'Authenticated event'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-[11px] text-stone-400 shrink-0 border-t sm:border-t-0 border-stone-800 pt-2 sm:pt-0">
                        <span className="flex items-center gap-1 font-mono text-[10px] text-amber-300/90">
                          <Laptop className="w-3 h-3 text-stone-500" /> {log.ipAddress}
                        </span>
                        <span className="flex items-center gap-1 text-stone-400">
                          <Clock className="w-3 h-3 text-stone-500" />
                          {new Date(log.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> All registration & login actions are logged for security verification.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
