import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Workflow, 
  AlertTriangle, 
  Coins, 
  Check, 
  Download, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  Play,
  Percent,
  Calculator,
  ShieldCheck,
  Building
} from 'lucide-react';
import { TabType, AlertItem, SimulationRun } from '../types';

interface ModalsProps {
  tradeModalOpen: boolean;
  onCloseTradeModal: () => void;
  analysisModalOpen: boolean;
  onCloseAnalysisModal: () => void;
  settingsModalOpen: boolean;
  onCloseSettingsModal: () => void;
  supportModalOpen: boolean;
  onCloseSupportModal: () => void;
  
  portfolioValue: number;
  onUpdatePortfolio: (value: number) => void;
  onAddActivity: (activity: { type: 'Hold' | 'Review' | 'Manual Action' | 'Contribution' | 'Reduce'; asset: string; amount: number; price?: number; total?: number; notes?: string }) => void;
  onAddSimulation: (sim: Omit<SimulationRun, 'id'>) => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

export default function Modals({
  tradeModalOpen,
  onCloseTradeModal,
  analysisModalOpen,
  onCloseAnalysisModal,
  settingsModalOpen,
  onCloseSettingsModal,
  supportModalOpen,
  onCloseSupportModal,
  portfolioValue,
  onUpdatePortfolio,
  onAddActivity,
  onAddSimulation,
  onTriggerAlert
}: ModalsProps) {

  // Trade Modal states
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedAsset, setSelectedAsset] = useState('VOO');
  const [tradeAmount, setTradeAmount] = useState(10);
  const [tradePrice, setTradePrice] = useState(485.50);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);

  // Analysis Modal states
  const [selectedStrategy, setSelectedStrategy] = useState('Momentum Alpha V3');
  const [accuracyTarget, setAccuracyTarget] = useState(92);
  const [targetRisk, setTargetRisk] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Settings states
  const [inputVal, setInputVal] = useState(portfolioValue);

  // Asset Price reference mapper
  const getAssetPrice = (symbol: string) => {
    switch(symbol) {
      case 'VOO': return 485.50;
      case 'K-US500XRMF': return 15.39;
      case 'SCHD': return 78.20;
      case 'TLT': return 92.40;
      case 'JEPQ': return 54.10;
      default: return 100;
    }
  };

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setTradePrice(getAssetPrice(asset));
  };

  const handleExecuteTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeAmount <= 0) return;

    const cost = tradeAmount * tradePrice;
    if (tradeType === 'BUY' && cost > (portfolioValue || 0)) {
      onTriggerAlert({
        type: 'high',
        typeLabel: 'CLEARING ERROR',
        title: 'Insufficient Cash Collateral',
        description: `Your order size ($${cost.toLocaleString()}) exceeds active ledger cache limits ($${(portfolioValue || 0).toLocaleString()}).`
      });
      return;
    }

    setIsExecutingTrade(true);
    setTimeout(() => {
      // Modify capital reserves
      const valueDiff = tradeType === 'BUY' ? -cost : cost;
      onUpdatePortfolio(portfolioValue + valueDiff);

      // Save clearing record
      onAddActivity({
        type: tradeType === 'BUY' ? 'Manual Action' : 'Reduce',
        asset: selectedAsset,
        amount: cost,
        price: tradePrice,
        total: cost,
        notes: `Spot order clearing: ${tradeType === 'BUY' ? 'Added' : 'Reduced'} ${tradeAmount} units of ${selectedAsset}`
      });

      onTriggerAlert({
        type: 'success',
        typeLabel: 'SETTLED',
        title: `Asset ${tradeType} Settled!`,
        description: `Spot order clearing for ${tradeAmount} ${selectedAsset} processed at speed bounds under 5ms.`
      });

      setIsExecutingTrade(false);
      onCloseTradeModal();
    }, 1500);
  };

  const handleExecuteAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSynthesizing(true);

    setTimeout(() => {
      const generatedApy = parseFloat((Math.random() * 35 + 8).toFixed(1));
      const drawdown = parseFloat((Math.random() * 12 + 0.5).toFixed(2));
      const simId = `SIM-${Math.floor(Math.random() * 9000 + 1000)}`;

      onAddSimulation({
        strategyName: selectedStrategy,
        network: 'Turing Neural Node cluster',
        modelAccuracy: accuracyTarget,
        maxDrawdown: drawdown,
        projApy: generatedApy,
        status: 'RUNNING'
      });

      onTriggerAlert({
        type: 'success',
        typeLabel: 'SIMULATION ACTIVE',
        title: `Simulation ${simId} Live`,
        description: `Synchronized strategy tracing model with target parameters set successfully.`
      });

      setIsSynthesizing(false);
      onCloseAnalysisModal();
    }, 2000);
  };

  const saveSettings = () => {
    onUpdatePortfolio(inputVal);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'CONFIG UPDATED',
      title: 'Reserves Limits Set',
        description: `Active core portfolio ledger total value adjusted to $${(inputVal || 0).toLocaleString()} safely.`
    });
    onCloseSettingsModal();
  };

  return (
    <>
      {/* 1. EXECUTE SPOT TRADE DIALOG */}
      {tradeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-white/30 dark:border-slate-800">
            <button
              onClick={onCloseTradeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleExecuteTradeSubmit} className="p-6 space-y-5 text-slate-855 dark:text-slate-100">
              <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400">
                <Coins size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Aequitas Register</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Review Allocation Plan</h3>
                <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Configure limits and adjust holding balances in the long-term wealth environment.</p>
              </div>

              {/* BUY / SELL Switch */}
              <div className="flex bg-slate-100/80 dark:bg-slate-900/55 p-1 rounded-xl border border-slate-205/10 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                    tradeType === 'BUY'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  ADD ALLOCATION
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-1.5 px-4 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                    tradeType === 'SELL'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 shadow-none'
                      : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  REDUCE ALLOCATION
                </button>
              </div>

              {/* Asset picker */}
              <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
                <label>Registered Asset Ticker</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none text-xs"
                >
                  {['VOO', 'K-US500XRMF', 'SCHD', 'TLT', 'JEPQ'].map(ticker => (
                    <option key={ticker} value={ticker}>{ticker} - Core holding</option>
                  ))}
                </select>
              </div>

              {/* Price and quantity row info inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
                  <label>Asset Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350 font-sans">
                  <label>Target Price (USD)</label>
                  <input
                    type="number"
                    step="any"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Costs summary breakdown */}
              <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-200/20 text-xs font-medium space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Available Liquidity:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">${portfolioValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-205/10 pt-1 text-sm font-bold text-slate-900 dark:text-indigo-400">
                  <span>Estimated Total Clears:</span>
                  <span className="font-mono font-black">${(tradeAmount * tradePrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Placing order triggers loader */}
              <button
                type="submit"
                disabled={isExecutingTrade}
                className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow ${
                  isExecutingTrade
                    ? 'bg-slate-400 text-slate-100 cursor-default animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-extrabold'
                }`}
              >
                {isExecutingTrade ? 'Aligning portfolio parameters...' : 'CONFIRM ALLOCATION REVIEW'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. INITIATE ANALYSIS WIZARD MODAL */}
      {analysisModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-white/30 dark:border-slate-800">
            <button
              onClick={onCloseAnalysisModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleExecuteAnalysis} className="p-6 space-y-5 text-slate-800 dark:text-slate-100">
              <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400">
                <Workflow size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Thematic Models</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Initiate Allocation Analysis</h3>
                <p className="text-xs text-slate-400 mt-1">Setup distributed scenario calculations targeting customized allocation targets.</p>
              </div>

              {/* Strategy Name entry selection */}
              <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
                <label>Thematic Allocation Archetype</label>
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none text-xs text-slate-800"
                >
                  <option value="Compounding Momentum">Compounding Momentum - Multi-Quarter Baseline</option>
                  <option value="Conservative Mean Reversion">Conservative Mean Reversion</option>
                  <option value="Symmetric Covered Yield">Symmetric Covered Yield</option>
                  <option value="High-Conviction Real Assets">High-Conviction Real Assets</option>
                </select>
              </div>

              {/* Target Accuracy sliding metrics percentage limits */}
              <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
                <div className="flex justify-between items-baseline">
                  <label>Model Compliance Target Ratio</label>
                  <span className="font-mono text-blue-600 font-bold">{accuracyTarget}% Accordance</span>
                </div>
                <input 
                  type="range"
                  min="60"
                  max="99"
                  value={accuracyTarget}
                  onChange={(e) => setAccuracyTarget(parseInt(e.target.value))}
                  className="accent-blue-600 h-1.5 w-full bg-slate-200 rounded-lg cursor-pointer animate-none"
                />
              </div>

              {/* Risk selection pills */}
              <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
                <label>Risk Vector Boundaries</label>
                <div className="flex bg-slate-100/80 dark:bg-slate-900/40 p-1 rounded-xl gap-2 cursor-pointer">
                  {(['LOW', 'MED', 'HIGH'] as const).map((risk) => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() => setTargetRisk(risk)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                        targetRisk === risk 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-650'
                      }`}
                    >
                      {risk} INDEX
                    </button>
                  ))}
                </div>
              </div>

              {/* Placing order triggers loader */}
              <button
                type="submit"
                disabled={isSynthesizing}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                {isSynthesizing ? (
                  <>
                    <Sparkles size={13} className="animate-spin-slow text-[#FAF7F2]" />
                    Optimizing allocation weights...
                  </>
                ) : (
                  <>
                    <Play size={10} fill="currentColor" />
                    RUN STRATEGIC ALIGNMENT SCENARIO
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SETTINGS MANAGE PANELS MODAL */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border border-white/30 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
            <button
              onClick={onCloseSettingsModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="space-y-4">
              <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Configuration Engine</span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Admin System Limits</h3>
                <p className="text-xs text-slate-450 mt-1">Direct wealth constraints configuration models.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-450 dark:text-slate-350">Capital Ledger Base size (USD)</label>
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className="p-3 bg-slate-100/50 dark:bg-slate-900/30 rounded-xl space-y-1.5 text-[10px] leading-relaxed text-slate-400">
                  <div className="flex justify-between">
                    <span>Authorized Clearances:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">Class 1 Private Wealth</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Gateway Interface:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">Aequitas Wealth OS Loop</span>
                  </div>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-none transition-all cursor-pointer mt-4"
              >
                Save Core Limit Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUPPORT DRAWER DETAILS MODAL */}
      {supportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-white/30 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
            <button
              onClick={onCloseSupportModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="space-y-4">
              <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400">
                <HelpCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Aequitas Support FAQ</span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-blue-600 dark:text-white">Assistance Clearing Center</h3>
                <p className="text-xs text-slate-450 mt-1">Frequently optimized queries regarding the Aequitas platform.</p>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                
                {/* Q1 */}
                <div className="p-3 bg-slate-100/40 dark:bg-slate-900/20 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex gap-2 items-start">
                    <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[9px] text-[#FAF7F2] shrink-0 font-bold">Q</span>
                    How do I allocate yields to Covered Income?
                  </h4>
                  <p className="text-[11px] text-[#6F685F] dark:text-slate-400 leading-normal mt-1.5 pl-6">
                    Symmetric covered income offsets direct variance. Select the Symmetric Covered Yield segment card under Portfolio themes to run long-term guidance models with target APY rate up to **12.4%** safely.
                  </p>
                </div>

                {/* Q2 */}
                <div className="p-3 bg-slate-100/40 dark:bg-slate-900/20 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 flex gap-2 items-start">
                    <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[9px] text-[#FAF7F2] shrink-0 font-bold font-sans">Q</span>
                    What is the Accordance rating of the Advisor?
                  </h4>
                  <p className="text-[11px] text-[#6F685F] dark:text-slate-400 leading-normal mt-1.5 pl-6">
                    Advisor accordance ratings evaluate 30 past quarterly models, validating metrics compliance. Target ranges average **98.2%** to confirm risk parameters.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
