export type TabType = 
  | 'dashboard' // Keep dashboard to match the active state in standard routers if selected, but label as "Dashboard Overview"
  | 'dailyBrief' 
  | 'holdings' 
  | 'allocation' 
  | 'dcaPlan' 
  | 'dividends' 
  | 'aiWorkflow'
  | 'aiAdvisor' 
  | 'snapshots'
  | 'settings'
  | 'labs'
  | 'watchlist'
  | 'activity';

export type AssetType =
  | 'US Stock'
  | 'US ETF'
  | 'Thai Mutual Fund'
  | 'Thai RMF'
  | 'Dividend ETF'
  | 'Sandbox Asset'
  | 'Cash';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  value: number;
  units: number;
  avgCost: number;
  currentPrice: number;
  gainLoss: number;
  gainLossPct: number;
  allocationPct: number;
  targetAllocationPct?: number;
  dividendYield?: number;
  dividendType?: 'cash' | 'reinvest';
  notes?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  monthlyDcaTarget: number;
  cashAvailable: number;
  dividendEstimateAnnual: number;
  dividendEstimateMonthly: number;
  portfolioHealth: number; // 0-100 scale
  allocationDriftPct: number;
  lastAiSummaryDate?: string;
  reviewItemsCount: number;
}

export interface AllocationBucket {
  name: string; // 'Core ETF Layer' | 'Growth Layer' | 'Dividend / Behavior Layer' | 'Thai Tax Wrapper Layer' | 'Sandbox Layer' | 'Cash Buffer'
  currentPct: number;
  targetPct: number;
  driftPct: number;
  value: number;
  color: string;
}

export interface AllocationPlan {
  buckets: AllocationBucket[];
  rebalanceGuidance: string;
  priorityActions: string[];
}

export interface DcaPlanItem {
  id: string;
  ticker: string;
  name: string;
  targetAmount: number;
  priorityOrder: number;
  interval: string;
  status: 'Completed' | 'Pending' | 'Skipped';
}

export interface DcaPlan {
  monthlyContributionPlan: number;
  items: DcaPlanItem[];
  cashAvailable: number;
  nextContributionReminder: string;
}

export interface DividendPlanItem {
  id: string;
  ticker: string;
  name: string;
  yield: number;
  annualEst: number;
  frequency: string;
  reinvestmentStatus: 'Reinvest' | 'Hold Cash' | 'Transfer';
}

export interface DividendPlan {
  expectedMonthlyDividend: number;
  annualizedIncomeEstimate: number;
  items: DividendPlanItem[];
  reinvestmentStatusDefault: string;
  cashflowStabilityNotes: string;
}

export interface ThaiFundNavState {
  ticker: string;
  name: string;
  nav: number;
  lastUpdated: string;
  isStale: boolean;
  navSource: 'Manual' | 'Google Sheet' | 'Stale Fallback';
  unitsHeld: number;
  taxEfficiencyNotes: string;
}

export interface AssetPlan {
  ticker: string;
  action: 'Review' | 'Consider' | 'Monitor' | 'Accumulate' | 'Hold Long-Term' | 'Reduce Overlap';
  targetAllocationPct: number;
  notes: string;
}

export interface AiImportSchema {
  portfolioSummary: {
    totalValue?: number;
    portfolioHealth?: number;
    allocationDriftPct?: number;
    reviewItemsCount?: number;
  };
  assetPlans: AssetPlan[];
  allocationPlan: {
    buckets: { name: string; targetPct: number }[];
    rebalanceGuidance: string;
    priorityActions: string[];
  };
  dcaPlan: {
    monthlyContributionPlan?: number;
    items: { ticker: string; targetAmount: number }[];
  };
  dividendNotes: string;
  dailyBrief: {
    todayObservation: string;
    todayReviewActions: string[];
    riskWarnings: string[];
  };
  labsSuggestions: {
    ticker: string;
    reason: string;
    riskScore: 'Low' | 'Medium' | 'High';
  }[];
}

export interface DailyBrief {
  todaySummary: string;
  aiObservation: string;
  allocationDrift: string;
  dcaReminder: string;
  dividendReminder: string;
  riskConcentrationNote: string;
  marketContextPlaceholder: string;
  whatToReviewToday: string[];
}

export interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  totalValue: number;
  holdingsCount: number;
  allocationBuckets: { name: string; currentPct: number }[];
  aiReviewSummary?: string;
  rawStateJson: string;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  name: string;
  targetEntryZone: string;
  notes: string;
  aiObservation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface LabsSuggestion {
  id: string;
  title: string;
  description: string;
  sandboxAsset: string;
  tacticalIdea: string;
  scenarioImpact: string;
  riskLevel: 'High' | 'Speculative';
}

export interface ExternalResearchResult {
  id: string;
  source: string;
  summary: string;
  aiNotes: string;
  manualReviewStatus: 'Reviewed' | 'Pending';
  date: string;
}

export interface AlertItem {
  id: string;
  type: 'high' | 'advisory' | 'monitoring' | 'success';
  typeLabel: string;
  time: string;
  title: string;
  description: string;
}

export interface AlertRule {
  id: string;
  ticker: string;
  symbol: string;
  triggerType: string;
  condition: 'above' | 'below';
  targetPrice: number;
  message: string;
  enabled: boolean;
  status: 'active' | 'triggered';
  lastTriggeredAt: string | null;
}

export interface DividendHistoryItem {
  id: string;
  date: string;
  ticker: string;
  amountUSD: number;
  taxUSD: number;
  netUSD: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  type: 'Hold' | 'Review' | 'Manual Action' | 'Contribution' | 'Reduce';
  asset: string;
  amount: number;
  price?: number;
  total?: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'SKIPPED';
  notes?: string;
}

export interface SimulationRun {
  id: string;
  strategyName: string;
  network: string;
  modelAccuracy: number;
  maxDrawdown: number;
  projApy: number;
  status: string;
}

export interface StrategyArchetype {
  id: string;
  title: string;
  iconName: string;
  description: string;
  status: string;
  risk: string;
  active?: boolean;
}

export interface MigrationCoverageReport {
  detected: string[];
  migrated: string[];
  ignored: string[];
  unsupported: string[];
}

export interface MigrationSummary {
  holdingsCount: number;
  totalValue: number;
  symbols: string[];
}

export interface MigrationStatus {
  source: 'old-local-storage' | 'new-state' | 'sample-state';
  migratedAt: string | null;
  detectedLegacyKeys?: string[];
  unmappedLegacyData?: Record<string, any>;
  coverageReport?: MigrationCoverageReport;
  summary?: MigrationSummary;
  success?: boolean;
  warnings: string[];
}

export interface FinancialSettings {
  baseCurrency: string;
  usdThbRate: number;
  showThbTotals: boolean;
  preferThaiNav: boolean;
}
