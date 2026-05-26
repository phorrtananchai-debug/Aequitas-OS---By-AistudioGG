import { MigrationStatus, Holding, DcaPlan, DividendPlan, ThaiFundNavState, WatchlistItem } from '../types';

const STORAGE_KEY = 'aequitas_os_state_v1';
const BACKUP_PREFIX = 'aequitas_pre_migration_backup_';

const OLD_KEYS = [
  'aequitas', 'portfolio', 'holdings', 'allocation', 'dca',
  'dividends', 'thai_nav', 'ai_strategy', 'ai_import',
  'snapshot', 'watchlist', 'settings'
];

export interface AppState {
  holdings: Holding[];
  portfolioValue: number;
  dcaPlan: DcaPlan;
  dividendPlan: DividendPlan;
  thaiFundNavs: ThaiFundNavState[];
  watchlist: WatchlistItem[];
  migrationStatus: MigrationStatus;
}

export const migrateData = () => {
  if (typeof window === 'undefined') return { state: null, status: null };

  const existingState = localStorage.getItem(STORAGE_KEY);
  if (existingState) {
    try {
      const parsed = JSON.parse(existingState);
      return { state: parsed, status: (parsed.migrationStatus || null) as MigrationStatus | null };
    } catch (e) {
      console.error("Failed to parse existing state", e);
    }
  }

  // Check for old keys
  const oldData: any = {};
  let foundOldData = false;

  OLD_KEYS.forEach(key => {
    const val = localStorage.getItem(key);
    if (val) {
      try {
        oldData[key] = JSON.parse(val);
      } catch {
        oldData[key] = val;
      }
      foundOldData = true;
    }
  });

  if (foundOldData) {
    // 1. Create Backup
    const timestamp = Date.now();
    try {
      localStorage.setItem(`${BACKUP_PREFIX}${timestamp}`, JSON.stringify(oldData));
    } catch (e) {
      console.error("Failed to create migration backup", e);
    }

    // 2. Map old data to new schema
    const newState: any = {
      holdings: oldData.holdings || oldData.portfolio?.holdings || null,
      dcaPlan: oldData.dca || oldData.dcaPlan || null,
      dividendPlan: oldData.dividends || oldData.dividendPlan || null,
      thaiFundNavs: oldData.thai_nav || oldData.thaiFundNavs || null,
      watchlist: oldData.watchlist || null,
      portfolioValue: oldData.portfolio?.totalValue || oldData.portfolioValue || null,
    };

    const status: MigrationStatus = {
      source: 'old-local-storage',
      migratedAt: new Date().toISOString(),
      warnings: []
    };

    const finalizedState = { ...newState, migrationStatus: status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalizedState));

    return { state: finalizedState, status, justMigrated: true };
  }

  return {
    state: null,
    status: {
      source: 'sample-state',
      migratedAt: null,
      warnings: []
    } as MigrationStatus
  };
};

export const saveState = (state: Partial<AppState>) => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  let base = {};
  if (existing) {
    try {
      base = JSON.parse(existing);
    } catch (e) {
      base = {};
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, ...state }));
};
