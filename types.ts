export enum ViewState {
  STRUCTURE = 'STRUCTURE',
  DATAFLOW = 'DATAFLOW',
  MODELS = 'MODELS',
  PRINCIPLES = 'PRINCIPLES',
  RISK_PHASE = 'RISK_PHASE',         // Phase 5: Risk & Simulation
  EXECUTION_PHASE = 'EXECUTION_PHASE', // Phase 6
  MONITORING = 'MONITORING',         // Phase 7
  BACKTEST = 'BACKTEST',             // Phase 8
  STRESS_TEST = 'STRESS_TEST',       // Phase 9
  FINAL_AUDIT = 'FINAL_AUDIT'        // Phase 10
}

export enum TradingMode {
  SYNTHETIC = 'SYNTHETIC', // Internal math-generated price
  LIVE_PAPER = 'LIVE_PAPER' // Real DexScreener API data
}

export type Environment = 'DEV' | 'TEST' | 'STAGING' | 'PROD';

export interface BacktestConfig {
  dateRange: string;
  initialCapital: number;
  tokens: string[];
  strategy: string;
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  pnl: number;
  pnlPercent: number;
  maxDrawdown: number;
  sharpeRatio: number;
  avgHoldTimeMs: number;
}

export interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: FolderItem[];
}

export interface PipelineStep {
  id: number;
  title: string;
  description: string;
  component: string;
  icon: string;
}

export interface DomainModel {
  name: string;
  code: string;
  description: string;
}

export interface Principle {
  title: string;
  description: string;
  points: string[];
}

// --- Monitoring & Explainability Types ---

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'DEBUG';

export interface LogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  context?: any; // Structured data (e.g., { price: 100, score: 85 })
}

export interface TradeReport {
  id: string;
  tokenSymbol: string;
  timestamp: number;
  direction: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED' | 'REJECTED';
  
  // Explainability Section
  decision: {
    score: number;
    factors: { [key: string]: number }; // e.g., { liquidity: 0.9, volume: 0.8 }
    strategyName: string;
    reason: string; // Human readable reason
  };

  execution: {
    entryPrice: number;
    exitPrice?: number;
    fees: number;
    slippage: number;
  };

  risk: {
    passed: boolean;
    checks: string[]; // ["MaxDrawdown: OK", "Exposure: OK"]
  };

  outcome?: {
    pnl: number;
    pnlPercent: number;
    holdDurationMs: number;
  };
}

export interface SystemHealth {
  tps: number; // Transactions/Events per second
  memoryUsageMb: number;
  eventLoopLagMs: number;
  activeGoroutines?: number; // Conceptually active promises
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export interface AuditCategory {
  id: string;
  name: string;
  status: 'READY' | 'WARNING' | 'CRITICAL';
  score: number; // 0-100
  items: { label: string; done: boolean; critical?: boolean }[];
}

export interface OptimizationTip {
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  codeSnippet?: string;
}

// --- Phase 5: Simulation Types ---

export interface SimulationConfig {
  startingBalance: number;
  slippageMultiplier: number; // e.g., 1.5x volatility
  latencyMs: { min: number; max: number };
  partialFillProbability: number;
  feeModel: { maker: number; taker: number };
}

export interface OrderIntent {
  token: string;
  direction: 'BUY' | 'SELL';
  amount: number; // USD for Buy, Tokens for Sell
  slippageTolerance: number; // 0.01 = 1%
}

export interface ExecutionResult {
  success: boolean;
  filledPrice: number;
  filledAmount: number;
  fee: number;
  txHash: string; // Virtual hash for paper
  error?: string;
  latencyMs: number;
}

export interface PaperPortfolio {
  balance: number; // USD
  startBalance: number;
  equity: number; // Balance + Unrealized PnL
  openPositions: SimulatedPosition[];
  realizedPnL: number;
  usedMargin: number;
}

export interface SimulatedPosition {
  id: string;
  token: string;
  entryPrice: number;
  size: number; // Token amount
  stopLoss: number;
  takeProfit: number;
  costBasis: number; // USD
  timestamp: number;
  currentPrice: number;
  unrealizedPnL: number;
  status: 'OPEN' | 'CLOSED';
}

export interface TradeJournalEntry {
  tradeId: string;
  timestamp: number;
  token: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  pnl?: number;
  signalScore: number;
  confidenceScore: number;
  executionLatency: number;
  notes: string;
}

export interface ReplayEngine {
  loadDataset(datasetId: string): Promise<void>;
  startReplay(): void;
  pauseReplay(): void;
  seek(timestamp: number): void;
}