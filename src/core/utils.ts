import { Holding } from '../types';

export const ASSET_LAYERS = [
  { name: 'Core ETF Layer', types: ['US ETF', 'Thai Mutual Fund'], target: 35, color: 'bg-blue-600', text: 'text-blue-650' },
  { name: 'Growth Layer', types: ['US Stock'], target: 35, color: 'bg-indigo-600', text: 'text-indigo-600' },
  { name: 'Dividend / Behavior Layer', types: ['Dividend ETF'], target: 15, color: 'bg-emerald-600', text: 'text-emerald-600' },
  { name: 'Thai Tax Wrapper Layer', types: ['Thai RMF'], target: 12, color: 'bg-amber-600', text: 'text-amber-600' },
  { name: 'Sandbox Layer', types: ['Sandbox Asset'], target: 3, color: 'bg-purple-600', text: 'text-purple-600' },
];

export const getLayerValue = (layerName: string, holdings: Holding[]): number => {
  const layer = ASSET_LAYERS.find(l => l.name === layerName);
  if (!layer) return 0;
  return (holdings || [])
    .filter(h => layer.types.includes(h.type))
    .reduce((acc, h) => acc + (h.value || 0), 0);
};

export const calculateLayerStats = (holdings: Holding[]) => {
  const totalValue = (holdings || []).reduce((acc, h) => acc + (h.value || 0), 0);
  const safeTotal = totalValue || 1;

  const getSafePct = (val: number) => {
    const res = (val / safeTotal) * 100;
    return Number.isFinite(res) ? parseFloat(res.toFixed(1)) : 0;
  };

  return {
    totalValue,
    layers: ASSET_LAYERS.map(l => ({
      ...l,
      value: getLayerValue(l.name, holdings),
      pct: getSafePct(getLayerValue(l.name, holdings))
    }))
  };
};

export const calculatePortfolioDrift = (holdings: Holding[]) => {
  const totalValue = (holdings || []).reduce((acc, h) => acc + (h.value || 0), 0);
  if (!totalValue) return 0;

  let totalWeightedDrift = 0;

  ASSET_LAYERS.forEach(layer => {
    const layerValue = getLayerValue(layer.name, holdings);
    const currentPct = (layerValue / totalValue) * 100;
    const drift = Math.abs(currentPct - layer.target);
    totalWeightedDrift += drift * (layer.target / 100);
  });

  return Number.isFinite(totalWeightedDrift) ? parseFloat(totalWeightedDrift.toFixed(1)) : 0;
};

export const calculatePortfolioHealth = (holdings: Holding[]) => {
  const drift = calculatePortfolioDrift(holdings);
  // Health starts at 100%, and drops as drift increases.
  // A 10% weighted drift is quite high, so we scale it.
  const health = 100 - (drift * 2);
  return Math.max(0, Math.min(100, parseFloat(health.toFixed(1))));
};

export const calculateDividendStats = (holdings: Holding[]) => {
  const annualEst = (holdings || []).reduce((acc, h) => acc + ((h.value || 0) * (h.dividendYield || 0) / 100), 0);
  const monthlyEst = annualEst / 12;
  const totalValue = (holdings || []).reduce((acc, h) => acc + (h.value || 0), 0);
  const weightedApy = totalValue > 0 ? (annualEst / totalValue) * 100 : 0;

  return {
    annualEst,
    monthlyEst,
    weightedApy: Number.isFinite(weightedApy) ? parseFloat(weightedApy.toFixed(2)) : 0
  };
};

export const formatCurrency = (value: number) => {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
