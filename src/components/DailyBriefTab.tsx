import { 
  FileText, 
  TrendingUp, 
  Coins, 
  Sparkles, 
  ArrowUpRight, 
  CalendarDays, 
  Activity, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface DailyBriefProps {
  portfolioValue: number;
}

export default function DailyBriefTab({ portfolioValue }: DailyBriefProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Introduction Greeting */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Aequitas Morning Briefing
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Executive Briefing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Automated intelligence reports and portfolio compliance updates compiled for the active cycle.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-800/10 shadow-sm w-fit self-start md:self-auto">
          <Clock size={14} className="text-slate-400 shrink-0" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{today}</span>
        </div>
      </section>

      {/* Main Grid: Executive Summary & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Portfolio Executive Snapshot (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/45">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">LEDGER METRIC</span>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Active Core Balance</h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 dark:text-white">${portfolioValue.toLocaleString()}</span>
                <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 flex items-center justify-end gap-0.5">
                  <ArrowUpRight size={10} /> +1.24% today
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/70 dark:bg-slate-900/10 dark:border-slate-800/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sector Weightings</span>
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Digital Assets Core</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">48%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Sovereign Buffers</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">32%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Alternative Yields</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">20%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/70 dark:bg-slate-900/10 dark:border-slate-800/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Drifts</span>
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Weighted Drift Marker</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">3.2% (Minimal)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Target Accordance Index</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">99.8% (Perfect)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Sync Node Status</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Stable (sol-09)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-900/10 border border-blue-100/30 dark:border-slate-800/10 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="font-medium">All Ledger nodes are synchronized with zero consensus faults. Portfolio is fully optimized according to standard long-term plans.</p>
          </div>
        </div>

        {/* Market Context Side panel (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
                MARKET CONTEXT
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Macro Framework</h3>
              <p className="text-xs text-slate-400 mt-1">Luminous index metrics tracking overall climate trends.</p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-500 font-medium">Macro Volatility Index</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">14.2 pt (Low)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-500 font-medium">Liquidity Stream Depth</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">High (Stable)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-500 font-medium">Treasury Yield Rate</span>
                <span className="font-mono font-bold text-emerald-600">4.85% (Secured)</span>
              </div>
            </div>

            {/* Dividend Reminder Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100/40 dark:bg-amber-950/10 dark:border-amber-800/20 shadow-sm flex items-start gap-2.5">
              <Coins size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">Upcoming Dividend Reminder</h4>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-0.5 leading-normal">
                  Estimated $1,450.00 cash flows pending release on June 1. Distribution automated to Core DCA plan.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Observations Spotlight section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">ACTIVE INTELLIGENCE NOTE</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none mt-1">Aequitas Strategic Indicator</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm leading-relaxed text-sm text-slate-650 dark:text-slate-300 font-sans space-y-3">
          <p>
            An analysis of institutional accumulator nodes confirms ongoing block-buying trends across primary layer-1 collateral pairs. The Aequitas algorithms note standard consensus drifts remain well-tolerated.
          </p>
          <p className="text-xs text-slate-400">
            No manual rebalancing actions are suggested for this cycle. DCA plans will deploy automatically as scheduled.
          </p>
        </div>
      </section>
    </div>
  );
}
