import { useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Clock, 
  AlertOctagon,
  Search,
  Download
} from 'lucide-react';
import { TradeLog, AlertItem } from '../types';

interface ActivityProps {
  trades: TradeLog[];
  searchQuery: string;
  onClearTrades: () => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function ActivityTab({
  trades,
  searchQuery,
  onClearTrades,
  onTriggerAlert
}: ActivityProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = 
      trade.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && trade.type.toLowerCase() === filterType;
  });

  const triggerExportLogs = () => {
    onTriggerAlert({
      type: 'success',
      typeLabel: 'LOGS DOWNLOADED',
      title: 'Activity Clearings Exported',
      description: 'Simulated activity logs fully bundled and saved to CSV format successfully.'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pb-12">
      
      {/* Tab head */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
        <div>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors">
            Activity Planning Logs
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Historical trace limits of allocations, plan reviews, and portfolio structural changes.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 self-end sm:self-auto">
          {trades.length > 0 && (
            <button
              onClick={onClearTrades}
              className="px-3.5 py-2 hover:bg-rose-500/10 hover:text-rose-650 border border-transparent hover:border-rose-500/20 rounded-xl text-xs font-bold font-sans text-slate-450 active:scale-98 transition-all"
            >
              Clear Logs
            </button>
          )}
          <button
            onClick={triggerExportLogs}
            className="px-4 py-2 hover:border-blue-500 hover:text-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 flex items-center gap-1.5 active:scale-98 transition-all"
          >
            <Download size={14} />
            Export Logs
          </button>
        </div>
      </section>

      {/* Main body Table card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25">
        
        {/* Filter triggers strip */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-slate-500/5">
          <div className="flex bg-slate-100/80 dark:bg-slate-900/40 p-1 rounded-xl w-fit">
            {['all', 'buy', 'sell'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  filterType === type 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Records tracked: {filteredTrades.length} Clearings</span>
        </div>

        {/* Real trades database rows */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-500/5 border-b border-white/10 dark:border-slate-800/5">
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">TX / ID</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">TYPE</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">ASSET</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">VOLUME</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase font-mono">PRICE (USD)</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">TOTAL SIZE</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">SETTLE TIME</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-slate-400">No simulated trade logs logged yet. Use &quot;Review Plan&quot; to trace transactions.</td>
                </tr>
              ) : (
                filteredTrades.map((log) => {
                  const isBuy = log.type === 'BUY';
                  return (
                    <tr key={log.id} className="hover:bg-slate-500/5 transition-colors font-sans">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{log.id}</td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                          isBuy 
                            ? 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-450' 
                            : 'bg-rose-450/10 text-rose-500'
                        }`}>
                          {isBuy ? <ArrowDownLeft size={11} strokeWidth={2.5} /> : <ArrowUpRight size={11} strokeWidth={2.5} />}
                          {log.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-extrabold text-slate-850 dark:text-white uppercase">{log.asset}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-700 dark:text-slate-300">{log.amount.toLocaleString()}</td>
                      
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800 dark:text-slate-300">
                        ${log.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </td>

                      <td className="px-6 py-4 text-xs font-mono font-extrabold text-slate-900 dark:text-indigo-400">
                        ${log.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-6 py-4 text-[11px] font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-black text-emerald-500">
                          <CheckCircle size={10} fill="currentColor" stroke="white" />
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
