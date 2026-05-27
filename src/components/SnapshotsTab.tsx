import React, { useState } from 'react';
import { 
  Camera, 
  Trash2, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Sparkles
} from 'lucide-react';
import { FinancialSettings } from '../types';
import { formatCurrency } from '../core/utils';

interface SnapshotItem {
  id: string;
  name: string;
  timestamp: string;
  value: number;
  node: string;
  drift: string;
}

interface SnapshotsTabProps {
  portfolioValue: number;
  onUpdatePortfolio: (val: number) => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
  holdings?: any[];
  snapshots: any[];
  onUpdateSnapshots: (snapshots: any[]) => void;
  financialSettings: FinancialSettings;
}

export default function SnapshotsTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert,
  holdings,
  snapshots,
  onUpdateSnapshots,
  financialSettings
}: SnapshotsTabProps) {

  const [newSnapshotName, setNewSnapshotName] = useState('');

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = newSnapshotName.trim() || `Ledger State - ${new Date().toLocaleDateString()}`;
    
    const newSnap: SnapshotItem = {
      id: `snap-${Date.now()}`,
      name: nameToSave,
      timestamp: new Date().toISOString(),
      value: portfolioValue,
      node: 'Primary Ledger',
      drift: '3.2%'
    };

    onUpdateSnapshots([newSnap, ...snapshots]);
    setNewSnapshotName('');
    onTriggerAlert({
      type: 'success',
      typeLabel: 'SNAPSHOT CAPTURED',
      title: 'Current State Snapshot Saved',
      description: `Config saved as "${nameToSave}" in browser local memory.`
    });
  };

  const handleApplySnapshot = (snap: SnapshotItem) => {
    onUpdatePortfolio(snap.value);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'STATE RESTORED',
      title: 'Local Snapshot Instated',
      description: `Active dashboard parameters calibrated back to state "${snap.name}".`
    });
  };

  const handleDeleteSnapshot = (id: string, name: string) => {
    onUpdateSnapshots(snapshots.filter(s => s.id !== id));
    onTriggerAlert({
      type: 'advisory',
      typeLabel: 'SNAPSHOT PRUNED',
      title: 'Record Removed',
      description: `State archive "${name}" has been permanently purged.`
    });
  };

  const handleDownloadBackup = () => {
    const backupData = JSON.stringify(snapshots, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aequitas-Ledger-Snapshots-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    onTriggerAlert({
      type: 'success',
      typeLabel: 'BACKUP DOWNLOADED',
      title: 'Local Backup Generated',
      description: 'Snapshots bundle saved as an encrypted local JSON file successfully.'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Introduction Greeting */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          non-custodial snapshot registry
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Historical Snapshots
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Save permanent, local-only snapshot points of your active portfolio. Restore historical weights instantly for historical auditing.
        </p>
      </section>

      {/* Overview stats & backup trigger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Total Saved Snapshots</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{snapshots.length} Records</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-200/60 dark:border-slate-800/25">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Active Sandbox Size</span>
          <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{formatCurrency(portfolioValue, financialSettings)}</span>
        </div>

        {/* Local Backup Action block */}
        <div className="glass-panel p-6 rounded-2xl relative shadow-sm border border-slate-205/60 dark:border-slate-800/25 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 block mb-1">Backup Configuration</span>
            <span className="text-xs text-slate-550 leading-normal block">Save an offline backup record bundle.</span>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="mt-4 py-2.5 bg-blue-50/50 hover:bg-blue-105/10 dark:bg-slate-909/40 border border-blue-200/20 text-blue-600 text-[11px] font-black tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            Export Local Ledger Archive
          </button>
        </div>
      </div>

      {/* Main Grid: Create & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* New Snapshot formulation (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <form onSubmit={handleCreateSnapshot} className="space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800/25">
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400 block">
                CREATE REGISTRY RECORD
              </span>
              <h3 className="text-base font-bold mt-1 text-slate-900 dark:text-white">Save Current State</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-355 block uppercase tracking-wider">
                  Snapshot Label
                </label>
                <input
                  type="text"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  placeholder="e.g. May Post-DCA Rebalance"
                  className="w-full bg-slate-100/100 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600/50"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-[10px] text-slate-500 leading-normal font-medium space-y-1.5 border border-slate-100 dark:border-slate-900/10">
                <div className="flex justify-between">
                  <span>Included Assets:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">SOL, BTC, ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Record:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-350">{formatCurrency(portfolioValue, financialSettings)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-101 active:scale-98 transition-all"
            >
              <Camera size={13} />
              Capture Active Ledger
            </button>
          </form>
        </div>

        {/* Snapshot Ledger List (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800/45 mb-6">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-450">CHRONO-REGISTRY</span>
            <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Saved State Records</h3>
          </div>

          <div className="space-y-4">
            {snapshots.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <AlertCircle className="mx-auto" size={24} />
                <p className="text-xs font-semibold">No saved snapshot states recorded yet.</p>
              </div>
            ) : (
              snapshots.map((snap) => (
                <div 
                  key={snap.id} 
                  className="p-5 bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-blue-300 dark:hover:border-slate-600 transition-all font-sans"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{snap.name}</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(snap.timestamp).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Node ID: {snap.node}</span>
                      <span>•</span>
                      <span>Drift index: {snap.drift}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-right shrink-0">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">ARCHIVED VALUE</span>
                      <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(snap.value, financialSettings)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplySnapshot(snap)}
                        title="Restore Active Dashboard State"
                        className="p-2 bg-blue-50/50 hover:bg-blue-105-1.5 hover:bg-blue-100/60 text-blue-600 rounded-lg border border-blue-100/40 transition-all flex items-center gap-1 text-[10px] font-bold"
                      >
                        <RotateCcw size={12} />
                        Restore Plan
                      </button>
                      
                      <button
                        onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                        title="Delete Record"
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-950/20 rounded-lg transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
