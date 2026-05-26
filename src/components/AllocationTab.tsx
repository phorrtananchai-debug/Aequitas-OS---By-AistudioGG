import { useState } from 'react';
import { PieChart, Sliders, AlertTriangle, Zap, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

interface AllocationTabProps {
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
}

export default function AllocationTab({ onTriggerAlert }: AllocationTabProps) {
  const [driftTolerance, setDriftTolerance] = useState<number>(3.5);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const allocations = [
    { ticker: 'SOL', name: 'Solana Stable Weight', current: 48, target: 50, color: 'bg-blue-600', text: 'text-blue-600' },
    { ticker: 'BTC', name: 'Bitcoin Digital Reserve', current: 32, target: 30, color: 'bg-slate-400', text: 'text-slate-500' },
    { ticker: 'ETH', name: 'Ethereum Contract Anchor', current: 20, target: 20, color: 'bg-emerald-500', text: 'text-emerald-505' },
  ];

  const handleSyncLimits = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerAlert({
        type: 'success',
        typeLabel: 'LIMITS CONFIGURED',
        title: 'Allocation Matrices Calibrated',
        description: 'Target weights and drift boundaries reconciled successfully with consensus nodes.'
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Introduction Greeting */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          SYSTEM ALIGNMENT MATRICES
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Allocation & Coherence
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Review core digital assets weighting limits, adjust deviation tolerances, and trigger automated rebalancing procedures.
        </p>
      </section>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Total Alignment Index</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">99.8%</span>
          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">Highly coherent</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Weighted Capital Drift</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">3.2%</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Below trigger threshold</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Drift Safety Bound</span>
          <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">±{driftTolerance}%</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Adjustable parameters</p>
        </div>
      </div>

      {/* Main Core: Target weights & current drift */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Allocations & Targets List (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/45 mb-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-450">COHERENCE LEDGER</span>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Target Coherence Ratios</h3>
              </div>
              <button 
                onClick={handleSyncLimits}
                disabled={isSyncing}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                Reconcile Core Weights
              </button>
            </div>

            <div className="space-y-6">
              {allocations.map((alloc) => {
                const drift = Math.abs(alloc.current - alloc.target);
                return (
                  <div key={alloc.ticker} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${alloc.color}`} />
                        <span className="text-slate-805 font-bold dark:text-slate-200">{alloc.ticker} ({alloc.name})</span>
                      </div>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {alloc.current}% <span className="text-slate-400 font-normal">/ {alloc.target}% target</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div className={`h-full ${alloc.color}`} style={{ width: `${alloc.current}%` }} />
                      </div>
                      <span className="font-mono text-[9px] font-black uppercase text-emerald-600 shrink-0">
                        {drift === 0 ? 'Aligned' : `Drift: ${drift.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-905/30 border border-slate-100 dark:border-slate-805/5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="font-medium">Continuous audits indicate zero allocation compliance breaches. Drift remains minor.</p>
          </div>
        </div>

        {/* Drift Adjuster Pane (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
                ADMIN BOUNDS
              </span>
              <h3 className="text-base font-bold mt-1 text-slate-900 dark:text-white">Drift Bounds</h3>
              <p className="text-xs text-slate-450 mt-1">Configure limits on deviation.</p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-1.5 text-xs font-bold text-slate-655 shrink-0">
                <div className="flex justify-between items-baseline">
                  <label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Drift Warning Threshold</label>
                  <span className="font-mono text-blue-600 font-bold">±{driftTolerance}% Max</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={driftTolerance}
                  onChange={(e) => setDriftTolerance(parseFloat(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer animate-none"
                />
              </div>

              {/* Informational Advisory block */}
              <div className="p-3 bg-blue-50/20 dark:bg-slate-900/35 border border-blue-105/10 rounded-xl flex items-start gap-2 text-xs">
                <Zap size={15} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Continuous Drift Guard</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                    If any sector drift breaches the ±{driftTolerance}% bound, the Aequitas advisor will suggest an automated alignment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
