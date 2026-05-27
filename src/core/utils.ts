import { Holding } from '../types';

export const calculateLayerStats = (holdings: Holding[]) => {
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);

  const getLayerValue = (layerName: string): number => {
    return holdings
      .filter(h => {
        if (layerName === 'Core ETF Layer') return h.type === 'US ETF' || h.type === 'Thai Mutual Fund';
        if (layerName === 'Growth Layer') return h.type === 'US Stock';
        if (layerName === 'Dividend / Behavior Layer') return h.type === 'Dividend ETF';
        if (layerName === 'Thai Tax Wrapper Layer') return h.type === 'Thai RMF';
        if (layerName === 'Sandbox Layer') return h.type === 'Sandbox Asset';
        return false;
      })
      .reduce((acc, h) => acc + h.value, 0);
  };

  const safeTotal = totalValue || 1;

  return {
    totalValue,
    core: { value: getLayerValue('Core ETF Layer'), pct: parseFloat(((getLayerValue('Core ETF Layer') / safeTotal) * 100).toFixed(1)) },
    growth: { value: getLayerValue('Growth Layer'), pct: parseFloat(((getLayerValue('Growth Layer') / safeTotal) * 100).toFixed(1)) },
    dividend: { value: getLayerValue('Dividend / Behavior Layer'), pct: parseFloat(((getLayerValue('Dividend / Behavior Layer') / safeTotal) * 100).toFixed(1)) },
    tax: { value: getLayerValue('Thai Tax Wrapper Layer'), pct: parseFloat(((getLayerValue('Thai Tax Wrapper Layer') / safeTotal) * 100).toFixed(1)) },
    sandbox: { value: getLayerValue('Sandbox Layer'), pct: parseFloat(((getLayerValue('Sandbox Layer') / safeTotal) * 100).toFixed(1)) },
  };
};

export const calculateDividendStats = (holdings: Holding[]) => {
  const annualEst = holdings.reduce((acc, h) => acc + (h.value * (h.dividendYield || 0) / 100), 0);
  const monthlyEst = annualEst / 12;
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const weightedApy = totalValue > 0 ? (annualEst / totalValue) * 100 : 0;

  return {
    annualEst,
    monthlyEst,
    weightedApy
  };
};

export const calculatePortfolioDrift = (holdings: Holding[]) => {
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  if (totalValue === 0) return 0;

  // We use the same layer definitions as calculateLayerStats
  const layers = [
    { name: 'Core ETF Layer', target: 35 },
    { name: 'Growth Layer', target: 35 },
    { name: 'Dividend / Behavior Layer', target: 15 },
    { name: 'Thai Tax Wrapper Layer', target: 12 },
    { name: 'Sandbox Layer', target: 3 },
  ];

  let totalWeightedDrift = 0;

  layers.forEach(layer => {
    const layerValue = holdings
      .filter(h => {
        if (layer.name === 'Core ETF Layer') return h.type === 'US ETF' || h.type === 'Thai Mutual Fund';
        if (layer.name === 'Growth Layer') return h.type === 'US Stock';
        if (layer.name === 'Dividend / Behavior Layer') return h.type === 'Dividend ETF';
        if (layer.name === 'Thai Tax Wrapper Layer') return h.type === 'Thai RMF';
        if (layer.name === 'Sandbox Layer') return h.type === 'Sandbox Asset';
        return false;
      })
      .reduce((acc, h) => acc + h.value, 0);

    const currentPct = (layerValue / totalValue) * 100;
    const drift = Math.abs(currentPct - layer.target);
    // Weighted drift contribution: (layer target / 100) * drift
    // Or just a simple average of absolute drifts for the "index"
    totalWeightedDrift += drift * (layer.target / 100);
  });

  return parseFloat(totalWeightedDrift.toFixed(1));
};
