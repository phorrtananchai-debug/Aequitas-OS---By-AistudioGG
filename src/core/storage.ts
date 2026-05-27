import { MigrationStatus, Holding, DcaPlan, DividendPlan, ThaiFundNavState, WatchlistItem, AiImportSchema, FinancialSettings, ActivityItem, Snapshot } from '../types';

const STORAGE_KEY = 'aequitas_os_state_v1';
const BACKUP_PREFIX = 'aequitas_pre_migration_backup_';

export interface AppState {
  holdings: Holding[];
  portfolioValue: number;
  dcaPlan: DcaPlan;
  dividendPlan: DividendPlan;
  activities: ActivityItem[];
  thaiFundNavs: ThaiFundNavState[];
  watchlist: WatchlistItem[];
  snapshots: Snapshot[];
  migrationStatus: MigrationStatus;
  latestAiImportPlan: AiImportSchema | null;
  financialSettings: FinancialSettings;
}

export const migrateData = () => {
  if (typeof window === 'undefined') return { state: null, status: null };

  // 1. Audit current storage for coverage report regardless of existing state
  let oldData: any = {};
  let detectedLegacyKeys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Expand detection to include more potential legacy keys
    if (key && (
      key.startsWith('aequitas_') ||
      key === 'aequitas' ||
      ['portfolio', 'holdings', 'allocation', 'dca', 'dividends', 'thai_nav', 'ai_strategy', 'ai_import', 'snapshot', 'watchlist', 'settings', 'activities', 'trade_journal'].includes(key)
    )) {
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

  const existingStateStr = localStorage.getItem(STORAGE_KEY);
  let existingState: any = null;
  if (existingStateStr) {
    try {
      existingState = JSON.parse(existingStateStr);
    } catch (e) {
      console.error("Failed to parse existing state", e);
    }
  }

  // Define mapping rules for coverage report
  const migrationRules = {
    migrated: [
      'aequitas_portfolio', 'portfolio', 'holdings',
      'aequitas_dca_plan', 'aequitas_dca', 'dca',
      'aequitas_dividend_ledger', 'dividends',
      'aequitas_trade_journal', 'activity', 'activities', 'trade_journal',
      'aequitas_thai_nav', 'thai_nav', 'thai_nav_state',
      'aequitas_watchlist', 'aequitas_watchlist_assets', 'watchlist',
      'aequitas_snapshots', 'snapshots', 'snapshot',
      'aequitas_ai_trading_plan', 'ai_import', 'ai_strategy',
      'aequitas_settings', 'settings',
      'aequitas_usd_thb_rate'
    ],
    ignored: [
      'aequitas_version', 'aequitas_last_sync', 'aequitas_ui_state'
    ]
  };

  const coverageReport = {
    detected: detectedLegacyKeys,
    migrated: detectedLegacyKeys.filter(k => migrationRules.migrated.includes(k)),
    ignored: detectedLegacyKeys.filter(k => migrationRules.ignored.includes(k)),
    unsupported: detectedLegacyKeys.filter(k => !migrationRules.migrated.includes(k) && !migrationRules.ignored.includes(k))
  };

  if (existingState) {
    // Refresh the coverage report in the existing state
    const updatedStatus = {
      ...existingState.migrationStatus,
      detectedLegacyKeys,
      coverageReport
    };
    const refreshedState = { ...existingState, migrationStatus: updatedStatus };
    return { state: refreshedState, status: updatedStatus };
  }

  // If no existing state, attempt full migration
  oldData = {};
  detectedLegacyKeys = [];

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
      activities: oldData.aequitas_trade_journal || oldData.activity || oldData.activities || oldData.trade_journal || null,
      thaiFundNavs: oldData.aequitas_thai_nav || oldData.thai_nav || oldData.thai_nav_state || null,
      watchlist: oldData.aequitas_watchlist || oldData.aequitas_watchlist_assets || oldData.watchlist || null,
      snapshots: oldData.aequitas_snapshots || oldData.snapshots || oldData.snapshot || null,
      latestAiImportPlan: oldData.aequitas_ai_trading_plan || oldData.ai_import || oldData.ai_strategy || null,
      financialSettings: {
        baseCurrency: oldData.aequitas_settings?.baseCurrency || oldData.settings?.baseCurrency || 'USD',
        usdThbRate: Number(oldData.aequitas_usd_thb_rate || oldData.aequitas_settings?.usdThbRate || oldData.settings?.usdThbRate || 36.45),
        showThbTotals: oldData.aequitas_settings?.showThbTotals ?? oldData.settings?.showThbTotals ?? true,
        preferThaiNav: oldData.aequitas_settings?.preferThaiNav ?? oldData.settings?.preferThaiNav ?? true
      }
    };

    // 3. Identify unmapped data
    const unmappedLegacyData: Record<string, any> = {};
    detectedLegacyKeys.forEach(key => {
      if (!migrationRules.migrated.includes(key)) {
        unmappedLegacyData[key] = oldData[key];
      }
    });

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
      unmappedLegacyData,
      coverageReport,
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
