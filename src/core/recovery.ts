import { mapBackupToState } from './storage';
import backupData from './canonical-backup-data.json';

export const getCanonicalBackupSummary = () => {
  const mapped = mapBackupToState(backupData);
  return {
    holdingsCount: mapped.holdings?.length || 0,
    totalValue: mapped.portfolioValue || 0,
    symbols: (mapped.holdings || []).slice(0, 5).map(h => h.ticker),
    exportedAt: "2026-05-21T16:45:40.812Z"
  };
};

export const getCanonicalBackupState = () => {
  return mapBackupToState(backupData);
};
