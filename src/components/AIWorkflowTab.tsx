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
  Trash2
} from 'lucide-react';
import { Holding, DcaPlan, DividendPlan, ThaiFundNavState, AiImportSchema, AlertItem, TabType, LabsSuggestion } from '../types';

interface AIWorkflowTabProps {
  portfolioValue: number;
  holdings: Holding[];
  dcaPlan: DcaPlan;
  dividendPlan: DividendPlan;
  thaiFundNavs: ThaiFundNavState[];
  onImportAiSchema: (schema: AiImportSchema) => void;
  latestImportStatus: string | null;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  setActiveTab: (tab: TabType) => void;
  labsSuggestions?: LabsSuggestion[];
  onUpdatePortfolio?: (val: number) => void;
}

export default function AIWorkflowTab({
  portfolioValue,
  holdings,
  dcaPlan,
  dividendPlan,
  thaiFundNavs,
  onImportAiSchema,
  latestImportStatus,
  onTriggerAlert,
  setActiveTab,
  labsSuggestions,
  onUpdatePortfolio
}: AIWorkflowTabProps) {
  const [copied, setCopied] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const handleClearDraft = () => {
    if (window.confirm('Clear active JSON draft?')) {
      setPastedJson('');
      setImportFeedback(null);
      setImportSuccess(null);
    }
  };

  // Generate the actual live state JSON to copy!
  const activeContext = JSON.stringify({
    system: "Aequitas Investment Operating System",
    local_timestamp: new Date().toISOString(),
    operating_mode: "Offline Cache",
    summary_metrics: {
      total_portfolio_value: portfolioValue,
      drift_marker_pct: "3.2%",
      health_score_pct: 94.8,
      currency: "USD"
    },
    live_holdings: (holdings || []).map(h => ({
      ticker: h.ticker,
      name: h.name,
      type: h.type,
      units: h.units,
      avg_cost: h.avgCost,
      current_price: h.currentPrice,
      subtotal_value: h.value,
      percent: h.allocationPct
    })),
    monthly_dca_plan: {
      monthlyContributionPlan: dcaPlan?.monthlyContributionPlan,
      cashAvailable: dcaPlan?.cashAvailable,
      nextContributionReminder: dcaPlan?.nextContributionReminder,
      items: (dcaPlan?.items || []).map(item => ({
        ticker: item.ticker,
        name: item.name,
        targetAmount: item.targetAmount,
        priorityOrder: item.priorityOrder,
        interval: item.interval,
        status: item.status
      }))
    },
    dividend_plan: {
      expectedMonthlyDividend: dividendPlan?.expectedMonthlyDividend,
      annualizedIncomeEstimate: dividendPlan?.annualizedIncomeEstimate,
      reinvestmentStatusDefault: dividendPlan?.reinvestmentStatusDefault,
      cashflowStabilityNotes: dividendPlan?.cashflowStabilityNotes,
      items: (dividendPlan?.items || []).map(item => ({
        ticker: item.ticker,
        name: item.name,
        yield: item.yield,
        annualEst: item.annualEst,
        frequency: item.frequency,
        reinvestmentStatus: item.reinvestmentStatus
      }))
    },
    thai_nav_bridge_states: (thaiFundNavs || []).map(f => ({
      ticker: f.ticker,
      nav_thb: f.nav,
      last_reconciled: f.lastUpdated
    }))
  }, null, 2);

  const handleCopyContext = () => {
    navigator.clipboard.writeText(activeContext);
    setCopied(true);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'CONTEXT COPIED',
      title: 'Context Exported Successfully',
      description: 'Unified Aequitas schema copied to clipboard. Paste this into your LLM reasoning engine.'
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
      
      // Basic validation checks
      const hasValidKey = 
        parsed.portfolioSummary || 
        parsed.assetPlans || 
        parsed.allocationPlan || 
        parsed.dcaPlan || 
        parsed.dividendNotes || 
        parsed.dailyBrief || 
        parsed.labsSuggestions;

      if (!hasValidKey) {
        setImportSuccess(false);
        setImportFeedback("JSON parsed correctly, but matches no recognizable schema elements of Aequitas AI Import Schema.");
        return;
      }

      // Execute Central State callback!
      onImportAiSchema(parsed as AiImportSchema);
      setImportSuccess(true);
      setImportFeedback("Aequitas schema compiled successfully! Active core holdings, monthly DCA targets, and allocation drift notes have been synchronized offline.");
      setPastedJson('');
    } catch (err: any) {
      setImportSuccess(false);
      setImportFeedback(`Parsing error: ${err.message || 'Invalid JSON syntax'}. Please audit format parameters.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      
      {/* Title block */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          Manual AI Investment Loop
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          AI Workflow Hub
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
          The manual-first loop: view your local state params, export private context file headers, analyze with external systems, and import back structured re-weighting suggestions.
        </p>
      </section>

      {/* Manual AI Investment Loop - Visual Timeline Checklist */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="text-blue-600 dark:text-blue-400 animate-pulse" size={18} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Human-Controlled Loop Workflow</h3>
        </div>

        {/* Dynamic timeline flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative font-sans">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-605 block">STEP 1</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Manual Input</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Enter assets, target splits, and NAV records locally in private workspace.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-605 block">STEP 2</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Plot Dashboard</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Aequitas parses values and plots active allocations and passive yields instantly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-605 block">STEP 3</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Export Context</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Generate unified privacy-safe JSON parameters containing active portfolio state.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-605 block">STEP 4</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Reason</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Analyze parameters with LLMs to evaluate drift targets and test alternatives.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-905/30 dark:border-slate-800/10 space-y-2">
            <span className="text-[10px] font-bold text-blue-605 block">STEP 5</span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Import JSON</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Paste suggestions back in to recalibrate targets and align future DCA cycles.
            </p>
          </div>

        </div>

        <div className="mt-6 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-900/10 border border-blue-100/30 dark:border-slate-800/10 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles size={14} className="text-blue-650 shrink-0" />
          <p className="font-semibold leading-relaxed">
            Data Sovereignty Principle: Aequitas runs entirely as a manual planning tool. There are no brokerage links or automated trading triggers. Rebalance targets and DCA allocations are customized and applied manually.
          </p>
        </div>
      </div>

      {/* Action Zone: Export (Left) and Import (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
        
        {/* EXPORT WORKSPACE CONTEXT (6 Columns) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/10">
              <div className="flex gap-2 items-center text-blue-600">
                <FileCode size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">AEQUITAS LOCAL CACHE JSON</span>
              </div>
              <button 
                onClick={handleCopyContext}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-605 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-blue-100/20 transition-all font-sans"
              >
                {copied ? <Check size={12} /> : null}
                <span>{copied ? 'Copied Context' : 'Export Context'}</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Private Parameters</h3>
              <p className="text-xs text-slate-450 mt-1">Unified model header tracking allocations, passive yields, RMF lists, and cash balances.</p>
            </div>

            <textarea
              readOnly
              value={activeContext}
              className="w-full h-80 font-mono text-[11px] bg-slate-5 p-4 rounded-xl text-slate-600 dark:text-slate-300 resize-none outline-none focus:ring-0 leading-relaxed border border-slate-150"
            />
          </div>
        </div>

        {/* IMPORT STATE PLAN (6 Columns) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <form onSubmit={handleImportPlan} className="space-y-4 w-full h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/10">
                <div className="flex gap-2 items-center text-blue-600">
                  <Upload size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none text-slate-450">AI Plan Import</span>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Import AI Suggested Parameters</h3>
                  <p className="text-xs text-slate-455 mt-1">
                    Paste the JSON suggestions box back below to synchronize core indicators and portfolio guidelines instantly.
                  </p>
                </div>
                {pastedJson && (
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Clear Draft"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <textarea
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder={JSON.stringify({
  "portfolioSummary": {
    "totalValue": 500000,
    "portfolioHealth": 92,
    "allocationDriftPct": 2.8,
    "reviewItemsCount": 3
  },
  "assetPlans": [
    {
      "ticker": "VOO",
      "action": "Accumulate",
      "targetAllocationPct": 30,
      "notes": "Use future DCA to increase core exposure."
    }
  ],
  "allocationPlan": {
    "buckets": [
      { "name": "Core ETF Layer", "targetPct": 35 },
      { "name": "Growth Layer", "targetPct": 35 },
      { "name": "Dividend / Behavior Layer", "targetPct": 15 },
      { "name": "Thai Tax Wrapper Layer", "targetPct": 12 },
      { "name": "Sandbox Layer", "targetPct": 3 }
    ],
    "rebalanceGuidance": "Redirect new monthly DCA toward core ETF and Thai RMF before adding more growth.",
    "priorityActions": [
      "Increase VOO contribution",
      "Maintain K-US500XRMF schedule",
      "Do not expand sandbox allocation"
    ]
  },
  "dcaPlan": {
    "monthlyContributionPlan": 5500,
    "items": [
      { "ticker": "VOO", "targetAmount": 1800 },
      { "ticker": "K-US500XRMF", "targetAmount": 1300 }
    ]
  },
  "dividendNotes": "Keep SCHD and JEPQ as behavioral income anchors. Reinvest unless cash buffer drops below target.",
  "dailyBrief": {
    "todayObservation": "Portfolio is stable. Core allocation can be strengthened through future DCA.",
    "todayReviewActions": [
      "Review VOO target contribution",
      "Check RMF annual tax wrapper limit",
      "Monitor sandbox exposure"
    ],
    "riskWarnings": [
      "Growth layer remains slightly above target."
    ]
  },
  "labsSuggestions": [
    {
      "ticker": "RBRK",
      "reason": "Keep as small sandbox exposure only.",
      "riskScore": "High"
    }
  ]
}, null, 2)}
                className="w-full h-44 font-mono text-[11px] bg-slate-5 border border-slate-150 rounded-xl p-4 text-slate-900 dark:text-white resize-none outline-none focus:outline-none focus:border-blue-500 leading-relaxed"
              />

              {/* Parsing feedback box */}
              {(importFeedback || latestImportStatus) && (
                <div className={`p-4 rounded-2xl text-xs font-sans leading-relaxed border ${
                  importSuccess !== false 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    : 'bg-rose-50 text-rose-800 border-rose-100'
                }`}>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <p className="font-semibold">{importFeedback || latestImportStatus}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-wider uppercase py-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer mt-4"
            >
              <CheckCircle2 size={13} />
              Import AI Plan
            </button>
          </form>
        </div>

      </div>

      {/* Guided prompt template */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/25 shadow-sm text-xs font-sans space-y-4 bg-white">
        <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
          <Sparkles size={15} className="text-blue-600 dark:text-blue-400" />
          Recommended Reasoning Directives
        </h4>
        <p className="text-slate-500 dark:text-slate-400 leading-normal">
          For accurate structural reviews, paste your copied schema context alongside this standard manual planning prompt:
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl text-slate-650 dark:text-slate-300 leading-relaxed font-mono select-all text-[11px]">
          "Review my active S&P 500 layers, Kasikorn SSF/RMF tax-wrapper limits, and passive dividend streams. Run an audit on asset drifted parameters, list tactical allocation tweaks, and return a single, valid structured JSON object with updated 'total_portfolio_value' or revised allocations list corresponding to your recommendations. Do not wrapper the code inside Markdown blocks."
        </div>
      </section>
    </div>
  );
}
