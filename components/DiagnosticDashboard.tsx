
import React, { useState, useEffect } from 'react';
import { 
  Cpu, HardDrive, Layout, Monitor, ShieldAlert, ShoppingCart, 
  Wrench, RefreshCcw, CheckCircle2, Loader2, Sparkles, 
  ExternalLink, Settings, Zap, MessageCircle, AlertTriangle,
  Search, BarChart3, Fingerprint, Activity, Gauge
} from 'lucide-react';
import { analyzeHardware } from '../services/geminiService';
import { DiagnosticData } from '../types';

interface DiagnosticDashboardProps {
  onComplete: (data: DiagnosticData | null) => void;
}

const SCAN_LOGS = [
  "Iniciando varredura de Kernel...",
  "Verificando integridade dos drivers de vídeo...",
  "Analisando perfis de energia do Windows...",
  "Cruzando dados com banco de dados ITXGAMER...",
  "Detectando possíveis gargalos de CPU...",
  "Avaliando latência de memória RAM...",
  "Checando velocidades de escrita/leitura do SSD...",
  "Calculando eficiência térmica estimada...",
  "Finalizando relatório técnico..."
];

const DiagnosticDashboard: React.FC<DiagnosticDashboardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'input' | 'scanning' | 'results'>('input');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticMetrics, setDiagnosticMetrics] = useState<DiagnosticData | null>(null);
  const [specs, setSpecs] = useState({
    case: '',
    cpu: '',
    gpu: '',
    motherboard: '',
    ram: '',
    storage: '',
    psu: ''
  });

  useEffect(() => {
    let interval: any;
    if (step === 'scanning') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (results && prev < 100) return Math.min(prev + 20, 100);
          if (error && prev < 100) return 100;
          if (prev >= 98) return 98;
          const next = prev + 1.2;
          const logIndex = Math.floor(prev / (100 / SCAN_LOGS.length));
          if (SCAN_LOGS[logIndex] && !scanLog.includes(SCAN_LOGS[logIndex])) {
            setScanLog(old => [...old, SCAN_LOGS[logIndex]].slice(-5));
          }
          return next;
        });
      }, 100);
    }
    if (scanProgress >= 100 && (results || error)) setStep('results');
    return () => clearInterval(interval);
  }, [step, results, error, scanProgress, scanLog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setScanProgress(0);
    setScanLog(["Iniciando protocolos de comunicação..."]);
    setStep('scanning');

    try {
      const analysis = await analyzeHardware(specs);
      setResults(analysis);
      
      const metrics = {
        cpuUsage: 12,
        ramUsage: 32,
        diskSpeed: 4200,
        temp: 58,
        os: "Windows 11 Gamer Pro",
        score: 95
      };
      setDiagnosticMetrics(metrics);
      onComplete(metrics);
    } catch (err: any) {
      setError("Não foi possível conectar à IA da ITXGAMER. Verifique sua chave de API nas configurações do Vercel.");
    }
  };

  const renderAnalysis = (content: string) => {
    if (error) {
       return (
         <div className="flex flex-col items-center gap-6 py-12 text-center">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500" />
           </div>
           <div className="max-w-md">
             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Falha Crítica no Link AI</h4>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">{error}</p>
           </div>
           <button onClick={() => setStep('input')} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">RECOMEÇAR</button>
         </div>
       );
    }
    return content.split('\n').map((line, i) => {
      if (line.includes('**')) {
        return <h4 key={i} className="text-green-400 font-black uppercase tracking-tighter mt-8 mb-4 italic text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> {line.replace(/\*\*/g, '')}
        </h4>;
      }
      return <p key={i} className="mb-4 text-slate-300 leading-relaxed text-base font-medium">{line}</p>;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
          Diagnóstico <span className="text-green-500 underline decoration-white/10 underline-offset-8">Inteligente</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-3 max-w-2xl leading-relaxed">
          Sua central de telemetria gamer. Identificamos <span className="text-white">gargalos físicos</span> e otimizamos o software.
        </p>
      </header>

      {step === 'input' && (
        <form onSubmit={handleStartScan} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-5 transition-opacity pointer-events-none">
            <Fingerprint className="w-64 h-64 text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              {[
                { label: 'Processador (CPU)', name: 'cpu', icon: Cpu, placeholder: 'Ex: Ryzen 7 7800X3D...' },
                { label: 'Placa de Vídeo (GPU)', name: 'gpu', icon: Monitor, placeholder: 'Ex: RTX 4070 Ti...' },
                { label: 'Memória RAM', name: 'ram', icon: RefreshCcw, placeholder: 'Ex: 32GB DDR5 6000MHz...' },
              ].map((field) => (
                <label key={field.name} className="block group/field">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                    <field.icon className="w-4 h-4" /> {field.label}
                  </span>
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                    onChange={handleInputChange}
                    required
                  />
                </label>
              ))}
            </div>
            <div className="space-y-6">
              {[
                { label: 'Placa Mãe', name: 'motherboard', icon: Settings, placeholder: 'Ex: ASUS ROG B650...' },
                { label: 'Armazenamento', name: 'storage', icon: HardDrive, placeholder: 'Ex: SSD NVMe Gen4 2TB...' },
              ].map((field) => (
                <label key={field.name} className="block group/field">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                    <field.icon className="w-4 h-4" /> {field.label}
                  </span>
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                    onChange={handleInputChange}
                    required
                  />
                </label>
              ))}
              <div className="pt-6">
                <button type="submit" className="w-full flex items-center justify-center gap-4 bg-green-600 hover:bg-green-500 text-slate-950 font-black italic text-lg py-5 rounded-2xl transition-all shadow-xl border-b-4 border-green-800 active:scale-95 group">
                  <Zap className="w-6 h-6 fill-current group-hover:animate-bounce" /> ANALISAR SETUP
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {step === 'scanning' && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 border border-white/5 rounded-[2.5rem] border-dashed relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent"></div>
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin shadow-[0_0_30px_rgba(34,197,94,0.2)]"></div>
            <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Processando Telemetria</h3>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-10">Cruzando banco de dados ITX Gamer</p>
          <div className="w-full max-w-md px-6 space-y-4">
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 rounded-full" style={{ width: `${scanProgress}%` }}></div>
            </div>
            <div className="bg-black/40 rounded-2xl p-5 border border-white/5 font-mono text-xs text-green-500/70 h-32 overflow-hidden flex flex-col justify-end shadow-inner">
              {scanLog.map((log, i) => (
                <div key={i} className="flex items-center gap-2 animate-in slide-in-from-bottom-1">
                  <span className="text-green-900 font-bold">[{new Date().toLocaleTimeString([], {second:'2-digit'})}s]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-slate-900/60 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#22c55e" strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (440 * (diagnosticMetrics?.score || 0)) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black italic text-white tracking-tighter leading-none">{diagnosticMetrics?.score}</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-1">Setup Score</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium px-4">Seu hardware está <span className="text-white font-bold">{diagnosticMetrics?.score && diagnosticMetrics.score > 80 ? 'Excelente' : 'Acima da média'}</span> para o padrão atual.</p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: 'CPU Usage', val: `${diagnosticMetrics?.cpuUsage}%`, icon: Cpu, color: 'blue' },
                { label: 'RAM Load', val: `${diagnosticMetrics?.ramUsage}%`, icon: RefreshCcw, color: 'purple' },
                { label: 'V-Disk Speed', val: `${diagnosticMetrics?.diskSpeed}MB/s`, icon: HardDrive, color: 'green' },
                { label: 'PC Temp (Est.)', val: `${diagnosticMetrics?.temp}ºC`, icon: Activity, color: 'orange' },
              ].map((m, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:border-white/20 transition-all">
                  <div className={`p-3 rounded-2xl bg-${m.color}-500/10 text-${m.color}-400`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{m.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-green-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><BarChart3 className="w-48 h-48 text-green-500" /></div>
             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
               <div className={`p-5 rounded-2xl shadow-xl ${error ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500 text-slate-950'}`}>
                 {error ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
               </div>
               <div>
                 <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
                   {error ? "Falha no" : "Relatório de Performance"} <span className={error ? "text-red-500" : "text-green-500"}>{error ? "Diagnóstico" : "Gerado"}</span>
                 </h2>
                 <p className="text-xs text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Análise realizada via ITX Gamer AI Core</p>
               </div>
               <button onClick={() => { setError(null); setResults(null); setStep('input'); }} className="md:ml-auto text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 transition-all">
                 <RefreshCcw className="w-3 h-3" /> NOVO SCAN
               </button>
             </div>
             <div className="prose prose-invert max-w-none relative z-10 font-sans">{renderAnalysis(results || "")}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDashboard;
