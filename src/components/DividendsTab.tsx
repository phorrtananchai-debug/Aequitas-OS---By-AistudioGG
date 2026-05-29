import { useState } from 'react';
import { Coins, TrendingUp, Calendar, Check, ArrowUpRight, Percent, Info } from 'lucide-react';
import { DividendPlan, Holding } from '../types';
import { calculateDividendStats } from '../core/utils';

interface DividendsTabProps {
  dividendPlan: DividendPlan;
  holdings: Holding[];
  onUpdateDividendPlan: (plan: DividendPlan) => void;
}

export default function DividendsTab({ dividendPlan, holdings, onUpdateDividendPlan }: DividendsTabProps) {
  const [compoundYears, setCompoundYears] = useState<number>(5);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1500);

  const stats = calculateDividendStats(holdings);
  const portfolioValue = holdings.reduce((acc, h) => acc + (h.value || 0), 0);

  // Calculate compound interest
  // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n)) * (1 + r/n)
  const calculateEstimate = () => {
    const P = portfolioValue;
    const r = stats.weightedApy / 100;
    const n = 12; // compounding monthly
    const t = compoundYears;
    const PMT = monthlyContribution;

    if (r === 0) return P + (PMT * 12 * t);

    const baseAmount = P * Math.pow(1 + r/n, n * t);
    const annuityAmount = PMT * ((Math.pow(1 + r/n, n * t) - 1) / (r/n)) * (1 + r/n);

    return Math.round(baseAmount + annuityAmount);
  };

  const dividendEvents = (holdings || [])
    .filter(h => h.dividendYield && h.dividendYield > 0)
    .map(h => ({
      id: `DIV-${h.ticker}`,
      source: h.name,
      amount: (h.value * (h.dividendYield || 0) / 100) / 4, // Simple quarterly est
      frequency: 'Quarterly',
      estimateDate: 'Next Cycle',
      status: 'PENDING'
    }))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Title block */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          RECURRING CAPITAL GENERATOR
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Dividends & Yield
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Track upcoming dividend payouts, compound interest paths, and review recurring yield statistics.
        </p>
      </section>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Monthly Yield Est.</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${stats.monthlyEst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2 flex items-center gap-0.5">
            <ArrowUpRight size={10} /> Derived from live yields
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Weighted System APY</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.weightedApy.toFixed(2)}%</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Compounding active</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Annualized Income Est.</span>
          <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">${stats.annualEst.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 flex items-center gap-1">
            <Calendar size={10} /> Core projection
          </p>
        </div>
      </div>

      {/* Table section: Dividend Events */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 flex justify-between items-center bg-slate-500/5">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-550">Compounding Ledger Log</span>
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 scale-90">Auto Reinvest Active</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-500/5 text-[10px] tracking-widest font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800/10">
                <th className="px-6 py-4">PLAN ID</th>
                <th className="px-6 py-4">SOURCE YIELD CHANNEL</th>
                <th className="px-6 py-4">EST. DISTRIBUTION</th>
                <th className="px-6 py-4">FREQUENCY</th>
                <th className="px-6 py-4">SCHEDULED DATE</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-sans text-xs">
              {dividendEvents.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">{event.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{event.source}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">${event.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500">{event.frequency}</td>
                  <td className="px-6 py-4 text-slate-500">{event.estimateDate}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black tracking-wider uppercase ${
                      event.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yield compounding calculator (Bento block) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 flex flex-col justify-between shadow-sm bg-white">
          <div>
            <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400 mb-2">
              <Percent size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Growth Estimator</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">compounding Target projections</h3>
            <p className="text-xs text-slate-450 mt-1 leading-normal">
              Adjust parameters to forecast core wealth accumulation over future cycles at active yield levels.
            </p>

            <div className="space-y-6 mt-6">
              <div className="space-y-1.5 text-xs font-bold text-slate-655 shrink-0">
                <div className="flex justify-between items-baseline">
                  <label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Compound horizon timeline</label>
                  <span className="font-mono text-blue-600 font-bold">{compoundYears} Years</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  value={compoundYears}
                  onChange={(e) => setCompoundYears(parseInt(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 text-xs font-bold text-slate-655 shrink-0">
                <div className="flex justify-between items-baseline">
                  <label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Estimated Monthly DCA Contribution (USD)</label>
                  <span className="font-mono text-blue-600 font-bold">${monthlyContribution.toLocaleString()} / mo</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="10000"
                  step="250"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-blue-50/20 dark:bg-slate-900/10 border border-blue-105/20 dark:border-slate-800/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-black block tracking-widest">Projected Core Value ({compoundYears}yr)</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">${calculateEstimate().toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-450 font-medium text-left sm:text-right max-w-sm">
              Includes initial core balance of <strong className="text-slate-900 dark:text-slate-50">${portfolioValue.toLocaleString()}</strong> compounding continuously at historical target weighting of <strong className="text-emerald-600">{stats.weightedApy.toFixed(2)}% APY</strong>.
            </div>
          </div>
        </div>

        {/* Compound note informational box (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Info size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Aequitas Note</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Automated Reallocation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
              Distribution proceeds are aggregated inside the core wallet and directed back to DCA planners to buy target assets automatically. This reduces manual transactions and keeps allocations aligned.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-805/10 text-[10px] uppercase font-mono font-bold text-slate-400 text-center tracking-wider">
            Reinvesting on Ethereum & Solana
          </div>
        </div>
      </div>
    </div>
  );
}
