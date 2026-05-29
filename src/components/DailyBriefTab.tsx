import { 
  FileText, 
  TrendingUp, 
  Coins, 
  Sparkles, 
  ArrowUpRight, 
  CalendarDays, 
  Activity, 
  CheckCircle2, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { DailyBrief } from '../types';

interface DailyBriefProps {
  portfolioValue: number;
  dailyBrief: DailyBrief;
}

export default function DailyBriefTab({ portfolioValue, dailyBrief }: DailyBriefProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12 font-sans">
      {/* Introduction Greeting */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Aequitas Executive Memo
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Core Portfolio Briefing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Local briefing compiled from private ledger parameters. Calm, strategic situational summaries.
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
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/45">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">LEDGER METRIC</span>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Active Core Balance</h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 dark:text-white">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <p className="text-[10px] text-emerald-650 font-bold uppercase mt-1 flex items-center justify-end gap-0.5">
                  <ArrowUpRight size={10} /> +2.48% relative growth
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/70 dark:bg-slate-900/10 dark:border-slate-800/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Structural Portfolios</span>
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Core S&P 500 ETF Layers</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">31.7%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Growth Equities Layer</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">44.3%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Thai Fund Tax Wrapper</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Behavior Dividend Layer</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">8.5%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/70 dark:bg-slate-900/10 dark:border-slate-800/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Compliance Summary</span>
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Overall Drift Marker</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-350">3.2% (Tolerable)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-550 font-medium">Tax Wrapper Efficiency</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Optimal (Within limit)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">System Operating Mode</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Offline Cache (Secured)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-900/10 border border-blue-100/30 dark:border-slate-800/10 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="font-medium">All local asset weights are within active drift bounds. Rebalancing suggested passively via subsequent DCA allocations.</p>
          </div>
        </div>

        {/* Market Context Side panel (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
                MACRO CONTEXT
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Market Environment</h3>
              <p className="text-xs text-slate-400 mt-1">Status of broad system benchmarks.</p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-500 font-medium">S&P 500 Index Stability</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">Neutral-Strong</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-500 font-medium font-sans">Treasury Yields</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">4.85% (Stable)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-805/10">
                <span className="text-slate-550 font-medium font-sans">USD/THB FX conversion</span>
                <span className="font-mono font-bold text-emerald-600">36.45 THB</span>
              </div>
            </div>

            {/* Dividend Reminder Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-105/45 dark:bg-amber-950/10 dark:border-amber-808/20 shadow-sm flex items-start gap-2.5">
              <Coins size={15} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-amber-850 dark:text-amber-400 font-sans">{dailyBrief.dividendReminder ? "Income Schedule" : "Upcoming Yield"}</h4>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-0.5 leading-normal">
                  {dailyBrief.dividendReminder ?? "Passive stock cash flows calculated in core layers for automated reinvestment."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Observations Spotlight section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-blue-600 dark:text-blue-400 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">ACTIVE INTELLIGENCE REVIEW</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none mt-1 font-sans">Situational Insights</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm leading-relaxed text-sm text-slate-650 dark:text-slate-300 font-sans space-y-4">
          <div className="flex gap-2 items-start">
            <span className="p-1 rounded bg-[#EBF3FE] dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              💡
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-xs">Suggested Allocation Guidance</p>
              <p className="text-xs text-slate-500 mt-1">{dailyBrief.aiObservation}</p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <span className="p-1 rounded bg-[#FEF6EB] dark:bg-amber-950/40 text-amber-600 shrink-0 mt-0.5">
              ⚠️
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-xs">Risk Concentrators & Stability</p>
              <p className="text-xs text-slate-500 mt-1">{dailyBrief.riskConcentrationNote || "Concentration index remains safely within standard US large-cap and local-saving assets limits."}</p>
            </div>
          </div>

          <div className="flex gap-2 items-start pb-2">
            <span className="p-1 rounded bg-[#EBFDF4] text-emerald-600 shrink-0 mt-0.5">
              ✅
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-xs">Today's Operating Action Items</p>
              <ul className="text-xs text-slate-500 mt-1 list-disc pl-4 space-y-1">
                {dailyBrief.whatToReviewToday.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
