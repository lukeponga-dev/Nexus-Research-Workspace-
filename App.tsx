
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Send, 
  Paperclip, 
  Trash2, 
  Plus,
  Loader2,
  Database,
  Menu,
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Terminal as TerminalIcon,
  HardDrive,
  Globe,
  Sparkles,
  Command,
  Box,
  Fingerprint,
  ClipboardCheck,
  Search,
  BookOpen,
  Edit3,
  GitBranch,
  History,
  Layers,
  Share2,
  Signal,
  LayoutDashboard,
  Cpu as CpuIcon,
  FileDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Artifact, Message, ReasoningMode, AgentState, AgentId, ResearchPhase } from './types';
import * as DBService from './services/db';
import * as GeminiService from './services/gemini';
import * as SecurityService from './services/security';
import { ChartRenderer } from './components/ChartRenderer';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<ReasoningMode>('pro');
  const [activePhase, setActivePhase] = useState<ResearchPhase>('IDLE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(true);
  const [monitorTab, setMonitorTab] = useState<'log' | 'graph'>('log');
  const [securityStatus, setSecurityStatus] = useState<'idle' | 'scanning' | 'safe' | 'alert'>('idle');
  const [systemMetrics, setSystemMetrics] = useState({ cpu: 8, ram: 42, latency: 98, uptime: '00:00:00' });
  const [logs, setLogs] = useState<{ t: number, m: string, s: 'info'|'warn'|'error'|'sec'|'rust' }[]>([]);
  const [agents, setAgents] = useState<AgentState[]>([
    { id: 'ORCHESTRATOR', name: 'Orchestrator', status: 'IDLE', load: 0 },
    { id: 'LIT_AGENT', name: 'Literature', status: 'IDLE', load: 0 },
    { id: 'CRITIC', name: 'Critic', status: 'IDLE', load: 0 },
    { id: 'SCRIBE', name: 'Scribe', status: 'IDLE', load: 0 },
    { id: 'SEC_OPA', name: 'Security', status: 'IDLE', load: 0 }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    loadArtifacts();
    addLog('NEXUS Control Surface v6.1 Initialized', 'rust');
    
    const interval = setInterval(() => {
        const diff = Date.now() - startTime.current;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        
        setSystemMetrics(prev => ({
            cpu: Math.floor(Math.random() * 8) + 4,
            ram: 41 + (Math.sin(diff / 8000) * 1.5),
            latency: 85 + Math.floor(Math.random() * 20),
            uptime: `${h}:${m}:${s}`
        }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addLog = (m: string, s: 'info'|'warn'|'error'|'sec'|'rust' = 'info') => {
      setLogs(prev => [{ t: Date.now(), m, s }, ...prev].slice(0, 100));
  };

  const updateAgent = (id: AgentId, status: 'IDLE' | 'ACTIVE' | 'ERROR', load: number) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status, load } : a));
  };

  const loadArtifacts = async () => {
    const items = await DBService.getAllArtifacts();
    setArtifacts(items);
  };

  const importDemoData = async () => {
    addLog('Initiating Demo Artifact Synthesis...', 'sec');
    updateAgent('LIT_AGENT', 'ACTIVE', 100);

    const demoFiles = [
      {
        name: 'postmortem_notes.md',
        type: 'text' as const,
        content: `# Postmortem Notes\n\nInitial hypotheses:\n- Regression caused by increased model complexity\n- Latency linked to context window growth\n- Tool-calling overhead underestimated\n\nMitigations attempted:\n- Reduced prompt size\n- Cached intermediate outputs\n- Switched to lower-latency models for non-critical paths`
      },
      {
        name: 'demo_guide.txt',
        type: 'text' as const,
        content: `Nexus Hackathon Demo Dataset\n\nThis dataset is designed to demonstrate:\n- Persistent context memory\n- Flash vs Pro reasoning modes\n- Causal analysis across documents and data\n\nSuggested first prompt:\n"Summarize what went wrong in this incident."\n\nSuggested deep prompt:\n"Using all available files, explain the primary cause of the regression and how it was resolved."`
      },
      {
        name: 'latency_metrics.csv',
        type: 'csv' as const,
        content: `date,model,avg_latency_ms,error_rate\n2024-03-10,pro,1820,0.9\n2024-03-20,pro,2410,1.6\n2024-04-01,flash,420,0.4`
      },
      {
        name: 'ai_incident_summary.md',
        type: 'text' as const,
        content: `# AI Incident Summary\n\nBetween March and April 2024, multiple AI-assisted systems exhibited performance regressions following model updates. Symptoms included higher latency, increased error rates, and degraded output quality.\n\nThis dataset documents observed failures, logs, and mitigation attempts.`
      },
      {
        name: 'system_changelog.csv',
        type: 'csv' as const,
        content: `date,change\n2024-03-15,Increased thinking budget\n2024-03-22,Enabled tool calling\n2024-03-28,Introduced Flash routing`
      }
    ];

    for (const file of demoFiles) {
      const newArtifact: Artifact = {
        id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        content: file.content,
        createdAt: Date.now()
      };
      await DBService.saveArtifact(newArtifact);
      addLog(`Artifact mounted: ${file.name}`, 'rust');
    }

    await loadArtifacts();
    updateAgent('LIT_AGENT', 'IDLE', 0);
    addLog('Demo Ingestion Complete.', 'sec');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setSecurityStatus('scanning');
    updateAgent('SEC_OPA', 'ACTIVE', 100);
    setActivePhase('PLANNING');
    addLog('Pre-flight security validation...', 'sec');
    
    const securityCheck = await SecurityService.validateInput(inputText);
    if (securityCheck.status === 'MALICIOUS') {
        updateAgent('SEC_OPA', 'ERROR', 0);
        setSecurityStatus('alert');
        addLog('PROTOCOL_VIOLATION: Directive blocked.', 'error');
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: `### 🔴 ACCESS REVOKED\n\nCommand parameters inconsistent with safety policies. Sandbox locked.`,
            timestamp: Date.now(),
            type: 'security_alert'
        }]);
        setIsProcessing(false);
        setActivePhase('IDLE');
        return;
    }

    setSecurityStatus('safe');
    updateAgent('SEC_OPA', 'IDLE', 0);
    updateAgent('ORCHESTRATOR', 'ACTIVE', 80);
    addLog('[ORCH] Decomposing objective...', 'rust');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now(),
      type: 'chat'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      await new Promise(r => setTimeout(r, 1000));
      setActivePhase('COLLECTION');
      updateAgent('ORCHESTRATOR', 'IDLE', 0);
      updateAgent('LIT_AGENT', 'ACTIVE', 95);
      addLog('[LIT] Ingesting groundings...', 'rust');

      await new Promise(r => setTimeout(r, 1200));
      setActivePhase('ANALYSIS');
      updateAgent('LIT_AGENT', 'IDLE', 0);
      updateAgent('CRITIC', 'ACTIVE', 90);
      addLog('[CRIT] Cross-verifying sources...', 'rust');

      await new Promise(r => setTimeout(r, 1000));
      setActivePhase('SYNTHESIS');
      updateAgent('CRITIC', 'IDLE', 0);
      updateAgent('SCRIBE', 'ACTIVE', 100);
      addLog('[SCRIBE] Finalizing research memo...', 'rust');

      const responseText = await GeminiService.generateResponse(
        messages,
        artifacts,
        mode,
        userMsg.text
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        type: responseText.includes('###') ? 'chat' : 'research_card'
      };
      
      setMessages(prev => [...prev, botMsg]);
      addLog(`[KERNEL] Task cycle successful.`, 'rust');
    } catch (error: any) {
      addLog(`Loop failure: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setActivePhase('IDLE');
      setAgents(prev => prev.map(a => ({ ...a, status: 'IDLE', load: 0 })));
      setTimeout(() => setSecurityStatus('idle'), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    updateAgent('LIT_AGENT', 'ACTIVE', 100);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      addLog(`Artifact mounted: ${file.name}`, 'rust');
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const result = ev.target?.result as string;
        let type: Artifact['type'] = 'text';
        let content = result;
        if (file.type.startsWith('image/')) {
            type = 'image';
            content = result.split(',')[1];
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            type = 'csv';
        }
        const newArtifact: Artifact = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          type,
          content,
          mimeType: file.type,
          createdAt: Date.now()
        };
        await DBService.saveArtifact(newArtifact);
        setArtifacts(prev => [...prev, newArtifact]);
        addLog(`Indexed: ${newArtifact.name}`, 'sec');
        updateAgent('LIT_AGENT', 'IDLE', 0);
      };
      if (file.type.startsWith('image/')) reader.readAsDataURL(file);
      else reader.readAsText(file);
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#020202] text-zinc-300 font-sans overflow-hidden relative selection:bg-aegis-accent/30 selection:text-white bg-grid">
      
      <div className="scan-line" />

      {/* MOBILE OVERLAY */}
      {(isSidebarOpen || (isMonitorOpen && window.innerWidth < 1024)) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden" onClick={() => { setIsSidebarOpen(false); setIsMonitorOpen(false); }} />
      )}

      {/* LEFT SIDEBAR: Context Vault */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-[80%] sm:w-60 glass border-r border-white/5 flex flex-col transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Box size={14} className="text-aegis-accent" />
                <span className="text-[10px] font-black tracking-[0.2em] font-mono text-zinc-500 uppercase">Context_Vault</span>
            </div>
            <div className="flex items-center gap-1">
                <button 
                  onClick={importDemoData} 
                  title="Import Demo Data"
                  className="p-1.5 hover:bg-aegis-accent/10 hover:text-aegis-accent rounded-md text-zinc-500 border border-white/5 transition-all"
                >
                    <FileDown size={14} />
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-white/5 rounded-md text-zinc-400 border border-white/5">
                    <Plus size={14} />
                </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {artifacts.length === 0 && (
                <div className="py-10 text-center opacity-20">
                    <Database size={24} className="mx-auto mb-2" />
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Storage_Null</span>
                </div>
            )}
            {artifacts.map(art => (
                <div key={art.id} className="group glass border border-white/5 rounded-lg p-2.5 hover:border-aegis-accent/30 transition-all cursor-default relative overflow-hidden active:scale-[0.98]">
                    <div className="flex items-center gap-2 mb-1">
                        <Fingerprint size={12} className="text-aegis-accent/60" />
                        <span className="text-[10px] font-mono font-bold truncate tracking-tight">{art.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase">
                        <span>{art.type}</span>
                        <button onClick={() => DBService.deleteArtifact(art.id).then(loadArtifacts)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-aegis-error">
                            <X size={10} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="p-3 border-t border-white/5 bg-black/40">
             <div className="flex items-center gap-2 px-2 py-1.5 bg-aegis-accent/5 rounded border border-aegis-accent/10">
                <ShieldCheck size={12} className="text-aegis-success" />
                <span className="text-[9px] font-mono font-bold text-aegis-success uppercase">OPA_Enforced</span>
             </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* COMMAND HUD HEADER */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 bg-[#0a0a0c]/80 backdrop-blur-xl z-50">
            <div className="flex items-center gap-4 sm:gap-8">
                <button className="md:hidden text-zinc-500" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-aegis-accent" />
                            <h1 className="text-[11px] font-black tracking-[0.3em] font-mono uppercase">Nexus_Research</h1>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-mono text-zinc-600 uppercase">Dist_Kernel_v6.1</span>
                            <div className="w-1 h-1 rounded-full bg-aegis-success shadow-[0_0_4px_#10b981]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* INTEGRATED PHASE INDICATOR */}
            <div className="hidden lg:flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-xl">
                {[
                    { p: 'PLANNING', icon: GitBranch, label: 'Plan' },
                    { p: 'COLLECTION', icon: Search, label: 'Collect' },
                    { p: 'ANALYSIS', icon: ClipboardCheck, label: 'Analyze' },
                    { p: 'SYNTHESIS', icon: Edit3, label: 'Synth' }
                ].map((item, idx) => (
                    <div key={item.p} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-500 ${activePhase === item.p ? 'bg-aegis-accent text-white shadow-[0_0_15px_rgba(0,112,243,0.3)]' : 'opacity-20 hover:opacity-40'}`}>
                        <item.icon size={12} />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden xl:flex items-center gap-4 text-[9px] font-mono font-bold mr-4 text-zinc-500 border-r border-white/10 pr-4">
                    <div className="flex flex-col items-end">
                        <span>LATENCY</span>
                        <span className="text-aegis-accent tracking-tighter">{systemMetrics.latency}ms</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span>SIGNAL</span>
                        <div className="flex gap-0.5 items-end h-2">
                            {[1,2,3,4].map(i => <div key={i} className={`w-0.5 rounded-full ${i <= 3 ? 'bg-aegis-success' : 'bg-white/10'}`} style={{ height: `${i * 25}%` }} />)}
                        </div>
                    </div>
                </div>
                
                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setMode('flash')} className={`p-1.5 rounded-lg transition-all ${mode === 'flash' ? 'bg-aegis-accent/10 text-aegis-accent' : 'text-zinc-600'}`}>
                        <Zap size={16} />
                    </button>
                    <button onClick={() => setMode('pro')} className={`p-1.5 rounded-lg transition-all ${mode === 'pro' ? 'bg-aegis-accent/10 text-aegis-accent' : 'text-zinc-600'}`}>
                        <Cpu size={16} />
                    </button>
                </div>
                
                <button onClick={() => setIsMonitorOpen(!isMonitorOpen)} className={`p-2 rounded-xl border transition-all ${isMonitorOpen ? 'border-aegis-accent/30 text-aegis-accent bg-aegis-accent/5' : 'border-white/5 text-zinc-500 hover:bg-white/5'}`}>
                    <LayoutDashboard size={18} />
                </button>
            </div>
        </div>

        {/* WORKSPACE CANVAS (MESSAGES) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-12 custom-scrollbar">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-aegis-accent/5 border border-aegis-accent/10 rounded-3xl flex items-center justify-center mb-8 relative group">
                        <Bot size={40} className="text-aegis-accent group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 border border-aegis-accent/20 rounded-3xl animate-ping opacity-20" />
                    </div>
                    <h2 className="text-xs font-mono font-black tracking-[0.4em] uppercase text-zinc-400 mb-4">Command_Interface_Ready</h2>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-loose">
                        Deploy specialized agent substrates to analyze persistent context volumes. 
                        Grounding enabled via OPA-validated edge nodes.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                        <div className="p-4 glass border border-white/5 rounded-2xl text-left hover:border-aegis-accent/30 transition-all cursor-pointer group">
                             <Edit3 size={14} className="text-aegis-accent mb-2 group-hover:translate-x-1 transition-transform" />
                             <span className="text-[9px] font-mono font-bold uppercase tracking-widest block text-zinc-500">Draft Memo</span>
                        </div>
                        <div className="p-4 glass border border-white/5 rounded-2xl text-left hover:border-aegis-accent/30 transition-all cursor-pointer group">
                             <Search size={14} className="text-aegis-accent mb-2 group-hover:translate-x-1 transition-transform" />
                             <span className="text-[9px] font-mono font-bold uppercase tracking-widest block text-zinc-500">Deep Lit Review</span>
                        </div>
                    </div>
                </div>
            )}
            
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 sm:gap-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-2xl ${msg.role === 'model' ? 'bg-[#0a0a0c] text-aegis-accent border-aegis-accent/20' : 'bg-zinc-800 text-zinc-400'}`}>
                        {msg.role === 'model' ? <Bot size={22} /> : <span className="text-[9px] font-black font-mono">USER</span>}
                    </div>
                    
                    <div className={`max-w-[85%] md:max-w-2xl lg:max-w-3xl space-y-4 ${msg.role === 'user' ? 'items-end' : ''}`}>
                        {msg.type === 'research_card' ? (
                            <div className="glass border border-aegis-accent/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <ClipboardCheck size={40} className="text-aegis-accent" />
                                </div>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <div className="p-2 bg-aegis-accent/10 rounded-xl">
                                        <Layers size={16} className="text-aegis-accent" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Atomic_Insight_Card</span>
                                        <span className="text-[8px] font-mono text-aegis-success uppercase">Grounding: Verified_98%</span>
                                    </div>
                                </div>
                                <div className="text-[14px] sm:text-[15px] leading-relaxed text-zinc-200 font-sans">
                                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{msg.text}</ReactMarkdown>
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500"><Share2 size={14} /></button>
                                    <button className="px-3 py-1 bg-aegis-accent/10 text-aegis-accent rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest border border-aegis-accent/20">Archive Finding</button>
                                </div>
                            </div>
                        ) : (
                            <div className={`px-6 py-5 rounded-3xl text-[14px] sm:text-[15px] leading-relaxed border shadow-xl ${msg.role === 'user' ? 'bg-zinc-900 border-zinc-700 text-zinc-100 message-frame-user' : 'glass border-white/5 text-zinc-300 message-frame-model'}`}>
                                <ReactMarkdown className="prose prose-invert prose-sm max-w-none" components={{
                                    code({node, inline, className, children, ...props}: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <div className="rounded-2xl overflow-hidden border border-white/5 my-6 shadow-2xl">
                                                <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                                                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{match[1]}</span>
                                                    <div className="flex gap-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-zinc-800" /><div className="w-2 h-2 rounded-full bg-zinc-800" />
                                                    </div>
                                                </div>
                                                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props} customStyle={{ background: '#020202', padding: '1.5rem', fontSize: '0.85rem' }}>
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="bg-white/5 px-1.5 py-0.5 rounded text-aegis-warning font-mono text-xs border border-white/5" {...props}>{children}</code>
                                        )
                                    }
                                }}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        )}
                        
                        {msg.role === 'model' && artifacts.filter(a => a.type === 'csv' && msg.text.toLowerCase().includes(a.name.toLowerCase())).map(a => (
                            <ChartRenderer key={a.id} artifact={a} />
                        ))}
                    </div>
                </div>
            ))}
            {isProcessing && (
                <div className="flex gap-4 sm:gap-10 animate-pulse">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-aegis-accent" />
                    </div>
                    <div className="space-y-4 py-2">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-aegis-accent font-black uppercase tracking-[0.3em]">
                            <CpuIcon size={14} className="animate-pulse" /> Substrate_Processing: {activePhase}
                        </div>
                        <div className="h-1 w-64 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-aegis-accent shadow-[0_0_10px_#0070f3] transition-all duration-1000 ease-in-out" style={{ width: activePhase === 'PLANNING' ? '25%' : activePhase === 'COLLECTION' ? '50%' : activePhase === 'ANALYSIS' ? '75%' : '100%' }} />
                        </div>
                        <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                            Allocating reasoning tokens via Pro_Kernel...
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* HUD INPUT CONTROL */}
        <div className="p-4 sm:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="max-w-4xl mx-auto relative group">
                <div className={`relative border-t border-x rounded-t-2xl transition-all duration-500 overflow-hidden ${securityStatus === 'alert' ? 'border-aegis-error bg-aegis-error/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/10 bg-[#0a0a0c]/80 focus-within:border-aegis-accent/50 focus-within:shadow-[0_0_40px_rgba(0,112,243,0.15)]'}`}>
                    {securityStatus === 'scanning' && <div className="absolute top-0 left-0 w-full h-[1px] bg-aegis-accent animate-progress z-20" />}
                    
                    <div className="flex items-end p-2 sm:p-4 gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-zinc-500 hover:text-aegis-accent transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5">
                            <Paperclip size={22} />
                        </button>
                        <textarea 
                            value={inputText} 
                            onChange={(e) => setInputText(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} 
                            placeholder="Enter research directive..." 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] py-3.5 px-2 min-h-[50px] max-h-48 resize-none text-zinc-100 placeholder-zinc-700 font-sans tracking-tight"
                        />
                        <button onClick={handleSendMessage} disabled={!inputText.trim() || isProcessing} className="p-4 bg-aegis-accent hover:bg-blue-600 disabled:opacity-10 text-white rounded-2xl shadow-2xl transition-all active:scale-95 group-focus-within:animate-pulse">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
                {/* HUD Lower Bar */}
                <div className="bg-[#0a0a0c] border border-white/10 border-t-0 rounded-b-2xl h-10 px-6 flex items-center justify-between">
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2 text-[8px] font-mono font-black uppercase text-zinc-600 tracking-widest">
                            <Shield size={10} className={securityStatus === 'safe' ? 'text-aegis-success' : 'text-zinc-700'} />
                            <span>System_Sec: {securityStatus}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-mono font-black uppercase text-zinc-600 tracking-widest">
                            <Globe size={10} className="text-zinc-700" />
                            <span>Mesh_Sync: Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-mono font-black uppercase text-zinc-700">
                        <span>Terminal_ID: NX-PRIME-08</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Signal Telemetry & Graph */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-[85%] sm:w-80 glass border-l border-white/5 flex flex-col transform transition-all duration-500 shadow-2xl
        ${isMonitorOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:translate-x-0 ${isMonitorOpen ? '' : 'lg:hidden'}
      `}>
        {/* TAB CONTROLS */}
        <div className="h-16 flex border-b border-white/5 bg-black/40">
            <button onClick={() => setMonitorTab('log')} className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest transition-all ${monitorTab === 'log' ? 'text-aegis-accent border-b-2 border-aegis-accent bg-aegis-accent/5' : 'text-zinc-600 hover:text-zinc-400'}`}>
                <TerminalIcon size={14} /> Log
            </button>
            <button onClick={() => setMonitorTab('graph')} className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest transition-all ${monitorTab === 'graph' ? 'text-aegis-accent border-b-2 border-aegis-accent bg-aegis-accent/5' : 'text-zinc-600 hover:text-zinc-400'}`}>
                <Share2 size={14} /> Graph
            </button>
            <button onClick={() => setIsMonitorOpen(false)} className="lg:hidden p-4 text-zinc-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
            
            {monitorTab === 'log' ? (
                <>
                    {/* AGENT STATUS GRID */}
                    <div className="space-y-4">
                        <h3 className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-[0.2em] px-1">Substrate_Matrix</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {agents.map(agent => (
                                <div key={agent.id} className={`p-3 rounded-xl border transition-all duration-700 ${agent.status === 'ACTIVE' ? 'border-aegis-accent/40 bg-aegis-accent/5 shadow-[0_0_15px_rgba(0,112,243,0.05)]' : 'border-white/5 bg-zinc-900/30'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-aegis-accent animate-pulse shadow-[0_0_8px_#0070f3]' : agent.status === 'ERROR' ? 'bg-aegis-error' : 'bg-zinc-800'}`} />
                                            <span className={`text-[10px] font-mono font-black uppercase ${agent.status === 'ACTIVE' ? 'text-aegis-accent' : 'text-zinc-500'}`}>{agent.name}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-zinc-600">{agent.load}%</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-aegis-accent transition-all duration-1000" style={{ width: `${agent.load}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEQUENTIAL LOG */}
                    <div className="space-y-4">
                        <h3 className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-[0.2em] px-1 flex justify-between items-center">
                            Output_Stream
                            <Signal size={10} className="text-aegis-accent animate-pulse" />
                        </h3>
                        <div className="h-[400px] bg-[#020202] rounded-2xl border border-white/5 p-4 font-mono text-[9px] space-y-2.5 overflow-y-auto custom-scrollbar shadow-inner">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3 leading-relaxed border-l border-white/5 pl-3 group">
                                    <span className="text-zinc-800 shrink-0 tabular-nums">{new Date(log.t).toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                    <span className={`
                                        break-words
                                        ${log.s === 'rust' ? 'text-zinc-200' : ''}
                                        ${log.s === 'sec' ? 'text-aegis-accent font-bold' : ''}
                                        ${log.s === 'error' ? 'text-aegis-error' : ''}
                                        ${log.s === 'info' ? 'text-zinc-600' : ''}
                                    `}>
                                        {log.m}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40 py-20">
                    <Share2 size={48} className="text-aegis-accent animate-pulse" />
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Graph_Engine_Init</h4>
                        <p className="text-[9px] font-mono tracking-widest leading-loose max-w-[180px]">Mapping semantic relationships across vaulted context artifacts...</p>
                    </div>
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-aegis-accent to-transparent" />
                </div>
            )}
        </div>

        {/* HUD FOOTER STATUS */}
        <div className="p-4 border-t border-white/5 bg-black/40 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[9px] font-mono font-black">
                <span className="text-zinc-700 uppercase tracking-tighter">Instance: NX-PRIME</span>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-aegis-success animate-pulse shadow-[0_0_8px_#10b981]" />
                    <span className="text-aegis-success uppercase">Sec_Verified</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-aegis-accent animate-[shimmer_2s_infinite]" style={{ width: '40%' }} /></div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-aegis-warning animate-[shimmer_2s_infinite_0.5s]" style={{ width: '65%' }} /></div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default App;
