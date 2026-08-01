import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, Check, KeyRound, Palette, Briefcase, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAuth: (user: User, token: string) => void;
  initialMode?: 'login' | 'register';
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop'
];

const ROLES: UserRole[] = [
  'Homeowner / Client',
  'Senior Interior Designer',
  'Architect',
  'Decor Enthusiast',
  'Admin'
];

const DESIGN_STYLES = [
  'Mid-Century Modern',
  'Japandi',
  'Scandinavian',
  'Industrial Loft',
  'Boho Organic',
  'Modern Coastal',
  'Moody Dark Velvet',
  'Art Deco'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessAuth,
  initialMode = 'register'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Homeowner / Client');
  const [preferredStyle, setPreferredStyle] = useState('Mid-Century Modern');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = mode === 'register'
      ? { fullName, email, password, role, preferredStyle, avatarUrl }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store in localStorage
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      localStorage.setItem('aura_token', data.token);

      onSuccessAuth(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(demoEmail.startsWith('elena') ? 'AdminPass123!' : demoEmail.startsWith('marcus') ? 'ClientPass123!' : 'DesignerPass123!');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden relative my-8">
        
        {/* Top Header Glow */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Aura Interior Member Portal</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              {mode === 'register' ? 'Create Your Design Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              {mode === 'register'
                ? 'Register securely to save custom room makeovers, track moodboards, and join the designer community.'
                : 'Sign in with your secure credentials to access saved spaces and audit history.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
            <button
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </div>

          {/* Quick Demo Pre-fill Bar */}
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400 font-semibold flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-400" /> Quick Demo Accounts:
              </span>
              <span className="text-[10px] text-amber-400/80">Click to fill</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('elena.vance@aurainterior.com')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono transition-colors"
              >
                Admin (Elena)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('marcus.sterling@example.com')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono transition-colors"
              >
                Client (Marcus)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sophia.chen@designstudio.io')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono transition-colors"
              >
                Architect (Sophia)
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name (Register Mode Only) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-stone-300 font-medium flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexandra Wright"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-stone-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-stone-300 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
                </span>
                {mode === 'register' && (
                  <span className="text-[10px] text-stone-500">PBKDF2 SHA-512 Encrypted</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 pr-10 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Register Specific Fields */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Role Selector */}
                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Member Category
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-200 focus:outline-none focus:border-amber-400"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Style */}
                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" /> Primary Aesthetic
                    </label>
                    <select
                      value={preferredStyle}
                      onChange={(e) => setPreferredStyle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-200 focus:outline-none focus:border-amber-400"
                    >
                      {DESIGN_STYLES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Avatar Chooser */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-stone-300 font-medium block text-[11px]">
                    Select Avatar Photo
                  </label>
                  <div className="flex items-center space-x-2">
                    {AVATAR_OPTIONS.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(img)}
                        className={`relative rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                          avatarUrl === img
                            ? 'border-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                            : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Avatar ${idx + 1}`}
                          className="w-9 h-9 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Securely...</span>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Register & Access Portal' : 'Sign In Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Footer */}
          <div className="pt-3 border-t border-stone-800/80 text-[10px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-500/80" /> Salted Passwords & Session Audits
            </span>
            <span>Aura Security Protocol</span>
          </div>

        </div>
      </div>
    </div>
  );
};
