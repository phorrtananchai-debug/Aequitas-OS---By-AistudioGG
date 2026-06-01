import { MigrationStatus, Holding, DcaPlan, DividendPlan, ThaiFundNavState, WatchlistItem, AiImportSchema, FinancialSettings, ActivityItem, Snapshot } from '../types';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const STORAGE_KEY_BASE = 'aequitas_os_state_v1';
const BACKUP_PREFIX = 'aequitas_pre_migration_backup_';

export const getStorageKey = (uid?: string) => uid ? `${STORAGE_KEY_BASE}_${uid}` : STORAGE_KEY_BASE;

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

export const fetchStateFromFirestore = async (uid: string): Promise<Partial<AppState> | null> => {
  const discoveryPaths = [
    ['users', uid, 'aequitas', 'state'],
    ['users', uid],
    ['aequitas', uid],
    ['workspaces', uid],
    ['portfolios', uid]
  ];

  console.log(`[Aequitas OS] Starting Cloud Discovery for UID: ${uid}`);

  for (const pathSegments of discoveryPaths) {
    const path = pathSegments.join('/');
    try {
      console.log(`[Aequitas OS] Probing path: ${path} (UID: ${uid})`);
      const docRef = doc(db, pathSegments[0], ...pathSegments.slice(1));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<AppState>;
        const holdingsCount = data.holdings?.length || 0;
        console.log(`[Aequitas OS] Found document at ${path}. Holdings count: ${holdingsCount}`);

        if (holdingsCount > 0 || (data as any).portfolioValue > 0) {
          console.log(`[Aequitas OS] Cloud Discovery SUCCESS at ${path}`);
          return data;
        } else {
          console.log(`[Aequitas OS] Document at ${path} is empty. Continuing search...`);
        }
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.warn(`[Aequitas OS] Permission Denied for path: ${path}. Please check Firestore Security Rules.`);
      } else {
        console.error(`[Aequitas OS] Error probing path ${path}:`, error);
      }
    }
  }

  console.log(`[Aequitas OS] Cloud Discovery completed. No non-empty state found.`);
  return null;
};

const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        sanitized[key] = sanitizeForFirestore(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

export const saveStateToFirestore = async (uid: string, state: Partial<AppState>) => {
  try {
    // Safety Check: Don't overwrite with empty state if cloud already has data
    const holdingsCount = state.holdings?.length || 0;
    const portfolioValue = Number(state.portfolioValue || 0);

    if (holdingsCount === 0 && portfolioValue === 0) {
      const docRef = doc(db, 'users', uid, 'aequitas', 'state');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if ((cloudData.holdings?.length || 0) > 0) {
          console.warn("[Aequitas OS] Blocked sync: Local state is empty, but non-empty Cloud state exists. Preventing overwrite.");
          return;
        }
      }
    }

    const sanitizedState = sanitizeForFirestore(state);

    // Ensure migrationStatus is at least null if undefined
    if (sanitizedState.migrationStatus === undefined) {
      sanitizedState.migrationStatus = null;
    }

    const docRef = doc(db, 'users', uid, 'aequitas', 'state');
    await setDoc(docRef, sanitizedState, { merge: true });
    console.log("[Aequitas OS] Cloud Sync SUCCESS");
  } catch (error) {
    console.error("[Aequitas OS] Error saving to Firestore:", error);
  }
};

export const migrateData = (uid?: string) => {
  if (typeof window === 'undefined') return { state: null, status: null };

  const STORAGE_KEY = getStorageKey(uid);

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
    const rawHoldings = oldData.aequitas_portfolio?.holdings || oldData.holdings || oldData.portfolio?.holdings || null;

    // Normalize holdings fields (e.g., allocationPct -> percent)
    const normalizedHoldings = Array.isArray(rawHoldings) ? rawHoldings.map((h: any) => ({
      ...h,
      percent: h.percent ?? h.allocationPct ?? h.weight ?? 0,
      gainLossPercent: h.gainLossPercent ?? h.gainLossPct ?? 0,
    })) : null;

    const newState: any = {
      holdings: normalizedHoldings,
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

    const summary = {
      holdingsCount: newState.holdings?.length || 0,
      totalValue: newState.portfolioValue || 0,
      symbols: (newState.holdings || []).slice(0, 3).map((h: any) => h.ticker)
    };

    const status: MigrationStatus = {
      source: 'old-local-storage',
      migratedAt: new Date().toISOString(),
      detectedLegacyKeys,
      unmappedLegacyData,
      coverageReport,
      summary,
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

export const saveState = (state: Partial<AppState>, uid?: string) => {
  if (typeof window === 'undefined') return;
  const STORAGE_KEY = getStorageKey(uid);
  const existing = localStorage.getItem(STORAGE_KEY);
  let base = {};
  if (existing) {
    try {
      base = JSON.parse(existing);
    } catch (e) {
      base = {};
    }
  }
    const newState = { ...base, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

    // Sync to cloud if authenticated
    if (uid) {
      saveStateToFirestore(uid, newState);
    }
};
