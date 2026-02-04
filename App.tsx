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
  ThumbsUp, Construction, DollarSign, Clock, RefreshCw
} from 'lucide-react';
import { FOLDER_STRUCTURE, PIPELINE_STEPS, DOMAIN_MODELS, PRINCIPLES, PRODUCTION_CHECKLIST, OPTIMIZATIONS, SIMULATION_CONFIG } from './constants';
import { ViewState, FolderItem, PipelineStep, DomainModel, Principle, TradingMode, LogEntry, TradeReport, LogLevel, Environment, BacktestResult, SystemHealth, AuditCategory, OptimizationTip, PaperPortfolio, SimulatedPosition, TradeJournalEntry, OrderIntent } from './types';

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
        'Radio': Activity, 'Database': Database, 'Cpu': Cpu, 'ShieldCheck': ShieldCheck,
        'Zap': Zap, 'CheckCircle': CheckCircle, 'Terminal': Terminal, 'Layers': Layers,
        'Activity': Activity, 'Lock': Lock, 'Server': Server, 'Globe': Globe, 'TrendingUp': TrendingUp, 'Play': Play,
        'AlertTriangle': AlertTriangle, 'FileText': FileText, 'Search': Search
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

const ReadinessCard: React.FC<{ category: AuditCategory }> = ({ category }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-bold text-lg">{category.name}</h4>
          <div className="text-gray-500 text-xs mt-1">Audit Score: {category.score}/100</div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
          category.status === 'READY' ? 'bg-green-900 text-green-300' :
          category.status === 'WARNING' ? 'bg-yellow-900 text-yellow-300' :
          'bg-red-900 text-red-300'
        }`}>
          {category.status}
        </div>
      </div>
      
      <div className="space-y-2">
        {category.items.map((item, idx) => (
           <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
              {item.done ? (
                <CheckSquare size={16} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon size={16} className={`${item.critical ? 'text-red-500' : 'text-yellow-500'} shrink-0 mt-0.5`} />
              )}
              <span className={item.done ? 'opacity-80' : ''}>{item.label}</span>
           </div>
        ))}
      </div>
    </div>
  );
};

const OptimizationCard: React.FC<{ tip: OptimizationTip }> = ({ tip }) => (
  <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-5 hover:bg-blue-900/20 transition-all">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-blue-300 font-bold flex items-center gap-2">
        <Zap size={16} /> {tip.title}
      </h4>
      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
        tip.impact === 'HIGH' ? 'border-red-500 text-red-400' : 'border-blue-500 text-blue-400'
      }`}>{tip.impact} IMPACT</span>
    </div>
    <p className="text-gray-400 text-sm mb-3">{tip.description}</p>
    {tip.codeSnippet && (
      <div className="bg-black/30 p-2 rounded text-xs font-mono text-gray-300 border border-white/10">
        {tip.codeSnippet}
      </div>
    )}
  </div>
);

const ReadinessDashboard = ({ setView }: { setView: (view: ViewState) => void }) => {
  const allReady = PRODUCTION_CHECKLIST.every(c => c.status === 'READY');

  const phases = [
    { id: ViewState.RISK_PHASE, num: 5, label: "Risk & Simulation" },
    { id: ViewState.EXECUTION_PHASE, num: 6, label: "Execution Engine" },
    { id: ViewState.MONITORING, num: 7, label: "Mission Control" },
    { id: ViewState.BACKTEST, num: 8, label: "Backtest & Deployment" },
    { id: ViewState.STRESS_TEST, num: 9, label: "Stress Test & Chaos" },
    { id: ViewState.FINAL_AUDIT, num: 10, label: "Final Review" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* 1. Readiness Audit */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="text-green-400" />
            System Readiness Audit
          </h3>
          <span className="text-sm text-gray-500">Last run: Just now</span>
        </div>

        {/* Phase Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
           {phases.map(p => (
             <button 
               key={p.num}
               onClick={() => setView(p.id)}
               className="bg-gray-900 border border-gray-800 p-3 rounded hover:border-blue-500 hover:bg-gray-800 transition-all text-left group"
             >
               <div className="text-[10px] text-gray-500 uppercase font-bold group-hover:text-blue-400">Phase {p.num}</div>
               <div className="text-xs font-bold text-gray-300 group-hover:text-white truncate">{p.label}</div>
             </button>
           ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTION_CHECKLIST.map(cat => <ReadinessCard key={cat.id} category={cat} />)}
        </div>

        <div className="mt-8">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Construction className="text-yellow-400" />
             Recommended Optimizations
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {OPTIMIZATIONS.map((tip, idx) => <OptimizationCard key={idx} tip={tip} />)}
           </div>
        </div>
      </div>

      {/* 2. Launch Control */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          <h3 className="text-lg font-bold text-white mb-6 text-center">Launch Status</h3>
          
          <div className="flex justify-center mb-8">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center flex-col gap-1 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
              allReady 
                ? 'border-green-500 bg-green-900/20 shadow-green-900/50' 
                : 'border-yellow-500 bg-yellow-900/20 shadow-yellow-900/50'
            }`}>
              <div className="text-3xl font-bold text-white">{allReady ? 'GO' : 'NO GO'}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{allReady ? 'FLIGHT READY' : 'ISSUES FOUND'}</div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
               <span className="text-gray-400 text-xs">Environment</span>
               <span className="text-blue-400 font-mono text-xs">PRODUCTION</span>
             </div>
             <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
               <span className="text-gray-400 text-xs">Safety Lock</span>
               <span className="text-green-400 font-mono text-xs">ENGAGED</span>
             </div>
             <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
               <span className="text-gray-400 text-xs">Est. Latency</span>
               <span className="text-yellow-400 font-mono text-xs">~45ms</span>
             </div>
          </div>

          <button 
            disabled={!allReady}
            className={`w-full mt-6 py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              allReady 
                ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/40' 
                : 'bg-gray-800 cursor-not-allowed opacity-50'
            }`}
          >
            {allReady ? <ThumbsUp size={18}/> : <AlertTriangle size={18} />}
            {allReady ? 'INITIALIZE PAPER TRADING' : 'RESOLVE WARNINGS FIRST'}
          </button>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-5">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-blue-500 rounded-full p-1"><Server size={14} className="text-white"/></div>
             <div className="text-blue-300 font-bold text-sm">Deployment Target</div>
           </div>
           <p className="text-gray-400 text-xs leading-relaxed">
             Docker Container (Node 20-alpine)<br/>
             PM2 Cluster Mode (2 instances)<br/>
             Redis Sidecar (Events)<br/>
             Region: AWS eu-central-1 (Low Latency)
           </p>
        </div>
      </div>
    </div>
  );
};

// --- SIMULATION DASHBOARD (PHASE 5) ---

const SimulationDashboard = () => {
  const [portfolio, setPortfolio] = useState<PaperPortfolio>({
    balance: SIMULATION_CONFIG.startingBalance,
    startBalance: SIMULATION_CONFIG.startingBalance,
    equity: SIMULATION_CONFIG.startingBalance,
    openPositions: [],
    realizedPnL: 0,
    usedMargin: 0
  });

  const [logs, setLogs] = useState<TradeJournalEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState<string>('IDLE');

  // Deterministic Fill Logic Mock
  const simulateExecution = async (token: string, direction: 'BUY'|'SELL', amountUsd: number) => {
    setIsSimulating(true);
    setSimStatus('RPC REQUEST...');
    
    // 1. Latency (Random between min/max)
    const latency = Math.floor(Math.random() * (SIMULATION_CONFIG.latencyMs.max - SIMULATION_CONFIG.latencyMs.min)) + SIMULATION_CONFIG.latencyMs.min;
    await new Promise(r => setTimeout(r, latency));

    // 2. Chaos/Failures
    if (Math.random() < 0.1) {
       setLogs(prev => [{ 
         tradeId: Date.now().toString(), 
         timestamp: Date.now(), 
         token, 
         type: direction, 
         entryPrice: 0, 
         size: 0, 
         signalScore: 0,
         confidenceScore: 0,
         executionLatency: latency,
         notes: `FAILED: Tx Timeout (${latency}ms)` 
       }, ...prev]);
       setSimStatus('FAILED');
       setIsSimulating(false);
       return;
    }

    setSimStatus('FILLING...');
    
    // 3. Pricing & Slippage
    const basePrice = 100 + (Math.random() * 10 - 5);
    const slippage = (amountUsd / 100000) * basePrice * SIMULATION_CONFIG.slippageMultiplier; 
    const fillPrice = direction === 'BUY' ? basePrice + slippage : basePrice - slippage;

    // 4. Update Ledger
    const newLog: TradeJournalEntry = {
      tradeId: Date.now().toString(),
      timestamp: Date.now(),
      token,
      type: direction,
      entryPrice: fillPrice,
      size: amountUsd / fillPrice,
      signalScore: 85,
      confidenceScore: 0.92,
      executionLatency: latency,
      notes: `Filled @ $${fillPrice.toFixed(2)} (Slippage: ${(slippage/basePrice*100).toFixed(2)}%)`
    };

    setLogs(prev => [newLog, ...prev]);
    setPortfolio(prev => ({
      ...prev,
      balance: direction === 'BUY' ? prev.balance - amountUsd : prev.balance + amountUsd,
      equity: prev.equity, // Simplified for mock
      realizedPnL: prev.realizedPnL - (amountUsd * 0.003) // Fee
    }));

    setSimStatus('COMPLETED');
    setIsSimulating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* 1. Portfolio Ledger & Status */}
      <div className="lg:col-span-1 space-y-6">
        {/* System Status Panel (NEW) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity className="text-blue-500" size={18}/> System Status
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-500">Execution Mode</span>
               <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-800 font-mono">PAPER</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-500">Fill Engine</span>
               <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-800 font-mono">ACTIVE</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-500">Portfolio Ledger</span>
               <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-800 font-mono">RUNNING</span>
             </div>
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-500">Replay Engine</span>
               <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700 font-mono">STANDBY</span>
             </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><DollarSign className="text-green-500" size={20}/> Paper Portfolio</h3>
          
          <div className="space-y-4">
             <div className="flex justify-between items-end border-b border-gray-800 pb-2">
               <span className="text-gray-400 text-sm">Equity</span>
               <span className="text-2xl font-mono text-white">${portfolio.equity.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-end border-b border-gray-800 pb-2">
               <span className="text-gray-400 text-sm">Buying Power</span>
               <span className="text-xl font-mono text-blue-400">${portfolio.balance.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-end border-b border-gray-800 pb-2">
               <span className="text-gray-400 text-sm">Realized PnL</span>
               <span className={`text-xl font-mono ${portfolio.realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {portfolio.realizedPnL >= 0 ? '+' : ''}{portfolio.realizedPnL.toFixed(2)}
               </span>
             </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap className="text-yellow-500" size={20}/> Manual Trigger</h3>
           <div className="flex gap-2">
             <button 
               onClick={() => simulateExecution('SOL', 'BUY', 1000)}
               disabled={isSimulating}
               className="flex-1 bg-green-900 border border-green-700 hover:bg-green-800 text-green-100 py-3 rounded font-bold disabled:opacity-50"
             >
               BUY $1k
             </button>
             <button 
               onClick={() => simulateExecution('SOL', 'SELL', 1000)}
               disabled={isSimulating}
               className="flex-1 bg-red-900 border border-red-700 hover:bg-red-800 text-red-100 py-3 rounded font-bold disabled:opacity-50"
             >
               SELL $1k
             </button>
           </div>
           <div className="mt-4 text-center text-xs font-mono text-gray-500">
             STATUS: <span className={isSimulating ? "text-yellow-500 animate-pulse" : "text-gray-300"}>{simStatus}</span>
           </div>
        </div>
      </div>

      {/* 2. Simulation Visualization (Fill Engine) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Cpu className="text-blue-500" size={20}/> Fill Engine Visualization</h3>
            <p className="text-xs text-gray-500 mb-6">Visualizing slippage, latency, and chaos injection in real-time.</p>
            
            <div className="flex items-center justify-between gap-4">
               <div className="flex-1 bg-black/40 p-4 rounded border border-gray-700 text-center">
                  <div className="text-xs text-gray-500 mb-1">NETWORK LATENCY</div>
                  <div className="text-xl font-mono text-yellow-500">{isSimulating ? (Math.random()* (SIMULATION_CONFIG.latencyMs.max - SIMULATION_CONFIG.latencyMs.min) + SIMULATION_CONFIG.latencyMs.min).toFixed(0) : '0'}ms</div>
               </div>
               <div className="flex-1 bg-black/40 p-4 rounded border border-gray-700 text-center">
                  <div className="text-xs text-gray-500 mb-1">SLIPPAGE IMPACT</div>
                  <div className="text-xl font-mono text-red-400">{isSimulating ? (Math.random()*0.5).toFixed(2) : '0.00'}%</div>
               </div>
               <div className="flex-1 bg-black/40 p-4 rounded border border-gray-700 text-center">
                  <div className="text-xs text-gray-500 mb-1">CHAOS PROBABILITY</div>
                  <div className="text-xl font-mono text-purple-400">{(SIMULATION_CONFIG.partialFillProbability * 100).toFixed(1)}%</div>
               </div>
            </div>

            {isSimulating && (
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"></div>
            )}
         </div>

         {/* Trade Journal */}
         <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText className="text-gray-400" size={20}/> Simulation Journal</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
               {logs.length === 0 && <div className="text-gray-600 text-sm text-center py-10">No simulated trades yet.</div>}
               {logs.map((log) => (
                 <div key={log.tradeId} className="flex justify-between items-center bg-black/20 p-3 rounded border border-gray-800 text-sm">
                    <div className="flex items-center gap-3">
                       <span className="text-gray-500 text-xs font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                       <span className={`font-bold ${log.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{log.type} {log.token}</span>
                       <span className="text-xs bg-gray-800 px-1 rounded text-gray-400">Score: {log.signalScore}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-gray-300 font-mono text-xs">{log.notes}</div>
                       <div className="text-[10px] text-gray-500">Lat: {log.executionLatency}ms</div>
                    </div>
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
            QuantBot <span className="text-xs bg-purple-900 text-purple-300 px-1 rounded ml-auto">v1.2.0</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Phase 10: Final Review</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <NavItem id={ViewState.STRUCTURE} label="Architecture" icon={Folder} />
          <NavItem id={ViewState.DATAFLOW} label="Pipelines" icon={GitBranch} />
          <NavItem id={ViewState.MODELS} label="Domain Models" icon={Database} />
          <NavItem id={ViewState.PRINCIPLES} label="Principles" icon={Search} />
          <div className="pt-4 mt-4 border-t border-gray-800">
            <NavItem id={ViewState.RISK_PHASE} label="Risk & Simulation" icon={Cpu} />
            <NavItem id={ViewState.EXECUTION_PHASE} label="Execution" icon={Zap} />
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
              {view === ViewState.EXECUTION_PHASE && "Phase 6: Execution Engine"}
              {view === ViewState.MONITORING && "Mission Control"}
              {view === ViewState.BACKTEST && "Backtesting & DevOps"}
              {view === ViewState.STRESS_TEST && "High-Velocity Stress Orchestrator"}
              {view === ViewState.FINAL_AUDIT && "Master Readiness Assessment"}
            </h2>
            <p className="text-gray-400">
              {view === ViewState.RISK_PHASE && "Deterministic market simulator for paper trading validation."}
              {view === ViewState.FINAL_AUDIT && "Comprehensive audit, optimization suggestions, and final production checklist."}
              {view !== ViewState.FINAL_AUDIT && view !== ViewState.RISK_PHASE && "Architectural documentation and interactive modules."}
            </p>
          </header>

          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {view === ViewState.STRUCTURE && <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl"><FolderTree item={FOLDER_STRUCTURE} /></div>}
            {view === ViewState.DATAFLOW && <div className="max-w-2xl"><PipelineViewer steps={PIPELINE_STEPS} /></div>}
            {view === ViewState.MODELS && <div className="grid gap-8">{DOMAIN_MODELS.map((model, idx) => (<div key={idx}><h3 className="text-xl font-semibold text-blue-400 mb-1">{model.name}</h3><p className="text-gray-500 text-sm mb-2">{model.description}</p><CodeBlock code={model.code} title={`${model.name}`} /></div>))}</div>}
            {view === ViewState.PRINCIPLES && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{PRINCIPLES.map((p, idx) => <PrincipleCard key={idx} principle={p} />)}</div>}
            
            {/* Nav Placeholders for missing phases in this context */}
            {view === ViewState.RISK_PHASE && <SimulationDashboard />}
            {view === ViewState.EXECUTION_PHASE && <div className="flex items-center justify-center h-full text-gray-500">Phase 6: Execution Engine</div>}
            {view === ViewState.MONITORING && <div className="flex items-center justify-center h-full text-gray-500">Phase 7: Monitoring View</div>}
            {view === ViewState.BACKTEST && <div className="flex items-center justify-center h-full text-gray-500">Phase 8: Backtest & Deployment</div>}
            {view === ViewState.STRESS_TEST && <div className="flex items-center justify-center h-full text-gray-500">Phase 9: Stress Test</div>}

            {/* The Final Audit View */}
            {view === ViewState.FINAL_AUDIT && <ReadinessDashboard setView={setView} />}
          </div>
        </div>
      </main>
    </div>
  );
}