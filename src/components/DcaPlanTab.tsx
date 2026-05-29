import { useState } from 'react';
import { Calendar, Layers, Clock, Plus, ArrowUpRight, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { DcaPlan, Holding } from '../types';

interface DcaPlanTabProps {
  dcaPlan: DcaPlan;
  holdings: Holding[];
  onUpdateDcaPlan: (plan: DcaPlan) => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
}

export default function DcaPlanTab({ dcaPlan, holdings, onUpdateDcaPlan, onTriggerAlert }: DcaPlanTabProps) {
  const [activeFrequency, setActiveFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  const handleUpdateContribution = (val: number) => {
    onUpdateDcaPlan({
      ...dcaPlan,
      monthlyContributionPlan: val
    });
  };

  const historicalContributions = [
    { date: 'May 20, 2026', total: dcaPlan.monthlyContributionPlan, breakdown: dcaPlan.items.slice(0, 3).map(i => `${i.ticker}: $${(i.targetAmount).toLocaleString()}`).join(' | '), status: 'COMPLETED' },
    { date: 'May 13, 2026', total: dcaPlan.monthlyContributionPlan, breakdown: dcaPlan.items.slice(0, 3).map(i => `${i.ticker}: $${(i.targetAmount).toLocaleString()}`).join(' | '), status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Introduction Greeting */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            DOLLAR-COST-AVERAGING PROTOCOL
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            DCA Accumulation Plan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Schedule automatic contributions, divide deposit splits across active assets, and view scheduled execution queues.
          </p>
        </div>
      </section>

      {/* Main Grid: Settings & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Planner Settings (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/45 mb-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-455">ACCUMULATION CONTROLLER</span>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Active DCA Settings</h3>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1 rounded-xl">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setActiveFrequency(freq)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeFrequency === freq 
                        ? 'bg-blue-600 text-white shadow-sm font-bold' 
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Config details */}
            <div className="space-y-6">
              <div className="space-y-1.5 text-xs font-bold text-slate-655 shrink-0">
                <div className="flex justify-between items-baseline">
                  <label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Recurring Monthly Contribution (USD)</label>
                  <span className="font-mono text-blue-600 font-bold">${dcaPlan.monthlyContributionPlan.toLocaleString()} / mo</span>
                </div>
                <input 
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={dcaPlan.monthlyContributionPlan}
                  onChange={(e) => handleUpdateContribution(parseInt(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Weight split feedback */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Splitting Ledger</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dcaPlan.items.map((item) => {
                    const percentage = ((item.targetAmount / dcaPlan.monthlyContributionPlan) * 100).toFixed(1);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-905/30 border border-slate-100 dark:border-slate-805/5 rounded-xl text-xs font-sans">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100/40 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold tracking-wider">
                            {item.ticker.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.ticker}</span>
                            <span className="text-[10px] text-slate-400 block">{item.interval} Deployment</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">${item.targetAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-805/10 flex justify-between items-center bg-transparent">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">DCA STATUS: {dcaPlan.items.every(i => i.status === 'Completed') ? 'OPTIMIZED' : 'PENDING EXECUTION'}</span>
            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              <span>View full schedules</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* DCA Information Sidebar (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
                PLAN SUMMARY
              </span>
              <h3 className="text-base font-bold mt-1 text-slate-900 dark:text-white">Execution Status</h3>
              <p className="text-xs text-slate-455 mt-1">Next capital deployment tracking.</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-100/50 dark:bg-slate-900/35 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-widest">Next Scheduled Run</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{dcaPlan.nextContributionReminder}</span>
                <p className="text-[10px] text-slate-455 leading-normal mt-1">
                  Manual validation required for multi-asset execution.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/30 border border-emerald-100/30 dark:bg-emerald-950/10 dark:border-emerald-800/20 rounded-xl flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Ledger Compliance Pass</h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-500 leading-normal mt-0.5">
                    Funding accounts verified at <strong className="text-emerald-600">${dcaPlan.cashAvailable.toLocaleString()}</strong> cash available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Historical logs Section */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 bg-slate-500/5">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-455">Historical Accumulations</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-500/5 text-[10px] tracking-widest font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-805/10">
                <th className="px-6 py-4">TRANSACTION DATE</th>
                <th className="px-6 py-4">CONTRIBUTED TOTAL</th>
                <th className="px-6 py-4">SPLIT MATRIX</th>
                <th className="px-6 py-4 text-right">LEDGER RECORD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-sans text-xs">
              {historicalContributions.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{log.date}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">${log.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono italic truncate max-w-xs">{log.breakdown}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 px-2.5 py-1 rounded-full border border-emerald-100/40">
                      RESOLVED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
