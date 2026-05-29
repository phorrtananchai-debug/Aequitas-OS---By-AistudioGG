import { useState, useEffect } from 'react';
import { 
  AlertItem, 
  TabType, 
  Holding, 
  DcaPlan, 
  DividendPlan, 
  DailyBrief, 
  Snapshot, 
  WatchlistItem, 
  LabsSuggestion, 
  ActivityItem, 
  ChatMessage, 
  ThaiFundNavState,
  AiImportSchema
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import PortfolioTab from './components/PortfolioTab';
import StrategyTab from './components/StrategyTab'; // Used for Labs
import MarketsTab from './components/MarketsTab'; // Refactored to Holdings
import AIInsightsTab from './components/AIInsightsTab'; // AI Advisor Workspace
import ActivityTab from './components/ActivityTab';
import Modals from './components/Modals';

// Core Aequitas sub-workspace modules
import DailyBriefTab from './components/DailyBriefTab';
import DividendsTab from './components/DividendsTab';
import DcaPlanTab from './components/DcaPlanTab';
import AllocationTab from './components/AllocationTab';
import SettingsTab from './components/SettingsTab';
import AIWorkflowTab from './components/AIWorkflowTab';
import SnapshotsTab from './components/SnapshotsTab';

import { calculatePortfolioDrift, calculatePortfolioHealth, calculateDividendStats } from './core/utils';

// Initial Mock Datasets
const INITIAL_NOTIFICATION_QUEUE: AlertItem[] = [
  {
    id: 'notif-1',
    type: 'advisory',
    typeLabel: 'PORTFOLIO DRIFT',
    title: 'Growth allocation target exceeded',
    description: 'Growth layer holdings have risen to 44.3% (target: 40%). Consider reducing current stock DCA weight.',
    time: '2m ago'
  },
  {
    id: 'notif-2',
    type: 'success',
    typeLabel: 'THAI FUND SYNC',
    title: 'Thai Fund RMF NAV Validated',
    description: 'Kasikorn S&P500 RMF NAV reconciled successfully at 15.39 THB.',
    time: '14m ago'
  }
];

const INITIAL_HOLDINGS: Holding[] = [
  { id: 'h-voo', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'US ETF', value: 40000, units: 80, avgCost: 480, currentPrice: 500, gainLoss: 1600, gainLossPct: 4.17, allocationPct: 8.24, dividendYield: 1.35, dividendType: 'reinvest', notes: 'Core long-term equity compounder' },
  { id: 'h-k500xa', ticker: 'K-US500X-A(A)', name: 'Kasikorn US Equity Index Fund', type: 'Thai Mutual Fund', value: 90000, units: 22500, avgCost: 3.8, currentPrice: 4.0, gainLoss: 4500, gainLossPct: 5.26, allocationPct: 18.55, dividendYield: 0, dividendType: 'reinvest', notes: 'S&P 500 tracker with FX hedge' },
  { id: 'h-k500rmf', ticker: 'K-US500XRMF', name: 'Kasikorn US Equity RMF', type: 'Thai RMF', value: 60000, units: 15000, avgCost: 3.6, currentPrice: 4.0, gainLoss: 6000, gainLossPct: 11.11, allocationPct: 12.36, dividendYield: 0, dividendType: 'reinvest', notes: 'Tax protection wrapper for retirement' },
  { id: 'h-msft', ticker: 'MSFT', name: 'Microsoft Corp.', type: 'US Stock', value: 46200, units: 110, avgCost: 400, currentPrice: 420, gainLoss: 2200, gainLossPct: 5.0, allocationPct: 9.52, dividendYield: 0.71, dividendType: 'cash', notes: 'Cloud & AI platform growth driver' },
  { id: 'h-googl', ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'US Stock', value: 30600, units: 180, avgCost: 160, currentPrice: 170, gainLoss: 1800, gainLossPct: 6.25, allocationPct: 6.31, dividendYield: 0.47, dividendType: 'cash', notes: 'AI advertising and search moat' },
  { id: 'h-amzn', ticker: 'AMZN', name: 'Amazon.com, Inc.', type: 'US Stock', value: 27000, units: 150, avgCost: 170, currentPrice: 180, gainLoss: 1500, gainLossPct: 6.0, allocationPct: 5.56, dividendYield: 0, dividendType: 'reinvest', notes: 'E-commerce and cloud database scale leader' },
  { id: 'h-avgo', ticker: 'AVGO', name: 'Broadcom Inc.', type: 'US Stock', value: 42000, units: 30, avgCost: 1300, currentPrice: 1400, gainLoss: 3000, gainLossPct: 7.69, allocationPct: 8.65, dividendYield: 1.5, dividendType: 'cash', notes: 'Hardware infrastructure and software giant' },
  { id: 'h-anet', ticker: 'ANET', name: 'Arista Networks, Inc.', type: 'US Stock', value: 18000, units: 60, avgCost: 280, currentPrice: 300, gainLoss: 1200, gainLossPct: 7.14, allocationPct: 3.71, dividendYield: 0, dividendType: 'reinvest', notes: 'High-speed cloud network switches' },
  { id: 'h-nvda', ticker: 'NVDA', name: 'NVIDIA Corporation', type: 'US Stock', value: 30400, units: 320, avgCost: 85, currentPrice: 95, gainLoss: 3200, gainLossPct: 11.76, allocationPct: 6.26, dividendYield: 0.04, dividendType: 'cash', notes: 'AI silicone and supercomputing backbone' },
  { id: 'h-pltr', ticker: 'PLTR', name: 'Palantir Technologies', type: 'US Stock', value: 21000, units: 500, avgCost: 38, currentPrice: 42, gainLoss: 2000, gainLossPct: 10.53, allocationPct: 4.33, dividendYield: 0, dividendType: 'reinvest', notes: 'Data operating systems for enterprise & defense' },
  { id: 'h-schd', ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', type: 'Dividend ETF', value: 24000, units: 300, avgCost: 78, currentPrice: 80, gainLoss: 600, gainLossPct: 2.56, allocationPct: 4.95, dividendYield: 3.45, dividendType: 'reinvest', notes: 'High-quality dividend compounder' },
  { id: 'h-jepq', ticker: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income', type: 'Dividend ETF', value: 21600, units: 400, avgCost: 52, currentPrice: 54, gainLoss: 800, gainLossPct: 3.85, allocationPct: 4.45, dividendYield: 9.12, dividendType: 'cash', notes: 'Options-overlay high monthly income provider' },
  { id: 'h-abbv', ticker: 'ABBV', name: 'AbbVie Inc.', type: 'US Stock', value: 19800, units: 120, avgCost: 160, currentPrice: 165, gainLoss: 600, gainLossPct: 3.12, allocationPct: 4.08, dividendYield: 3.76, dividendType: 'cash', notes: 'Dividend Aristocrat immunotherapies giant' },
  { id: 'h-rbrk', ticker: 'RBRK', name: 'Rubrik, Inc.', type: 'Sandbox Asset', value: 6000, units: 150, avgCost: 35, currentPrice: 40, gainLoss: 750, gainLossPct: 14.28, allocationPct: 1.24, dividendYield: 0, dividendType: 'reinvest', notes: 'Labs tactical AI cloud data security sandbox asset' },
  { id: 'h-cash', ticker: 'CASH', name: 'US Dollar Cash Buffer', type: 'Cash', value: 8690, units: 8690, avgCost: 1, currentPrice: 1, gainLoss: 0, gainLossPct: 0, allocationPct: 1.79, notes: 'Dry powder capital buffer for future monthly DCA' }
];

const INITIAL_DCA_PLAN: DcaPlan = {
  monthlyContributionPlan: 5500.00,
  cashAvailable: 8690.00,
  nextContributionReminder: 'June 1, 2026',
  items: [
    { id: 'dca-1', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', targetAmount: 1500, priorityOrder: 1, interval: 'Monthly', status: 'Pending' },
    { id: 'dca-2', ticker: 'K-US500XRMF', name: 'Kasikorn US Equity RMF', targetAmount: 1200, priorityOrder: 2, interval: 'Monthly', status: 'Pending' },
    { id: 'dca-3', ticker: 'K-US500X-A(A)', name: 'Kasikorn US Equity Index Fund', targetAmount: 1000, priorityOrder: 3, interval: 'Monthly', status: 'Pending' },
    { id: 'dca-4', ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', targetAmount: 800, priorityOrder: 4, interval: 'Monthly', status: 'Pending' },
    { id: 'dca-5', ticker: 'MSFT', name: 'Microsoft Corp.', targetAmount: 600, priorityOrder: 5, interval: 'Monthly', status: 'Pending' },
    { id: 'dca-6', ticker: 'PLTR', name: 'Palantir Technologies', targetAmount: 400, priorityOrder: 6, interval: 'Monthly', status: 'Pending' }
  ]
};

const INITIAL_DIVIDEND_PLAN: DividendPlan = {
  expectedMonthlyDividend: 695.00,
  annualizedIncomeEstimate: 8345.00,
  reinvestmentStatusDefault: 'Reinvested locally via DCA Scheduler',
  cashflowStabilityNotes: 'Highly stable dividend overlay. Strong behavior anchoring against market noise.',
  items: [
    { id: 'div-jepq', ticker: 'JEPQ', name: 'JPMorgan Nasdaq Premium Income', yield: 9.12, annualEst: 1970, frequency: 'Monthly', reinvestmentStatus: 'Reinvest' },
    { id: 'div-schd', ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF', yield: 3.45, annualEst: 828, frequency: 'Quarterly', reinvestmentStatus: 'Reinvest' },
    { id: 'div-abbv', ticker: 'ABBV', name: 'AbbVie Inc.', yield: 3.76, annualEst: 745, frequency: 'Quarterly', reinvestmentStatus: 'Hold Cash' },
    { id: 'div-avgo', ticker: 'AVGO', name: 'Broadcom Inc.', yield: 1.50, annualEst: 630, frequency: 'Quarterly', reinvestmentStatus: 'Hold Cash' },
    { id: 'div-voo', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', yield: 1.35, annualEst: 540, frequency: 'Quarterly', reinvestmentStatus: 'Reinvest' }
  ]
};

const INITIAL_DAILY_BRIEF: DailyBrief = {
  todaySummary: 'Manual monitoring active. Total assets stable. Standard US Stock DCA scheduled for next week.',
  aiObservation: 'The Growth Layer slightly exceeds standard threshold margins (44.3% vs. 40%). We suggest directing upcoming DCA to the Core ETF Layer.',
  allocationDrift: 'Optimal Range: Combined weighted drift index is currently 3.2%, which is safely below your 3.5% drift threshold limits.',
  dcaReminder: 'DCA contribution validation of $5,500 scheduled tomorrow.',
  dividendReminder: '$695.00 upcoming monthly income registered across passive dividend holdings.',
  riskConcentrationNote: 'Technological Growth asset concentration at 44.3%. No immediate action required.',
  marketContextPlaceholder: 'S&P 500 is historically stable. Treasury yields remain at 4.85% secured levels.',
  whatToReviewToday: [
    'Review cash buffer limits for subsequent stock accumulation DCA',
    'Verify Thai mutual fund K-US500XRMF annual tax deduction cap status',
    'Monitor Sandbox asset RBRK volatility indices inside Labs'
  ]
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-32091',
    type: 'Contribution',
    asset: 'VOO',
    amount: 1500,
    timestamp: '2026-05-26 01:12:44',
    status: 'COMPLETED',
    notes: 'Standard monthly contribution plan accumulation'
  },
  {
    id: 'act-48905',
    type: 'Review',
    asset: 'K-US500XRMF',
    amount: 1200,
    timestamp: '2026-05-26 01:35:12',
    status: 'COMPLETED',
    notes: 'Audited Thai tax wrapping deductible efficiency'
  }
];

const INITIAL_THAI_FUND_NAVS: ThaiFundNavState[] = [
  { ticker: 'K-US500X-A(A)', name: 'Kasikorn US Equity Index Fund', nav: 15.42, lastUpdated: '2026-05-25', isStale: false, navSource: 'Manual', unitsHeld: 22500, taxEfficiencyNotes: 'S&P 500 S-Class tracker' },
  { ticker: 'K-US500XRMF', name: 'Kasikorn US Equity RMF', nav: 15.39, lastUpdated: '2026-05-25', isStale: false, navSource: 'Manual', unitsHeld: 15000, taxEfficiencyNotes: 'RMF Retirement plan wrapper, tax savings eligible' }
];

const INITIAL_WATCHLIST: WatchlistItem[] = [
  { id: 'w-cost', ticker: 'COST', name: 'Costco Wholesale Corp.', targetEntryZone: '$780 - $800', notes: 'Strong resilient consumer moat', aiObservation: 'Valuation slightly rich. Plan future acquisition limit entry zones carefully.', riskLevel: 'Medium' },
  { id: 'w-mcd', ticker: 'MCD', name: 'McDonald\'s Corporation', targetEntryZone: '$255 - $260', notes: 'Anchoring behavior dividend contributor', aiObservation: 'Approaching suggested historical value entry parameters.', riskLevel: 'Low' }
];

const INITIAL_LABS_SUGGESTIONS: LabsSuggestion[] = [
  { id: 'ls-rbrk', title: 'High-Growth AI Cybersecurity', description: 'Evaluate experimental deployment of soft data security assets.', sandboxAsset: 'RBRK', tacticalIdea: 'Leverage sandbox sandbox weights for high-multiple momentum assets.', scenarioImpact: '+18% under tech rally, -12% under liquidity contraction', riskLevel: 'High' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');
  const [portfolioValue, setPortfolioValue] = useState<number>(485290.00);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core App State Matrices
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [dcaPlan, setDcaPlan] = useState<DcaPlan>(INITIAL_DCA_PLAN);
  const [dividendPlan, setDividendPlan] = useState<DividendPlan>(INITIAL_DIVIDEND_PLAN);
  const [dailyBrief, setDailyBrief] = useState<DailyBrief>(INITIAL_DAILY_BRIEF);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [thaiFundNavs, setThaiFundNavs] = useState<ThaiFundNavState[]>(INITIAL_THAI_FUND_NAVS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [labsSuggestions, setLabsSuggestions] = useState<LabsSuggestion[]>(INITIAL_LABS_SUGGESTIONS);
  const [notifications, setNotifications] = useState<AlertItem[]>(INITIAL_NOTIFICATION_QUEUE);
  const [latestAiImportPlan, setLatestAiImportPlan] = useState<AiImportSchema | null>(null);
  const [aiImportStatus, setAiImportStatus] = useState<string>('Offline Schema Mode: Default core parameters preloaded.');

  // Simulated Simulation model backups
  const [simulations, setSimulations] = useState<any[]>([
    { id: 'SIM-HQ', strategyName: 'Cyclical Accumulation Simulation', network: 'Aequitas Plan Mock', modelAccuracy: 94.2, maxDrawdown: 1.15, projApy: 18.5, status: 'OPTIMIZED' },
    { id: 'SIM-MT', strategyName: 'Tech Momentum Corridor', network: 'Growth Layer Simulator', modelAccuracy: 88.5, maxDrawdown: 4.12, projApy: 32.4, status: 'RUNNING' }
  ]);

  // Toast Control
  const [activeToast, setActiveToast] = useState<AlertItem | null>(null);

  // Modal control states
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Sync state derived from sum of holdings
  useEffect(() => {
    const safeHoldings = Array.isArray(holdings) ? holdings : [];
    const sum = safeHoldings.reduce((acc, curr) => acc + (curr?.value || 0), 0);
    // Align portfolio value only if close or trigger manual recalculations
    if (Math.abs(sum - portfolioValue) > 0.01) {
      setPortfolioValue(sum);
    }
  }, [holdings, portfolioValue]);

  // Dark mode side-effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast notifications manager
  const pushNotification = (alert: Omit<AlertItem, 'id' | 'time'>) => {
    if (!alert) return;
    const freshAlert: AlertItem = {
      ...alert,
      id: `alert-${Date.now()}`,
      time: 'Just now'
    };
    
    setNotifications(prev => [freshAlert, ...(Array.isArray(prev) ? prev : [])]);
    setActiveToast(freshAlert);
    
    // Auto-erase toast after 5s
    setTimeout(() => {
      setActiveToast(prev => prev?.id === freshAlert.id ? null : prev);
    }, 5000);
  };

  const handleClearNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  // Run backtests inside strategic labs
  const handleRunSimulation = (id: string) => {
    setSimulations(prev => prev.map(run => {
      if (run.id === id) {
        return {
          ...run,
          status: 'RUNNING',
          modelAccuracy: parseFloat(Math.min(99.6, run.modelAccuracy + 1.2).toFixed(1))
        };
      }
      return run;
    }));

    setTimeout(() => {
      setSimulations(prev => prev.map(run => {
        if (run.id === id) {
          return { ...run, status: 'OPTIMIZED' };
        }
        return run;
      }));
      pushNotification({
        type: 'success',
        typeLabel: 'SIMULATED',
        title: `Simulation ${id} Completed`,
        description: 'Completed backtest simulation matrix within labs environment.'
      });
    }, 3000);
  };

  const handleExportCsv = () => {
    pushNotification({
      type: 'success',
      typeLabel: 'EXPORT COMPLETED',
      title: 'Ledger Audit Exported',
      description: 'Portfolio allocation parameters dataset exported as local CSV.'
    });
  };

  // Aequitas AI import action parser
  const handleImportAiSchema = (parsed: AiImportSchema) => {
    if (!parsed) return;
    setLatestAiImportPlan(parsed);
    setAiImportStatus(`Successfully parsed AI plan on ${new Date().toLocaleTimeString()}`);

    // Let's modify states based on imported schema fields
    if (parsed.portfolioSummary) {
      const { totalValue } = parsed.portfolioSummary;
      
      // Update asset cash holdings value if totalValue varies or updates
      if (typeof totalValue === 'number') {
        setHoldings(prev => (Array.isArray(prev) ? prev : []).map(h => {
          if (h && h.type === 'Cash') {
            const safePrev = Array.isArray(prev) ? prev : [];
            const othersValueSum = safePrev.filter(x => x && x.type !== 'Cash').reduce((sum, current) => sum + (current?.value || 0), 0);
            const nextCashValue = Math.max(0, totalValue - othersValueSum);
            return { ...h, value: nextCashValue, units: nextCashValue };
          }
          return h;
        }));
      }

      pushNotification({
        type: 'success',
        typeLabel: 'AI IMPORT',
        title: 'Core Portfolio Targets Updated',
        description: 'Drift indexes and health rates updated according to AI suggestions.'
      });
    }

    if (Array.isArray(parsed.assetPlans) && parsed.assetPlans.length > 0) {
      setHoldings(prev => prev.map(holding => {
        const match = parsed.assetPlans.find(ap => ap && ap.ticker && ap.ticker.toLowerCase() === holding.ticker.toLowerCase());
        if (match) {
          return {
            ...holding,
            notes: `${holding.notes ? holding.notes + ' | ' : ''}AI SUGGESTS: ${match.action} (${match.notes || ''})`,
            targetAllocationPct: match.targetAllocationPct
          };
        }
        return holding;
      }));
    }

    if (parsed.dcaPlan) {
      setDcaPlan(prev => {
        const dcaPlanItems = parsed.dcaPlan?.items;
        const updatedItems = Array.isArray(dcaPlanItems) ? prev.items.map(item => {
          const matchingImportItem = dcaPlanItems.find(x => x && x.ticker && x.ticker.toLowerCase() === item.ticker.toLowerCase());
          if (matchingImportItem) {
            return { ...item, targetAmount: matchingImportItem.targetAmount };
          }
          return item;
        }) : prev.items;
        return {
          ...prev,
          monthlyContributionPlan: parsed.dcaPlan.monthlyContributionPlan ?? prev.monthlyContributionPlan,
          items: updatedItems
        };
      });
    }

    if (parsed.dailyBrief) {
      setDailyBrief(prev => {
        const riskWarnings = parsed.dailyBrief?.riskWarnings;
        const newRiskConcentration = Array.isArray(riskWarnings) 
          ? riskWarnings.join('; ') 
          : (riskWarnings || '');
        return {
          ...prev,
          aiObservation: parsed.dailyBrief.todayObservation || prev.aiObservation,
          whatToReviewToday: Array.isArray(parsed.dailyBrief.todayReviewActions) ? parsed.dailyBrief.todayReviewActions : prev.whatToReviewToday,
          riskConcentrationNote: newRiskConcentration || prev.riskConcentrationNote
        };
      });
    }

    if (Array.isArray(parsed.labsSuggestions) && parsed.labsSuggestions.length > 0) {
      const parsedSuggestions: LabsSuggestion[] = parsed.labsSuggestions.map((ls, index) => ({
        id: `ls-imported-${index}-${Date.now()}`,
        title: `AI: ${ls.ticker || ''} Sandbox Proposal`,
        description: ls.reason || '',
        sandboxAsset: ls.ticker || '',
        tacticalIdea: `Evaluate ${ls.ticker || ''} asset at High Risk target limits`,
        scenarioImpact: `Risk rating analyzed as ${ls.riskScore || 'Unknown'}`,
        riskLevel: ls.riskScore === 'High' ? 'High' : 'Speculative'
      }));
      setLabsSuggestions(prev => [...parsedSuggestions, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F1F5F9] font-sans transition-colors duration-300 dot-grid">
      
      {/* 1. Left side Persistent Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewAnalysis={() => setAnalysisModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
        onTriggerAlert={pushNotification}
        portfolioValue={portfolioValue}
      />

      {/* 2. Top Navigation header */}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExecuteTrade={() => setTradeModalOpen(true)}
        notifications={notifications}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onClearNotification={handleClearNotif}
        onClearAllNotifications={handleClearAllNotifs}
      />

      {/* 3. Main content body wrapper */}
      <main className="pl-64 pt-16 min-h-screen relative z-10">
        <div id="dashboard-tab-viewport" className="p-8 max-w-[1440px] mx-auto min-h-[calc(100vh-64px)] overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <OverviewTab 
              portfolioValue={portfolioValue} 
              setActiveTab={setActiveTab}
              healthScore={calculatePortfolioHealth(holdings)}
              driftPct={calculatePortfolioDrift(holdings)}
              dailyBrief={dailyBrief}
              dcaTarget={dcaPlan.monthlyContributionPlan}
              cashAvailable={dcaPlan.cashAvailable}
              dividendMonthly={calculateDividendStats(holdings).monthlyEst}
              holdings={holdings}
            />
          )}

          {activeTab === 'dailyBrief' && (
            <DailyBriefTab 
              portfolioValue={portfolioValue}
              dailyBrief={dailyBrief}
              holdings={holdings}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
              holdings={holdings}
              dcaPlan={dcaPlan}
            />
          )}

          {activeTab === 'holdings' && (
            <MarketsTab 
              searchQuery={searchQuery}
              onTriggerAlert={pushNotification}
              holdings={holdings}
              onUpdateHoldings={setHoldings}
              thaiFundNavs={thaiFundNavs}
              onUpdateThaiFundNavs={setThaiFundNavs}
            />
          )}

          {activeTab === 'allocation' && (
            <AllocationTab 
              onTriggerAlert={pushNotification}
              holdings={holdings}
              latestAiImportPlan={latestAiImportPlan}
            />
          )}

          {activeTab === 'dividends' && (
            <DividendsTab 
              dividendPlan={dividendPlan}
              onUpdateDividendPlan={setDividendPlan}
              holdings={holdings}
            />
          )}

          {activeTab === 'dcaPlan' && (
            <DcaPlanTab 
              dcaPlan={dcaPlan}
              onUpdateDcaPlan={setDcaPlan}
              holdings={holdings}
              onTriggerAlert={pushNotification}
            />
          )}

          {activeTab === 'aiWorkflow' && (
            <AIWorkflowTab 
              portfolioValue={portfolioValue}
              holdings={holdings}
              dcaPlan={dcaPlan}
              dividendPlan={dividendPlan}
              thaiFundNavs={thaiFundNavs}
              labsSuggestions={labsSuggestions}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
              onImportAiSchema={handleImportAiSchema}
              latestImportStatus={aiImportStatus}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'snapshots' && (
            <SnapshotsTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
              holdings={holdings}
            />
          )}

          {activeTab === 'aiAdvisor' && (
            <AIInsightsTab 
              onTriggerAlert={pushNotification}
              holdings={holdings}
              dailyBrief={dailyBrief}
              aiImportStatus={aiImportStatus}
            />
          )}

          {activeTab === 'labs' && (
            <StrategyTab 
              searchQuery={searchQuery}
              simulations={simulations}
              onRunSimulation={handleRunSimulation}
              onExportCsv={handleExportCsv}
              onTriggerAlert={pushNotification}
              labsSuggestions={labsSuggestions}
              watchlist={watchlist}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityTab 
              activities={activities}
              searchQuery={searchQuery}
              onClearActivities={() => setActivities([])}
              onTriggerAlert={pushNotification}
            />
          )}

        </div>
      </main>

      {/* 4. Multi-purpose dialogue overlays */}
      <Modals 
        tradeModalOpen={tradeModalOpen}
        onCloseTradeModal={() => setTradeModalOpen(false)}
        analysisModalOpen={analysisModalOpen}
        onCloseAnalysisModal={() => setAnalysisModalOpen(false)}
        settingsModalOpen={settingsModalOpen}
        onCloseSettingsModal={() => setSettingsModalOpen(false)}
        supportModalOpen={supportModalOpen}
        onCloseSupportModal={() => setSupportModalOpen(false)}
        
        portfolioValue={portfolioValue}
        onUpdatePortfolio={setPortfolioValue}
        onAddActivity={(newAct) => {
          const freshAct: ActivityItem = {
            ...newAct,
            id: `act-${Math.random().toString(36).substring(2, 7)}-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'COMPLETED'
          };
          setActivities(prev => [freshAct, ...prev]);
        }}
        onAddSimulation={(newSim) => {
          const freshSim = {
            ...newSim,
            id: `SIM-${Math.floor(Math.random() * 9000 + 1000)}`
          };
          setSimulations(prev => [freshSim, ...prev]);
        }}
        onTriggerAlert={pushNotification}
      />

      {/* 5. Ambient Active Toast notification popup overlay */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 w-80 glass-panel border-l-4 border-blue-600 dark:border-blue-500 rounded-2xl shadow-lg p-4 z-55 flex items-start gap-3 animate-slide-in text-slate-950 dark:text-slate-50 animate-fade-in transition-all">
          <div className="flex-1">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[8px] tracking-widest px-2 py-0.5 rounded font-bold bg-blue-550/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300">
                {activeToast.typeLabel}
              </span>
              <button 
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ×
              </button>
            </div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{activeToast.title}</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-350 leading-normal mt-1">{activeToast.description}</p>
          </div>
        </div>
      )}

    </div>
  );
}
