import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Folder, FileText, Database, ShieldCheck, 
  Cpu, Zap, GitBranch, Layers, 
  Terminal, Activity, Lock, ArrowRight,
  Play, Pause, RotateCcw, AlertTriangle,
  TrendingDown, TrendingUp, Search, CheckCircle,
  Globe, Server, Wifi, Bell, Eye, X,
  Box, Settings, Download, Gauge, Thermometer,
  BarChart, AlertOctagon, CheckSquare, ClipboardCheck,
  ThumbsUp, Construction, DollarSign, Clock, RefreshCw, Radio,
  ShieldAlert, Shield, PlayCircle, StopCircle, FastForward
} from 'lucide-react';
import { FOLDER_STRUCTURE, PIPELINE_STEPS, DOMAIN_MODELS, PRINCIPLES, PRODUCTION_CHECKLIST, OPTIMIZATIONS, SIMULATION_CONFIG, SECURITY_CONFIG } from './constants';
import { ViewState, FolderItem, PipelineStep, DomainModel, Principle, TradingMode, LogEntry, TradeReport, LogLevel, Environment, BacktestResult, SystemHealth, AuditCategory, OptimizationTip, PaperPortfolio, SimulatedPosition, TradeJournalEntry, OrderIntent, MarketEvent, MarketEventType, FeedHealth, KillSwitchState, KillSwitchTrigger, CircuitBreakerStatus, ExposureMetrics, SecurityAuditLog } from './types';

// --- SHARED COMPONENTS (Simplified for context) ---

const CodeBlock = ({ code, title }: { code: string; title: string }) => (
  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 font-mono text-sm my-4 shadow-lg">
    <div className="bg-gray-800 px-4 py-2 text-gray-400 text-xs border-b border-gray-700 flex items-center gap-2">
      <FileText size={12} />
      {title}
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-green-400">
        <code>{code}</code>
      </pre>
    </div>
  </div>
);

const FolderTree: React.FC<{ item: FolderItem; level?: number }> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === 'folder';

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center py-1 cursor-pointer hover:bg-gray-800 rounded px-2 ${level === 0 ? 'mb-2' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2 text-gray-500">
          {isFolder ? (isOpen ? '📂' : '📁') : '📄'}
        </span>
        <span className={`${isFolder ? 'text-blue-300 font-semibold' : 'text-gray-300'}`}>
          {item.name}
        </span>
        {item.description && (
          <span className="ml-4 text-xs text-gray-500 italic">
            // {item.description}
          </span>
        )}
      </div>
      {isFolder && isOpen && item.children && (
        <div className="border-l border-gray-700 ml-2 pl-2">
          {item.children.map((child, idx) => (
            <FolderTree key={idx} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const PipelineViewer = ({ steps }: { steps: PipelineStep[] }) => (
  <div className="space-y-4">
    {steps.map((step, index) => {
      const isLast = index === steps.length - 1;
      const IconMap: any = {
        'Radio': Radio, 'Database': Database, 'Cpu': Cpu, 'ShieldCheck': ShieldCheck,
        'Zap': Zap, 'CheckCircle': CheckCircle, 'Terminal': Terminal, 'Layers': Layers,
        'Activity': Activity, 'Lock': Lock, 'Server': Server, 'Globe': Globe, 'TrendingUp': TrendingUp, 'Play': Play,
        'AlertTriangle': AlertTriangle, 'FileText': FileText, 'Search': Search, 'RefreshCw': RefreshCw,
        'GitBranch': GitBranch, 'BarChart': BarChart
      };
      const Icon = IconMap[step.icon] || Terminal;

      return (
        <div key={step.id} className="relative pl-8 pb-8">
          {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-700"></div>}
          <div className="absolute left-0 top-0 bg-blue-900 p-2 rounded-full border-2 border-blue-500 z-10">
            <Icon size={16} className="text-blue-200" />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
            <h3 className="font-bold text-lg text-blue-400">{step.title}</h3>
            <p className="text-gray-300 text-sm">{step.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const PrincipleCard: React.FC<{ principle: Principle }> = ({ principle }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md h-full">
    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><ShieldCheck size={20} className="text-blue-400" />{principle.title}</h3>
    <p className="text-gray-400 text-sm mb-4">{principle.description}</p>
    <ul className="space-y-2">{principle.points.map((point, idx) => <li key={idx} className="flex gap-2 text-sm text-gray-300"><ArrowRight size={14} className="mt-1 text-blue-500" />{point}</li>)}</ul>
  </div>
);

// --- Phase 7: SECURITY DASHBOARD ---

const SecurityDashboard = () => {
  const [killSwitch, setKillSwitch] = useState<KillSwitchState>({
    status: 'ACTIVE',
    timestamp: Date.now(),
    recoveryMode: false
  });

  const [circuitBreaker, setCircuitBreaker] = useState<CircuitBreakerStatus>({
    dailyPnL: -120,
    maxDailyLoss: SECURITY_CONFIG.maxDailyLossUsd,
    drawdownPercent: 2.4,
    tradeCount: 15,
    maxTrades: 50,
    isBreached: false
  });

  const [exposure, setExposure] = useState<ExposureMetrics>({
    totalExposureUsd: 1500,
    maxTotalExposure: 4000,
    maxSingleTradePercent: 5,
    maxTokenExposurePercent: 12,
    currentRiskScore: 35
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Simulation
  useEffect(() => {
    const interval = setInterval(() => {
       // Randomly generate logs
       if (Math.random() > 0.6) {
         const actions = ['WALLET_AUTH', 'RISK_CHECK', 'EXPOSURE_CHECK', 'SIGNING_ATTEMPT'];
         const outcomes: ('ALLOWED' | 'DENIED')[] = Math.random() > 0.1 ? ['ALLOWED'] : ['DENIED'];
         const newLog: SecurityAuditLog = {
           id: Math.random().toString(36).substring(7),
           timestamp: Date.now(),
           severity: outcomes[0] === 'ALLOWED' ? 'INFO' : 'WARNING',
           component: 'ExecutionGuard',
           action: actions[Math.floor(Math.random() * actions.length)],
           outcome: outcomes[0],
           details: outcomes[0] === 'ALLOWED' ? 'Verified successfully' : 'Policy violation detected'
         };
         setAuditLogs(prev => [newLog, ...prev].slice(0, 10));
       }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleKillSwitch = () => {
    const newStatus = killSwitch.status === 'ACTIVE' ? 'HALTED' : 'ACTIVE';
    setKillSwitch({
      status: newStatus,
      trigger: newStatus === 'HALTED' ? KillSwitchTrigger.MANUAL : undefined,
      timestamp: Date.now(),
      recoveryMode: newStatus === 'ACTIVE'
    });
    
    // Add Log
    setAuditLogs(prev => [{
      id: Date.now().toString(),
      timestamp: Date.now(),
      severity: 'CRITICAL',
      component: 'KillSwitch',
      action: 'MANUAL_TOGGLE',
      outcome: newStatus === 'ACTIVE' ? 'ALLOWED' : 'DENIED', // Logic inversion for display semantics: Allowed to resume vs Denied/Halted
      details: `System status changed to ${newStatus}`
    }, ...prev]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Column 1: Critical Controls */}
      <div className="space-y-6">
        
        {/* KILL SWITCH */}
        <div className={`border-2 rounded-xl p-6 shadow-2xl relative overflow-hidden transition-all ${
          killSwitch.status === 'HALTED' ? 'bg-red-900/40 border-red-500' : 'bg-gray-900 border-gray-700'
        }`}>
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <ShieldAlert className={killSwitch.status === 'HALTED' ? 'text-red-500' : 'text-gray-400'} />
                 Global Kill Switch
               </h3>
               <p className="text-xs text-gray-400 mt-1">Override all trading activity instantly.</p>
             </div>
             <div className={`px-3 py-1 rounded font-bold text-xs border ${
               killSwitch.status === 'HALTED' 
                 ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                 : 'bg-green-900 text-green-400 border-green-700'
             }`}>
               {killSwitch.status === 'HALTED' ? 'SYSTEM HALTED' : 'SYSTEM ACTIVE'}
             </div>
           </div>

           <button 
             onClick={toggleKillSwitch}
             className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${
               killSwitch.status === 'HALTED' 
                 ? 'bg-green-600 hover:bg-green-500' 
                 : 'bg-red-600 hover:bg-red-500'
             }`}
           >
             {killSwitch.status === 'HALTED' ? 'DISENGAGE & RESUME' : 'ENGAGE KILL SWITCH'}
           </button>
        </div>

        {/* CIRCUIT BREAKERS */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <Activity className="text-yellow-500" size={20}/> Circuit Breakers
           </h3>
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Daily PnL Limit</span>
                  <span>${circuitBreaker.dailyPnL} / -${circuitBreaker.maxDailyLoss}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Max Drawdown</span>
                  <span>{circuitBreaker.drawdownPercent}% / {SECURITY_CONFIG.maxDrawdownPercent}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-500" style={{ width: `${(circuitBreaker.drawdownPercent / SECURITY_CONFIG.maxDrawdownPercent) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Trade Frequency</span>
                  <span>{circuitBreaker.tradeCount} / {circuitBreaker.maxTrades} trades</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* Column 2: Exposure & Wallet */}
      <div className="space-y-6">
         {/* EXPOSURE FIREWALL */}
         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Shield className="text-blue-500" size={20}/> Exposure Firewall
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="bg-black/30 p-3 rounded border border-gray-800 text-center">
                  <div className="text-gray-500 text-[10px] uppercase">Total Exposure</div>
                  <div className="text-xl font-mono text-white">${exposure.totalExposureUsd}</div>
                  <div className="text-xs text-gray-600">Max: ${exposure.maxTotalExposure}</div>
               </div>
               <div className="bg-black/30 p-3 rounded border border-gray-800 text-center">
                  <div className="text-gray-500 text-[10px] uppercase">Risk Score</div>
                  <div className={`text-xl font-mono ${exposure.currentRiskScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>{exposure.currentRiskScore}/100</div>
                  <div className="text-xs text-gray-600">Moderate</div>
               </div>
            </div>

            <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded">
               <div className="text-xs text-blue-300 font-bold mb-1">Active Constraints</div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                     <span>Max Single Trade</span>
                     <span className="text-gray-200">5.0% (${SIMULATION_CONFIG.startingBalance * 0.05})</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                     <span>Max Token Alloc</span>
                     <span className="text-gray-200">15.0%</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                     <span>Sector Limit</span>
                     <span className="text-gray-200">20.0%</span>
                  </div>
               </div>
            </div>
         </div>

         {/* WALLET GUARD */}
         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Lock className="text-purple-500" size={20}/> Secure Wallet
            </h3>
            <div className="flex items-center gap-4 mb-4">
               <div className="bg-green-900/30 p-3 rounded-full border border-green-500/30">
                  <Lock size={24} className="text-green-500" />
               </div>
               <div>
                  <div className="text-sm font-bold text-gray-200">Private Keys Isolated</div>
                  <div className="text-xs text-gray-500">Adapters/Wallet/SecureWallet</div>
               </div>
            </div>
            <div className="text-xs text-gray-400 bg-black/30 p-3 rounded border border-gray-800 font-mono">
               Status: LOCKED<br/>
               Signing: REQUIRES_APPROVAL<br/>
               RPC Rate: 12/50 rps
            </div>
         </div>
      </div>

      {/* Column 3: Audit Log */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col h-full overflow-hidden">
         <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <ClipboardCheck className="text-gray-400" size={20}/> Security Audit Log
         </h3>
         <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono">
            {auditLogs.map((log) => (
               <div key={log.id} className={`p-2 rounded border text-xs ${
                  log.severity === 'CRITICAL' ? 'bg-red-900/20 border-red-800 text-red-300' :
                  log.severity === 'WARNING' ? 'bg-yellow-900/20 border-yellow-800 text-yellow-300' :
                  'bg-black/40 border-gray-800 text-gray-400'
               }`}>
                  <div className="flex justify-between opacity-70 text-[10px] mb-1">
                     <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                     <span>{log.component}</span>
                  </div>
                  <div className="font-bold">{log.action}</div>
                  <div className="opacity-80 mt-1">{log.details}</div>
               </div>
            ))}
            {auditLogs.length === 0 && <div className="text-center text-gray-600 py-10">System Clean. No events.</div>}
         </div>
      </div>

    </div>
  );
};

// --- Phase 8: BACKTEST DASHBOARD ---

const BacktestDashboard = () => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [equity, setEquity] = useState<number[]>([10000]);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [speed, setSpeed] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  useEffect(() => {
    let interval: any;
    if (running && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.5, 100));
        
        // Simulate System Events
        const random = Math.random();
        
        // 1. Market Data
        if (random > 0.5) {
          // Price Tick
          const change = (Math.random() - 0.5) * 50;
          setEquity(prev => {
            const newVal = prev[prev.length-1] + change;
            return [...prev, newVal];
          });
          setCurrentBalance(prev => prev + change);
        }

        // 2. Orchestrator Events
        if (random > 0.95) {
          addLog("MARKET_ROUTER: Token SOL-MEME Discovered");
        } else if (random > 0.90) {
          addLog("SIGNAL_DISPATCHER: SCORING_UPDATE :: SOL-MEME :: Score 82/100");
        } else if (random > 0.88) {
          addLog("RISK_GUARD: Checking Exposure Constraints...");
        } else if (random > 0.87) {
           addLog("EXECUTION: Trade SIM_ENTRY Submitted -> SOL-MEME");
        }

      }, 100 / speed);
    } else if (progress >= 100) {
      setRunning(false);
      addLog("BACKTEST_COMPLETE: Simulation Finished.");
    }
    return () => clearInterval(interval);
  }, [running, progress, speed]);

  const handleStart = () => {
    if (progress >= 100) {
      setProgress(0);
      setEquity([10000]);
      setCurrentBalance(10000);
      setLogs([]);
    }
    setRunning(true);
    addLog("REPLAY_ENGINE: Starting deterministic replay...");
  };

  const handleStop = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setProgress(0);
    setEquity([10000]);
    setCurrentBalance(10000);
    setLogs([]);
    addLog("SYSTEM: Reset complete.");
  };

  // SVG Chart Helper
  const maxEquity = Math.max(...equity, 10000);
  const minEquity = Math.min(...equity, 10000);
  const range = maxEquity - minEquity || 100;
  const points = equity.map((val, i) => {
    const x = (i / (equity.length - 1 || 1)) * 100;
    const y = 100 - ((val - minEquity) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Configuration & Controls */}
      <div className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Settings className="text-blue-500" size={20}/> Backtest Config
          </h3>
          
          <div className="space-y-4">
             <div>
               <label className="text-xs text-gray-500 block mb-1">Date Range</label>
               <div className="flex gap-2">
                 <div className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 w-full">2023-10-01</div>
                 <span className="text-gray-500 self-center">to</span>
                 <div className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 w-full">2023-10-31</div>
               </div>
             </div>

             <div>
               <label className="text-xs text-gray-500 block mb-1">Initial Capital</label>
               <div className="flex items-center bg-gray-950 border border-gray-700 rounded px-3 py-2">
                 <span className="text-green-500 mr-2">$</span>
                 <input type="number" defaultValue={10000} className="bg-transparent text-white w-full outline-none font-mono" disabled={running} />
               </div>
             </div>

             <div>
               <label className="text-xs text-gray-500 block mb-1">Replay Speed</label>
               <div className="flex gap-2">
                 {[1, 5, 10].map(s => (
                   <button 
                     key={s}
                     onClick={() => setSpeed(s)}
                     className={`flex-1 py-1 rounded text-xs border ${speed === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                   >
                     {s}x
                   </button>
                 ))}
               </div>
             </div>
          </div>

          <div className="mt-6 flex gap-2">
            {!running ? (
               <button onClick={handleStart} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold shadow-lg transition-all">
                 <PlayCircle size={18} /> {progress > 0 && progress < 100 ? "Resume" : "Run Backtest"}
               </button>
            ) : (
               <button onClick={handleStop} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold shadow-lg transition-all">
                 <Pause size={18} /> Pause
               </button>
            )}
            <button onClick={handleReset} className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg flex items-center justify-center shadow-lg">
               <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2">
             <BarChart className="text-purple-500" size={20}/> Performance Metrics
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-950 p-3 rounded border border-gray-800">
                 <div className="text-gray-500 text-[10px] uppercase">Total Return</div>
                 <div className={`text-xl font-mono ${currentBalance >= 10000 ? 'text-green-400' : 'text-red-400'}`}>
                   {((currentBalance - 10000) / 10000 * 100).toFixed(2)}%
                 </div>
              </div>
              <div className="bg-gray-950 p-3 rounded border border-gray-800">
                 <div className="text-gray-500 text-[10px] uppercase">Sharpe Ratio</div>
                 <div className="text-xl font-mono text-blue-400">1.42</div>
              </div>
              <div className="bg-gray-950 p-3 rounded border border-gray-800">
                 <div className="text-gray-500 text-[10px] uppercase">Max Drawdown</div>
                 <div className="text-xl font-mono text-red-400">-4.2%</div>
              </div>
              <div className="bg-gray-950 p-3 rounded border border-gray-800">
                 <div className="text-gray-500 text-[10px] uppercase">Win Rate</div>
                 <div className="text-xl font-mono text-yellow-400">62%</div>
              </div>
           </div>
        </div>
      </div>

      {/* Charting & Visuals */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-1 flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <Activity className="text-green-500" size={20}/> Equity Curve
               </h3>
               <div className="text-right">
                  <span className="text-gray-400 text-xs">Current Balance</span>
                  <div className="text-2xl font-mono font-bold text-white">${currentBalance.toFixed(2)}</div>
               </div>
            </div>
            
            <div className="flex-1 w-full bg-gray-950 rounded border border-gray-800 relative overflow-hidden flex items-end">
               {equity.length > 1 && (
                 <svg className="w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                       fill="none"
                       stroke={currentBalance >= 10000 ? "#4ade80" : "#f87171"}
                       strokeWidth="2"
                       points={points}
                       vectorEffect="non-scaling-stroke"
                    />
                    {/* Gradient Fill approximation */}
                    <path 
                       d={`M 0 100 L 0 ${100 - ((equity[0]-minEquity)/range)*100} ${points.split(' ').map(p => `L ${p}`).join(' ')} L 100 100 Z`} 
                       fill={currentBalance >= 10000 ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)"}
                       stroke="none"
                    />
                 </svg>
               )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
         </div>

         {/* Event Terminal */}
         <div className="bg-black border border-gray-800 rounded-xl p-4 h-64 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2">
               <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Terminal size={12} /> Replay Engine Logs
               </div>
               <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 pr-2" ref={scrollRef}>
               {logs.length === 0 && <div className="text-gray-600 italic">Waiting for simulation start...</div>}
               {logs.map((log, i) => (
                  <div key={i} className="text-gray-300 border-l-2 border-transparent hover:border-blue-500 pl-2 transition-colors">
                     <span className="opacity-50 mr-2">{log.split(' ')[0]}</span>
                     <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('TRADE') ? 'text-green-400' : 'text-gray-300'}>
                        {log.substring(log.indexOf(' ')+1)}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.STRUCTURE);

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => (
    <button
      onClick={() => setView(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-all ${
        view === id 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-blue-500" />
            QuantBot <span className="text-xs bg-purple-900 text-purple-300 px-1 rounded ml-auto">v1.4.0</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">PHASE 7 — BACKTESTING ONLINE</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <NavItem id={ViewState.STRUCTURE} label="Architecture" icon={Folder} />
          <NavItem id={ViewState.DATAFLOW} label="Pipelines" icon={GitBranch} />
          <NavItem id={ViewState.MODELS} label="Domain Models" icon={Database} />
          <NavItem id={ViewState.PRINCIPLES} label="Principles" icon={Search} />
          <div className="pt-4 mt-4 border-t border-gray-800">
            <NavItem id={ViewState.RISK_PHASE} label="Risk & Simulation" icon={Cpu} />
            <NavItem id={ViewState.EXECUTION_PHASE} label="Live Paper Trading" icon={Radio} />
            <NavItem id={ViewState.SECURITY_PHASE} label="Security & Hardening" icon={ShieldCheck} />
            <NavItem id={ViewState.MONITORING} label="Mission Control" icon={Activity} />
            <NavItem id={ViewState.BACKTEST} label="Backtest & Deploy" icon={Server} />
            <NavItem id={ViewState.STRESS_TEST} label="Stress & Chaos" icon={AlertOctagon} />
            <NavItem id={ViewState.FINAL_AUDIT} label="Readiness Check" icon={ClipboardCheck} />
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Status: SYSTEM ONLINE
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-950 relative">
        <div className="max-w-7xl mx-auto p-8 h-full flex flex-col">
          <header className="mb-6 flex-shrink-0">
            <h2 className="text-3xl font-bold text-white mb-2">
              {view === ViewState.STRUCTURE && "System Architecture"}
              {view === ViewState.DATAFLOW && "CI/CD & Event Pipelines"}
              {view === ViewState.MODELS && "Core Domain Models"}
              {view === ViewState.PRINCIPLES && "Engineering Principles"}
              {view === ViewState.RISK_PHASE && "Phase 5: Paper Trading & Simulation"}
              {view === ViewState.EXECUTION_PHASE && "Phase 6: Live Paper Trading"}
              {view === ViewState.SECURITY_PHASE && "Phase 7: Security & Hardening"}
              {view === ViewState.MONITORING && "Mission Control"}
              {view === ViewState.BACKTEST && "Backtesting & Replay Engine"}
              {view === ViewState.STRESS_TEST && "High-Velocity Stress Orchestrator"}
              {view === ViewState.FINAL_AUDIT && "Master Readiness Assessment"}
            </h2>
            <p className="text-gray-400">
              {view === ViewState.SECURITY_PHASE && "Kill switches, circuit breakers, and isolated signing environments."}
              {view === ViewState.BACKTEST && "Deterministic event replay of historical market data with full risk engine integration."}
              {view !== ViewState.SECURITY_PHASE && view !== ViewState.EXECUTION_PHASE && view !== ViewState.FINAL_AUDIT && view !== ViewState.RISK_PHASE && view !== ViewState.BACKTEST && "Architectural documentation and interactive modules."}
            </p>
          </header>

          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {view === ViewState.STRUCTURE && <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl"><FolderTree item={FOLDER_STRUCTURE} /></div>}
            {view === ViewState.DATAFLOW && <div className="max-w-2xl"><PipelineViewer steps={PIPELINE_STEPS} /></div>}
            {view === ViewState.MODELS && <div className="grid gap-8">{DOMAIN_MODELS.map((model, idx) => (<div key={idx}><h3 className="text-xl font-semibold text-blue-400 mb-1">{model.name}</h3><p className="text-gray-500 text-sm mb-2">{model.description}</p><CodeBlock code={model.code} title={`${model.name}`} /></div>))}</div>}
            {view === ViewState.PRINCIPLES && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{PRINCIPLES.map((p, idx) => <PrincipleCard key={idx} principle={p} />)}</div>}
            
            {/* Nav Placeholders for missing phases in this context */}
            {view === ViewState.EXECUTION_PHASE && <div className="flex items-center justify-center h-full text-gray-500">Phase 6: Live Paper Trading (Active)</div>}
            {view === ViewState.SECURITY_PHASE && <SecurityDashboard />}
            {view === ViewState.BACKTEST && <BacktestDashboard />}
            
            {view === ViewState.RISK_PHASE && <div className="flex items-center justify-center h-full text-gray-500">Phase 5: Paper Trading (Active)</div>}
            {view === ViewState.MONITORING && <div className="flex items-center justify-center h-full text-gray-500">Phase 7: Monitoring View</div>}
            {view === ViewState.STRESS_TEST && <div className="flex items-center justify-center h-full text-gray-500">Phase 9: Stress Test</div>}

            {/* The Final Audit View */}
            {view === ViewState.FINAL_AUDIT && <div className="flex items-center justify-center h-full text-gray-500">Phase 10: Final Audit</div>}
          </div>
        </div>
      </main>
    </div>
  );
}