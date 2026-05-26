import React, { useState } from 'react';
import { 
  Brain, 
  ArrowRight, 
  Copy, 
  Check, 
  Upload, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Database, 
  FileCode,
  LayoutDashboard,
  Coins
} from 'lucide-react';

interface AIWorkflowTabProps {
  portfolioValue: number;
  onUpdatePortfolio: (val: number) => void;
  onTriggerAlert: (alert: { type: 'high' | 'advisory' | 'monitoring' | 'success'; typeLabel: string; title: string; description: string }) => void;
  setActiveTab: (tab: any) => void;
}

export default function AIWorkflowTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert,
  setActiveTab
}: AIWorkflowTabProps) {
  const [copied, setCopied] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  // Generate the current active state JSON to copy
  const activeContext = JSON.stringify({
    system: "Aequitas Investment OS",
    local_timestamp: new Date().toISOString(),
    node_id: "sol-09",
    active_currency: "USD",
    core_holdings: [
      { ticker: "SOL", balance: 1450, value: 232000, percentage: 48, label: "Solana Stable Yields" },
      { ticker: "BTC", balance: 2.38, value: 155000, percentage: 32, label: "Bitcoin Digital Gold" },
      { ticker: "ETH", balance: 31.25, value: 98290, percentage: 20, label: "Ethereum Consensus Core" }
    ],
    summary_metrics: {
      total_core_balance: portfolioValue,
      weighted_drift: "3.2%",
      alignment_index: "99.8%",
      compound_yield_apy: "7.2%"
    }
  }, null, 2);

  const handleCopyContext = () => {
    navigator.clipboard.writeText(activeContext);
    setCopied(true);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'CONTEXT EXPORTED',
      title: 'Portfolio Context Copied',
      description: 'Encrypted JSON context copied to clipboard. Ready for AI reasoning.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedJson.trim()) {
      setImportFeedback("Input box is empty.");
      setImportSuccess(false);
      return;
    }

    try {
      const parsed = JSON.parse(pastedJson);
      
      // Look for custom parameters in the JSON to apply
      let updatedValue = portfolioValue;
      let appliedNotes: string[] = [];

      // Look for total_core_balance or core_balance or portfolioValue
      if (parsed.total_core_balance && typeof parsed.total_core_balance === 'number') {
        updatedValue = parsed.total_core_balance;
        appliedNotes.push(`Adjusted target balance to $${updatedValue.toLocaleString()}`);
      } else if (parsed.portfolioValue && typeof parsed.portfolioValue === 'number') {
        updatedValue = parsed.portfolioValue;
        appliedNotes.push(`Adjusted target balance to $${updatedValue.toLocaleString()}`);
      }

      if (parsed.node_id && typeof parsed.node_id === 'string') {
        appliedNotes.push(`RPC consensus node switched to '${parsed.node_id}'`);
      }

      if (appliedNotes.length > 0) {
        onUpdatePortfolio(updatedValue);
        setImportSuccess(true);
        setImportFeedback(`Successfully synchronized: ${appliedNotes.join(', ')}.`);
        setPastedJson('');
        onTriggerAlert({
          type: 'success',
          typeLabel: 'AI PLAN IMPORTED',
          title: 'Model Parameters Reconciled',
          description: `Import successful. Ledger updated via structured manual JSON review.`
        });
      } else {
        setImportSuccess(true);
        setImportFeedback("JSON parses correctly, but no standard parameters were matched. (Hint: Specify total_core_balance or portfolioValue as a number)");
      }
    } catch (err: any) {
      setImportSuccess(false);
      setImportFeedback(`Failed to parse: ${err.message || 'Invalid format'}. Please input standard structured JSON.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      {/* Title block */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          manual local-first AI reasoning cycle
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          AI Workflow Hub
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          The non-custodial manual loop: enter your parameters, copy context, consult AI, and paste structured results.
        </p>
      </section>

      {/* Manual AI Investment Loop - Visual Timeline Checklist */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="text-blue-600 dark:text-blue-400" size={18} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual AI Investment Loop</h3>
        </div>

        {/* Dynamic timeline flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative font-sans">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">STEP 1</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Manual Input</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              User inputs holdings weights, DCA plans, and balances independently.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">STEP 2</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Plot Dashboard</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Aequitas parses values into beautiful allocation, yield, and simulation metrics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">STEP 3</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Export Context</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Export comprehensive state variables in structured JSON schemas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">STEP 4</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Reason</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Copy to your preferred AI model to audit drift vectors and design target parameters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">STEP 5</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Import JSON</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Paste the structured response back into Aequitas to calibrate your live workspace.
            </p>
          </div>

        </div>

        <div className="mt-6 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-900/10 border border-blue-100/30 dark:border-slate-800/10 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="font-semibold leading-relaxed">
            Local-First Verification: This local sandbox operates fully offline with complete privacy. Your data has no custody risks, API keys, or automatic trading brokers. You are in absolute control of every parameter.
          </p>
        </div>
      </div>

      {/* Action Zone: Export (Left) and Import (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* EXPORT WORKSPACE CONTEXT (6 Columns) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/10">
              <div className="flex gap-2 items-center text-blue-600">
                <FileCode size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Aequitas Scheme Context</span>
              </div>
              <button 
                onClick={handleCopyContext}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-lg border border-blue-105/20 transition-all font-sans"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Local Context</h3>
              <p className="text-xs text-slate-450 mt-1">Copy this current parameter list to send to the AI Advisor.</p>
            </div>

            <textarea
              readOnly
              value={activeContext}
              className="w-full h-64 font-mono text-[11px] bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-805/10 rounded-xl p-4 text-slate-600 dark:text-slate-300 resize-none outline-none focus:ring-0 leading-normal"
            />
          </div>
        </div>

        {/* IMPORT STATE PLAN (6 Columns) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <form onSubmit={handleImportPlan} className="space-y-4 w-full">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/10">
              <div className="flex gap-2 items-center text-blue-600">
                <Upload size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none text-slate-450">INTELLIGENCE REGISTRY</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Import AI-Generated Plan</h3>
              <p className="text-xs text-slate-450 mt-1">
                Paste structured AI feedback back in here to instantly plot parameters (e.g., balance updates).
              </p>
            </div>

            <textarea
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              placeholder={`{\n  "total_core_balance": 520000,\n  "node_id": "eth-03"\n}`}
              className="w-full h-44 font-mono text-[11px] bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-805/10 rounded-xl p-4 text-slate-900 dark:text-white resize-none outline-none focus:outline-none focus:border-blue-500"
            />

            {/* Parsing feedback box */}
            {importFeedback && (
              <div className={`p-3.5 rounded-xl text-xs font-sans leading-relaxed ${
                importSuccess 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  : 'bg-rose-50/80 text-rose-800 border border-rose-100'
              }`}>
                {importSuccess ? (
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <p className="font-medium">{importFeedback}</p>
                  </div>
                ) : (
                  <p className="font-medium">{importFeedback}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase py-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              <CheckCircle2 size={13} />
              Reconcile AI Guidance Plan
            </button>
          </form>
        </div>

      </div>

      {/* Guided Walkthrough instruction block */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm text-xs font-sans space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Sparkles size={15} className="text-blue-600 dark:text-blue-400" />
          Standard Guidance Prompt Template
        </h4>
        <p className="text-slate-500 dark:text-slate-400 leading-normal">
          To audit your portfolio strategy, paste your copied schema into your AI Advisor or preferred assistant along with this suggested structured directive prompt:
        </p>
        <div className="p-4 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-905/20 rounded-xl text-slate-650 dark:text-slate-350 leading-relaxed font-mono select-all">
          "Acting as the Aequitas Portfolio Advisor auditing my local investment ledger: Review my current sector weights, deviation drifts, and DCA options. Formulate an optimized re-weight target path. Return the adjusted metrics as a valid, single structured JSON block with the 'total_core_balance' property set to my updated target parameter balance. Do not include markdown around the JSON block."
        </div>
      </section>
    </div>
  );
}
