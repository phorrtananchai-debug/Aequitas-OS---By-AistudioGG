import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, DollarSign, ArrowRight, Database, CloudCheck, Zap, User as UserIcon, LogOut } from 'lucide-react';
import { AlertItem, MigrationStatus } from '../types';
import { User, signOut } from 'firebase/auth';
import { auth } from '../core/firebase';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExecuteTrade: () => void;
  notifications: AlertItem[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  onClearNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  migrationStatus: MigrationStatus | null;
  user: User | null;
  workspaceMode: 'cloud' | 'local' | 'demo';
  isDemoData?: boolean;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onExecuteTrade,
  notifications,
  darkMode,
  toggleDarkMode,
  onClearNotification,
  onClearAllNotifications,
  migrationStatus,
  user,
  workspaceMode,
  isDemoData
}: HeaderProps) {
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'risk' | 'yield' | 'governance'>('overview');

  // Close dropdowns on clicking outside (simple cleanup)
  useEffect(() => {
    const handleOutsideClick = () => {
      // Small delay to allow button click events to resolve first
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass-panel border-b border-white/20 dark:border-slate-800/20 backdrop-blur-md shadow-sm flex justify-between items-center px-8 z-40 transition-colors">
      
      {/* Search Strategies and Global Links */}
      <div className="flex items-center gap-8 flex-grow max-w-2xl">
        <div className="relative w-64">
          <input
            id="header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-slate-100/70 dark:bg-slate-900/40 rounded-full py-1.5 pl-10 pr-4 w-full border border-slate-200/50 dark:border-slate-800/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Search Assets..."
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>
        
        <nav className="flex items-center gap-6">
          {(['overview', 'risk', 'yield', 'governance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                onSearchChange(tab === 'overview' ? '' : tab);
              }}
              className={`text-xs font-bold tracking-wide capitalize py-5 border-b-2 transition-all relative ${
                activeSubTab === tab
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Quick Action bar icons, Dark mode, execute trade, avatar */}
      <div className="flex items-center gap-4">
        
        {/* Workspace Mode Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          {workspaceMode === 'cloud' ? (
            <>
              <CloudCheck className="text-blue-500" size={14} />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Cloud Workspace</span>
            </>
          ) : workspaceMode === 'demo' ? (
            <>
              <Zap className="text-amber-500" size={14} />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Demo Mode</span>
            </>
          ) : (
            <>
              <Database className="text-slate-400" size={14} />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Local Cache</span>
            </>
          )}
        </div>

        {/* Migration/Continuity Indicator */}
        {migrationStatus?.source === 'old-local-storage' && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-full">
            <Database size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Legacy Continuity Active</span>
          </div>
        )}

        {/* Dark Mode toggle */}
        <button
          id="btn-header-dark-mode"
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>

        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={(e) => {
              e.stopPropagation();
              setBellOpen(!bellOpen);
              setProfileOpen(false);
            }}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 rounded-full transition-all relative transform hover:scale-105"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {bellOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-3 w-80 glass-panel border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-100 z-50 animate-fade-in"
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="font-bold text-xs tracking-wider text-slate-400 dark:text-slate-500 uppercase">ALLOCATION UPDATES</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAllNotifications}
                    className="text-[10px] text-[#6F685F] hover:underline hover:text-[#1E1B16] dark:text-slate-400 bg-transparent shrink-0 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active tactical alerts</p>
                ) : (
                  notifications.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-2.5 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 relative group"
                    >
                      <button
                        onClick={() => onClearNotification(alert.id)}
                        className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div className="flex gap-2 items-start">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                          alert.type === 'high' ? 'bg-[#ba1a1a]' : 
                          alert.type === 'advisory' ? 'bg-[#6F685F]' : 
                          alert.type === 'success' ? 'bg-emerald-500' : 'bg-[#6F685F]/50'
                        }`} />
                        <div>
                          <div className="flex justify-between w-full items-baseline gap-2">
                            <span className="font-bold text-xs">{alert.title}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{alert.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Review Plan Button */}
        <button
          id="btn-header-execute-trade"
          onClick={onExecuteTrade}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-5 py-2.5 rounded-full font-semibold text-xs transition-all transform active:scale-98 flex items-center gap-1.5 shadow-sm shadow-blue-500/10 border border-blue-500/10"
        >
          <ArrowRight size={13} strokeWidth={2.5} />
          Review Plan
        </button>

        {/* User Profile Container */}
        <div className="relative">
          <button
            id="btn-header-profile"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(!profileOpen);
              setBellOpen(false);
            }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300 dark:border-slate-700/80 shadow-sm hover:border-[#1E1B16] dark:hover:border-slate-400 transition-all flex items-center justify-center bg-slate-200 dark:bg-slate-800"
          >
            {user?.photoURL ? (
              <img
                alt="Investor Profile"
                src={user.photoURL}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={20} className="text-slate-400" />
            )}
          </button>

          {profileOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-3 w-64 glass-panel border border-slate-200/80 dark:border-slate-800/85 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-100 z-50 animate-fade-in"
            >
              <div className="flex gap-3 items-center pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      alt="Investor Avatar"
                      src={user.photoURL}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm truncate">{user?.displayName || (workspaceMode === 'demo' ? 'Demo Account' : 'Guest User')}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Secured Ledger'}</p>
                </div>
              </div>
              <div className="py-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Workspace ID:</span>
                  <span className="font-mono text-[9px] font-bold opacity-60">
                    {user?.uid ? user.uid.substring(0, 12) + '...' : (workspaceMode === 'demo' ? 'DEMO-8080' : 'LOCAL-ONLY')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session Access:</span>
                  <span className="font-mono text-[11px] font-bold uppercase text-emerald-500">Authorized</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    if (window.confirm("Disconnect from Aequitas Workspace?")) {
                      signOut(auth);
                    }
                  }}
                  className="w-full py-2 px-3 flex items-center gap-2 text-[11px] font-bold text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  Disconnect Workspace
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
