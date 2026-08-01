import React, { useState } from 'react';
import { Sparkles, ShoppingBag, RefreshCw, Users, ShieldCheck, LogIn, UserPlus, LogOut, User as UserIcon, KeyRound } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  savedCount: number;
  totalBudget: number;
  onOpenMoodboard: () => void;
  onReset: () => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAudit: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  totalBudget,
  onOpenMoodboard,
  onReset,
  currentUser,
  onOpenAuth,
  onOpenAudit,
  onLogout
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/30">
            <Sparkles className="w-5 h-5 text-stone-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-serif tracking-tight font-semibold text-stone-100">
                Aura Interior
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 font-sans hidden sm:block">
              Interactive Room Makeover & Design Consultant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Audit Logs & Registered Users Directory Button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700/80 transition-all active:scale-95 shadow-sm"
            title="View Registered Users & Security Audits"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Registered Users & Audits</span>
            <span className="lg:hidden">Audits</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800 hover:border-stone-700"
            title="Start New Room Makeover"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Change Room</span>
          </button>

          {/* Moodboard / Saved Items Button */}
          <button
            onClick={onOpenMoodboard}
            className="relative flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Saved Items</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-stone-950 text-amber-300 text-[11px] font-bold rounded-full">
                {savedCount}
              </span>
            )}
            {totalBudget > 0 && (
              <span className="hidden sm:inline-block ml-1 pl-1.5 border-l border-stone-950/20 text-[11px]">
                ${totalBudget.toLocaleString()}
              </span>
            )}
          </button>

          {/* User Auth Profile Pill / Login Buttons */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1 pl-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700/80 transition-all"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                  />
                  <span className="text-xs font-medium text-stone-200 hidden sm:inline max-w-[100px] truncate">
                    {currentUser.fullName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
                    <div className="pb-2 border-b border-stone-800">
                      <p className="font-semibold text-stone-100">{currentUser.fullName}</p>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => { setShowUserDropdown(false); onOpenAudit(); }}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-stone-800 text-stone-300 flex items-center gap-2"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Community Directory</span>
                    </button>

                    <button
                      onClick={() => { setShowUserDropdown(false); onLogout(); }}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-rose-500/10 text-rose-300 flex items-center gap-2 border-t border-stone-800/80"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800"
                >
                  <LogIn className="w-3.5 h-3.5 inline sm:mr-1" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 inline sm:mr-1" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
