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
  AlertCircle
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
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Inline edit state values
  const [editUnits, setEditUnits] = useState<string>('');
  const [editAvgCost, setEditAvgCost] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Thai NAV bridge inputs state
  const [updatingThaiTicker, setUpdatingThaiTicker] = useState<string | null>(null);
  const [thaiNavInput, setThaiNavInput] = useState<string>('');

  const handleStartEdit = (h: Holding) => {
    setEditingId(h.id);
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

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'us stock', label: 'US Stocks' },
    { id: 'us etf', label: 'US ETFs' },
    { id: 'thai mutual fund', label: 'Thai Funds' },
    { id: 'cash', label: 'Cash & Others' }
  ];

  const filteredHoldings = holdings.filter(h => {
    const matchesSearch = 
      h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.notes && h.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'cash') {
      return matchesSearch && (h.type === 'Cash' || h.type === 'Sandbox Asset');
    }
    return matchesSearch && h.type.toLowerCase() === filterType;
  });

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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Audit and manually update position sizes, historical average costs, or custom mutual fund price benchmarks. Zero third-party tracker hooks required.
          </p>
        </div>
      </section>

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
                    <span className="text-base font-bold font-mono text-emerald-400">{fund.nav.toFixed(2)} THB</span>
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

      {/* Main Holdings parameters ledger table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-205/60 dark:border-slate-800/25 bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 dark:border-slate-800/5 text-[10px] tracking-widest font-black text-slate-400 uppercase">
                <th className="px-6 py-4">TICKER</th>
                <th className="px-6 py-4">ASSET NAME</th>
                <th className="px-6 py-4">SECTOR TYPE</th>
                <th className="px-6 py-4 font-mono text-right">UNITS HELD</th>
                <th className="px-6 py-4 font-mono text-right">AVG COST (USD)</th>
                <th className="px-6 py-4 font-mono text-right">MARKET NAV</th>
                <th className="px-6 py-4 font-mono text-right">SUBTOTAL STATE</th>
                <th className="px-6 py-4 text-center">ALLOCT %</th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-xs font-sans">
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-xs text-slate-400">No core assets found matching active filter.</td>
                </tr>
              ) : (
                filteredHoldings.map((h) => {
                  const isEditing = editingId === h.id;
                  const isGain = h.gainLoss >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{h.ticker}</td>
                      
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-850 dark:text-slate-200">{h.name}</span>
                        {h.notes && (
                          <span className="block text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{h.notes}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {h.type}
                        </span>
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
                          h.units.toLocaleString(undefined, { maximumFractionDigits: 2 })
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
                          `$${h.avgCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
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
                          h.type.includes('Thai') ? `฿${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `$${h.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        )}
                      </td>

                      {/* Computed Subtotal Value */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(h.value, financialSettings)}</span>
                        <span className={`block font-mono text-[9px] uppercase font-semibold mt-0.5 ${isGain ? 'text-emerald-650' : 'text-rose-600'}`}>
                          {isGain ? '▲' : '▼'} {isGain ? '+' : ''}{h.gainLossPct}%
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
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold uppercase transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center items-center">
                            <button 
                              onClick={() => handleStartEdit(h)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-transparent"
                              title="Edit parameters"
                            >
                              <Edit3 size={14} />
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
