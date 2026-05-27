import { 
  TrendingUp, 
  Layers, 
  Workflow, 
  Cpu, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  LineChart,
  Brain,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign
} from 'lucide-react';
import { TabType, DailyBrief, Holding, FinancialSettings } from '../types';
import { calculateLayerStats, calculateDividendStats, formatCurrency } from '../core/utils';

interface OverviewProps {
  portfolioValue: number;
  setActiveTab: (tab: TabType) => void;
  healthScore: number;
  driftPct: number;
  dailyBrief: DailyBrief;
  dcaTarget: number;
  cashAvailable: number;
  dividendMonthly: number;
  holdings: Holding[];
  financialSettings: FinancialSettings;
}

export default function OverviewTab({
  portfolioValue,
  setActiveTab,
  healthScore,
  driftPct,
  dailyBrief,
  dcaTarget,
  cashAvailable,
  dividendMonthly,
  holdings,
  financialSettings
}: OverviewProps) {

  const layerStats = calculateLayerStats(holdings);
  const dividendStats = calculateDividendStats(holdings);
  
  const stats = [
    { title: 'Total Portfolio Value', value: formatCurrency(layerStats.totalValue, financialSettings), change: financialSettings.showThbTotals ? `FX: ${financialSettings.usdThbRate}` : 'Live Ledger', isPositive: true, icon: BarChart3, color: 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/20' },
    { title: 'Portfolio Health Rating', value: `${healthScore.toFixed(1)}%`, change: healthScore > 90 ? 'Optimal' : 'Review Required', isPositive: true, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/20' },
    { title: 'Target Monthly DCA', value: formatCurrency(dcaTarget, financialSettings), change: 'Plan Configured', isPositive: true, icon: Calendar, color: 'text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/20' },
    { title: 'Dividends (Monthly Est.)', value: formatCurrency(dividendStats.monthlyEst, financialSettings), change: 'Passive Income', isPositive: true, icon: TrendingUp, color: 'text-purple-650 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-950/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      
      {/* Intro greeting */}
      <section>
        <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
          manual local-first investment operating system
        </span>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors mt-0.5">
          Executive Operating Center
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Aequitas represents a calm, deliberate cockpit. True wealth is compounded through local-first planning, behavior discipline, and structured thinking—safely free of trading desks and order slip triggers.
        </p>
      </section>

      {/* Stats row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={idx}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-500/20 shadow-sm border border-slate-200/60 dark:border-slate-800/25"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450">{stat.title}</span>
                  <p className="text-2xl font-bold mt-2 tracking-tight text-slate-900 dark:text-slate-50 transition-all">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} shadow-none`}>
                  <IconComponent size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Offline Sync</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CENTRAL VISUAL: Manual AI Investment Loop Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-205/60 dark:border-slate-800/45 shadow-sm space-y-6 relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-805/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">ae active product core</span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Manual AI Investment Loop (Human-controlled)</h3>
          </div>
          <button 
            onClick={() => setActiveTab('aiWorkflow')} 
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline bg-blue-5/50 hover:bg-blue-100/50 dark:bg-slate-909/40 px-3 py-1.5 rounded-xl border border-blue-200/20 transition-all self-start sm:self-auto font-sans"
          >
            Go to AI Workflow Hub
            <ArrowRight size={13} />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
          Wealth architecture is constructed manually. Under the Aequitas philosophy, your parameters remain locally private in local storage. Send exported context to LLMs, import suggestion rules, and update plans safely:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Phase 1 */}
          <div 
            onClick={() => setActiveTab('holdings')}
            className="p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-905/30 hover:border-blue-400/50 border border-slate-100 dark:border-slate-805/10 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">01. MANUAL INPUT</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Enter Holdings</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Input holdings, target ranges and NAV details locally.
            </p>
          </div>

          {/* Phase 2 */}
          <div 
            onClick={() => setActiveTab('holdings')}
            className="p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-905/30 hover:border-blue-400/50 border border-slate-100 dark:border-slate-805/10 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">02. DASHBOARD PLOT</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Plot Dashboard</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Review current asset ratios, dividend forecasts, and drift margins.
            </p>
          </div>

          {/* Phase 3 */}
          <div 
            onClick={() => setActiveTab('aiWorkflow')}
            className="p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-905/30 hover:border-blue-400/50 border border-slate-100 dark:border-slate-805/10 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">03. EXPORT CONTEXT</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Export AI JSON</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Generate unified JSON context files of your current offline states.
            </p>
          </div>

          {/* Phase 4 */}
          <div 
            onClick={() => setActiveTab('aiAdvisor')}
            className="p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-905/30 hover:border-blue-400/50 border border-slate-100 dark:border-slate-805/10 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">04. AI THINK / REVIEW</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">AI Advisor Think</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Reason on allocation weights or simulate growth trajectories with AI.
            </p>
          </div>

          {/* Phase 5 */}
          <div 
            onClick={() => setActiveTab('aiWorkflow')}
            className="p-4 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-905/30 hover:border-blue-400/50 border border-slate-100 dark:border-slate-805/10 rounded-2xl cursor-pointer transition-all space-y-2 group"
          >
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">05. IMPORT PLAN</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Import & Update</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Paste suggestions back to recalibrate system metrics and guides instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Main core bento sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Engine model review block (8 Columns mapped) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455">PORTFOLIO STRUCTURAL LAYERS</span>
                <h3 className="text-base font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Active Allocation Weights vs Target Goals</h3>
              </div>
              <button 
                onClick={() => setActiveTab('allocation')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-450 hover:underline bg-transparent"
              >
                Inspect layers
              </button>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-550 dark:text-slate-300">Core ETF Layer (VOO, K-US500X, SCHD)</span>
                  <span className="font-mono text-slate-900 dark:text-white">{layerStats.core.pct}% <span className="text-slate-400 font-light">/ Goal: 35%</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-blue-550" style={{ width: `${layerStats.core.pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-550 dark:text-slate-300">Growth Layer (MSFT, GOOGL, NVDA, AVGO, etc.)</span>
                  <span className="font-mono text-slate-900 dark:text-white">{layerStats.growth.pct}% <span className="text-slate-400 font-light">/ Goal: 40%</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 dark:bg-emerald-400" style={{ width: `${layerStats.growth.pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-550 dark:text-slate-300">Thai Tax Wrapper Layer (K-US500XRMF)</span>
                  <span className="font-mono text-slate-900 dark:text-white">{layerStats.tax.pct}% <span className="text-slate-400 font-light">/ Goal: 10%</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: `${layerStats.tax.pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-550 dark:text-slate-300">Dividend / Income Layer (JEPQ, ABBV)</span>
                  <span className="font-mono text-slate-900 dark:text-white">{layerStats.dividend.pct}% <span className="text-slate-400 font-light">/ Goal: 10%</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${layerStats.dividend.pct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-808/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-blue-600 dark:text-blue-450 shrink-0 animate-pulse" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Combination drift rate is {driftPct}% {driftPct <= 3.5 ? '(Safe)' : '(Action Required)'}. Drift rebalancing resolved naturally via monthly DCA directions.</p>
            </div>
            <button 
              onClick={() => setActiveTab('dcaPlan')}
              className="text-blue-600 dark:text-blue-450 font-bold hover:underline self-end sm:self-auto uppercase tracking-wider text-[10px]"
            >
              Adjust DCA splits
            </button>
          </div>
        </div>

        {/* Quick Strategy recommendations panel (4 Columns mapped) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25 bg-white">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Advisor Observations</h3>
            <p className="text-xs text-slate-400 mt-1">Calm situational summaries generated by your local context parameters.</p>
            
            <div className="mt-6 space-y-4">
              <div className="gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm flex flex-col">
                <span className="text-[9px] uppercase font-black text-rose-600 tracking-wider">DRIFT OBSERVATION</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-0.5">
                  {dailyBrief.aiObservation}
                </p>
              </div>

              <div className="gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm flex flex-col">
                <span className="text-[9px] uppercase font-black text-blue-600 tracking-wider">TACTICAL TO-DO</span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans space-y-1 mt-0.5 list-disc pl-4">
                  {dailyBrief.whatToReviewToday.slice(0, 2).map((item, id) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('aiAdvisor')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 text-xs py-3 rounded-xl tracking-wider font-bold shadow-sm shadow-blue-500/10 active:scale-98 transition-all mt-6 uppercase leading-none border border-blue-500/10"
          >
            Open Advisor Workspace
          </button>
        </div>

      </div>

    </div>
  );
}
