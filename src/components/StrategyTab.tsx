import { useState, useEffect } from 'react';
import { 
  Waves, 
  TrendingUp, 
  Layers, 
  Gauge, 
  Filter, 
  Download, 
  Zap, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { SimulationRun, StrategyArchetype, AlertItem, LabsSuggestion } from '../types';

interface StrategyProps {
  searchQuery: string;
  simulations: SimulationRun[];
  onRunSimulation: (id: string) => void;
  onExportCsv: () => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  labsSuggestions?: LabsSuggestion[];
  watchlist?: any[];
}

const ARCHETYPES: StrategyArchetype[] = [
  {
    id: 'mean-rev',
    title: 'Cyclical Allocation',
    iconName: 'waves',
    description: 'Strategic asset accumulation during market cycles focusing on long-term historical value range.',
    status: 'HEDGED',
    risk: 'Low'
  },
  {
    id: 'momentum',
    title: 'Long-Term Growth',
    iconName: 'trending_up',
    description: 'Compound-growth allocations focused on high-conviction structural and macro wealth trends.',
    status: 'BULLISH',
    risk: 'Med',
    active: true
  },
  {
    id: 'delta-neutral',
    title: 'Capital Preservation',
    iconName: 'layers',
    description: 'Defensive asset buffers and sovereign yields designed to protect capital across all climates.',
    status: 'HEDGED',
    risk: 'Stable'
  },
  {
    id: 'high-freq',
    title: 'Yield Enhancer',
    iconName: 'speed',
    description: 'Optimized long-term staking metrics and conservative low-turnover dividend capture sources.',
    status: 'PROFITABLE',
    risk: 'Low'
  }
];

export default function StrategyTab({
  searchQuery,
  simulations,
  onRunSimulation,
  onExportCsv,
  onTriggerAlert
}: StrategyProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(99.8);
  const [nodeDetails, setNodeDetails] = useState<string | null>('Hover on neural node to trace connection...');
  const [alertFilter, setAlertFilter] = useState<string>('all');

  // Simulated live sync ticking
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // randomly tick confidence slightly or shake nodes
      setConfidence(prev => {
        const diff = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.min(100, Math.max(95, prev + diff)).toFixed(2));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerCustomScan = () => {
    setIsSyncing(false);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'SYSTEM MATCH',
      title: 'Structural Model Aligned',
      description: 'Synchronized Wealth Engine intelligence at ' + confidence + '% alignment rating across portfolio channels.'
    });
    setTimeout(() => setIsSyncing(true), 1500);
  };

  // Filter runs by selected archetype or search query
  const filteredRuns = simulations.filter(run => {
    const matchesSearch = 
      run.strategyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!selectedArchetype) return matchesSearch;
    
    if (selectedArchetype === 'momentum') {
      return matchesSearch && run.strategyName.toLowerCase().includes('momentum');
    } else if (selectedArchetype === 'mean-rev') {
      return matchesSearch && run.strategyName.toLowerCase().includes('mean');
    } else if (selectedArchetype === 'delta-neutral') {
      return matchesSearch && run.strategyName.toLowerCase().includes('neutral');
    } else {
      return matchesSearch && !run.strategyName.toLowerCase().includes('momentum') && !run.strategyName.toLowerCase().includes('mean');
    }
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pb-12">
      
      {/* Upper header section */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-sans text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors">
            Strategic Themes & Planning
          </h2>
          <p className="text-sm sm:text-base text-[#6F685F] dark:text-slate-400 max-w-2xl mt-2 leading-relaxed">
            Curated allocation engines and model evaluations designed for serene personal wealth stewardship.
          </p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <button 
            onClick={triggerCustomScan}
            className="px-4 py-2 bg-white/40 dark:bg-slate-900/40 glass-border border border-white/30 dark:border-slate-800/50 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-white/60 dark:hover:bg-slate-800/80 transition-all text-slate-700 dark:text-slate-200"
          >
            <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-spin'}`} />
            <span>Engine: {isSyncing ? 'Syncing' : 'Recalibrating...'}</span>
          </button>
        </div>
      </section>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Central Neural Intelligence mapping */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 min-h-[420px] flex flex-col relative overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">ALIGNMENT INDEX</span>
                <h3 className="text-xl font-extrabold mt-1 tracking-tight text-slate-900 dark:text-white">Active Sector Integrator</h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                  {confidence}<span className="text-lg opacity-60 ml-0.5">%</span>
                </span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-1">Portfolio Coherence</p>
              </div>
            </div>

            {/* Simulated Animated Interactive Neural Network Node grid */}
            <div className="relative h-64 flex flex-col justify-between rounded-2xl bg-slate-50 border border-slate-100/70 dark:border-slate-800/10 p-6">
              
              {/* Dynamic neural connecting backdrop lines using inline SVGs */}
              <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Connecting lines */}
                  <line x1="15%" y1="20%" x2="45%" y2="20%" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 5" />
                  <line x1="45%" y1="20%" x2="70%" y2="50%" stroke="#10B981" strokeWidth="1" />
                  <line x1="70%" y1="50%" x2="85%" y2="20%" stroke="#e11d48" strokeWidth="1" />
                  <line x1="15%" y1="20%" x2="15%" y2="55%" stroke="#2563EB" strokeWidth="2" />
                  <line x1="45%" y1="20%" x2="45%" y2="70%" stroke="#10B981" strokeWidth="1.5" />
                  <line x1="70%" y1="50%" x2="70%" y2="80%" stroke="#3B82F6" strokeWidth="2.5" />
                  <line x1="85%" y1="20%" x2="85%" y2="75%" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="15%" y1="55%" x2="45%" y2="70%" stroke="#3B82F6" strokeWidth="1" />
                  <line x1="45%" y1="70%" x2="70%" y2="80%" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <line x1="70%" y1="80%" x2="85%" y2="75%" stroke="#475569" strokeWidth="1" />
                </svg>
              </div>

              {/* Top layer: Nodes positioned absolutely */}
              <div className="relative w-full h-full grid grid-cols-4 gap-8">
                
                {/* Row 1 - Node 1 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Asset sector: Digital Assets Core | Weight: 48% | Balance: Preserved')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-5 h-5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-125 duration-300" />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-blue-600 transition-colors">α-CORE</span>
                </div>

                {/* Row 1 - Node 2 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Asset sector: Sovereign Yields | Target: 20% | Status: Aligned')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-4 h-4 bg-emerald-500/80 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '0.8s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-emerald-600 transition-colors">β-YIELD</span>
                </div>

                {/* Row 1 - Node 3 */}
                <div 
                  onMouseEnter={() => setNodeDetails('System Core: Aequitas Wealth Engine Core | Rating: Steady')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-6 h-6 bg-slate-700/80 rounded-full shadow-[0_0_20px_rgba(71,85,105,0.4)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '0.4s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-slate-700 dark:group-hover:text-white transition-colors">γ-AEQ</span>
                </div>

                {/* Row 1 - Node 4 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Asset sector: Sovereign Reserve Buffer | Cushion: High')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-5 h-5 bg-amber-500/100 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '1.2s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-amber-600 transition-colors">δ-BUFFER</span>
                </div>

                {/* Row 2 - Node 1 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Aequitas Yield optimizer VM | Alignment reduction: -0.05% deviation')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-3.5 h-3.5 bg-slate-500 rounded-full shadow-[0_0_8px_rgba(100,116,139,0.2)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '0.2s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-slate-755 transition-colors">ε-YLV</span>
                </div>

                {/* Row 2 - Node 2 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Portfolio Coherence Index | Score: 99.8% | Verified')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-6 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '1.5s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-indigo-600 transition-colors">ζ-ALIGN</span>
                </div>

                {/* Row 2 - Node 3 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Liquidity Cushion allocation | Capital reserve: $1.2B')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-5 h-5 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '0.6s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-blue-600 transition-colors">η-CUSHION</span>
                </div>

                {/* Row 2 - Node 4 */}
                <div 
                  onMouseEnter={() => setNodeDetails('Yield Dispersion Tracker | Structural outliers: None')}
                  className="flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="neural-node-animate w-4 h-4 bg-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.2)] transition-transform group-hover:scale-125 duration-300" style={{ animationDelay: '1s' }} />
                  <span className="text-[10px] text-slate-400 mt-2 font-mono group-hover:text-slate-600 transition-colors">θ-OUTFLOW</span>
                </div>

              </div>
              
              {/* Trace log displayer */}
              <div className="mt-4 pt-3 border-t border-slate-205/60 dark:border-slate-800/40 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 text-[11px] truncate">{nodeDetails}</span>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 scale-90">ALIGNED CHANNELS</span>
              </div>
            </div>

            {/* Slider for parameter tuning */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-100 p-4 rounded-xl dark:bg-slate-900/10 dark:border-slate-800/10 shadow-sm">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Zap size={15} className="text-amber-500 shrink-0 select-none" />
                <span className="text-xs font-bold whitespace-nowrap text-slate-705">Investment Alignment Rating:</span>
                <input 
                  type="range" 
                  min="85" 
                  max="100" 
                  step="0.1"
                  value={confidence} 
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full sm:w-36 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer max-w-xs"
                />
              </div>
              <button
                onClick={() => {
                  setConfidence(99.8);
                  setNodeDetails('Scanners reset fully. Re-connecting node clusters...');
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 bg-transparent border-0 self-end sm:self-auto hover:underline cursor-pointer"
              >
                <RotateCcw size={11} />
                Reset Core
              </button>
            </div>

          </div>
        </div>

        {/* Supplementary Alert Rail: Theme Guidance */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col shadow-sm max-h-[460px] border border-slate-205/60 dark:border-slate-800/25">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Theme Guidance List</h3>
            <Zap size={16} className="text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>

          {/* Categorize Alerts toggles */}
          <div className="flex gap-1.5 mb-3 bg-slate-100/50 dark:bg-slate-900/30 p-1 rounded-xl">
            {['all', 'high', 'system', 'monitoring'].map((filter) => (
              <button
                key={filter}
                onClick={() => setAlertFilter(filter)}
                className={`flex-1 text-[9px] uppercase font-black py-1.5 rounded-lg transition-all ${
                  alertFilter === filter 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-3 flex-grow overflow-y-auto pr-1">
            
            {/* ALERT 1 */}
            {(alertFilter === 'all' || alertFilter === 'high') && (
              <div 
                onClick={() => {
                  onTriggerAlert({
                    type: 'success',
                    typeLabel: 'APPLIED',
                    title: 'Balanced Allocation Adjusted',
                    description: 'Set custom strategic target range boundaries for SOL position, aligning assets for long-term compounding.'
                  });
                }}
                className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-white/20 dark:border-slate-800/10 hover:bg-white/60 dark:hover:bg-slate-900/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[8px] tracking-widest px-2 py-0.5 rounded font-black bg-emerald-450/10 text-emerald-600 dark:text-emerald-300">STABLE TARGET</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">2m ago</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1E1B16] dark:group-hover:text-[#a5b4fc] transition-colors font-sans">Strategic Convergence Range</h4>
                <p className="text-[11px] text-[#6F685F] dark:text-slate-400 mt-0.5 leading-relaxed">ETH/USD exhibiting standard historical consolidation cycles. Dynamic long-term re-entry model suggested.</p>
              </div>
            )}

            {/* ALERT 2 */}
            {(alertFilter === 'all' || alertFilter === 'system') && (
              <div 
                onClick={() => {
                  onTriggerAlert({
                    type: 'success',
                    typeLabel: 'OPTIMIZED',
                    title: 'Strategic Portfolio Updated',
                    description: 'Re-weighted target allocation ratios on SIM-8501, smoothing projected performance indicators.'
                  });
                }}
                className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-white/20 dark:border-slate-800/10 hover:bg-white/60 dark:hover:bg-slate-900/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[8px] tracking-widest px-2 py-0.5 rounded font-black bg-amber-500/10 text-amber-600 dark:text-[#93c5fd]">PORTFOLIO ADVISORY</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">14m ago</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1E1B16] dark:group-hover:text-[#a5b4fc] transition-colors">Resilience Buffer Rebalance</h4>
                <p className="text-[11px] text-[#6F685F] dark:text-slate-400 mt-0.5 leading-relaxed">Capital preservation model suggestions indicate optimization of position size inside solid liquidity channels.</p>
              </div>
            )}

            {/* ALERT 3 */}
            {(alertFilter === 'all' || alertFilter === 'monitoring') && (
              <div 
                onClick={() => {
                  onTriggerAlert({
                    type: 'advisory',
                    typeLabel: 'MONITORING',
                    title: 'Volatility Grid Active',
                    description: 'Bollinger bounds threshold updated for BTC trade targets.'
                  });
                }}
                className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/20 border border-white/20 dark:border-slate-800/10 hover:bg-white/60 dark:hover:bg-slate-900/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[8px] tracking-widest px-2 py-0.5 rounded font-black bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">MONITORING</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">1h ago</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0037b0] dark:group-hover:text-[#a5b4fc] transition-colors">Volatility Squeeze</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Bollinger bands narrowing on BTC/USD. Expecting breakout volatility within subsequent blocks.</p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Strategy Archetypes Column Layout */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Strategy Archetypes</h3>
          <div className="h-px flex-grow bg-slate-300/40 dark:bg-slate-800/40" />
          <span className="text-xs text-slate-400 whitespace-nowrap">Click card to isolate simulation list</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARCHETYPES.map((item) => {
            const isClickActive = selectedArchetype === item.id;
            const isOriginalActive = item.active;
            
            // Icon mapping
            let IconComp = Waves;
            if (item.iconName === 'trending_up') IconComp = TrendingUp;
            else if (item.iconName === 'layers') IconComp = Layers;
            else if (item.iconName === 'speed') IconComp = Gauge;

            return (
              <div
                id={`archetype-card-${item.id}`}
                key={item.id}
                onClick={() => {
                  setSelectedArchetype(isClickActive ? null : item.id);
                  onTriggerAlert({
                    type: 'advisory',
                    typeLabel: 'FILTERED',
                    title: `Isolated: ${item.title}`,
                    description: `Active simulation records narrowed down strictly to ${item.title} executions.`
                  });
                }}
                className={`glass-panel cursor-pointer rounded-3xl p-6 transition-all duration-300 relative group flex flex-col justify-between border ${
                  isClickActive 
                    ? 'border-blue-600 dark:border-blue-400 scale-102 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
                    : isOriginalActive && !selectedArchetype
                      ? 'border-blue-600/50 dark:border-blue-400/50 bg-blue-50/10 dark:bg-blue-950/10 shadow-sm'
                      : 'border-slate-200/60 dark:border-slate-800/25 hover:border-blue-550 dark:hover:border-slate-400 hover:translate-y-[-4px] bg-white dark:bg-slate-900/30'
                }`}
              >
                
                {/* Active tag indicator */}
                {isOriginalActive && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white dark:bg-blue-500 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Active
                  </div>
                )}
                {isClickActive && (
                  <div className="absolute top-2 right-2 flex w-2 h-2 rounded-full bg-blue-550 dark:bg-[#4edea3] scale-110" />
                )}

                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow transition-transform duration-300 group-hover:scale-110 ${
                    isClickActive || (isOriginalActive && !selectedArchetype)
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-blue-50/50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-slate-700/50'
                  }`}>
                    <IconComp size={22} className={isOriginalActive ? 'animate-pulse' : ''} />
                  </div>

                  <h4 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/20 w-fit">
                  <span className={`text-[9px] uppercase font-black ${
                    item.status === 'PROFITABLE' || item.status === 'BULLISH'
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : item.status === 'HEDGED'
                        ? 'text-blue-500'
                        : 'text-rose-500'
                  }`}>{item.status}</span>
                  <span className="text-xs opacity-30 text-slate-400">•</span>
                  <span className="text-xs text-slate-400 font-medium">Risk: {item.risk}</span>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Simulation Environment Table */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-sm">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-white/20 dark:border-slate-800/10 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-slate-500/5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Planning & Projection Models</h3>
            <p className="text-xs text-slate-400 mt-1">Projected performance metrics of long-term backtested strategic themes.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto shrink-0">
            {selectedArchetype && (
              <button
                onClick={() => setSelectedArchetype(null)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 active:scale-98"
              >
                Reset Filter
              </button>
            )}
            <button 
              onClick={onExportCsv}
              className="flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Download size={14} />
              Export Runs
            </button>
          </div>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-500/5 border-b border-slate-100 dark:border-slate-800/10">
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">PLAN ID</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">STRATEGIC ARCHETYPE</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">ALIGNMENT RATING</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">HISTORIC VOLATILITY</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">TARGET APY</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">STATUS</th>
                <th className="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-xs text-slate-400">No matching simulation records found.</td>
                </tr>
              ) : (
                (filteredRuns || []).map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{run.id}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-sans text-sm font-extrabold text-slate-850 dark:text-white">{run.strategyName}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">{run.network}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 shadow-none">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold w-10 text-slate-800 dark:text-slate-200">{run.modelAccuracy.toFixed(1)}%</span>
                        <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0 font-sans">
                          <div 
                            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000" 
                            style={{ width: `${run.modelAccuracy}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-500 dark:text-rose-450">
                      {Math.abs(run.maxDrawdown).toFixed(2)}%
                    </td>

                    <td className="px-6 py-4 font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      +{run.projApy.toFixed(1)}%
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[9px] tracking-wider px-2.5 py-1 rounded-full font-black uppercase text-center shrink-0 ${
                        run.status === 'OPTIMIZED' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100' 
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100'
                      }`}>
                        {run.status === 'OPTIMIZED' ? 'ALIGNED' : 'INTEGRATING'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          onRunSimulation(run.id);
                          onTriggerAlert({
                            type: 'success',
                            typeLabel: 'ALIGNMENT MODEL',
                            title: `Running Alignment test ${run.id}`,
                            description: `Accelerated model computation and historical alignment verify initialized on theme ${run.strategyName}.`
                          });
                        }}
                        className="bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-205 dark:hover:text-blue-400 hover:text-blue-600 p-2 rounded-lg transition-all border border-slate-102 inline-flex items-center gap-1.5 text-xs font-bold shadow-sm"
                      >
                        <Play size={10} fill="currentColor" />
                        Verify
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
}
