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
  { id: '1', title: 'Market Data Ingestion', description: 'Normalized WebSocket streams', icon: 'Radio' },
  { id: '2', title: 'Signal Generation', description: 'Strategy evaluation engine', icon: 'Cpu' },
  { id: '3', title: 'Risk Check', description: 'Pre-trade validation', icon: 'ShieldCheck' },
  { id: '4', title: 'Execution', description: 'Transaction signing & broadcasting', icon: 'Zap' },
];

export const DOMAIN_MODELS: DomainModel[] = [
  {
    name: 'core/risk/execution_guard.ts',
    description: 'Validates orders against risk parameters.',
    code: `export class ExecutionGuard {
  validate(intent: OrderIntent): boolean {
    // 1. Check Max Amount
    if (intent.amount > 1000) return false;
    
    // 2. Check Blacklist
    if (this.isBlacklisted(intent.token)) return false;

    return true;
  }
}`
  },
  {
    name: 'core/execution/signing_pipeline.ts',
    description: 'Sandbox environment that validates transaction safety before signing.',
    code: `export class SigningPipeline {
  constructor(
    private guard: ExecutionGuard,
    private wallet: SecureWallet,
    private auditLog: AuditLogger
  ) {}

  public async process(
    intent: OrderIntent, 
    ctx: SigningContext
  ): Promise<SignedTransaction> {
    // 1. Guard Validation (State, Risk, KillSwitch)
    await this.guard.validate(intent);

    // 2. Sandbox Safety Checks
    this.runSandboxChecks(intent, ctx);

    // 3. Approve & Sign
    // Only reachable if Sandbox checks pass
    const signature = await this.wallet.signTransaction({
      to: intent.token,
      amount: intent.amount,
      data: '0x...' // Constructed Transaction Data
    }, intent.id);

    // 4. Broadcast
    return {
      intentId: intent.id,
      txHash: \`0x\${Math.random().toString(36).substring(2)}\`,
      signature,
      broadcastTime: Date.now()
    };
  }

  private runSandboxChecks(intent: OrderIntent, ctx: SigningContext) {
    // Check 1: Slippage Hard Limit
    const MAX_SLIPPAGE = 0.05; // 5% Hard Cap
    if (intent.slippageTolerance > MAX_SLIPPAGE) {
      throw new Error(\`SANDBOX REJECT: Slippage \${intent.slippageTolerance} exceeds max \${MAX_SLIPPAGE}\`);
    }

    // Check 2: Liquidity Depth
    const MIN_DEPTH_RATIO = 5; // Pool must be 5x larger than order
    if (ctx.liquidityUsd < intent.amount * MIN_DEPTH_RATIO) {
      throw new Error(\`SANDBOX REJECT: Insufficient liquidity depth (Pool: $\${ctx.liquidityUsd} vs Order: $\${intent.amount})\`);
    }

    // Check 3: Gas Spikes
    const MAX_GAS_GWEI = 100;
    if (ctx.gasPriceGwei > MAX_GAS_GWEI) {
      throw new Error(\`SANDBOX REJECT: Gas spike detected (\${ctx.gasPriceGwei} Gwei)\`);
    }

    // Check 4: MEV Risk
    if (ctx.mevRiskScore > 80) {
      throw new Error('SANDBOX REJECT: High MEV risk probability');
    }
    
    this.auditLog.info('SigningSandbox', 'CHECKS_PASSED', intent.id);
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
