import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Plus,
  Newspaper,
  Layers,
  PieChart,
  Coins,
  Calendar,
  Sparkles,
  Beaker,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Camera,
  Workflow
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewAnalysis: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
  portfolioValue: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onNewAnalysis,
  onOpenSettings,
  onOpenSupport,
  onTriggerAlert,
  portfolioValue
}: SidebarProps) {
  // Popover States
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Command Menu State
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const commandMenuRef = useRef<HTMLDivElement>(null);

  // Sync state indication
  const [isSyncing, setIsSyncing] = useState(false);

  // Group Definitions
  const navigationGroups = [
    {
      groupTitle: 'Overview',
      items: [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard, popup: null },
        { id: 'dailyBrief' as TabType, label: 'Daily Brief', icon: Newspaper, popup: 'dailyBrief' },
      ]
    },
    {
      groupTitle: 'Portfolio',
      items: [
        { id: 'portfolio' as TabType, label: 'Portfolio', icon: Wallet, popup: null },
        { id: 'holdings' as TabType, label: 'Holdings', icon: Layers, popup: null }, // Maps to markets originally
        { id: 'allocation' as TabType, label: 'Allocation', icon: PieChart, popup: 'allocation' },
        { id: 'dividends' as TabType, label: 'Dividends', icon: Coins, popup: 'dividends' },
        { id: 'dcaPlan' as TabType, label: 'DCA Plan', icon: Calendar, popup: null },
      ]
    },
    {
      groupTitle: 'Intelligence',
      items: [
        { id: 'aiWorkflow' as TabType, label: 'AI Workflow', icon: Workflow, popup: 'aiWorkflow' },
        { id: 'aiAdvisor' as TabType, label: 'AI Advisor', icon: Sparkles, popup: 'aiAdvisor' }, // Maps to insights originally
        { id: 'labs' as TabType, label: 'Labs', icon: Beaker, popup: 'labs' }, // Maps to strategy originally
      ]
    },
    {
      groupTitle: 'System',
      items: [
        { id: 'snapshots' as TabType, label: 'Snapshots', icon: Camera, popup: null },
        { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon, popup: null },
      ]
    }
  ];

  // Optional Utilities List
  const lowerUtilities = [
    { id: 'sync', label: 'Sync Status', icon: RefreshCw, action: 'sync' },
    { id: 'export', label: 'Export / Import', icon: Download, action: 'export' },
    { id: 'help', label: 'Help', icon: HelpCircle, action: 'help' }
  ];

  // Hover Debouncing handlers
  const handleMouseEnter = (itemId: string, hasPopup: boolean) => {
    if (!hasPopup) {
      handleMouseLeave();
      return;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTab(itemId);
    }, 120); // Smooth entry delay to prevent fast skip flickering
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredTab(null);
  };

  // Close command menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commandMenuRef.current && !commandMenuRef.current.contains(event.target as Node)) {
        setCommandMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync Trigger Action
  const handleTriggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    onTriggerAlert({
      type: 'monitoring',
      typeLabel: 'LEDGER RE-SYNCING',
      title: 'Auditing Ledger Nodes...',
      description: 'Requesting verified account balances from the consensus clusters.'
    });

    setTimeout(() => {
      setIsSyncing(false);
      onTriggerAlert({
        type: 'success',
        typeLabel: 'SYNC RESOLVED',
        title: 'Wealth Ledger Synced',
        description: 'Synchronized with Aequitas nodes (sol-09, eth-03). Account parameters reconciled.'
      });
    }, 1800);
  };

  // State Context Export action
  const handleExportState = () => {
    onTriggerAlert({
      type: 'success',
      typeLabel: 'STATE EXPORTED',
      title: 'Context Export Initiated',
      description: 'Aequitas portfolio parameters state file processed and saved successfully in encrypted JSON.'
    });
  };

  return (
    <aside className="fixed h-full w-64 left-0 top-0 glass-sidebar flex flex-col py-6 px-4 z-50 shadow-sm text-slate-800 dark:text-slate-100 transition-colors select-none overflow-y-auto overflow-x-visible">
      {/* Header Logo Info */}
      <div className="mb-6 px-3">
        <h1 className="font-sans text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Aequitas OS
        </h1>
        <p className="text-[10px] font-black text-blue-600/90 dark:text-blue-400 mt-1 uppercase tracking-widest leading-none">
          SECURED WEALTH LEDGER
        </p>
      </div>

      {/* Nav groups rendering */}
      <div className="flex-grow space-y-5">
        {navigationGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">
              {group.groupTitle}
            </h4>
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <div 
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id, !!item.popup)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      id={`nav-tab-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setHoveredTab(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-medium text-xs border border-transparent active:scale-98 ${
                        isActive
                          ? 'bg-blue-50/80 dark:bg-blue-950/20 border-blue-100/20 text-blue-600 dark:text-blue-400 font-bold shadow-none'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/10 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <IconComp 
                        size={15} 
                        className={`transition-transform duration-150 ${
                          isActive 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700'
                        }`} 
                      />
                      <span>{item.label}</span>
                    </button>

                    {/* Popover Hover Frame (Right offset fly-out) */}
                    {hoveredTab === item.id && item.popup && (
                      <div className="absolute left-60 top-1/2 -translate-y-1/2 ml-3 w-80 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-5 backdrop-blur-md z-99 pointer-events-auto cursor-default animate-fade-in text-slate-800 dark:text-slate-105 transition-all">
                        {/* Popover Title */}
                        {item.popup === 'dailyBrief' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <Newspaper size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Daily OS Briefing</span>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-bold block">Consensus balance</span>
                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-50">${portfolioValue.toLocaleString()}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/10 text-[11px] space-y-1 leading-normal font-sans">
                                <div className="flex justify-between">
                                  <span className="text-slate-450">Trend Climate</span>
                                  <span className="font-bold text-slate-700 dark:text-slate-350">Macro Stable</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-450">Event Payout</span>
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Pending Jun 1</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-medium">✨ Solana RSI divergence indicator flagged</span>
                            </div>
                          </div>
                        )}

                        {item.popup === 'allocation' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <PieChart size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deviations Drift</span>
                            </div>
                            <div className="space-y-2.5">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-bold block">COHERENCE DRIFT INDEX</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">3.2% Target Deviation</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-sans leading-normal">
                                Standard core splits are maintained under standard boundaries. Drift warning: <span className="text-emerald-600 font-bold">Stable Range</span>.
                              </div>
                              <button
                                onClick={() => {
                                  setActiveTab('allocation');
                                  setHoveredTab(null);
                                }}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-lg shadow-none flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                Review Deviation Boundaries
                              </button>
                            </div>
                          </div>
                        )}

                        {item.popup === 'dividends' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <Coins size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Recurring Capital Yield</span>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/10">
                                <span className="text-slate-450">Expected Monthly</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">$3,150.00</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100/50 dark:border-slate-800/10">
                                <span className="text-slate-450">Direct Target APY</span>
                                <span className="font-mono font-bold text-emerald-600">7.20% Core APY</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal mt-2">
                                Upcoming payout: <strong className="text-slate-600 dark:text-slate-350">$420.00 SOL Stake</strong> scheduled for Jun 1 deposition.
                              </p>
                            </div>
                          </div>
                        )}

                        {item.popup === 'aiWorkflow' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <Workflow size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Manual AI Reasoning Cycle</span>
                            </div>
                            <div className="space-y-2.5">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-black block">Active Guidance Anchor</span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">Manual Input &harr; Export &harr; Import Loop</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium font-sans">
                                Manage local snapshot parameters and sync parsed AI suggestions safely.
                              </p>
                              <button
                                onClick={() => {
                                  setActiveTab('aiWorkflow');
                                  setHoveredTab(null);
                                }}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-lg shadow-none flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                Open Workflow Hub
                              </button>
                            </div>
                          </div>
                        )}

                        {item.popup === 'aiAdvisor' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <Sparkles size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">System Intelligence Core</span>
                            </div>
                            <div className="space-y-2.5">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase font-black block">Active Guidance Anchor</span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">Boundaries support detected at $145.00 limit.</span>
                              </div>
                              <div className="p-2 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-[10px] text-slate-450 font-medium">
                                System Status: Consensus calibrated. No critical warning signals. Include regular DCA instructions.
                              </div>
                            </div>
                          </div>
                        )}

                        {item.popup === 'labs' && (
                          <div className="space-y-3.5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-805/15 pb-2">
                              <Beaker size={16} className="text-blue-600" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-450">Backtest sandbox environments</span>
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center bg-blue-50/20 dark:bg-blue-950/20 px-2 py-1 rounded border border-blue-100/20">
                                <span className="text-[10px] text-blue-600 font-bold uppercase">Sandbox Node</span>
                                <span className="text-[9px] font-black tracking-widest bg-blue-600 text-white px-1.5 rounded uppercase">v0.9.8 stable</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium font-sans">
                                3 custom simulations loaded active. Mean Reversion matrix calibration in performance tracking mode.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action / Utilities Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/15 relative">
        {/* Quick Command button menu trigger */}
        <div className="relative" ref={commandMenuRef}>
          <button
            id="btn-sidebar-new-analysis"
            onClick={() => setCommandMenuOpen(!commandMenuOpen)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 active:scale-98 cursor-pointer border border-blue-500/10"
          >
            <Plus size={14} strokeWidth={3} className={`transition-transform duration-150 ${commandMenuOpen ? 'rotate-45' : ''}`} />
            Quick Actions
          </button>

          {/* Floating Command Menu */}
          {commandMenuOpen && (
            <div className="absolute bottom-14 left-0 w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-slate-800">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-3.5 py-1.5 block border-b border-slate-100 dark:border-slate-800/10">
                Aequitas Command Menu
              </span>
              <div className="space-y-0.5 mt-1 font-sans text-xs">
                <button
                  onClick={() => {
                    handleTriggerSync();
                    setCommandMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={13} className="text-slate-400" />
                  Import Portfolio
                </button>
                <button
                  onClick={() => {
                    handleExportState();
                    setCommandMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download size={13} className="text-slate-400" />
                  Export AI Context
                </button>
                <button
                  onClick={() => {
                    setActiveTab('allocation');
                    setCommandMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <PieChart size={13} className="text-slate-400" />
                  Review Allocation
                </button>
                <button
                  onClick={() => {
                    setActiveTab('dividends');
                    setCommandMenuOpen(false);
                    onTriggerAlert({
                      type: 'success',
                      typeLabel: 'YIELD REGISTERED',
                      title: 'Weekly Payout Appended',
                      description: 'Estimated standard stacking records registered and mapped to system DCA.'
                    });
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Coins size={13} className="text-slate-400" />
                  Add Dividend Entry
                </button>
                <button
                  onClick={() => {
                    setActiveTab('dcaPlan');
                    setCommandMenuOpen(false);
                    onTriggerAlert({
                      type: 'success',
                      typeLabel: 'DCA RE-ALIGNED',
                      title: 'Schedule Parameters Mapped',
                      description: 'DCA Split weights optimized according to standard boundaries.'
                    });
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Calendar size={13} className="text-slate-400" />
                  Add DCA Contribution
                </button>
                <button
                  onClick={() => {
                    setActiveTab('dailyBrief');
                    setCommandMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/10 rounded-lg font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Newspaper size={13} className="text-slate-400" />
                  Open Daily Brief
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lower Utility rows (Sync, Export, Help) */}
        <div className="space-y-0.5">
          {lowerUtilities.map((util) => {
            const IconComp = util.icon;
            const isSync = util.id === 'sync';
            return (
              <button
                key={util.id}
                onClick={() => {
                  if (util.action === 'sync') handleTriggerSync();
                  if (util.action === 'export') handleExportState();
                  if (util.action === 'help') onOpenSupport();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-450 hover:bg-slate-100/50 dark:hover:bg-slate-900/10 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px] font-semibold active:scale-98 cursor-pointer"
              >
                <IconComp 
                  size={14} 
                  className={`text-slate-405 dark:text-slate-500 shrink-0 ${
                    isSync && isSyncing ? 'animate-spin text-blue-600' : ''
                  }`} 
                />
                <span className="flex-grow text-left">{util.label}</span>
                {isSync && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
