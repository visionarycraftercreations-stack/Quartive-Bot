export enum ViewState {
  STRUCTURE = 'STRUCTURE',
  DATAFLOW = 'DATAFLOW',
  MODELS = 'MODELS',
  PRINCIPLES = 'PRINCIPLES',
  RISK_PHASE = 'RISK_PHASE',
  EXECUTION_PHASE = 'EXECUTION_PHASE',
  SECURITY_PHASE = 'SECURITY_PHASE',
  MONITORING = 'MONITORING',
  BACKTEST = 'BACKTEST',
  STRESS_TEST = 'STRESS_TEST',
  FINAL_AUDIT = 'FINAL_AUDIT'
}

export interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
  description?: string;
}

export interface PipelineStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DomainModel {
  name: string;
  description: string;
  code: string;
}

export interface Principle {
  title: string;
  description: string;
  points: string[];
}

export type TradingMode = 'PAPER' | 'LIVE';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export type Environment = 'LOCAL' | 'STAGING' | 'PROD';
export type AuditCategory = 'SECURITY' | 'PERFORMANCE' | 'COMPLIANCE';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
}

export interface TradeReport {
  totalTrades: number;
  winRate: number;
  pnl: number;
}

export interface BacktestResult {
  sharpeRatio: number;
  maxDrawdown: number;
  totalReturn: number;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  latency: number;
}

export interface OptimizationTip {
  title: string;
  description: string;
  impact: string;
}

export interface PaperPortfolio {
  balance: number;
  positions: SimulatedPosition[];
}

export interface SimulatedPosition {
  symbol: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
}

export interface TradeJournalEntry {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  timestamp: number;
}

export interface OrderIntent {
  id: string;
  token: string;
  amount: number;
  slippageTolerance: number;
}

export enum MarketEventType {
  PRICE_UPDATE = 'PRICE_UPDATE',
  VOLUME_SPIKE = 'VOLUME_SPIKE',
  TOKEN_DISCOVERED = 'TOKEN_DISCOVERED',
  LIQUIDITY_ADD = 'LIQUIDITY_ADD'
}

export interface MarketEvent {
  type: MarketEventType;
  data: any;
  timestamp: number;
  tokenAddress?: string;
}

export interface FeedHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  latency: number;
}

export enum KillSwitchTrigger {
  MANUAL = 'MANUAL',
  RISK_LIMIT = 'RISK_LIMIT'
}

export interface KillSwitchState {
  status: 'ACTIVE' | 'HALTED';
  trigger?: KillSwitchTrigger;
  timestamp: number;
  recoveryMode: boolean;
}

export interface CircuitBreakerStatus {
  dailyPnL: number;
  maxDailyLoss: number;
  drawdownPercent: number;
  tradeCount: number;
  maxTrades: number;
  isBreached: boolean;
}

export interface ExposureMetrics {
  totalExposureUsd: number;
  maxTotalExposure: number;
  maxSingleTradePercent: number;
  maxTokenExposurePercent: number;
  currentRiskScore: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'BLOCKER';
  component: string;
  action: string;
  outcome: 'ALLOWED' | 'DENIED';
  details: string;
}

export interface SigningContext {
  gasPriceGwei: number;
  liquidityUsd: number;
  mevRiskScore: number; // 0-100
  networkCongestion: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SignedTransaction {
  intentId: string;
  txHash: string;
  signature: string;
  broadcastTime: number;
}

export interface Signal {
  id: string;
  token: string;
  type: 'ENTRY_LONG' | 'EXIT_LONG';
  score: number;
  confidence: number;
  timestamp: number;
  metadata: any;
}

export interface LedgerTransaction {
  id: string;
  timestamp: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE_FEE' | 'REALIZED_PNL';
  amount: number;
  token?: string;
  referenceId?: string;
}

export interface BacktestConfig {
  startDate: number;
  endDate: number;
  initialBalance: number;
  includeFees: boolean;
}

export enum ReplaySpeed {
  REALTIME = 1,
  FAST = 10,
  TURBO = 100,
  INSTANT = 999
}