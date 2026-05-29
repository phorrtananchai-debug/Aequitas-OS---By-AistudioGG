import React from 'react';
import {
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  RefreshCw,
  MoreVertical,
  Check
} from 'lucide-react';
import { DcaPlan, Holding, AlertItem } from '../types';
import { safeToLocaleString, safeToFixed } from '../core/utils';

interface DcaPlanTabProps {
  dcaPlan: DcaPlan;
  onUpdateDcaPlan: (plan: DcaPlan) => void;
  holdings: Holding[];
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function DcaPlanTab({ dcaPlan, onUpdateDcaPlan, holdings, onTriggerAlert }: DcaPlanTabProps) {

  const handleUpdateAmount = (id: string, amount: number) => {
    if (!dcaPlan) return;
    const nextItems = (dcaPlan.items || []).map(item => {
      if (item && item.id === id) {
        return { ...item, targetAmount: amount };
      }
      return item;
    });
    onUpdateDcaPlan({ ...dcaPlan, items: nextItems });
  };

  const handleToggleStatus = (id: string) => {
    if (!dcaPlan) return;
    const nextItems = (dcaPlan.items || []).map(item => {
      if (item && item.id === id) {
        const nextStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...item, status: nextStatus as any };
      }
      return item;
    });
    onUpdateDcaPlan({ ...dcaPlan, items: nextItems });

    onTriggerAlert({
      type: 'success',
      typeLabel: 'DCA UPDATED',
      title: 'Contribution Status Toggled',
      description: 'Monthly accumulation record has been updated locally.'
    });
  };

  const totalDca = (dcaPlan?.items || []).reduce((sum, item) => sum + (item?.targetAmount || 0), 0);
  const safeItems = Array.isArray(dcaPlan?.items) ? dcaPlan.items : [];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12 font-sans">

      {/* Introduction Greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            RECURRING ACCUMULATION ENGINE
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            DCA Contribution Plan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Manage your monthly capital injections. Align new flows toward underweight positions to resolve drift naturally without selling core assets.
          </p>
        </div>
      </section>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25 bg-white text-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455 block mb-1">Total Monthly Target</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${safeToLocaleString(totalDca)}</span>
          <p className="text-[10px] text-blue-600 font-bold uppercase mt-2 flex items-center gap-0.5">
            <Calendar size={10} /> Next: {dcaPlan?.nextContributionReminder || 'Not Set'}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25 bg-white text-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455 block mb-1">Available Cash Buffer</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">${safeToLocaleString(dcaPlan?.cashAvailable || 0)}</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Held for next cycle</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25 bg-white text-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455 block mb-1">Execution Progress</span>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-2xl font-bold tracking-tight text-emerald-600">
               {safeItems.length > 0 ? Math.round((safeItems.filter(i => i && i.status === 'Completed').length / safeItems.length) * 100) : 0}%
             </span>
             <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${safeItems.length > 0 ? (safeItems.filter(i => i && i.status === 'Completed').length / safeItems.length) * 100 : 0}%` }}
                />
             </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Active Month Status</p>
        </div>
      </div>

      {/* Main DCA Ledger Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white text-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 flex justify-between items-center bg-slate-500/5">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-550">Active Contribution Matrix</span>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
            <Plus size={16} />
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-500/5 border-b border-slate-100 text-[10px] tracking-widest font-black text-slate-400 uppercase">
                <th className="px-6 py-4">TICKER</th>
                <th className="px-6 py-4">ASSET NAME</th>
                <th className="px-6 py-4">CONTRIBUTION TARGET</th>
                <th className="px-6 py-4">INTERVAL</th>
                <th className="px-6 py-4">PRIORITY</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs">
              {safeItems.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No DCA items configured. Start by adding a target asset.</td>
                </tr>
              ) : safeItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{item.ticker}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">${safeToLocaleString(item.targetAmount)}</span>
                      <div className="flex-grow max-w-[80px]">
                         <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={item.targetAmount}
                          onChange={(e) => handleUpdateAmount(item.id, parseInt(e.target.value))}
                          className="accent-blue-600 h-1 w-full bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{item.interval}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.priorityOrder <= 2 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      Priority {item.priorityOrder}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ml-auto border ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {item.status === 'Completed' ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border-2 border-slate-200" />}
                      {item.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actionable Rebalancing Guidance Box */}
      <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Resolve Portfolio Drift via DCA</h3>
          <p className="text-blue-100 text-sm max-w-xl">
            Aequitas detected a 3.2% drift in your Growth Layer. We suggest increasing your monthly VOO contribution by $300 to naturally re-balance without triggering tax events.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-blue-600 font-black text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-blue-50 active:scale-95 transition-all">
          Apply Suggested Splits
        </button>
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
