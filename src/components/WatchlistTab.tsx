import React, { useState } from 'react';
import { TrendingUp, Plus, Edit3, Trash2, X, Check } from 'lucide-react';
import { WatchlistItem, AlertItem } from '../types';

interface WatchlistTabProps {
  watchlist: WatchlistItem[];
  onUpdateWatchlist: (next: WatchlistItem[]) => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function WatchlistTab({ watchlist, onUpdateWatchlist, onTriggerAlert }: WatchlistTabProps) {
  const [filterRisk, setFilterType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [editTicker, setEditTicker] = useState('');
  const [editName, setEditName] = useState('');
  const [editZone, setEditZone] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editRisk, setEditRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const safeWatchlist = watchlist || [];

  const filteredWatchlist = safeWatchlist.filter(item => {
    if (filterRisk === 'all') return true;
    return item.riskLevel.toLowerCase() === filterRisk.toLowerCase();
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTicker) return;
    const newItem: WatchlistItem = {
      id: `w-${Date.now()}`,
      ticker: editTicker.toUpperCase(),
      name: editName || editTicker.toUpperCase(),
      targetEntryZone: editZone,
      notes: editNotes,
      aiObservation: 'Pending audit...',
      riskLevel: editRisk
    };
    onUpdateWatchlist([...safeWatchlist, newItem]);
    setIsAdding(false);
    resetForm();
  };

  const handleEdit = (item: WatchlistItem) => {
    setEditingId(item.id);
    setEditTicker(item.ticker);
    setEditName(item.name);
    setEditZone(item.targetEntryZone);
    setEditNotes(item.notes);
    setEditRisk(item.riskLevel);
  };

  const handleSaveEdit = (id: string) => {
    const next = safeWatchlist.map(w => w.id === id ? {
      ...w,
      ticker: editTicker.toUpperCase(),
      name: editName,
      targetEntryZone: editZone,
      notes: editNotes,
      riskLevel: editRisk
    } : w);
    onUpdateWatchlist(next);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string, ticker: string) => {
    if (window.confirm(`Remove ${ticker} from watchlist?`)) {
      onUpdateWatchlist(safeWatchlist.filter(w => w.id !== id));
    }
  };

  const resetForm = () => {
    setEditTicker('');
    setEditName('');
    setEditZone('');
    setEditNotes('');
    setEditRisk('Medium');
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      <section className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            AEQUITAS STRATEGIC MONITORING
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Asset Watchlist
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Maintain continuity of potential entry targets. Review AI observations on risk-adjusted zones and behavior anchoring assets.
          </p>
        </div>
        <button
          onClick={() => { setIsAdding(true); resetForm(); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 mb-1"
        >
          <Plus size={14} />
          Add Target
        </button>
      </section>

      {isAdding && (
        <div className="p-6 bg-blue-50/30 dark:bg-slate-900/40 border border-blue-200/50 dark:border-slate-800 rounded-3xl animate-slide-in">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={editTicker} onChange={e => setEditTicker(e.target.value)} placeholder="Ticker" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
              <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
              <select value={editRisk} onChange={e => setEditRisk(e.target.value as any)} className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs">
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={editZone} onChange={e => setEditZone(e.target.value)} placeholder="Entry Zone (e.g. $150 - $160)" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
              <input value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes" className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">Save Target</button>
            </div>
          </form>
        </div>
      )}

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
          (filteredWatchlist || []).map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/25 shadow-sm hover:shadow-md transition-all flex flex-col justify-between bg-white dark:bg-slate-900/20">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 font-bold text-sm tracking-tighter border border-blue-100/50 dark:border-blue-800/20">
                      {isEditing ? (
                        <input value={editTicker} onChange={e => setEditTicker(e.target.value)} className="w-full bg-transparent text-center focus:outline-none" />
                      ) : item.ticker}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isEditing ? (
                        <select value={editRisk} onChange={e => setEditRisk(e.target.value as any)} className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-slate-100 dark:bg-slate-800">
                          <option value="Low">Low Risk</option>
                          <option value="Medium">Medium Risk</option>
                          <option value="High">High Risk</option>
                        </select>
                      ) : (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          item.riskLevel === 'High' ? 'bg-rose-50 text-rose-600' :
                          item.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {item.riskLevel} Risk
                        </span>
                      )}

                      {!isEditing && (
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-blue-600"><Edit3 size={12} /></button>
                          <button onClick={() => handleDelete(item.id, item.ticker)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg mb-4 text-sm" />
                  ) : (
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  )}

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Entry Zone</span>
                    {isEditing ? (
                      <input value={editZone} onChange={e => setEditZone(e.target.value)} className="w-full text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-transparent focus:outline-none" />
                    ) : (
                      <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{item.targetEntryZone}</span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-455 uppercase block mb-1">User Notes</span>
                      {isEditing ? (
                        <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="w-full text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl resize-none" rows={2} />
                      ) : (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.notes}</p>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40">
                        <span className="text-[10px] font-bold text-blue-600/80 uppercase block mb-1 flex items-center gap-1">
                          <TrendingUp size={10} /> AI Observation
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-455 italic leading-relaxed">{item.aiObservation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setEditingId(null)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase flex items-center justify-center gap-1"><X size={12}/> Cancel</button>
                    <button onClick={() => handleSaveEdit(item.id)} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase flex items-center justify-center gap-1"><Check size={12}/> Save</button>
                  </div>
                ) : (
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
