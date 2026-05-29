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
  Compass,
  Calendar
} from 'lucide-react';
import { AlertItem, Holding } from '../types';

interface PortfolioProps {
  portfolioValue: number;
  onUpdatePortfolio: (value: number) => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  holdings: Holding[];
}

// Sparklines coordinates lists for hover integration
const CHART_POINTS = [
  { x: 0, y: 200, balance: 420000, time: 'Jan 2026' },
  { x: 100, y: 195, balance: 425000, time: 'Feb 2026' },
  { x: 200, y: 180, balance: 440000, time: 'Mar 2026' },
  { x: 300, y: 210, balance: 432000, time: 'Apr 10' },
  { x: 400, y: 190, balance: 448000, time: 'Apr 25' },
  { x: 500, y: 165, balance: 462000, time: 'May 05' },
  { x: 600, y: 170, balance: 460000, time: 'May 12' },
  { x: 700, y: 155, balance: 472000, time: 'May 18' },
  { x: 800, y: 140, balance: 485000, time: 'May 22' },
  { x: 900, y: 145, balance: 482000, time: 'May 25' },
  { x: 1000, y: 120, balance: 485290.00, time: 'Today' },
];

export default function PortfolioTab({
  portfolioValue,
  onUpdatePortfolio,
  onTriggerAlert,
  holdings
}: PortfolioProps) {
  const [chartRange, setChartRange] = useState<'1H' | '1D' | '1W' | '1M'>('1M');
  const [alignmentStatus, setAlignmentStatus] = useState<'standard' | 'aligned'>('standard');
  const [optPercent, setOptPercent] = useState(94.8);

  // Soft ticking to show simulation feel
  const [priceChange24h, setPriceChange24h] = useState(1.42);

  // Tooltip tracking states
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [hoverData, setHoverData] = useState({ balance: 485290.00, time: 'Today' });

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
      balance: closestIndex === 10 ? portfolioValue : activePoint.balance,
      time: activePoint.time
    });
  };

  const applyAlignment = () => {
    setAlignmentStatus('aligned');
    setOptPercent(98.5);
    // Standard rebalancing simulation (add dry powder or shift cash)
    onTriggerAlert({
      type: 'success',
      typeLabel: 'PLAN ALIGNED',
      title: 'Allocation Guidance Met',
      description: 'Your upcoming monthly DCA target lists have been updated to direct flows into Core S&P 500 and Cash Buffers.'
    });
  };

  const gainLossTotal = holdings.reduce((sum, h) => sum + h.gainLoss, 0);
  const avgCostBasis = portfolioValue - gainLossTotal;
  const gainPctTotal = avgCostBasis > 0 ? (gainLossTotal / avgCostBasis) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-slate-100 pb-12 font-sans">
      
      {/* Immersive skyscrapers header */}
      <section className="relative h-[340px] w-full rounded-2xl overflow-hidden flex items-end pb-8 px-6 sm:px-8 border border-slate-200/50 dark:border-slate-800/20 shadow-sm bg-slate-900">
        
        {/* Background image of professional skyscrapers at sunrise */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#0F172A] dark:via-[#0F172A]/70 dark:to-transparent z-10" />
          <img 
            alt="Luminous Modern Corporate Skyscrapers"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-105 saturate-100 opacity-95 dark:opacity-30 transition-all duration-500"
          />
        </div>

        {/* Info elements representing capital stewardship */}
        <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50/90 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/30 rounded-full text-blue-600 dark:text-blue-450 text-[10px] font-bold tracking-wider leading-none flex items-center gap-1.5 shadow-none">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                OFFLINE ACTIVE PARAMS
              </span>
              <span className="text-xs font-bold text-slate-450 dark:text-slate-400 tracking-wider font-mono">NON-CUSTODIAL PORTFOLIO</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Portfolio Overview</h2>
            <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 max-w-xl leading-relaxed">
              Consolidated strategic holding models. View your visual growth path, calibrate target confidence levels, and analyze drift guidelines without custody exposure.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex gap-4 self-start md:self-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            
            {/* Metric 1 */}
            <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl px-5 py-3.5 rounded-2xl flex flex-col gap-0.5 min-w-[140px] border border-slate-205/80 dark:border-slate-800/40 shadow-sm select-none">
              <span className="text-[9px] tracking-wider text-slate-400 dark:text-slate-500 uppercase font-extrabold">AGGREGATE GAIN</span>
              <span className="text-2xl font-bold tracking-tight text-[#ba1a1a] dark:text-[#ffb4ab] transition-all">
                +${gainLossTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-emerald-650 dark:text-emerald-405 text-xs font-semibold flex items-center gap-0.5">
                <ArrowUpRight size={13} strokeWidth={2.5} />
                +{gainPctTotal.toFixed(2)}% total
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl px-5 py-3.5 rounded-2xl flex flex-col gap-0.5 min-w-[140px] border border-slate-205/80 dark:border-slate-800/40 shadow-sm select-none">
              <span className="text-[9px] tracking-wider text-slate-400 dark:text-slate-500 uppercase font-extrabold text-blue-600">HEALTH INDEX</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {optPercent}%
              </span>
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase mt-0.5">
                Optimal Margin
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 relative min-h-[400px] flex flex-col justify-between shadow-sm bg-white">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Growth Projection & History</h3>
                  <p className="text-xs text-slate-400 mt-1">Calming interactive valuation trajectory constructed from your historical snapshots.</p>
                </div>
                
                {/* Interval Toggles */}
                <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl w-fit border border-slate-200/40 dark:border-slate-800/20">
                  {(['1D', '1W', '1M'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setChartRange(range)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        chartRange === range 
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-[#FAF7F2] shadow-sm font-bold' 
                          : 'text-slate-450 hover:text-slate-800 dark:hover:text-slate-350'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced SVG Interactive Chart Layout with tooltips */}
              <div className="relative w-full h-56 rounded-2xl bg-blue-50/20 dark:bg-slate-905/15 border border-slate-100 dark:border-slate-800/40 overflow-visible select-none py-2">
                
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
                      <stop offset="0%" stopColor="rgba(37, 99, 235, 0.1)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="75" x2="1000" y2="75" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>
                  <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3"/>
-
                  {/* Areas Fill */}
                  <path 
                    d="M0 200 L 100 195 L 200 180 L 300 210 L 400 190 L 500 165 L 600 170 L 700 155 L 800 140 L 900 145 L 1000 120 L 1000 300 L 0 300 Z" 
                    fill="url(#chartFill)" 
                  />
                  
                  {/* Performance curve primary line */}
                  <path 
                    d="M0 200 L 100 195 L 200 180 L 300 210 L 400 190 L 500 165 L 600 170 L 700 155 L 800 140 L 900 145 L 1000 120" 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeLinecap="round" 
                    strokeWidth="3" 
                    className="transition-all duration-300"
                  />

                  {/* Intersect Snap indicator dotted tracker */}
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
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hoverData.time}</div>
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-blue-500 mt-0.5">
                      ${hoverData.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Standard market summary sub metrics */}
            <div className="grid grid-cols-3 gap-6 border-t border-slate-200/50 dark:border-slate-800/10 pt-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Volatility standard (beta)</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">0.82 Stable</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Monthly reinvest flow</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">DCA Enabled</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Holding Assets Count</span>
                <span className="text-base sm:text-lg font-black block mt-0.5 text-slate-800 dark:text-slate-100">{holdings.length} Positions</span>
              </div>
            </div>

          </div>

          {/* AI Advisor thesis parameters */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm bg-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
                <Compass size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">Strategic Allocation Moat</h3>
                <p className="text-xs text-slate-400 mt-1">Situational reviews of core holdings.</p>
              </div>
              <span className="ml-auto text-[10px] tracking-wider px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                COMPLIANCE EYE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                {/* Thesis 1 */}
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Growth Stocks Momentum</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-650 dark:text-emerald-450">Active Compounding</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                    Strong underlying EPS growth among US growth equities continues to justify the current Growth allocation (44.3%). No tactical actions required.
                  </p>
                </div>

                {/* Thesis 2 */}
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex justify-between items-baseline mb-1 font-sans">
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Thai RMF Tax efficiency</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Perfect hedge</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-0.5">
                    Kasikorn RMF assets provide robust local income deduction wrapper, securing tax write-offs up to legal limit bounds automatically.
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
                      className="transition-all duration-500"
                    />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                      {optPercent.toFixed(1)}%
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Health</span>
                  </div>

                </div>

                <div className="mt-4 w-full">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Accordance Rating</h4>
                  <p className="text-xs text-slate-400 mt-1">Calibration margin relative to goals.</p>
                  
                  <div className="mt-3 px-4">
                    <input 
                      type="range" 
                      min="70" 
                      max="100" 
                      step="0.5"
                      value={optPercent} 
                      onChange={(e) => setOptPercent(parseFloat(e.target.value))}
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[350px] bg-white">
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">Allocation Alignment Guidance</h3>
              <p className="text-xs text-slate-400 mt-1">Calibration suggestion based on S&P 500 relative valuation vectors.</p>

              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-805/30 flex items-center justify-center text-slate-400">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-850 dark:text-slate-200">Current S&P ETF Layer</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">31.7% of portfolio weight</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold font-mono text-slate-600 dark:text-slate-300">
                    $154,000
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50/70 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-300 animate-pulse">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400">Suggested target plan</h4>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">35.0% allocation weight</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold font-mono text-blue-600 dark:text-blue-300">
                    $169,850
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={applyAlignment}
              disabled={alignmentStatus === 'aligned'}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-sm mt-8 flex items-center justify-center gap-2 ${
                alignmentStatus === 'aligned'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100/45 cursor-default shadow-none font-bold'
                  : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-98 cursor-pointer font-bold'
              }`}
            >
              {alignmentStatus === 'aligned' ? 'Guidance Aligned Successfully' : 'Align Target Allocation'}
            </button>
          </div>

          {/* Connected Strategy paths tracker */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Active Reinvestment Channels</h3>
              <Sliders size={15} className="text-slate-400" />
            </div>

            <div className="space-y-3.5">
              <div className="white-card p-4 rounded-2xl border-l-4 border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">Core ETF DCA</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Vanguard VOO accumulation flow.</p>
                </div>
                <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-300">$1,500/mo</span>
              </div>

              <div className="white-card p-4 rounded-2xl border-l-4 border-emerald-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-emerald-650 transition-colors">Thai deductible SSF/RMF</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Kasikorn S&P RMF retirement support.</p>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-650 dark:text-emerald-400">$1,200/mo</span>
              </div>

              <div className="white-card p-4 rounded-2xl border-l-4 border-purple-650 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all cursor-pointer group flex justify-between items-center bg-white border border-slate-100 dark:bg-slate-950/20 dark:border-slate-900/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-purple-650 transition-colors">Dividend Income Layer</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">JEPQ overlay compounding plan.</p>
                </div>
                <span className="text-xs font-bold font-mono text-purple-600">$800/mo</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
