import { Holding } from '../types';

export const ASSET_LAYERS = [
  { name: 'Core ETF Layer', types: ['US ETF', 'Thai Mutual Fund'], target: 35 },
  { name: 'Growth Layer', types: ['US Stock'], target: 35 },
  { name: 'Dividend / Behavior Layer', types: ['Dividend ETF'], target: 15 },
  { name: 'Thai Tax Wrapper Layer', types: ['Thai RMF'], target: 12 },
  { name: 'Sandbox Layer', types: ['Sandbox Asset'], target: 3 },
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
    core: { value: getLayerValue('Core ETF Layer', holdings), pct: getSafePct(getLayerValue('Core ETF Layer', holdings)) },
    growth: { value: getLayerValue('Growth Layer', holdings), pct: getSafePct(getLayerValue('Growth Layer', holdings)) },
    dividend: { value: getLayerValue('Dividend / Behavior Layer', holdings), pct: getSafePct(getLayerValue('Dividend / Behavior Layer', holdings)) },
    tax: { value: getLayerValue('Thai Tax Wrapper Layer', holdings), pct: getSafePct(getLayerValue('Thai Tax Wrapper Layer', holdings)) },
    sandbox: { value: getLayerValue('Sandbox Layer', holdings), pct: getSafePct(getLayerValue('Sandbox Layer', holdings)) },
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
