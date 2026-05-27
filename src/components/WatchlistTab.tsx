import { TrendingUp } from 'lucide-react';
import { WatchlistItem, AlertItem } from '../types';
import { useState } from 'react';

interface WatchlistTabProps {
  watchlist: WatchlistItem[];
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function WatchlistTab({ watchlist, onTriggerAlert }: WatchlistTabProps) {
  const [filterRisk, setFilterType] = useState<string>('all');

  const filteredWatchlist = watchlist.filter(item => {
    if (filterRisk === 'all') return true;
    return item.riskLevel.toLowerCase() === filterRisk.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          AEQUITAS STRATEGIC MONITORING
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Asset Watchlist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
          Maintain continuity of potential entry targets. Review AI observations on risk-adjusted zones and behavior anchoring assets.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/5">
          {['all', 'low', 'medium', 'high'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterType(lvl)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterRisk === lvl
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              {lvl} Risk
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlist.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-900/10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            No assets found in the selected risk category.
          </div>
        ) : (
          filteredWatchlist.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/25 shadow-sm hover:shadow-md transition-all flex flex-col justify-between bg-white dark:bg-slate-900/20">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 font-bold text-sm tracking-tighter border border-blue-100/50 dark:border-blue-800/20">
                    {item.ticker}
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                    item.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.riskLevel} Risk
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Entry Zone</span>
                  <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{item.targetEntryZone}</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-455 uppercase block mb-1">User Notes</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.notes}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-bold text-blue-600/80 uppercase block mb-1 flex items-center gap-1">
                      <TrendingUp size={10} /> AI Observation
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 italic leading-relaxed">{item.aiObservation}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onTriggerAlert({
                  type: 'monitoring',
                  typeLabel: 'WATCHLIST SYNC',
                  title: `${item.ticker} Alert Active`,
                  description: `Subscribed to threshold alerts for entry at ${item.targetEntryZone}.`
                })}
                className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"
              >
                Toggle Price Alert
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
