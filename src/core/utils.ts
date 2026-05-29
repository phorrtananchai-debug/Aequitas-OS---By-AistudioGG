import { Holding } from '../types';

export const ASSET_LAYERS = [
  { name: 'Core ETF Layer', types: ['US ETF', 'Thai Mutual Fund'], target: 35, color: 'bg-blue-600', text: 'text-blue-650' },
  { name: 'Growth Layer', types: ['US Stock'], target: 35, color: 'bg-indigo-600', text: 'text-indigo-600' },
  { name: 'Dividend / Behavior Layer', types: ['Dividend ETF'], target: 15, color: 'bg-emerald-600', text: 'text-emerald-600' },
  { name: 'Thai Tax Wrapper Layer', types: ['Thai RMF'], target: 12, color: 'bg-amber-600', text: 'text-amber-600' },
  { name: 'Sandbox Layer', types: ['Sandbox Asset'], target: 3, color: 'bg-purple-600', text: 'text-purple-600' },
];

export const getLayerValue = (layerName: string, holdings: Holding[]): number => {
  if (!Array.isArray(holdings)) return 0;
  const layer = ASSET_LAYERS.find(l => l.name === layerName);
  if (!layer) return 0;
  return holdings
    .filter(h => h && layer.types.includes(h.type))
    .reduce((acc, h) => acc + (Number.isFinite(h.value) ? h.value : 0), 0);
};

export const calculateLayerStats = (holdings: Holding[]) => {
  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const totalValue = safeHoldings.reduce((acc, h) => acc + (h && Number.isFinite(h.value) ? h.value : 0), 0);
  const safeTotal = totalValue > 0 ? totalValue : 1;

  const getSafePct = (val: number) => {
    if (!Number.isFinite(val)) return 0;
    const res = (val / safeTotal) * 100;
    return Number.isFinite(res) ? parseFloat(res.toFixed(1)) : 0;
  };

  return {
    totalValue,
    layers: ASSET_LAYERS.map(l => ({
      ...l,
      value: getLayerValue(l.name, safeHoldings),
      pct: getSafePct(getLayerValue(l.name, safeHoldings))
    }))
  };
};

export const calculatePortfolioDrift = (holdings: Holding[]) => {
  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const totalValue = safeHoldings.reduce((acc, h) => acc + (h && Number.isFinite(h.value) ? h.value : 0), 0);
  if (!totalValue || totalValue <= 0) return 0;

  let totalWeightedDrift = 0;

  ASSET_LAYERS.forEach(layer => {
    const layerValue = getLayerValue(layer.name, safeHoldings);
    const currentPct = (layerValue / totalValue) * 100;
    const drift = Math.abs(currentPct - layer.target);
    totalWeightedDrift += drift * (layer.target / 100);
  });

  return Number.isFinite(totalWeightedDrift) ? parseFloat(totalWeightedDrift.toFixed(1)) : 0;
};

export const calculatePortfolioHealth = (holdings: Holding[]) => {
  const drift = calculatePortfolioDrift(holdings);
  // Health starts at 100%, and drops as drift increases.
  const health = 100 - (drift * 2);
  return Math.max(0, Math.min(100, Number.isFinite(health) ? parseFloat(health.toFixed(1)) : 0));
};

export const calculateDividendStats = (holdings: Holding[]) => {
  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const annualEst = safeHoldings.reduce((acc, h) => {
    if (!h) return acc;
    const val = Number.isFinite(h.value) ? h.value : 0;
    const yld = Number.isFinite(h.dividendYield) ? h.dividendYield : 0;
    return acc + (val * yld / 100);
  }, 0);

  const monthlyEst = annualEst / 12;
  const totalValue = safeHoldings.reduce((acc, h) => acc + (h && Number.isFinite(h.value) ? h.value : 0), 0);
  const weightedApy = totalValue > 0 ? (annualEst / totalValue) * 100 : 0;

  return {
    annualEst: Number.isFinite(annualEst) ? annualEst : 0,
    monthlyEst: Number.isFinite(monthlyEst) ? monthlyEst : 0,
    weightedApy: Number.isFinite(weightedApy) ? parseFloat(weightedApy.toFixed(2)) : 0
  };
};

export const formatCurrency = (value: number) => {
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) return '0'.repeat(decimals > 0 ? 1 : 0) + (decimals > 0 ? '.' + '0'.repeat(decimals) : '');
  return value.toFixed(decimals);
};

export const safeToLocaleString = (value: number | undefined | null, options?: Intl.NumberFormatOptions): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) return '0';
  return value.toLocaleString(undefined, options);
};
