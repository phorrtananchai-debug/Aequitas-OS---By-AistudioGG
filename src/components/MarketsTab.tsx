import { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  DollarSign, 
  Plus, 
  Minus,
  Coins,
  History
} from 'lucide-react';
import { AlertItem } from '../types';

interface MarketsProps {
  searchQuery: string;
  onExecuteTrade: () => void;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
}

interface AssetInfo {
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  cap: string;
  trend: number[];
  logo: string;
}

const INITIAL_ASSETS: AssetInfo[] = [
  { ticker: 'SOL', name: 'Solana', price: 148.24, change: 5.2, volume: '$1.2B', cap: '$65.4B', trend: [135, 137, 134, 140, 144, 142, 146, 145, 148.24], logo: 'S' },
  { ticker: 'BTC', name: 'Bitcoin', price: 68420.00, change: 2.4, volume: '$32.8B', cap: '$1.3T', trend: [67100, 67400, 67200, 67800, 68100, 68000, 68420], logo: 'B' },
  { ticker: 'ETH', name: 'Ethereum', price: 3480.50, change: -1.2, volume: '$14.1B', cap: '$418.2B', trend: [3550, 3530, 3510, 3495, 3485, 3480.50], logo: 'E' },
  { ticker: 'JUP', name: 'Jupiter', price: 1.15, change: 8.7, volume: '$210M', cap: '$1.5B', trend: [1.02, 1.05, 1.04, 1.08, 1.12, 1.15], logo: 'J' },
  { ticker: 'PYTH', name: 'Pyth Network', price: 0.52, change: -3.8, volume: '$84M', cap: '$780M', trend: [0.55, 0.54, 0.53, 0.52], logo: 'P' },
];

export default function MarketsTab({
  searchQuery,
  onExecuteTrade,
  onTriggerAlert
}: MarketsProps) {
  const [assets, setAssets] = useState<AssetInfo[]>(INITIAL_ASSETS);
  const [activeAsset, setActiveAsset] = useState<AssetInfo>(INITIAL_ASSETS[0]);
  
  // Simulated bids asks orders lists
  const [orderBook, setOrderBook] = useState<{ price: number; amount: number; type: 'bid' | 'ask' }[]>([]);

  // Periodically fluctuate rates and update bids/asks order listings
  useEffect(() => {
    // Generate initial order details
    const initialOrders: typeof orderBook = [];
    for (let i = 0; i < 6; i++) {
      initialOrders.push({
        price: activeAsset.price + (Math.random() * activeAsset.price * 0.005),
        amount: Math.random() * 50 + 2,
        type: 'ask'
      });
      initialOrders.push({
        price: activeAsset.price - (Math.random() * activeAsset.price * 0.005),
        amount: Math.random() * 50 + 2,
        type: 'bid'
      });
    }
    setOrderBook(initialOrders.sort((a, b) => b.price - a.price));

    const priceInterval = setInterval(() => {
      // fluctuation setup
      setAssets(prev => prev.map(item => {
        const drift = (Math.random() - 0.48) * 0.03;
        const multiplier = item.price > 1000 ? 5 : item.price > 100 ? 0.2 : 0.01;
        const newPrice = Math.max(0.01, item.price + drift * multiplier);
        const nextPrice = parseFloat(newPrice.toFixed(item.price > 10 ? 2 : 4));
        const changeDrift = drift * 0.1;
        
        if (item.ticker === activeAsset.ticker) {
          setActiveAsset(prevAct => ({
            ...prevAct,
            price: nextPrice,
            change: parseFloat((prevAct.change + changeDrift).toFixed(2))
          }));
        }
        return {
          ...item,
          price: nextPrice,
          change: parseFloat((item.change + changeDrift).toFixed(2))
        };
      }));

      // Simulate order book dynamic ticks
      setOrderBook(prev => {
        const next = [...prev];
        const replaceIdx = Math.floor(Math.random() * next.length);
        const type = next[replaceIdx].type;
        const offset = type === 'ask' 
          ? (Math.random() * activeAsset.price * 0.005) 
          : -(Math.random() * activeAsset.price * 0.005);
        
        next[replaceIdx] = {
          price: parseFloat((activeAsset.price + offset).toFixed(activeAsset.price > 10 ? 2 : 4)),
          amount: parseFloat((Math.random() * 80 + 1).toFixed(2)),
          type
        };
        return next.sort((a, b) => b.price - a.price);
      });

    }, 2000);

    return () => clearInterval(priceInterval);
  }, [activeAsset.ticker]);

  const filteredAssets = assets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 pb-12">
      
      {/* Intro section heading */}
      <section>
        <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors">
          Asset & Market Matrix
        </h2>
        <p className="text-sm text-[#6F685F] dark:text-slate-400 mt-2">
          Selected long-term assets, baseline target performance ranges, and registered liquidity depths.
        </p>
      </section>

      {/* Grid container: Assets overview list and central asset trade book */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Assets List columns (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">SELECT ASSET</span>
            <h3 className="text-base font-extrabold tracking-tight mt-1 mb-5">Tracked Institutional Collaterals</h3>

            <div className="space-y-3">
              {filteredAssets.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No assets match search parameters.</p>
              ) : (
                filteredAssets.map((asset) => {
                  const isSelected = asset.ticker === activeAsset.ticker;
                  const isPositive = asset.change >= 0;
                  
                  return (
                    <div
                       id={`market-asset-${asset.ticker}`}
                      key={asset.ticker}
                      onClick={() => {
                        setActiveAsset(asset);
                        onTriggerAlert({
                          type: 'advisory',
                          typeLabel: 'MARKET SELECTION',
                          title: `Tracking asset: ${asset.ticker}`,
                          description: `Set live visual tickers strictly to active configuration of ${asset.name}.`
                        });
                      }}
                      className={`p-4 rounded-2xl glass-panel cursor-pointer transition-all duration-300 flex items-center justify-between border ${
                        isSelected 
                          ? 'border-blue-600 dark:border-blue-400 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/10' 
                          : 'border-slate-200/50 dark:border-slate-850 hover:border-blue-500 bg-white dark:bg-slate-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm ${
                          isSelected 
                            ? 'bg-blue-600 text-white dark:bg-blue-600' 
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {asset.logo}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-slate-805 dark:text-slate-200">{asset.ticker}</span>
                            <span className="text-[11px] text-slate-400">{asset.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">Vol: {asset.volume}</span>
                        </div>
                      </div>

                      {/* Sparkline column block minimal render */}
                      <div className="hidden sm:block w-24 h-8 select-none overflow-hidden">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                          <polyline
                            fill="none"
                            stroke={isPositive ? '#10b981' : '#e11d48'}
                            strokeWidth="2"
                            points={asset.trend.map((val, idx) => {
                              const min = Math.min(...asset.trend);
                              const max = Math.max(...asset.trend);
                              const range = max - min || 1;
                              const x = (idx / (asset.trend.length - 1)) * 100;
                              const y = 30 - ((val - min) / range) * 26 - 2;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                        </svg>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold block text-slate-900 dark:text-white">
                          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>
                        <span className={`text-xs font-bold inline-flex items-center mt-0.5 gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {asset.change.toFixed(2)}%
                        </span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-slate-200/50 dark:border-slate-800/20 pt-4 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-slate-400">Institutional routing aligned to strategic allocations</span>
            <button 
              onClick={onExecuteTrade}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Review Limits
            </button>
          </div>
        </div>

        {/* Dynamic Live order book (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between border border-slate-205/60 dark:border-slate-800/25">
          <div>
            <div className="flex justify-between items-start pb-4 border-b border-slate-250/20 dark:border-slate-800/15 mb-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">{activeAsset.ticker} CAPITAL BANDS</span>
                <h4 className="text-sm font-extrabold text-slate-905 dark:text-white mt-0.5 animate-fade-in">Strategic Range Boundaries</h4>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-extrabold text-blue-600 dark:text-indigo-400 block">${activeAsset.price.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Aggregated Spot Rate</span>
              </div>
            </div>

            {/* Bids Asks columns lists layout mapping exactly like terminal depth lists */}
            <div className="space-y-3.5">
              
              {/* Asks (Sellers) */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Lower Reserve Limit</span>
                  <span>Target Ratio ({activeAsset.ticker})</span>
                </div>
                {orderBook.filter(o => o.type === 'ask').slice(0, 4).map((record, i) => (
                  <div key={`ask-${i}`} className="flex justify-between text-slate-400 dark:text-slate-400 items-center">
                    <span>${record.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-right">{record.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Spread marker row */}
              <div className="py-2.5 bg-blue-50/20 dark:bg-slate-900/35 rounded-xl text-center font-mono text-xs font-bold text-blue-600 dark:text-[#a5b4fc] border border-blue-500/10 shadow-sm flex justify-around">
                <span>Spread Tolerance: {(activeAsset.price * 0.001).toFixed(activeAsset.price > 10 ? 2 : 4)}</span>
                <span>Alignment Variance: 0.10%</span>
              </div>

              {/* Bids (Buyers) */}
              <div className="space-y-1.5 font-mono text-xs">
                {orderBook.filter(o => o.type === 'bid').slice(0, 4).map((record, i) => (
                  <div key={`bid-${i}`} className="flex justify-between text-black dark:text-slate-200 items-center font-bold">
                    <span>${record.price.toLocaleString()}</span>
                    <span className="text-slate-400 text-right font-normal">{record.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onExecuteTrade}
              className="w-full py-4 bg-blue-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-none hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer dark:bg-white dark:text-blue-650 dark:hover:bg-slate-100"
            >
              Review Plan for {activeAsset.ticker}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
