import { useState, useEffect } from 'react';
import { 
  AlertItem, 
  TabType, 
  TradeLog, 
  SimulationRun, 
  ChatMessage 
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import PortfolioTab from './components/PortfolioTab';
import StrategyTab from './components/StrategyTab';
import MarketsTab from './components/MarketsTab';
import AIInsightsTab from './components/AIInsightsTab';
import ActivityTab from './components/ActivityTab';
import Modals from './components/Modals';

// New specialized sub-workspace modules
import DailyBriefTab from './components/DailyBriefTab';
import DividendsTab from './components/DividendsTab';
import DcaPlanTab from './components/DcaPlanTab';
import AllocationTab from './components/AllocationTab';
import SettingsTab from './components/SettingsTab';
import AIWorkflowTab from './components/AIWorkflowTab';
import SnapshotsTab from './components/SnapshotsTab';

// Initial mock dataset
const INITIAL_NOTIFICATION_QUEUE: AlertItem[] = [
  {
    id: 'notif-1',
    type: 'high',
    typeLabel: 'MOMENTUM SIGNAL',
    title: 'Divergence Found on ETH',
    description: '15m RSI divergence suggests high probability reversal pattern formulation.',
    time: '2m ago'
  },
  {
    id: 'notif-2',
    type: 'advisory',
    typeLabel: 'NODE RE-CALIBRATING',
    title: 'Distributed Consensus Synced',
    description: 'Cluster Sol-09 completed standard VM ledger optimization successfully.',
    time: '14m ago'
  }
];

const INITIAL_SIMULATIONS: SimulationRun[] = [
  {
    id: 'SIM-8492',
    strategyName: 'Mean Reversion Alpha-9',
    network: 'Solana Arbitrage Cluster',
    modelAccuracy: 94.2,
    maxDrawdown: 1.15,
    projApy: 18.5,
    status: 'OPTIMIZED'
  },
  {
    id: 'SIM-8501',
    strategyName: 'Momentum Breakout V2',
    network: 'Turing Neural AI Node',
    modelAccuracy: 88.5,
    maxDrawdown: 4.12,
    projApy: 32.4,
    status: 'RUNNING'
  },
  {
    id: 'SIM-8514',
    strategyName: 'Delta Neutral Spreads',
    network: 'Gas Optimizer VM Cluster',
    modelAccuracy: 91.0,
    maxDrawdown: 0.52,
    projApy: 12.4,
    status: 'QUEUED'
  }
];

const INITIAL_TRADES: TradeLog[] = [
  {
    id: 'tx-sol-32091',
    type: 'BUY',
    asset: 'SOL',
    amount: 150,
    price: 145.20,
    total: 21780.00,
    timestamp: '2026-05-26 01:12:44',
    status: 'COMPLETED'
  },
  {
    id: 'tx-btc-48905',
    type: 'SELL',
    asset: 'BTC',
    amount: 0.85,
    price: 67950.00,
    total: 57757.50,
    timestamp: '2026-05-26 01:35:12',
    status: 'COMPLETED'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');
  const [portfolioValue, setPortfolioValue] = useState<number>(485290.00);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Lists & Activity Database
  const [notifications, setNotifications] = useState<AlertItem[]>(INITIAL_NOTIFICATION_QUEUE);
  const [simulations, setSimulations] = useState<SimulationRun[]>(INITIAL_SIMULATIONS);
  const [trades, setTrades] = useState<TradeLog[]>(INITIAL_TRADES);

  // Active Bottom Right Toast Popup
  const [activeToast, setActiveToast] = useState<AlertItem | null>(null);

  // Modal control states
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Dark mode side-effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle new incoming notifications with optional Quick Bottom Toast displayer!
  const pushNotification = (alert: Omit<AlertItem, 'id' | 'time'>) => {
    const freshAlert: AlertItem = {
      ...alert,
      id: `alert-${Date.now()}`,
      time: 'Just now'
    };
    
    setNotifications(prev => [freshAlert, ...prev]);
    setActiveToast(freshAlert);
    
    // Auto erase toast after 5s
    setTimeout(() => {
      setActiveToast(prev => prev?.id === freshAlert.id ? null : prev);
    }, 5000);
  };

  // Helper clear alerts
  const handleClearNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  // Run/Optimize traces animations simulator inside StrategyTable
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

    // Transition mock state to OPTIMIZED after 3s
    setTimeout(() => {
      setSimulations(prev => prev.map(run => {
        if (run.id === id) {
          return {
            ...run,
            status: 'OPTIMIZED'
          };
        }
        return run;
      }));
      pushNotification({
        type: 'success',
        typeLabel: 'TRACE COMPLETED',
        title: `Run ${id} Fully Optimized`,
        description: 'Completed backtesting matrix. Signal correlation limits tightened.'
      });
    }, 3000);
  };

  const handleExportCsv = () => {
    pushNotification({
      type: 'success',
      typeLabel: 'EXPORT COMPLETED',
      title: 'Simulation List Exported',
      description: 'Active backtest scenarios database downloaded successfully in CSV format.'
    });
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

      {/* 2. Top Navigation header dashboard options */}
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
              confidence={98.2}
            />
          )}

          {activeTab === 'dailyBrief' && (
            <DailyBriefTab 
              portfolioValue={portfolioValue}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
            />
          )}

          {(activeTab === 'holdings' || activeTab === 'markets') && (
            <MarketsTab 
              searchQuery={searchQuery}
              onExecuteTrade={() => setTradeModalOpen(true)}
              onTriggerAlert={pushNotification}
            />
          )}

          {activeTab === 'allocation' && (
            <AllocationTab 
              onTriggerAlert={pushNotification}
            />
          )}

          {activeTab === 'dividends' && (
            <DividendsTab />
          )}

          {activeTab === 'dcaPlan' && (
            <DcaPlanTab />
          )}

          {activeTab === 'aiWorkflow' && (
            <AIWorkflowTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'snapshots' && (
            <SnapshotsTab 
              portfolioValue={portfolioValue}
              onUpdatePortfolio={setPortfolioValue}
              onTriggerAlert={pushNotification}
            />
          )}

          {(activeTab === 'aiAdvisor' || activeTab === 'insights') && (
            <AIInsightsTab 
              onTriggerAlert={pushNotification}
            />
          )}

          {(activeTab === 'labs' || activeTab === 'strategy') && (
            <StrategyTab 
              searchQuery={searchQuery}
              simulations={simulations}
              onRunSimulation={handleRunSimulation}
              onExportCsv={handleExportCsv}
              onTriggerAlert={pushNotification}
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
              trades={trades}
              searchQuery={searchQuery}
              onClearTrades={() => setTrades([])}
              onTriggerAlert={pushNotification}
            />
          )}

        </div>
      </main>

      {/* 4. Multi purpose dialog windows drawer controllers */}
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
        onAddTrade={(newTrade) => {
          const freshTrade: TradeLog = {
            ...newTrade,
            id: `tx-${Math.random().toString(36).substring(2, 7)}-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'COMPLETED'
          };
          setTrades(prev => [freshTrade, ...prev]);
        }}
        onAddSimulation={(newSim) => {
          const freshSim: SimulationRun = {
            ...newSim,
            id: `SIM-${Math.floor(Math.random() * 9000 + 1000)}`
          };
          setSimulations(prev => [freshSim, ...prev]);
        }}
        onTriggerAlert={pushNotification}
      />

      {/* 5. Clean, elegant active Toast notification banner overlay */}
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
