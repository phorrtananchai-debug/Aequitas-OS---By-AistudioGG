import React, { useState, useMemo } from 'react';
import { 
  Edit3,
  Globe, 
  Check, 
  Plus,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  X,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  MoreVertical,
  ChevronUp
} from 'lucide-react';
import { Holding, ThaiFundNavState, AlertItem, AssetType } from '../types';
import { safeToFixed, safeToLocaleString } from '../core/utils';

interface HoldingsTabProps {
  searchQuery: string;
  onTriggerAlert: (alert: Omit<AlertItem, 'id' | 'time'>) => void;
  holdings: Holding[];
  onUpdateHoldings: (nextHoldings: Holding[]) => void;
  thaiFundNavs: ThaiFundNavState[];
  onUpdateThaiFundNavs: (nextNavs: ThaiFundNavState[]) => void;
}

type SortKey = 'ticker' | 'value' | 'allocationPct' | 'gainLossPct' | 'gainLoss' | 'type';

export default function MarketsTab({
  searchQuery,
  onTriggerAlert,
  holdings,
  onUpdateHoldings,
  thaiFundNavs,
  onUpdateThaiFundNavs
}: HoldingsTabProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'value', direction: 'desc' });
  
  // Inline edit state values
  const [editUnits, setEditUnits] = useState<string>('');
  const [editAvgCost, setEditAvgCost] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editType, setEditType] = useState<AssetType>('US Stock');

  // Thai NAV bridge inputs state
  const [updatingThaiTicker, setUpdatingThaiTicker] = useState<string | null>(null);
  const [thaiNavInput, setThaiNavInput] = useState<string>('');

  // Add position state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Holding>>({
    ticker: '',
    name: '',
    type: 'US Stock',
    units: 0,
    avgCost: 0,
    currentPrice: 0,
    notes: ''
  });

  const safeHoldings = useMemo(() => Array.isArray(holdings) ? holdings : [], [holdings]);
  const safeThaiNavs = useMemo(() => Array.isArray(thaiFundNavs) ? thaiFundNavs : [], [thaiFundNavs]);

  const handleStartEdit = (h: Holding) => {
    if (!h) return;
    setEditingId(h.id);
    setEditUnits((h.units ?? 0).toString());
    setEditAvgCost((h.avgCost ?? 0).toString());
    setEditPrice((h.currentPrice ?? 0).toString());
    setEditNotes(h.notes || '');
    setEditType(h.type || 'US Stock');
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

    const nextHoldings = safeHoldings.map(h => {
      if (h && h.id === id) {
        return {
          ...h,
          units: unitsVal,
          avgCost: avgCostVal,
          currentPrice: currentPriceVal,
          value: parseFloat(valueCalculated.toFixed(2)),
          gainLoss: parseFloat(calculatedGain.toFixed(2)),
          gainLossPct: parseFloat(gainPct.toFixed(2)),
          notes: editNotes,
          type: editType
        };
      }
      return h;
    });

    recalculateAndSave(nextHoldings);
    setEditingId(null);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'HOLDING RE-SYNCED',
      title: 'Ledger Holding Updated',
      description: `Manually reconciled parameters successfully. Total position size recalibrated to $${valueCalculated.toLocaleString()}.`
    });
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.ticker || !newAsset.name) return;

    const units = Number(newAsset.units) || 0;
    const price = Number(newAsset.currentPrice) || 0;
    const avgCost = Number(newAsset.avgCost) || 0;
    const value = units * price;
    const gainLoss = value - (units * avgCost);
    const gainLossPct = (units * avgCost) > 0 ? (gainLoss / (units * avgCost)) * 100 : 0;

    const fresh: Holding = {
      id: `h-${Date.now()}`,
      ticker: newAsset.ticker.toUpperCase(),
      name: newAsset.name,
      type: newAsset.type as AssetType,
      units,
      avgCost,
      currentPrice: price,
      value: parseFloat(value.toFixed(2)),
      gainLoss: parseFloat(gainLoss.toFixed(2)),
      gainLossPct: parseFloat(gainLossPct.toFixed(2)),
      allocationPct: 0, // Recalculated below
      notes: newAsset.notes
    };

    recalculateAndSave([...safeHoldings, fresh]);
    setShowAddForm(false);
    setNewAsset({ ticker: '', name: '', type: 'US Stock', units: 0, avgCost: 0, currentPrice: 0, notes: '' });

    onTriggerAlert({
      type: 'success',
      typeLabel: 'ASSET ADDED',
      title: `${fresh.ticker} Initialized`,
      description: `New position registered in manual ledger with ${units} units.`
    });
  };

  const handleDeleteAsset = (id: string, ticker: string) => {
    if (window.confirm(`Permanently remove ${ticker} from your ledger?`)) {
      recalculateAndSave(safeHoldings.filter(h => h.id !== id));
      onTriggerAlert({
        type: 'advisory',
        typeLabel: 'ASSET REMOVED',
        title: 'Ledger Purged',
        description: `${ticker} has been permanently removed from your holdings.`
      });
    }
  };

  const recalculateAndSave = (nextHoldings: Holding[]) => {
    const totalSum = nextHoldings.reduce((sum, h) => sum + (h?.value || 0), 0);
    const finalized = nextHoldings.map(h => ({
      ...h,
      allocationPct: totalSum > 0 ? parseFloat((( (h?.value || 0) / totalSum) * 100).toFixed(2)) : 0
    }));
    onUpdateHoldings(finalized);
  };

  const handleTriggerThaiNavUpdate = (ticker: string) => {
    setUpdatingThaiTicker(ticker);
    const match = safeThaiNavs.find(f => f && f.ticker === ticker);
    if (match) {
      setThaiNavInput((match.nav ?? 0).toString());
    }
  };

  const handleSaveThaiNav = (ticker: string) => {
    const navVal = parseFloat(thaiNavInput);
    if (isNaN(navVal) || navVal <= 0) return;

    // 1. Update Thai Fund NAV Bridge
    const nextNavs = safeThaiNavs.map(f => {
      if (f && f.ticker === ticker) {
        return { ...f, nav: navVal, lastUpdated: new Date().toISOString().split('T')[0], isStale: false };
      }
      return f;
    });
    onUpdateThaiFundNavs(nextNavs);

    // 2. Cascade changes back to holdings asset values
    const matchNav = nextNavs.find(f => f && f.ticker === ticker);
    const nextHoldings = safeHoldings.map(h => {
      if (h && h.ticker === ticker && matchNav) {
        const nextValue = (h.units ?? 0) * navVal;
        const totalCostAndBasis = (h.units ?? 0) * (h.avgCost ?? 0);
        const calculatedGain = nextValue - totalCostAndBasis;
        const gainPct = totalCostAndBasis > 0 ? (calculatedGain / totalCostAndBasis) * 100 : 0;
        return {
          ...h,
          currentPrice: navVal,
          value: parseFloat(nextValue.toFixed(2)),
          gainLoss: parseFloat(calculatedGain.toFixed(2)),
          gainLossPct: parseFloat(gainPct.toFixed(2))
        };
      }
      return h;
    });

    recalculateAndSave(nextHoldings);
    setUpdatingThaiTicker(null);
    onTriggerAlert({
      type: 'success',
      typeLabel: 'THAI FUND RECONCILED',
      title: `${ticker} NAV Updated`,
      description: `NAV bridged to ${navVal} THB. Total sub-portfolio aggregates synchronized accordingly.`
    });
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'us stock', label: 'US Stocks' },
    { id: 'us etf', label: 'US ETFs' },
    { id: 'thai mutual fund', label: 'Thai Funds' },
    { id: 'cash', label: 'Cash & Others' }
  ];

  const filteredAndSortedHoldings = useMemo(() => {
    const filtered = safeHoldings.filter(h => {
      if (!h) return false;
      const matchesSearch =
        (h.ticker || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (h.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (h.notes && h.notes.toLowerCase().includes((searchQuery || '').toLowerCase()));

      if (filterType === 'all') return matchesSearch;
      if (filterType === 'cash') {
        return matchesSearch && (h.type === 'Cash' || h.type === 'Sandbox Asset');
      }
      return matchesSearch && (h.type || '').toLowerCase() === filterType;
    });

    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const numA = Number(aVal) || 0;
      const numB = Number(bVal) || 0;

      return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
    });
  }, [safeHoldings, searchQuery, filterType, sortConfig]);

  // Metrics for Summary Cards
  const totalValue = safeHoldings.reduce((sum, h) => sum + (h?.value || 0), 0);
  const totalGain = safeHoldings.reduce((sum, h) => sum + (h?.gainLoss || 0), 0);
  const avgGainPct = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0;
  const topPerformer = [...safeHoldings].sort((a, b) => (b.gainLossPct || 0) - (a.gainLossPct || 0))[0];

  const AssetTypes: AssetType[] = ['US Stock', 'US ETF', 'Thai Mutual Fund', 'Thai RMF', 'Dividend ETF', 'Sandbox Asset', 'Cash'];

  return (
    <div className="space-y-8 animate-fade-in text-slate-850 dark:text-[#F4EEE4] pb-12 font-sans">
      
      {/* Title greeting */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            AEQUITAS OPERATING SYSTEMS LEDGER
          </span>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Manual Asset Ledger
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Audit and manually update position sizes, historical average costs, or custom mutual fund price benchmarks. Zero third-party tracker hooks required.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          Add Position
        </button>
      </section>

      {/* Summary Chips / Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Ledger Value</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">${safeToLocaleString(totalValue, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cumulative Gain</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black ${totalGain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${safeToLocaleString(Math.abs(totalGain), { maximumFractionDigits: 0 })}
            </span>
            <span className={`text-xs font-bold ${totalGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {totalGain >= 0 ? '▲' : '▼'} {safeToFixed(Math.abs(avgGainPct), 1)}%
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Asset Count</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{safeHoldings.length} Positions</span>
        </div>
        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Top Performer</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-blue-600">{topPerformer?.ticker || 'N/A'}</span>
            <span className="text-xs font-bold text-emerald-500">+{safeToFixed(topPerformer?.gainLossPct, 1)}%</span>
          </div>
        </div>
      </div>

      {/* Thai Fund NAV Bridge Panel (Calming bento widget) */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-slate-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/50 mb-6 text-slate-100">
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
          {safeThaiNavs.length === 0 ? (
             <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
               No Thai funds configured in active ledger.
             </div>
          ) : safeThaiNavs.map(fund => (
            <div key={fund.ticker} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex justify-between items-center hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">{fund.ticker}</span>
                <h4 className="text-xs font-semibold text-slate-200 mt-0.5">{fund.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                  <span>Last Reconciled: {fund.lastUpdated || 'Never'}</span>
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
                    <span className="text-base font-bold font-mono text-emerald-400">{safeToFixed(fund.nav, 2)} THB</span>
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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent pb-1 text-slate-800">
        <div className="flex bg-slate-100 dark:bg-slate-900/40 p-1 rounded-xl w-fit flex-wrap border border-slate-200/50 dark:border-slate-800/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterType === cat.id 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold' 
                  : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-450 font-mono">Showing {filteredAndSortedHoldings.length} of {safeHoldings.length} Assets</span>
      </div>

      {/* Main Holdings parameters ledger table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white text-slate-800">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 dark:border-slate-800/5 text-[10px] tracking-widest font-black text-slate-400 uppercase">
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('ticker')}>
                  <div className="flex items-center gap-1.5">TICKER <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4">ASSET NAME</th>
                <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1.5">SECTOR <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 font-mono text-right">UNITS</th>
                <th className="px-6 py-4 font-mono text-right">AVG COST</th>
                <th className="px-6 py-4 font-mono text-right">PRICE</th>
                <th className="px-6 py-4 font-mono text-right cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('value')}>
                  <div className="flex items-center justify-end gap-1.5">SUBTOTAL <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('allocationPct')}>
                  <div className="flex items-center justify-center gap-1.5">ALLOC % <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('gainLossPct')}>
                  <div className="flex items-center justify-center gap-1.5">P/L % <ArrowUpDown size={10} /></div>
                </th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs font-sans text-slate-800">
              {filteredAndSortedHoldings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-xs text-slate-400">No core assets found matching active filter.</td>
                </tr>
              ) : (
                filteredAndSortedHoldings.map((h) => {
                  if (!h) return null;
                  const isEditing = editingId === h.id;
                  const gainLoss = h.gainLoss || 0;
                  const isGain = gainLoss >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{h.ticker}</td>
                      
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-855 dark:text-slate-200">{h.name}</span>
                        {h.notes && (
                          <span className="block text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{h.notes}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as AssetType)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase"
                          >
                            {AssetTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        ) : (
                          <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                          safeToLocaleString(h.units, { maximumFractionDigits: 2 })
                        )}
                      </td>

                      {/* Average cost */}
                      <td className="px-6 py-4 font-mono text-right font-medium text-slate-700 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editAvgCost}
                            onChange={(e) => setEditAvgCost(e.target.value)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 w-24 text-right font-mono"
                          />
                        ) : (
                          `$${safeToLocaleString(h.avgCost, { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Market price */}
                      <td className="px-6 py-4 font-mono text-right font-medium text-slate-900 dark:text-white">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="p-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 w-24 text-right font-mono"
                          />
                        ) : (
                          `$${safeToLocaleString(h.currentPrice, { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Computed Subtotal Value */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">${safeToLocaleString(h.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </td>

                      {/* Allocation percentage weights */}
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-850 dark:text-slate-300">
                        {safeToFixed(h.allocationPct, 2)}%
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`block font-mono text-[10px] font-black uppercase ${isGain ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isGain ? '▲' : '▼'} {safeToFixed(Math.abs(h.gainLossPct || 0), 1)}%
                        </span>
                      </td>

                      {/* Action tools */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center items-center">
                            <button 
                              onClick={() => handleSaveEdit(h.id)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                              title="Save Changes"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1 justify-center items-center">
                            <button 
                              onClick={() => handleStartEdit(h)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                              title="Edit parameters"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(h.id, h.ticker)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                              title="Delete position"
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

      {/* Add Position Overlay / Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in text-slate-800">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Register New Position</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>

              <form onSubmit={handleAddAsset} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ticker Symbol</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VOO"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        value={newAsset.ticker}
                        onChange={(e) => setNewAsset({...newAsset, ticker: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vanguard S&P 500"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sector / Type</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                        value={newAsset.type}
                        onChange={(e) => setNewAsset({...newAsset, type: e.target.value as AssetType})}
                      >
                         {AssetTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Units Held</label>
                      <input
                        type="number"
                        step="any"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono"
                        value={newAsset.units || ''}
                        onChange={(e) => setNewAsset({...newAsset, units: parseFloat(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Cost (USD)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono"
                        value={newAsset.avgCost || ''}
                        onChange={(e) => setNewAsset({...newAsset, avgCost: parseFloat(e.target.value)})}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Price (USD)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono"
                        value={newAsset.currentPrice || ''}
                        onChange={(e) => setNewAsset({...newAsset, currentPrice: parseFloat(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notes</label>
                    <textarea
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm h-20 resize-none"
                      value={newAsset.notes}
                      onChange={(e) => setNewAsset({...newAsset, notes: e.target.value})}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                   <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50"
                   >
                     Cancel
                   </button>
                   <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20"
                   >
                     Confirm Registration
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
