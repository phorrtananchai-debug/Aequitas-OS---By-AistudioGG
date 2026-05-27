import { useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Clock, 
  AlertOctagon,
  Search,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  FileJson
} from 'lucide-react';
import { ActivityItem, AlertItem } from '../types';

interface ActivityProps {
  activities: ActivityItem[];
  searchQuery: string;
  onClearActivities: () => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function ActivityTab({
  activities,
  searchQuery,
  onClearActivities,
  onTriggerAlert
}: ActivityProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const safeActivities = activities || [];

  const filteredActivities = safeActivities.filter(act => {
    const matchesSearch = 
      (act.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && act.type.toLowerCase() === filterType.toLowerCase();
  });

  const triggerExportLogs = () => {
    onTriggerAlert({
      type: 'success',
      typeLabel: 'LOGS EXPORTED',
      title: 'Activity Ledger Exported',
      description: 'Unified planning activities fully saved in structured JSON context. Compatible with AI model audits.'
    });
  };

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'hold':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      case 'review':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400';
      case 'manual action':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400';
      case 'contribution':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'reduce':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  const categories = ['all', 'Contribution', 'Review', 'Manual Action', 'Hold', 'Reduce'];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pb-12 font-sans">
      
      {/* Tab head */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Human-controlled Settle Audit Trail
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Activity Planning Audit
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Audit logs tracking past DCA changes, local weight reconciliations, and imported AI structural guidance logs.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 self-end sm:self-auto font-sans">
          {safeActivities.length > 0 && (
            <button
              onClick={onClearActivities}
              className="px-3.5 py-2 hover:bg-rose-500/10 hover:text-rose-600 border border-transparent hover:border-rose-200/40 rounded-xl text-xs font-bold text-slate-400 active:scale-98 transition-all"
            >
              Clear Audit Log
            </button>
          )}
          <button
            onClick={triggerExportLogs}
            className="px-4 py-2 hover:border-blue-500 hover:text-blue-600 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-350 flex items-center gap-1.5 active:scale-98 transition-all"
          >
            <Download size={14} />
            Export Audit
          </button>
        </div>
      </section>

      {/* Main body Table card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white">
        
        {/* Filter triggers strip */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-slate-50">
          <div className="flex bg-slate-100/85 p-1 rounded-xl w-fit flex-wrap">
            {categories.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  filterType.toLowerCase() === type.toLowerCase()
                    ? 'bg-white text-blue-600 shadow-sm font-bold' 
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-450 font-mono font-bold">Audit records: {filteredActivities.length} Operations</span>
        </div>

        {/* Real trades database rows */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 dark:border-slate-800/5">
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">OPERATION ID</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">CATEGORY</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">OP DETAILS DESCRIPTION</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase font-mono text-center">VALUE DELTA</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase text-center">SYNC SOURCE</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase">SETTLE DATE</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-black text-slate-400 uppercase text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs font-sans">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400">No operations entered yet in this workspace.</td>
                </tr>
              ) : (
                filteredActivities.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{log.id}</td>
                      
                      <td className="px-6 py-4">
                        <span className={`text-[9px] uppercase font-bold px-2.5 py-1 rounded-full ${getCategoryColor(log.type)}`}>
                          {log.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 dark:text-white">
                          <span className="font-mono text-xs font-bold text-blue-600 mr-2">[{log.asset}]</span>
                          {log.notes || 'No notes provided'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center font-mono font-medium text-slate-900 dark:text-white">
                        {log.amount !== undefined ? (
                          log.amount === 0 ? (
                            <span className="text-slate-400">Neutral</span>
                          ) : (
                            <span className="text-slate-950 dark:text-slate-50 font-bold">
                              ${log.amount.toLocaleString()}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-slate-500">
                        {log.type === 'Review' ? 'AI AUDIT' : 'LOCAL WORKSPACE'}
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-450 dark:text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                          RECONCILED
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
