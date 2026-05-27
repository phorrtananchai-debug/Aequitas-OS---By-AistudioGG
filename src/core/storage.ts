import { MigrationStatus, Holding, DcaPlan, DividendPlan, ThaiFundNavState, WatchlistItem, AiImportSchema } from '../types';

const STORAGE_KEY = 'aequitas_os_state_v1';
const BACKUP_PREFIX = 'aequitas_pre_migration_backup_';

export interface AppState {
  holdings: Holding[];
  portfolioValue: number;
  dcaPlan: DcaPlan;
  dividendPlan: DividendPlan;
  thaiFundNavs: ThaiFundNavState[];
  watchlist: WatchlistItem[];
  migrationStatus: MigrationStatus;
  latestAiImportPlan: AiImportSchema | null;
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

  // Check for all aequitas_* keys
  const oldData: any = {};
  const detectedLegacyKeys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('aequitas_') || key === 'aequitas' || key === 'portfolio' || key === 'holdings' || key === 'allocation' || key === 'dca' || key === 'dividends' || key === 'thai_nav' || key === 'ai_strategy' || key === 'ai_import' || key === 'snapshot' || key === 'watchlist' || key === 'settings')) {
      // Exclude our own new storage key and backups
      if (key === STORAGE_KEY || key.startsWith(BACKUP_PREFIX)) continue;

      const val = localStorage.getItem(key);
      if (val) {
        try {
          oldData[key] = JSON.parse(val);
        } catch {
          oldData[key] = val;
        }
        detectedLegacyKeys.push(key);
      }
    }
  }

  if (detectedLegacyKeys.length > 0) {
    // 1. Create Backup
    const timestamp = Date.now();
    try {
      localStorage.setItem(`${BACKUP_PREFIX}${timestamp}`, JSON.stringify(oldData));
    } catch (e) {
      console.error("Failed to create migration backup", e);
    }

    // 2. Map old data to new schema
    // Use the comprehensive list of keys provided in the task
    const newState: any = {
      holdings: oldData.aequitas_portfolio?.holdings || oldData.holdings || oldData.portfolio?.holdings || null,
      portfolioValue: Number(oldData.aequitas_portfolio?.totalValue || oldData.portfolio?.totalValue || oldData.portfolioValue || 0) || null,
      dcaPlan: oldData.aequitas_dca_plan || oldData.dca || oldData.aequitas_dca || null,
      dividendPlan: oldData.aequitas_dividend_ledger || oldData.dividends || null,
      thaiFundNavs: oldData.aequitas_thai_nav || oldData.thai_nav || oldData.thai_nav_state || null,
      watchlist: oldData.aequitas_watchlist || oldData.aequitas_watchlist_assets || oldData.watchlist || null,
      latestAiImportPlan: oldData.aequitas_ai_trading_plan || oldData.ai_import || null,
    };

    // Derived fallback if portfolioValue is missing or 0 but holdings exist
    if ((!newState.portfolioValue || newState.portfolioValue === 0) && newState.holdings?.length > 0) {
      newState.portfolioValue = newState.holdings.reduce((acc: number, h: any) => acc + (Number(h.value) || 0), 0);
    }

    // Audit Report for debugging
    console.log("[Aequitas OS] Migration Audit Report:");
    console.log("- Detected Keys:", detectedLegacyKeys);
    console.log("- Migrated Holdings Count:", newState.holdings?.length || 0);
    console.log("- Migrated Portfolio Value:", newState.portfolioValue);
    console.log("- Migrated AI Plan:", newState.latestAiImportPlan ? "Yes" : "No");

    const status: MigrationStatus = {
      source: 'old-local-storage',
      migratedAt: new Date().toISOString(),
      detectedLegacyKeys,
      success: true,
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
