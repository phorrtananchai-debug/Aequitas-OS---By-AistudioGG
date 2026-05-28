import React, { useState } from 'react';
import { Coins, TrendingUp, Calendar, Check, ArrowUpRight, Percent, Info, Plus, Edit3, Trash2, X } from 'lucide-react';
import { Holding, DividendPlan, FinancialSettings, DividendPlanItem } from '../types';
import { calculateDividendStats, formatCurrency } from '../core/utils';

interface DividendsTabProps {
  dividendPlan: DividendPlan;
  onUpdateDividendPlan: (plan: DividendPlan) => void;
  holdings: Holding[];
  financialSettings: FinancialSettings;
}

export default function DividendsTab({ dividendPlan, onUpdateDividendPlan, holdings, financialSettings }: DividendsTabProps) {
  const [compoundYears, setCompoundYears] = useState<number>(5);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1500);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [editSource, setEditSource] = useState('');
  const [editYield, setEditYield] = useState('');
  const [editAnnual, setEditAnnual] = useState('');
  const [editFreq, setEditFreq] = useState('Monthly');
  const [editStatus, setEditStatus] = useState<'Reinvest' | 'Hold Cash' | 'Transfer'>('Reinvest');

  const dividendStats = calculateDividendStats(holdings);
  const initialPrincipal = holdings.reduce((acc, h) => acc + h.value, 0);
  const annualApy = dividendStats.weightedApy / 100;

  // Calculate compound interest
  // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n)) * (1 + r/n) (assuming payments at start of period)
  const calculateEstimate = () => {
    const P = initialPrincipal;
    const r = annualApy;
    const n = 12; // compounding monthly
    const t = compoundYears;
    const PMT = monthlyContribution;

    const baseAmount = P * Math.pow(1 + r/n, n * t);
    const annuityAmount = PMT * ((Math.pow(1 + r/n, n * t) - 1) / (r/n)) * (1 + r/n);

    return Math.round(baseAmount + annuityAmount);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSource) return;
    const newItem: DividendPlanItem = {
      id: `div-${Date.now()}`,
      ticker: editSource.split(' ')[0].toUpperCase(),
      name: editSource,
      yield: parseFloat(editYield) || 0,
      annualEst: parseFloat(editAnnual) || 0,
      frequency: editFreq,
      reinvestmentStatus: editStatus
    };
    onUpdateDividendPlan({
      ...dividendPlan,
      items: [...dividendPlan.items, newItem]
    });
    setIsAdding(false);
    resetForm();
  };

  const handleEdit = (item: DividendPlanItem) => {
    setEditingId(item.id);
    setEditSource(item.name);
    setEditYield(item.yield.toString());
    setEditAnnual(item.annualEst.toString());
    setEditFreq(item.frequency);
    setEditStatus(item.reinvestmentStatus);
  };

  const handleSaveEdit = (id: string) => {
    const nextItems = dividendPlan.items.map(item => item.id === id ? {
      ...item,
      name: editSource,
      ticker: editSource.split(' ')[0].toUpperCase(),
      yield: parseFloat(editYield) || 0,
      annualEst: parseFloat(editAnnual) || 0,
      frequency: editFreq,
      reinvestmentStatus: editStatus
    } : item);
    onUpdateDividendPlan({ ...dividendPlan, items: nextItems });
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete dividend rule for ${name}?`)) {
      onUpdateDividendPlan({
        ...dividendPlan,
        items: dividendPlan.items.filter(i => i.id !== id)
      });
    }
  };

  const resetForm = () => {
    setEditSource('');
    setEditYield('');
    setEditAnnual('');
    setEditFreq('Monthly');
    setEditStatus('Reinvest');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Title block */}
      <section className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            RECURRING CAPITAL GENERATOR
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Dividends & Yield
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Track upcoming dividend payouts, compound interest paths, and review recurring yield statistics.
          </p>
        </div>
        <button
          onClick={() => { setIsAdding(true); resetForm(); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 mb-1"
        >
          <Plus size={14} />
          Add Yield Rule
        </button>
      </section>

      {isAdding && (
        <div className="p-6 bg-blue-50/30 dark:bg-slate-900/40 border border-blue-200/50 dark:border-slate-800 rounded-3xl animate-slide-in">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={editSource} onChange={e => setEditSource(e.target.value)} placeholder="Source (e.g. VOO Dividends)" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
              <input value={editYield} onChange={e => setEditYield(e.target.value)} placeholder="Yield %" type="number" step="0.01" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
              <input value={editAnnual} onChange={e => setEditAnnual(e.target.value)} placeholder="Annual Est $" type="number" step="0.01" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={editFreq} onChange={e => setEditFreq(e.target.value)} className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs">
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
                <option value="Weekly">Weekly</option>
              </select>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value as any)} className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs">
                <option value="Reinvest">Reinvest</option>
                <option value="Hold Cash">Hold Cash</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">Save Rule</button>
            </div>
          </form>
        </div>
      )}

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Monthly Yield Est.</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{formatCurrency(dividendStats.monthlyEst, financialSettings)}</span>
          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2 flex items-center gap-0.5">
            <ArrowUpRight size={10} /> +4.2% from last cycle
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Weighted System APY</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{dividendStats.weightedApy.toFixed(2)}%</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Compounding active</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Upcoming Payout Scheduled</span>
          <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{formatCurrency(dividendStats.annualEst / 12, financialSettings)}</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 flex items-center gap-1">
            <Calendar size={10} /> June 1, 2026
          </p>
        </div>
      </div>

      {/* Table section: Dividend Events */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25">
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
              {dividendPlan.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No yield rules configured.</td>
                </tr>
              ) : (
                dividendPlan.items.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">
                        {isEditing ? 'EDITING' : item.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {isEditing ? (
                          <input value={editSource} onChange={e => setEditSource(e.target.value)} className="w-full bg-transparent border-b border-blue-500 focus:outline-none" />
                        ) : item.name}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">$</span>
                            <input value={editAnnual} onChange={e => setEditAnnual(e.target.value)} className="w-16 bg-transparent border-b border-blue-500 focus:outline-none text-right" />
                          </div>
                        ) : formatCurrency(item.annualEst, financialSettings)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {isEditing ? (
                          <select value={editFreq} onChange={e => setEditFreq(e.target.value)} className="bg-transparent focus:outline-none">
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Weekly">Weekly</option>
                          </select>
                        ) : item.frequency}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {isEditing ? (
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value as any)} className="bg-transparent focus:outline-none">
                            <option value="Reinvest">Reinvest</option>
                            <option value="Hold Cash">Hold Cash</option>
                          </select>
                        ) : item.reinvestmentStatus}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="p-1 text-slate-400"><X size={14}/></button>
                            <button onClick={() => handleSaveEdit(item.id)} className="p-1 text-emerald-600"><Check size={14}/></button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete(item.id, item.name)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 size={14}/></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yield compounding calculator (Bento block) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400 mb-2">
              <Percent size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Growth Estimator</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">compounding Target projections</h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal">
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
                  <span className="font-mono text-blue-600 font-bold">{formatCurrency(monthlyContribution, financialSettings)} / mo</span>
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
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{formatCurrency(calculateEstimate(), financialSettings)}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium text-left sm:text-right max-w-sm">
              Includes initial core balance of <strong className="text-slate-600 dark:text-slate-350">{formatCurrency(initialPrincipal, financialSettings)}</strong> compounding continuously at historical target weighting of <strong className="text-emerald-600">{(annualApy * 100).toFixed(2)}% APY</strong>.
            </div>
          </div>
        </div>

        {/* Compound note informational box (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Info size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Aequitas Note</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Automated Reallocation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
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
