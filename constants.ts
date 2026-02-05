import { FolderItem, PipelineStep, DomainModel, Principle, OptimizationTip } from './types';

export const FOLDER_STRUCTURE: FolderItem = {
  name: 'src',
  type: 'folder',
  children: [
    {
      name: 'core',
      type: 'folder',
      children: [
        {
          name: 'backtesting',
          type: 'folder',
          description: 'Phase 7: Replay Engine',
          children: [
            { name: 'replay_engine.ts', type: 'file' },
            { name: 'time_controller.ts', type: 'file' },
            { name: 'data_loader.ts', type: 'file' },
            { name: 'strategy_reactor.ts', type: 'file' },
            { name: 'performance_analyzer.ts', type: 'file' },
          ]
        },
        {
          name: 'orchestrator',
          type: 'folder',
          description: 'Phase 6.5: Execution Wiring',
          children: [
            { name: 'event_bus.ts', type: 'file' },
            { name: 'market_router.ts', type: 'file' },
            { name: 'signal_dispatcher.ts', type: 'file' },
            { name: 'execution_coordinator.ts', type: 'file' }
          ]
        },
        { 
          name: 'execution', 
          type: 'folder', 
          children: [{ name: 'SigningPipeline.ts', type: 'file' }] 
        },
        { 
          name: 'risk', 
          type: 'folder', 
          children: [{ name: 'ExecutionGuard.ts', type: 'file' }] 
        },
      ]
    },
    { name: 'strategies', type: 'folder' },
    { name: 'config', type: 'folder' },
  ]
};

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: '1', title: 'Data Loader', description: 'Ingest Historical Ticks', icon: 'Database' },
  { id: '2', title: 'Replay Engine', description: 'Deterministic Event Emission', icon: 'RefreshCw' },
  { id: '3', title: 'Orchestrator', description: 'Standard Execution Path', icon: 'Cpu' },
  { id: '4', title: 'Performance', description: 'Sharpe, Drawdown, PnL', icon: 'BarChart' },
];

export const DOMAIN_MODELS: DomainModel[] = [
  {
    name: 'core/backtesting/replay_engine.ts',
    description: 'Drives the entire system using historical data, respecting original event timing.',
    code: `export class ReplayEngine {
  constructor(
    private bus: EventBus,
    private time: TimeController,
    private speed: number = 100 // 100x speed
  ) {}

  public async run(events: MarketEvent[]) {
    console.log(\`Starting replay of \${events.length} events...\`);
    
    for (const event of events) {
      // 1. Sync System Time
      this.time.setTime(event.timestamp);

      // 2. Publish (Systems react immediately)
      this.bus.publish(event.type, event);

      // 3. Simulate delay if not in INSTANT mode
      if (this.speed < 999) {
         await this.sleep(10); // Simplified lag simulation
      }
    }
    
    this.bus.publish('BACKTEST_COMPLETE', {});
  }
  
  private sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}`
  },
  {
    name: 'core/backtesting/time_controller.ts',
    description: 'Abstracts system time, allowing the backtester to control the clock.',
    code: `export class TimeController {
  private currentTime: number;

  constructor(startTime: number = Date.now()) {
    this.currentTime = startTime;
  }

  // System components use this instead of Date.now()
  public now(): number {
    return this.currentTime;
  }

  public setTime(ts: number) {
    if (ts < this.currentTime) throw new Error("Time cannot flow backwards");
    this.currentTime = ts;
  }
}`
  },
  {
    name: 'core/backtesting/data_loader.ts',
    description: 'Normalizes diverse historical data sources into standard MarketEvents.',
    code: `export class DataLoader {
  public normalize(rawTicks: any[]): MarketEvent[] {
    return rawTicks
      .map(tick => ({
        type: 'PRICE_UPDATE',
        timestamp: tick.ts,
        tokenAddress: tick.pair,
        data: {
          price: parseFloat(tick.p),
          volume: parseFloat(tick.v),
          liquidity: parseFloat(tick.liq)
        }
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Ensure chronological order
  }
  
  public async loadFromCSV(path: string): Promise<MarketEvent[]> {
    // CSV parsing logic would go here
    return []; 
  }
}`
  },
  {
    name: 'core/backtesting/performance_analyzer.ts',
    description: 'Computes institutional-grade metrics from the PortfolioLedger.',
    code: `export class PerformanceAnalyzer {
  public analyze(trades: LedgerTransaction[]): BacktestResult {
    const pnlCurve = trades
      .filter(t => t.type === 'REALIZED_PNL')
      .map(t => t.amount);

    const totalReturn = pnlCurve.reduce((acc, val) => acc + val, 0);
    const wins = pnlCurve.filter(v => v > 0).length;
    
    // Drawdown Calc
    let peak = 0;
    let maxDrawdown = 0;
    let runningBalance = 10000; // Initial
    
    for (const pnl of pnlCurve) {
      runningBalance += pnl;
      if (runningBalance > peak) peak = runningBalance;
      const dd = (peak - runningBalance) / peak;
      if (dd > maxDrawdown) maxDrawdown = dd;
    }

    return {
      sharpeRatio: this.calculateSharpe(pnlCurve),
      maxDrawdown: maxDrawdown * 100, // Percentage
      totalReturn: totalReturn
    };
  }

  private calculateSharpe(returns: number[]): number {
    if (returns.length === 0) return 0;
    const avg = returns.reduce((a,b) => a+b, 0) / returns.length;
    // Standard deviation logic...
    return 1.5; // Placeholder
  }
}`
  },
  {
    name: 'core/backtesting/strategy_reactor.ts',
    description: 'Monitors Strategy behavior specifically during replay to catch missed signals.',
    code: `export class StrategyReactor {
  private signals: Signal[] = [];
  private trades: any[] = [];

  constructor(bus: EventBus) {
    bus.subscribe('SIGNAL_ELIGIBLE', (s: Signal) => this.signals.push(s));
    bus.subscribe('TRADE_OPENED', (t: any) => this.trades.push(t));
  }

  public getConversionRate(): number {
    if (this.signals.length === 0) return 0;
    return this.trades.length / this.signals.length;
  }
}`
  },
  {
    name: 'core/orchestrator/event_bus.ts',
    description: 'Lightweight, dependency-free Pub/Sub engine connecting all system components.',
    code: `export class EventBus {
  private subscribers: Map<string, Function[]> = new Map();

  public subscribe(event: string, handler: Function): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(handler);
  }

  public publish(event: string, payload: any): void {
    const handlers = this.subscribers.get(event) || [];
    handlers.forEach(fn => {
      try {
        fn(payload);
      } catch (e) {
        console.error(\`EventBus Error [\${event}]:\`, e);
      }
    });
  }
}`
  }
];

export const PRINCIPLES: Principle[] = [
  {
    title: 'Survival > Profit',
    description: 'Capital preservation is the primary objective.',
    points: ['Strict stop losses', 'Exposure limits', 'Kill switches']
  },
  {
    title: 'Deterministic Execution',
    description: 'No random behavior. All actions must be traceable.',
    points: ['Audit logging', 'Idempotency', 'State machines']
  }
];

export const PRODUCTION_CHECKLIST: string[] = [
  'Environment variables secure',
  'Wallet keys isolated',
  'Logging configured',
  'Circuit breakers tested',
  'Network redundancy active'
];

export const OPTIMIZATIONS: OptimizationTip[] = [
  { title: 'JIT Compilation', description: 'Use warm-up scripts', impact: 'High' },
  { title: 'Connection Pooling', description: 'Reuse WS connections', impact: 'Medium' }
];

export const SIMULATION_CONFIG = {
  startingBalance: 10000,
  latencyMs: 50
};

export const SECURITY_CONFIG = {
  maxDailyLossUsd: 500,
  maxDrawdownPercent: 10
};