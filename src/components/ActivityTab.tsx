import React from 'react';
import { 
  Plus,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { ActivityItem, AlertItem } from '../types';
import { safeToLocaleString } from '../core/utils';

interface ActivityTabProps {
  activities: ActivityItem[];
  searchQuery: string;
  onClearActivities: () => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function ActivityTab({ activities, searchQuery, onClearActivities, onTriggerAlert }: ActivityTabProps) {

  const safeActivities = Array.isArray(activities) ? activities : [];

  const filtered = safeActivities.filter(act => {
    if (!act) return false;
    const sQuery = (searchQuery || '').toLowerCase();
    return (
      (act.asset || '').toLowerCase().includes(sQuery) ||
      (act.type || '').toLowerCase().includes(sQuery) ||
      (act.notes || '').toLowerCase().includes(sQuery) ||
      (act.status || '').toLowerCase().includes(sQuery)
    );
  });

  const handleClear = () => {
    if (window.confirm("Permanently purge all manual ledger activity history?")) {
      onClearActivities();
      onTriggerAlert({
        type: 'advisory',
        typeLabel: 'LEDGER PURGED',
        title: 'Activity History Cleared',
        description: 'All local activity records have been permanently removed from the ledger.'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12 font-sans">
      
      {/* Introduction Greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Sovereign Transaction Log
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Manual Ledger Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Audit manual contributions, rebalance events, and status updates. This log is stored entirely in your local browser cache.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
        >
          <Trash2 size={14} />
          Purge History
        </button>
      </section>

      {/* Main Activity List */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white text-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 flex justify-between items-center bg-slate-500/5">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-550">Historical Registry</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {filtered.length} Records found
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-500/5 border-b border-slate-100 text-[10px] tracking-widest font-black text-slate-400 uppercase">
                <th className="px-6 py-4">TIMESTAMP</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">ASSET</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">NOTES / CONTEXT</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs">
              {filtered.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No activity records found matching active filter.</td>
                </tr>
              ) : filtered.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">{act.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      act.type === 'Contribution' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {act.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{act.asset}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {act.amount ? `$${safeToLocaleString(act.amount)}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">
                    {act.notes || 'No context provided.'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 bg-emerald-50 px-2 py-1 rounded-full">
                      {act.status}
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
