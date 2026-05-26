import { 
  TrendingUp, 
  Layers, 
  Workflow, 
  Cpu, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  LineChart 
} from 'lucide-react';
import { TabType } from '../types';

interface OverviewProps {
  portfolioValue: number;
  setActiveTab: (tab: TabType) => void;
  confidence: number;
}

export default function OverviewTab({
  portfolioValue,
  setActiveTab,
  confidence
}: OverviewProps) {
  
  const stats = [
    { title: 'Total Portfolio Value', value: `$${portfolioValue.toLocaleString()}`, change: '+8.4%', isPositive: true, icon: BarChart3, color: 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/20' },
    { title: 'Average Projected APY', value: '23.8%', change: '+1.8%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/20' },
    { title: 'Portfolio Alignment Ratio', value: `${confidence.toFixed(1)}%`, change: 'Optimal', isPositive: true, icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/20' },
    { title: 'Preservation Level', value: 'Class 1 Private', change: 'Secured', isPositive: true, icon: Cpu, color: 'text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-950/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-[#F4EEE4] pb-12">
      
      {/* Intro greeting */}
      <section>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
          Executive Dashboard Overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          An overarching visual synopsis of wealth alignments, premium allocation rules, and long-term targets.
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
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  stat.change.includes('+') || stat.change === 'Secured'
                    ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-450' 
                    : 'bg-blue-55 text-blue-700 dark:text-blue-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ticked live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main core bento sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Engine model review block (8 Columns mapped) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 relative shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">PORTFOLIO FLOW</span>
                <h3 className="text-lg font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Active Core Allocation Ratios</h3>
              </div>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-450 hover:underline"
              >
                Inspect Core
              </button>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-300">Portfolio Overview (Target SOL allocations)</span>
                  <span className="font-mono text-slate-900 dark:text-white">48%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-blue-500" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-300">BTC Momentum Spikes Tracker</span>
                  <span className="font-mono text-slate-800 dark:text-slate-350">32%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 dark:bg-slate-600" style={{ width: '32%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 dark:text-slate-300">Mean Reversion (ETH liquidity)</span>
                  <span className="font-mono text-slate-800 dark:text-slate-350">20%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 dark:bg-emerald-400" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-900/10 border border-blue-100/30 dark:border-slate-800/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-blue-600 dark:text-blue-450 shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Long-term compounding target paths and rules active on registered system loops.</p>
            </div>
            <button 
              onClick={() => setActiveTab('strategy')}
              className="text-blue-600 dark:text-blue-450 font-bold hover:underline self-end sm:self-auto uppercase tracking-wider text-[10px]"
            >
              Configure Rule set
            </button>
          </div>
        </div>

        {/* Quick Strategy recommendations panel (4 Columns mapped) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Aequitas Wealth Insights</h3>
            <p className="text-xs text-slate-400 mt-1">Daily notes on capital preservation and allocation pathways.</p>
            
            <div className="mt-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-[#F4EEE4] flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-805/10 pb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  SOL Asset Alignments
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal mt-1.5 font-sans">
                  Automated metrics tracking indicates institutional accumulator nodes purchasing SOL. Target standard limit set at $155 boundary.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40 shadow-sm">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-[#F4EEE4] flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-805/10 pb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  Mean Arbitrage Stable
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal mt-1.5 font-sans">
                  Arb spreads narrowing on ETH collateral pairs, reducing overall risk indicators safely to historical limits. 
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('insights')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 text-xs py-3 rounded-xl tracking-wider font-bold shadow-sm shadow-blue-500/10 active:scale-98 transition-all mt-6 uppercase leading-none border border-blue-500/10"
          >
            Open Wealth Advisor
          </button>
        </div>

      </div>

    </div>
  );
}
