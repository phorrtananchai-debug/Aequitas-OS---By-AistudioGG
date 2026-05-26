import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Sliders, 
  AlertTriangle, 
  Layers, 
  Lock, 
  ChevronRight, 
  Coins,
  ArrowUpRight,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { AlertItem } from '../types';

interface PortfolioProps {
  portfolioValue: number;
  onUpdatePortfolio: (value: number) => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

// Sparklines mockup coordinate lists for hover integration
const CHART_POINTS = [
  { x: 0, y: 240, price: 139.5, time: '02:00' },
  { x: 100, y: 220, price: 141.2, time: '04:00' },
  { x: 200, y: 250, price: 140.0, time: '06:00' },
  { x: 300, y: 210, price: 143.8, time: '08:00' },
  { x: 400, y: 190, price: 144.1, time: '10:00' },
  { x: 500, y: 230, price: 142.9, time: '12:00' },
  { x: 600, y: 170, price: 146.5, time: '14:00' },
  { x: 700, y: 190, price: 145.8, time: '16:00' },
  { x: 800, y: 120, price: 148.24, time: '18:00' },
  { x: 900, y: 140, price: 147.3, time: '20:00' },
  { x: 1000, y: 80, price: 149.9, time: '22:00' },
];

export default function PortfolioTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert
}: PortfolioProps) {
  const [chartRange, setChartRange] = useState<'1H' | '1D' | '1W' | '1M'>('1D');
  const [allocationMode, setAllocationMode] = useState<'default' | 'optimized'>('default');
  const [optPercent, setOptPercent] = useState(85);
  
  // Real time price ticking simulator
  const [currentPrice, setCurrentPrice] = useState(148.24);
  const [priceChange24h, setPriceChange24h] = useState(5.2);

  // Tooltip tracking states
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [hoverData, setHoverData] = useState({ price: 148.24, time: '18:00' });

  // Soft ticking SOL price
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrice(prev => {
        const delta = (Math.random() - 0.48) * 0.15; // slightly upwards bias
        const next = parseFloat((prev + delta).toFixed(2));
        // Soft align 24h change
        setPriceChange24h(pct => parseFloat((pct + delta * 0.05).toFixed(2)));
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Track cursor coordinates snaps
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width; // 0 to 1
    const xCoord = xRatio * 1000; // SVG coordinates limits (0 to 1000)

    // Find closest index in CHART_POINTS
    let closestIndex = 0;
    let minDiff = Infinity;
    CHART_POINTS.forEach((point, idx) => {
      const diff = Math.abs(point.x - xCoord);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    const activePoint = CHART_POINTS[closestIndex];
    
    // Account for responsive scaling
    const finalXRatio = activePoint.x / 1000;
    const finalYRatio = activePoint.y / 300;
    
    setHoverIndex(closestIndex);
    setHoverPos({
      x: finalXRatio * rect.width,
      y: finalYRatio * rect.height
    });
    setHoverData({
      price: hoverIndex === 8 ? currentPrice : activePoint.price,
      time: activePoint.time
    });
  };

  const applyOptimization = () => {
    setAllocationMode('optimized');
    // Tick portfolio value up dynamically on optimizaton!
    onUpdatePortfolio(portfolioValue + 18700);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'REBALANCED',
      title: 'Allocation Aligned',
      description: 'Allocation model re-structured securely to a smart 18.0% target ratio ($18.7K added liquidity assets).'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pb-12">
      
      {/* Immersive luminous skyscrapers header */}
      <section className="relative h-[340px] w-full rounded-2xl overflow-hidden flex items-end pb-8 px-6 sm:px-8 border border-slate-200/50 dark:border-slate-800/20 shadow-sm">
        
        {/* Absolute Background image with luminous sky glow */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#0F172A] dark:via-[#0F172A]/70 dark:to-transparent z-10" />
          <img 
            alt="Luminous Modern Skyscrapers Facade"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-105 saturate-100 opacity-90 dark:opacity-30 transition-all duration-500"
          />
        </div>

        {/* Info elements */}
        <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-105/90 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/30 rounded-full text-blue-600 dark:text-blue-450 text-[10px] font-bold tracking-wider leading-none flex items-center gap-1.5 shadow-none">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                ACTIVE CORE
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 tracking-wider">USD TARGET</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Portfolio Overview</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 max-w-xl leading-relaxed">
              Integrated long-term wealth assets with automated allocation matching. Yield optimized via predictive non-congestive market models.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex gap-4 self-start md:self-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            
            {/* Metric 1 */}
            <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl px-5 py-3.5 rounded-2xl flex flex-col gap-0.5 min-w-[140px] border border-slate-205/80 dark:border-slate-800/40 shadow-sm select-none">
              <span className="text-[9px] tracking-wider text-slate-400 dark:text-slate-500 uppercase font-extrabold">PRICE</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 transition-all">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-0.5">
                <ArrowUpRight size={13} strokeWidth={2.5} />
                +{priceChange24h.toFixed(1)}%
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl px-5 py-3.5 rounded-2xl flex flex-col gap-0.5 min-w-[140px] border border-slate-205/80 dark:border-slate-800/40 shadow-sm select-none">
              <span className="text-[9px] tracking-wider text-slate-400 dark:text-slate-500 uppercase font-extrabold">PORTFOLIO HEALTH</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">94.8</span>
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase mt-0.5">
                Optimal Level
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Bento grid panels split 8/4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Charting canvas and thesis analytics (8 columns mapping) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Performance intel chart box */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 relative min-h-[400px] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#1E1B16] dark:text-[#FAF7F2]">Performance Intelligence</h3>
                  <p className="text-xs text-[#6F685F] mt-1">Real-time volatility tracking and predictive trend corridors.</p>
                </div>
                
                {/* Interval Toggles */}
                <div className="flex bg-[#F6F1E8]/80 dark:bg-slate-900/60 p-1 rounded-xl w-fit border border-[#1E1B16]/5 dark:border-slate-800/20">
                  {(['1H', '1D', '1W', '1M'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setChartRange(range);
                        onTriggerAlert({
                          type: 'advisory',
                          typeLabel: 'INTERVAL',
                          title: `Portfolio range: ${range}`,
                          description: `Allocation vectors historically aligned with ${range} index benchmarks.`
                        });
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        chartRange === range 
                          ? 'bg-white dark:bg-slate-800 text-[#1E1B16] dark:text-[#FAF7F2] shadow-none' 
                          : 'text-[#6F685F] hover:text-[#1E1B16] dark:hover:text-slate-350'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced SVG Interactive Chart Layout with Snap Snapping tooltips! */}
              <div className="relative w-full h-56 rounded-2xl bg-blue-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/40 overflow-visible select-none py-2">
                
                <svg 
                  ref={svgRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="w-full h-full cursor-crosshair overflow-visible" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 1000 300"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(37, 99, 235, 0.12)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="75" x2="1000" y2="75" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>
                  <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>

                  {/* Areas Fill */}
                  <path 
                    d="M0 240 Q 150 220 250 240 T 450 180 T 650 200 T 850 120 T 1000 80 V 300 H 0 Z" 
                    fill="url(#chartFill)" 
                  />
                  
                  {/* Performance curve primary line */}
                  <path 
                    d="M0 240 Q 150 220 250 240 T 450 180 T 650 200 T 850 120 T 1000 80" 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeLinecap="round" 
                    strokeWidth="3" 
                    className="transition-all duration-350"
                  />

                  {/* Secondary green predictive corridor dashline */}
                  <path 
                    d="M0 210 Q 200 230 400 140 T 700 170 T 1000 120" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeDasharray="6 4" 
                    strokeWidth="1.5" 
                    opacity="0.6"
                  />

                  {/* Interactive Snap tracking vertical line / indicator dots */}
                  {hoverIndex !== null && (
                    <>
                      <line 
                        x1={CHART_POINTS[hoverIndex].x} 
                        y1="0" 
                        x2={CHART_POINTS[hoverIndex].x} 
                        y2="300" 
                        stroke="rgba(37, 99, 235, 0.15)" 
                        strokeWidth="1.5" 
                      />
                      <circle 
                        cx={CHART_POINTS[hoverIndex].x} 
                        cy={CHART_POINTS[hoverIndex].y} 
                        r="6" 
                        fill="#2563EB" 
                        stroke="white" 
                        strokeWidth="2.5" 
                      />
                    </>
                  )}
                </svg>

                {/* Flying magnetic floating Snap Tooltip card */}
                {hoverIndex !== null && (
                  <div 
                    className="absolute glass-panel pointer-events-none px-3 py-1.5 rounded-xl border border-blue-200/60 dark:border-blue-800/40 shadow-xl z-20 animate-fade-in text-slate-900 dark:text-white"
                    style={{
                      left: `${hoverPos.x}px`,
                      top: `${hoverPos.y - 65}px`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{hoverData.time}</div>
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-blue-300 mt-0.5">
                      ${hoverData.price.toFixed(2)}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Standard market summary sub metrics metrics */}
            <div className="grid grid-cols-3 gap-6 border-t border-slate-200/50 dark:border-slate-800/10 pt-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Volatility index</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">Moderate 24V</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">24H Trading Vol</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">$1.24B</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Capitalization</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">$65.41B</span>
              </div>
            </div>

          </div>

          {/* AI Conviction thesis model parameters details */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
                <Compass size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Investment Notes</h3>
                <p className="text-xs text-slate-400 mt-1">Aequitas premium allocation synthesis analysis</p>
              </div>
              <span className="ml-auto text-[10px] tracking-wider px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">
                LONG-TERM VIEW
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              <div className="space-y-4">
                {/* Thesis 1 */}
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Network Usage Decay</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Bullish</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Lower gas consumption relative to TPS speed increase indicates extreme network efficiency scaling.
                  </p>
                </div>

                {/* Thesis 2 */}
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Institutional Velocity</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Very High</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Aequitas tracker detects $400M+ whale wallet accumulation over the last 72 hours.
                  </p>
                </div>
              </div>

              {/* Thesis Radial Donut visual representation */}
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36 flex items-center justify-center select-none">
                  
                  {/* Donut SVG structure */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="7" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="41" 
                      fill="none" 
                      stroke="#2563EB" 
                      strokeWidth="7" 
                      strokeDasharray={`${(optPercent * 257.6) / 100} 257.6`} 
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                      {optPercent}%
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Confidence</span>
                  </div>

                </div>

                <div className="mt-4 w-full">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Algorithmic Match</h4>
                  <p className="text-xs text-slate-400 mt-1">Target Core Alignment set at highest confidence.</p>
                  
                  {/* Slider to alter conviction ratio */}
                  <div className="mt-3 px-4">
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={optPercent} 
                      onChange={(e) => setOptPercent(parseInt(e.target.value))}
                      className="accent-[#2563EB] h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic Sidebar widgets (4 columns layout) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Re-balance allocations panel */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">Allocation Guidance</h3>
              <p className="text-xs text-slate-400 mt-1">Optimization suggested based on long-term allocation principles.</p>

              <div className="mt-6 space-y-6">
                
                {/* Allocation 1: Current */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Current Allocation</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">12.5% of Portfolio size</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold font-mono text-slate-600 dark:text-slate-300">
                    {allocationMode === 'default' ? '$42,800' : '$61,500'}
                  </span>
                </div>

                {/* Allocation 2: Target */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50/70 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400">Target Allocation</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">18.0% recommended matrix</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold font-mono text-blue-600 dark:text-blue-400">
                    $61,500
                  </span>
                </div>

              </div>
            </div>

            <button
              onClick={applyOptimization}
              disabled={allocationMode === 'optimized'}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm mt-8 flex items-center justify-center gap-2 ${
                allocationMode === 'optimized'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100/40 dark:border-emerald-900/40 cursor-default shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-98 cursor-pointer'
              }`}
            >
              {allocationMode === 'optimized' ? 'Guidance Aligned Successfully' : 'Align Target Allocation'}
            </button>
          </div>

          {/* Connected Strategy paths tracker */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Long-Term Themes</h3>
              <Sliders size={15} className="text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" />
            </div>

            <div className="space-y-3.5">
              
              {/* Path 1 */}
              <div className="white-card p-4 rounded-2xl border-l-4 border-emerald-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors">Yield Optimization</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Staking and dividend integration.</p>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">+7.2% APY</span>
              </div>

              {/* Path 2 */}
              <div className="white-card p-4 rounded-2xl border-l-4 border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-450 transition-colors">Balanced Growth</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Asset-anchored compound allocation.</p>
                </div>
                <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">+12.4% APY</span>
              </div>

              {/* Path 3 */}
              <div className="white-card p-4 rounded-2xl border-l-4 border-rose-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-rose-650 dark:group-hover:text-rose-450 transition-colors">Risk-Off Pivot</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Defensive cash and stable collateral pairs.</p>
                </div>
                <span className="text-xs font-bold font-mono text-rose-500 dark:text-rose-400 font-bold">Stable</span>
              </div>

            </div>
          </div>

          {/* Warning risk alert card */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-100/50 dark:bg-rose-900/30 text-rose-650 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Liquidity Concentration</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1">
                Primary DEX pool depth decreased by 14% in the subsequent hour blocks. Slippage limits may be dynamic.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
