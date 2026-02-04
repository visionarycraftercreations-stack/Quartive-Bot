import { FolderItem, PipelineStep, DomainModel, Principle, AuditCategory, OptimizationTip } from './types';

export const SIMULATION_CONFIG = {
  startingBalance: 10000,
  slippageMultiplier: 1.2, // Amplify volatility for stress testing
  latencyMs: { min: 200, max: 800 },
  partialFillProbability: 0.05,
  feeModel: { maker: 0.002, taker: 0.002 } // 0.2%
};

export const FOLDER_STRUCTURE: FolderItem = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'core',
          type: 'folder',
          children: [
            {
              name: 'simulation',
              type: 'folder',
              description: 'Phase 5: Paper Trading Engine',
              children: [
                { name: 'providers.ts', type: 'file', description: 'PaperExecutionProvider & Interfaces' },
                { name: 'fill_engine.ts', type: 'file', description: 'Slippage & Latency Logic' },
                { name: 'ledger.ts', type: 'file', description: 'PortfolioLedger & PositionSimulator' },
                { name: 'journal.ts', type: 'file', description: 'TradeJournal Persistence' },
                { name: 'replay_engine.ts', type: 'file', description: 'ReplayEngine Interface (Placeholder)' }
              ]
            },
            {
              name: 'optimization',
              type: 'folder',
              description: 'Phase 10: Performance Tuning',
              children: [
                { name: 'worker_pool.ts', type: 'file', description: 'Offloads scoring to threads.' },
                { name: 'memory_guard.ts', type: 'file', description: 'Prevents heap overflows.' }
              ]
            },
            {
              name: 'monitoring',
              type: 'folder',
              children: [
                { name: 'logger.ts', type: 'file' },
                { name: 'metrics.ts', type: 'file' }
              ]
            },
            {
               name: 'execution',
               type: 'folder',
               children: [
                  { name: 'engine.ts', type: 'file' },
                  { name: 'state_machine.ts', type: 'file' }
               ]
            }
          ]
        },
        // ... previous folders
      ]
    }
  ]
};

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    title: 'Architecture Audit',
    component: 'Structure Review',
    description: 'Validating modular boundaries and dependency graph.',
    icon: 'Search'
  },
  {
    id: 2,
    title: 'Stress Analysis',
    component: 'Phase 9 Results',
    description: 'Reviewing Event Loop Lag under 5000 TPS load.',
    icon: 'Activity'
  },
  {
    id: 3,
    title: 'Optimization',
    component: 'System Tuner',
    description: 'Applying Worker Threads and Memory Limits.',
    icon: 'Zap'
  },
  {
    id: 4,
    title: 'Final Checklist',
    component: 'Go/No-Go',
    description: 'Verifying all safety checks before launch.',
    icon: 'CheckCircle'
  }
];

export const DOMAIN_MODELS: DomainModel[] = [
  {
    name: 'core/simulation/providers.ts',
    description: 'Adapters for switching between Live and Paper execution.',
    code: `export interface ExecutionProvider {
  executeBuy(order: OrderIntent): Promise<ExecutionResult>;
  executeSell(order: OrderIntent): Promise<ExecutionResult>;
}

export class PaperExecutionProvider implements ExecutionProvider {
  constructor(private fillEngine: FillEngine, private journal: TradeJournal) {}

  async executeBuy(order: OrderIntent): Promise<ExecutionResult> {
    const fill = await this.fillEngine.simulateFill(order);
    this.journal.logExecution(fill);
    return fill;
  }
  
  // ... executeSell implementation
}`
  },
  {
    name: 'core/simulation/ledger.ts',
    description: 'Tracks Equity, PnL, and Open Positions in memory.',
    code: `export class PortfolioLedger {
  private balance: number;
  private positions: Map<string, SimulatedPosition>;

  public updateEquity(marketData: Map<string, number>) {
    // Recalculate Unrealized PnL for all open positions
    this.positions.forEach(pos => {
      const currentPrice = marketData.get(pos.token) || pos.currentPrice;
      pos.unrealizedPnL = (currentPrice - pos.entryPrice) * pos.size;
    });
  }

  public checkMargin(amount: number): boolean {
    return this.balance >= amount;
  }
}`
  },
  {
    name: 'core/simulation/fill_engine.ts',
    description: 'Deterministic market simulator for paper trading.',
    code: `export class FillEngine {
  private readonly FAIL_RATE = 0.08; // 8% Chaos

  public async simulateFill(order: OrderIntent): Promise<ExecutionResult> {
    // 1. Calculate Slippage
    // Impact increases linearly with order size relative to pool
    const liquidity = await this.getLiquidity(order.token);
    const impact = order.amount / liquidity; 
    const slippage = impact * SIMULATION_CONFIG.slippageMultiplier;
    
    // 2. Simulate Network Latency (RPC + Block Time)
    const latency = this.randomLatency();
    await this.sleep(latency);

    // 3. Chaos Injection
    if (Math.random() < this.FAIL_RATE) {
       throw new Error('Simulation: Slippage Exceeded during pending block');
    }

    // ... return ExecutionResult
  }
}`
  },
  {
    name: 'core/simulation/replay_engine.ts',
    description: 'Backtesting placeholder interface.',
    code: `export interface ReplayEngine {
  /**
   * Loads historical tick data for backtesting.
   */
  loadDataset(datasetId: string): Promise<void>;

  /**
   * Starts feeding historical ticks into the Strategy Engine.
   */
  startReplay(): void;

  /**
   * Pauses the simulation.
   */
  pauseReplay(): void;

  /**
   * Jumps to a specific point in time.
   */
  seek(timestamp: number): void;
}`
  }
];

export const PRINCIPLES: Principle[] = [
  {
    title: 'Survival > Profit',
    description: 'Paper trading must enforce strict risk limits.',
    points: [
      'Portfolio Ledger checks balance before every Simulated Trade.',
      'Slippage modeling must be pessimistic (assume worst case).',
      'Latency injection prevents "perfect timing" bias in simulations.'
    ]
  },
  {
    title: 'Zero-Trust Architecture',
    description: 'Assume every API will fail and every input is malformed.',
    points: [
      'Validate schema of every incoming WebSocket message.',
      'Never trust the price until cross-referenced (e.g., Pyth + DexScreener).',
      'Execution engine must verify balance before *every* order.'
    ]
  }
];

export const PRODUCTION_CHECKLIST: AuditCategory[] = [
  {
    id: 'SEC',
    name: 'Security & Risk',
    status: 'READY',
    score: 100,
    items: [
      { label: 'Private Keys injected via ENV only', done: true, critical: true },
      { label: 'Kill Switch functionality verified', done: true, critical: true },
      { label: 'Max Drawdown limit hard-coded', done: true, critical: true },
      { label: 'RPC Rate Limits handled', done: true }
    ]
  },
  {
    id: 'PERF',
    name: 'Performance',
    status: 'WARNING',
    score: 85,
    items: [
      { label: 'Event Loop Lag < 10ms under load', done: false, critical: true },
      { label: 'Memory Leak checks (Heap dumps)', done: true },
      { label: 'Worker Threads implemented', done: false } // Optimization needed
    ]
  },
  {
    id: 'OBS',
    name: 'Observability',
    status: 'READY',
    score: 95,
    items: [
      { label: 'Structured Logging (JSON)', done: true },
      { label: 'Alerting (Telegram/PagerDuty)', done: true, critical: true },
      { label: 'Trade "Flight Recorder" active', done: true }
    ]
  }
];

export const OPTIMIZATIONS: OptimizationTip[] = [
  {
    title: 'Offload Scoring to Worker Threads',
    impact: 'HIGH',
    description: 'The stress test revealed Event Loop Lag > 50ms during high volatility. Moving the scoring logic to a separate thread pool will free up the main loop for I/O.',
    codeSnippet: 'new Worker("./scorer.js")'
  },
  {
    title: 'Implement Redis Event Bus',
    impact: 'MEDIUM',
    description: 'Node EventEmitter is fast but local. Using Redis Pub/Sub allows splitting the bot into microservices (Ingestor vs Executor) for better scaling.',
    codeSnippet: 'redis.publish("PRICE_UPDATE", payload)'
  }
];