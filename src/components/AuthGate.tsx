import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../core/firebase';
import { LogIn, LogOut, User as UserIcon, ShieldCheck, Database, Zap } from 'lucide-react';

interface AuthGateProps {
  children: (user: User) => React.ReactNode;
  onDemoMode?: () => void;
}

export default function AuthGate({ children, onDemoMode }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Initializing Aequitas Security Layer...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] dot-grid">
        <div className="max-w-md w-full p-8 glass-panel rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-blue-600/20">
              <Zap className="text-blue-600" size={32} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Aequitas OS</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[280px]">
              The Secured Wealth Ledger for Long-term Thematic Allocation.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn size={20} />
              Sign in with Google Workspace
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <button
              onClick={() => {
                setIsDemo(true);
                if (onDemoMode) onDemoMode();
              }}
              className="w-full py-4 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Database size={20} />
              Access Local Sandbox (Demo)
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
              <div className="text-left">
                <h4 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">End-to-End Privacy</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Portfolio data is bound to your authenticated identity and stored in your private cloud workspace.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center px-4 italic">
              By accessing Aequitas, you agree to local-first data processing and non-custodial ledger management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children(user as User)}</>;
}
