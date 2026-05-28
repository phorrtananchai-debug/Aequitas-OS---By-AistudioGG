import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Globe, 
  Calculator, 
  Calendar, 
  ArrowUpRight, 
  Check, 
  TrendingUp, 
  Edit3, 
  CheckCircle2,
  RefreshCw,
  Sliders,
  AlertCircle,
  ShieldAlert,
  Trash2,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { Holding, ThaiFundNavState, AlertItem, FinancialSettings } from '../types';
import { formatCurrency } from '../core/utils';

interface HoldingsTabProps {
  searchQuery: string;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  holdings: Holding[];
  onUpdateHoldings: (nextHoldings: Holding[]) => void;
  thaiFundNavs: ThaiFundNavState[];
  onUpdateThaiFundNavs: (nextNavs: ThaiFundNavState[]) => void;
  financialSettings: FinancialSettings;
}

export default function MarketsTab({
  searchQuery,
  onTriggerAlert,
  holdings,
  onUpdateHoldings,
  thaiFundNavs,
  onUpdateThaiFundNavs,
  financialSettings
}: HoldingsTabProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingAsset, setIsAddingAsset] = useState<boolean>(false);
  
  // Inline edit / Add state values
  const [editTicker, setEditTicker] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editType, setEditType] = useState<string>('US Stock');
  const [editUnits, setEditUnits] = useState<string>('');
  const [editAvgCost, setEditAvgCost] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Thai NAV bridge inputs state
  const [updatingThaiTicker, setUpdatingThaiTicker] = useState<string | null>(null);
  const [thaiNavInput, setThaiNavInput] = useState<string>('');

  const handleStartEdit = (h: Holding) => {
    setEditingId(h.id);
    setEditTicker(h.ticker);
    setEditName(h.name);
    setEditType(h.type);
    setEditUnits(h.units.toString());
    setEditAvgCost(h.avgCost.toString());
    setEditPrice(h.currentPrice.toString());
    setEditNotes(h.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    const unitsVal = parseFloat(editUnits);
    const avgCostVal = parseFloat(editAvgCost);
    const currentPriceVal = parseFloat(editPrice);

    if (isNaN(unitsVal) || isNaN(avgCostVal) || isNaN(currentPriceVal)) {
      onTriggerAlert({
        type: 'high',
        typeLabel: 'VALIDATION ACTION',
        title: 'Invalid Parameters',
        description: 'Units, Average Cost, and Current NAV must be valid positive numeric coordinates.'
      });
      return;
    }

    const valueCalculated = unitsVal * currentPriceVal;
    const initialCostVal = unitsVal * avgCostVal;
    const calculatedGain = valueCalculated - initialCostVal;
    const gainPct = initialCostVal > 0 ? (calculatedGain / initialCostVal) * 100 : 0;

    const nextHoldings = holdings.map(h => {
      if (h.id === id) {
        return {
          ...h,
          ticker: editTicker.toUpperCase(),
          name: editName,
          type: editType as any,
          units: unitsVal,
          avgCost: avgCostVal,
          currentPrice: currentPriceVal,
          value: parseFloat(valueCalculated.toFixed(2)),
          gainLoss: parseFloat(calculatedGain.toFixed(2)),
          gainLossPct: parseFloat(gainPct.toFixed(2)),
          notes: editNotes
        };
      }
      return h;
    });

    // Re-tweak percentages based on next total sum
    const totalSum = nextHoldings.reduce((sum, current) => sum + current.value, 0);
    const finalizedHoldings = nextHoldings.map(h => ({
      ...h,
      allocationPct: parseFloat(((h.value / totalSum) * 100).toFixed(2))
    }));

    onUpdateHoldings(finalizedHoldings);
    setEditingId(null);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'HOLDING RE-SYNCED',
      title: 'Ledger Holding Updated',
      description: `Manually reconciled parameters successfully. Total position size recalibrated to ${formatCurrency(valueCalculated, financialSettings)}.`
    });
  };

  const handleTriggerThaiNavUpdate = (ticker: string) => {
    setUpdatingThaiTicker(ticker);
    const match = thaiFundNavs.find(f => f.ticker === ticker);
    if (match) {
      setThaiNavInput(match.nav.toString());
    }
  };

  const handleSaveThaiNav = (ticker: string) => {
    const navVal = parseFloat(thaiNavInput);
    if (isNaN(navVal) || navVal <= 0) return;

    // 1. Update Thai Fund NAV Bridge
    const nextNavs = thaiFundNavs.map(f => {
      if (f.ticker === ticker) {
        return { ...f, nav: navVal, lastUpdated: new Date().toISOString().split('T')[0], isStale: false };
      }
      return f;
    });
    onUpdateThaiFundNavs(nextNavs);

    // 2. Cascade changes back to holdings asset values
    // Important: Convert THB NAV to USD for the value property if base is USD
    const fxRate = financialSettings.usdThbRate || 36.45;
    const matchNav = nextNavs.find(f => f.ticker === ticker);
    const nextHoldings = holdings.map(h => {
      if (h.ticker === ticker && matchNav) {
        const nextValueThb = h.units * navVal;
        const nextValueUsd = nextValueThb / fxRate;
        const totalCostAndBasisUsd = h.units * h.avgCost;
        const calculatedGainUsd = nextValueUsd - totalCostAndBasisUsd;
        const gainPct = totalCostAndBasisUsd > 0 ? (calculatedGainUsd / totalCostAndBasisUsd) * 100 : 0;
        return {
          ...h,
          currentPrice: navVal, // Store NAV in THB for Thai assets
          value: parseFloat(nextValueUsd.toFixed(2)),
          gainLoss: parseFloat(calculatedGainUsd.toFixed(2)),
          gainLossPct: parseFloat(gainPct.toFixed(2))
        };
      }
      return h;
    });

    const totalSum = nextHoldings.reduce((sum, current) => sum + current.value, 0);
    const finalHoldings = nextHoldings.map(h => ({
      ...h,
      allocationPct: parseFloat(((h.value / totalSum) * 100).toFixed(2))
    }));

    onUpdateHoldings(finalHoldings);
    setUpdatingThaiTicker(null);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'THAI FUND RECONCILED',
      title: `${ticker} NAV Updated`,
      description: `NAV bridged to ${navVal} THB. Total sub-portfolio aggregates synchronized accordingly.`
    });
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const unitsVal = parseFloat(editUnits);
    const avgCostVal = parseFloat(editAvgCost);
    const currentPriceVal = parseFloat(editPrice);

    if (!editTicker || isNaN(unitsVal) || isNaN(avgCostVal) || isNaN(currentPriceVal)) {
      onTriggerAlert({
        type: 'high',
        typeLabel: 'VALIDATION ACTION',
        title: 'Missing Parameters',
        description: 'Please provide ticker, units, cost and price.'
      });
      return;
    }

    const valueCalculated = unitsVal * currentPriceVal;
    const initialCostVal = unitsVal * avgCostVal;
    const calculatedGain = valueCalculated - initialCostVal;
    const gainPct = initialCostVal > 0 ? (calculatedGain / initialCostVal) * 100 : 0;

    const newHolding: Holding = {
      id: `h-${Date.now()}`,
      ticker: editTicker.toUpperCase(),
      name: editName || editTicker.toUpperCase(),
      type: editType as any,
      units: unitsVal,
      avgCost: avgCostVal,
      currentPrice: currentPriceVal,
      value: parseFloat(valueCalculated.toFixed(2)),
      gainLoss: parseFloat(calculatedGain.toFixed(2)),
      gainLossPct: parseFloat(gainPct.toFixed(2)),
      allocationPct: 0,
      notes: editNotes
    };

    const nextHoldings = [...holdings, newHolding];
    const totalSum = nextHoldings.reduce((sum, current) => sum + current.value, 0);
    const finalizedHoldings = nextHoldings.map(h => ({
      ...h,
      allocationPct: parseFloat(((h.value / totalSum) * 100).toFixed(2))
    }));

    onUpdateHoldings(finalizedHoldings);
    setIsAddingAsset(false);
    resetForm();
    onTriggerAlert({
      type: 'success',
      typeLabel: 'ASSET ADDED',
      title: 'New Position Logged',
      description: `${newHolding.ticker} successfully added to canonical ledger.`
    });
  };

  const handleDeleteAsset = (id: string, ticker: string) => {
    if (window.confirm(`Are you sure you want to delete ${ticker} from your holdings? This action is permanent.`)) {
      const nextHoldings = holdings.filter(h => h.id !== id);
      const totalSum = nextHoldings.reduce((sum, current) => sum + current.value, 0);
      const finalizedHoldings = nextHoldings.map(h => ({
        ...h,
        allocationPct: parseFloat(((h.value / totalSum) * 100).toFixed(2))
      }));
      onUpdateHoldings(finalizedHoldings);
      onTriggerAlert({
        type: 'advisory',
        typeLabel: 'ASSET DELETED',
        title: 'Position Removed',
        description: `${ticker} has been purged from the local OS ledger.`
      });
    }
  };

  const resetForm = () => {
    setEditTicker('');
    setEditName('');
    setEditType('US Stock');
    setEditUnits('');
    setEditAvgCost('');
    setEditPrice('');
    setEditNotes('');
  };

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'US Stock', label: 'Quality Growth' },
    { id: 'US ETF', label: 'Core ETF' },
    { id: 'Dividend ETF', label: 'Dividend Cashflow' },
    { id: 'Thai Mutual Fund', label: 'Thai Funds' },
    { id: 'Thai RMF', label: 'Thai RMF' },
    { id: 'Sandbox Asset', label: 'Sandbox' },
    { id: 'Cash', label: 'Cash & Others' }
  ];

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const filteredHoldings = holdings.filter(h => {
    const matchesSearch = 
      h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.notes && h.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'Cash') {
      return matchesSearch && (h.type === 'Cash' || h.type === 'Sandbox Asset');
    }
    return matchesSearch && h.type === filterType;
  }).sort((a, b) => {
    let valA: any = a[sortBy as keyof Holding];
    let valB: any = b[sortBy as keyof Holding];

    if (sortBy === 'value') {
      valA = a.value;
      valB = b.value;
    } else if (sortBy === 'gainLossPct') {
      valA = a.gainLossPct;
      valB = b.gainLossPct;
    } else if (sortBy === 'allocationPct') {
      valA = a.allocationPct;
      valB = b.allocationPct;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Summary Metrics
  const topOverweight = holdings.length > 0 ? [...holdings].sort((a, b) => b.allocationPct - a.allocationPct)[0] : null;
  const topGainer = holdings.length > 0 ? [...holdings].sort((a, b) => b.gainLossPct - a.gainLossPct)[0] : null;
  const topLoser = holdings.length > 0 ? [...holdings].sort((a, b) => a.gainLossPct - b.gainLossPct)[0] : null;
  const missingPrices = holdings.filter(h => h.currentPrice === 0).length;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'US ETF': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'US Stock': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
      case 'Dividend ETF': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Thai Mutual Fund':
      case 'Thai RMF': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case 'Sandbox Asset': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      
      {/* Title greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
          <div>
            <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              AEQUITAS OPERATING SYSTEMS LEDGER
            </span>
            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Manual Asset Ledger
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Audit and manually update position sizes, historical average costs, or custom mutual fund price benchmarks. Zero third-party tracker hooks required.
            </p>
          </div>

          <div className="flex gap-2">
            {!financialSettings.finnhubKey && (
              <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-500/20 rounded-xl flex items-center gap-2 mb-1 animate-pulse">
                <ShieldAlert className="text-amber-600 dark:text-amber-400" size={14} />
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Manual Price Mode Active</span>
              </div>
            )}
            <button
              onClick={() => {
                setIsAddingAsset(true);
                resetForm();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 mb-1"
            >
              <Plus size={14} />
              Add Asset
            </button>
          </div>
        </div>
      </section>

      {/* Summary Chips Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Total Positions</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{holdings.length}</span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Top Overweight</span>
          <span className="text-xs font-black text-blue-600 truncate">{topOverweight?.ticker || 'N/A'}</span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Top Gainer</span>
          <span className="text-xs font-black text-emerald-600 truncate">{topGainer?.ticker || 'N/A'} (+{topGainer?.gainLossPct}%)</span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Top Loser</span>
          <span className="text-xs font-black text-rose-600 truncate">{topLoser?.ticker || 'N/A'} ({topLoser?.gainLossPct}%)</span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold text-slate-400">Stale Prices</span>
          <span className="text-lg font-black text-amber-600">{missingPrices}</span>
        </div>
      </div>

      {/* Thai Fund NAV Bridge Panel (Calming bento widget) */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-slate-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/50 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="text-blue-400 shrink-0" size={16} />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">THAI FUND TAX NAV BRIDGE</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">Kasikorn S&P 500 RMF / SSF Nav Reconciliation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
            Because Thai tax wrappers do not offer public JSON end points, NAV bridges are reconciled manually here. Tap a position to update standard benchmark pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {thaiFundNavs.map(fund => (
            <div key={fund.ticker} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex justify-between items-center hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">{fund.ticker}</span>
                <h4 className="text-xs font-semibold text-slate-200 mt-0.5">{fund.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                  <span>Last Reconciled: {fund.lastUpdated}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </p>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5">
                {updatingThaiTicker === fund.ticker ? (
                  <div className="flex gap-1 items-center bg-transparent">
                    <input 
                      type="text" 
                      value={thaiNavInput}
                      onChange={(e) => setThaiNavInput(e.target.value)}
                      className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs w-20 text-center text-white"
                      placeholder="e.g. 15.4"
                    />
                    <button 
                      onClick={() => handleSaveThaiNav(fund.ticker)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-base font-bold font-mono text-emerald-400">฿{fund.nav.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button 
                      onClick={() => handleTriggerThaiNavUpdate(fund.ticker)}
                      className="text-[10px] font-bold text-blue-400 hover:underline bg-transparent"
                    >
                      Override NAV
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings list filter parameters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent pb-1">
        <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1 rounded-xl w-fit flex-wrap border border-slate-200/50 dark:border-slate-800/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterType === cat.id 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold' 
                  : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-255'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-450 font-mono">Positions Filtered: {filteredHoldings.length} Assets</span>
      </div>

      {/* Add Asset Form Overlay */}
      {isAddingAsset && (
        <div className="p-6 bg-blue-50/30 dark:bg-slate-900/40 border border-blue-200/50 dark:border-slate-800 rounded-3xl animate-slide-in">
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-blue-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Plus size={16} />
                Create New position Entry
              </h3>
              <button onClick={() => setIsAddingAsset(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Ticker</label>
                <input
                  type="text"
                  value={editTicker}
                  onChange={(e) => setEditTicker(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  placeholder="e.g. MSFT"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-slate-400">Asset Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                  placeholder="Microsoft Corporation"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Sector Layer</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <option value="US Stock">Quality Growth</option>
                  <option value="US ETF">Core ETF</option>
                  <option value="Dividend ETF">Dividend Cashflow</option>
                  <option value="Thai Mutual Fund">Thai Mutual Fund</option>
                  <option value="Thai RMF">Thai RMF</option>
                  <option value="Sandbox Asset">Sandbox Layer</option>
                  <option value="Cash">Cash Buffer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Units</label>
                <input
                  type="number" step="0.0001"
                  value={editUnits}
                  onChange={(e) => setEditUnits(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Avg Cost (USD)</label>
                <input
                  type="number" step="0.01"
                  value={editAvgCost}
                  onChange={(e) => setEditAvgCost(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Current Price (Manual)</label>
                <input
                  type="number" step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingAsset(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                Register Position
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Holdings parameters ledger table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 dark:border-slate-800/5 text-[10px] tracking-widest font-black text-slate-400 uppercase">
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('ticker')}>
                  <div className="flex items-center gap-1.5">TICKER <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                   <div className="flex items-center gap-1.5">ASSET NAME <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('type')}>
                   <div className="flex items-center gap-1.5">SECTOR TYPE <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 font-mono text-right">UNITS HELD</th>
                <th className="px-6 py-4 font-mono text-right">AVG COST (USD)</th>
                <th className="px-6 py-4 font-mono text-right">MARKET NAV</th>
                <th className="px-6 py-4 font-mono text-right cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('value')}>
                   <div className="flex items-center gap-1.5 justify-end">SUBTOTAL STATE <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('allocationPct')}>
                   <div className="flex items-center gap-1.5 justify-center">ALLOCT % <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs font-sans">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-xs text-slate-400 italic">No core assets found matching active parameters.</td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                  const isEditing = editingId === h.id;
                  const isGain = h.gainLoss >= 0;
                  const isNeutral = h.gainLoss === 0;

                  return (
                    <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTicker}
                            onChange={(e) => setEditTicker(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs w-20 font-mono"
                          />
                        ) : h.ticker}
                      </td>
                      
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs w-full"
                          />
                        ) : (
                          <>
                            <span className="font-bold text-slate-850 dark:text-slate-200">{h.name}</span>
                            {h.notes && (
                              <span className="block text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{h.notes}</span>
                            )}
                          </>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold w-full"
                          >
                            <option value="US Stock">Quality Growth</option>
                            <option value="US ETF">Core ETF</option>
                            <option value="Dividend ETF">Dividend Cashflow</option>
                            <option value="Thai Mutual Fund">Thai Mutual Fund</option>
                            <option value="Thai RMF">Thai RMF</option>
                            <option value="Sandbox Asset">Sandbox Layer</option>
                            <option value="Cash">Cash Buffer</option>
                          </select>
                        ) : (
                          <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full ${getTypeStyle(h.type)}`}>
                            {h.type}
                          </span>
                        )}
                      </td>

                      {/* Units */}
                      <td className="px-6 py-4 font-mono text-right font-medium text-slate-700 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editUnits}
                            onChange={(e) => setEditUnits(e.target.value)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 w-20 text-right font-mono"
                          />
                        ) : (
                          h.units.toLocaleString(undefined, { maximumFractionDigits: 4 })
                        )}
                      </td>

                      {/* Average cost */}
                      <td className="px-6 py-4 font-mono text-right font-medium text-slate-700 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editAvgCost}
                            onChange={(e) => setEditAvgCost(e.target.value)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 w-20 text-right font-mono"
                          />
                        ) : (
                          `$${h.avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Market price */}
                      <td className="px-6 py-4 font-mono text-right font-medium text-slate-900 dark:text-white">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 w-20 text-right font-mono"
                          />
                        ) : (
                          h.type.includes('Thai') ? `฿${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Computed Subtotal Value */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(h.value, financialSettings)}</span>
                        <span className={`block font-mono text-[9px] uppercase font-semibold mt-0.5 ${
                          isNeutral ? 'text-slate-400' : isGain ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                          {isNeutral ? '' : isGain ? '▲' : '▼'} {isNeutral ? 'Neutral' : `${isGain ? '+' : ''}${h.gainLossPct}%`}
                        </span>
                      </td>

                      {/* Allocation percentage weights */}
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-850 dark:text-slate-300">
                        {h.allocationPct.toFixed(2)}%
                      </td>

                      {/* Action tools */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center items-center">
                            <button 
                              onClick={() => handleSaveEdit(h.id)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
                            >
                              <Plus className="rotate-45" size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center items-center">
                            <button 
                              onClick={() => handleStartEdit(h)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent transition-colors"
                              title="Edit position"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(h.id, h.ticker)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 bg-transparent transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
