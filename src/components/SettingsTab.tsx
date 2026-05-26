import { useState, FormEvent } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Cpu, Save, RefreshCw, KeyRound, Server } from 'lucide-react';

interface SettingsTabProps {
  portfolioValue: number;
  onUpdatePortfolio: (val: number) => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
}

export default function SettingsTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert
}: SettingsTabProps) {
  const [ledgerVal, setLedgerVal] = useState<string>(portfolioValue.toString());
  const [nodeId, setNodeId] = useState<string>('sol-09');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveParameters = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const numericVal = parseFloat(ledgerVal);
      if (!isNaN(numericVal) && numericVal > 0) {
        onUpdatePortfolio(numericVal);
        onTriggerAlert({
          type: 'success',
          typeLabel: 'LEDGER CONFIGURED',
          title: 'Core Parameters Resolved',
          description: `Consensus ledger base size calibrated securely to $${numericVal.toLocaleString()} USD.`
        });
      }
      setIsSaving(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Introduction Greeting */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          Wealth Operating System Controller
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          System Core Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Calibrate system ledger dimensions, coordinate API parameters, and adjust active node configurations.
        </p>
      </section>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Form Block (8 Columns) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm border border-slate-205/60 dark:border-slate-800/25">
          <form onSubmit={handleSaveParameters} className="space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800/45">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-450">LEDGER COORDINATOR</span>
              <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Admin Parameters</h3>
            </div>

            {/* Input 1: Capital size */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-355 block uppercase tracking-wider">
                Capital Ledger Base Size (USD)
              </label>
              <input
                type="number"
                value={ledgerVal}
                onChange={(e) => setLedgerVal(e.target.value)}
                className="w-full bg-slate-100/100 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600/50"
              />
            </div>

            {/* Input 2: Node Identification */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-355 block uppercase tracking-wider">
                Consensus RPC Node Target ID
              </label>
              <select
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                className="w-full bg-slate-100/100 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-950 dark:text-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600/50"
              >
                <option value="sol-09">sol-09 (Primary Active Solana RPC)</option>
                <option value="eth-03">eth-03 (Backup Ethereum Validator)</option>
                <option value="btc-01">btc-01 (Sovereign Bitcoin Index RPC)</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 bg-blue-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-none hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Calibrating System Ledgers...
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Core Parameters
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / Health checklist Sidebar (4 Columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
                HEALTH & AUDITING
              </span>
              <h3 className="text-base font-bold mt-1 text-slate-900 dark:text-white">OS Diagnostics</h3>
              <p className="text-xs text-slate-450 mt-1">Consensus checks.</p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-805/10">
                <span className="font-semibold">Node consensus ping</span>
                <span className="font-mono text-emerald-600 font-bold">12ms (Pass)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-805/10">
                <span className="font-semibold">Encryption level</span>
                <span className="font-mono text-slate-500">AES-GCM-256</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-805/10">
                <span className="font-semibold">Active Ledger sync</span>
                <span className="font-mono text-blue-600 font-bold">100% Resolved</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/20 border border-amber-100/20 rounded-xl flex items-start gap-2 text-xs">
              <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400">Access Key Restriction</h4>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 leading-normal mt-0.5">
                  Ledger edits are signed on-chain securely. Verify key limits independently in the hardware module.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
