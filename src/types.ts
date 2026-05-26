export type TabType = 
  | 'dashboard' 
  | 'dailyBrief' 
  | 'portfolio' 
  | 'holdings' 
  | 'allocation' 
  | 'dividends' 
  | 'dcaPlan' 
  | 'aiWorkflow'
  | 'aiAdvisor' 
  | 'labs' 
  | 'snapshots'
  | 'settings'
  | 'markets' 
  | 'insights' 
  | 'strategy' 
  | 'activity';

export interface AlertItem {
  id: string;
  type: 'high' | 'advisory' | 'monitoring' | 'success';
  typeLabel: string;
  time: string;
  title: string;
  description: string;
}

export interface SimulationRun {
  id: string;
  strategyName: string;
  network: string;
  modelAccuracy: number;
  maxDrawdown: number;
  projApy: number;
  status: 'OPTIMIZED' | 'RUNNING' | 'QUEUED';
}

export interface StrategyArchetype {
  id: string;
  title: string;
  iconName: 'waves' | 'trending_up' | 'layers' | 'speed';
  description: string;
  status: 'PROFITABLE' | 'BULLISH' | 'HEDGED' | 'VOLATILE';
  risk: 'Low' | 'Med' | 'Stable' | 'High';
  active?: boolean;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  sparkline: number[];
}

export interface TradeLog {
  id: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
