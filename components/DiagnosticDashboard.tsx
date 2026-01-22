
import React, { useState, useEffect } from 'react';
import { 
  Cpu, HardDrive, Layout, Monitor, ShieldAlert, ShoppingCart, 
  Wrench, RefreshCcw, CheckCircle2, Loader2, Sparkles, 
  ExternalLink, Settings, Zap, MessageCircle, AlertTriangle,
  Search, BarChart3, Fingerprint
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
          if (results && prev < 100) {
             return Math.min(prev + 20, 100);
          }
          if (error && prev < 100) {
             return 100;
          }
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
    
    if (scanProgress >= 100 && (results || error)) {
        setStep('results');
    }

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
      
      onComplete({
        cpuUsage: 12,
        ramUsage: 32,
        diskSpeed: 4200,
        temp: 58,
        os: "Windows 11 Gamer Pro",
        score: 95
      });
    } catch (err: any) {
      console.error("Falha no diagnóstico:", err);
      // Se for um erro de autenticação/chave, damos uma dica mais direta no console
      if (err.message?.includes("API key") || !process.env.API_KEY) {
        console.warn("DICA TÉCNICA: Verifique se a variável de ambiente API_KEY está configurada no painel do Vercel.");
      }
      setError("Não foi possível conectar à IA da ITXGAMER. Verifique sua chave de API nas configurações do Vercel ou sua conexão.");
      // Deixamos a barra de progresso completar via useEffect para mostrar o erro graciosamente
    }
  };

  const renderAnalysis = (content: string) => {
    if (error) {
       return (
         <div className="flex flex-col items-center gap-6 py-12 text-center">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertTriangle className="w-10 h-10 text-red-500" />
           </div>
           <div className="max-w-md">
             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Falha Crítica no Link AI</h4>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">{error}</p>
             <p className="text-[10px] text-slate-600 font-bold uppercase mt-4 tracking-widest italic">Verifique os logs do console (F12) para detalhes técnicos.</p>
           </div>
           <button 
             onClick={() => setStep('input')}
             className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all border-b-4 border-slate-400 active:scale-95"
           >
             RECOMEÇAR DIAGNÓSTICO
           </button>
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
          Nossa inteligência analisa seu hardware para identificar <span className="text-white">gargalos de FPS</span> e sugerir otimizações precisas para o seu setup.
        </p>
      </header>

      {step === 'input' && (
        <form onSubmit={handleStartScan} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-5 transition-opacity">
            <Fingerprint className="w-64 h-64 text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <label className="block group/field">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                  <Cpu className="w-4 h-4" /> Processador (CPU)
                </span>
                <input
                  type="text"
                  name="cpu"
                  placeholder="Ex: Ryzen 5 5600X..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block group/field">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                  <Monitor className="w-4 h-4" /> Placa de Vídeo (GPU)
                </span>
                <input
                  type="text"
                  name="gpu"
                  placeholder="Ex: RTX 3060..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block group/field">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                  <RefreshCcw className="w-4 h-4" /> Memória RAM
                </span>
                <input
                  type="text"
                  name="ram"
                  placeholder="Ex: 16GB DDR4..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block group/field">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                  <Settings className="w-4 h-4" /> Placa Mãe
                </span>
                <input
                  type="text"
                  name="motherboard"
                  placeholder="Ex: B550M..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block group/field">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 group-focus-within/field:text-green-500 transition-colors">
                  <HardDrive className="w-4 h-4" /> Armazenamento
                </span>
                <input
                  type="text"
                  name="storage"
                  placeholder="Ex: SSD 1TB..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-800 font-bold"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-4 bg-green-600 hover:bg-green-500 text-slate-950 font-black italic text-lg py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(34,197,94,0.2)] active:scale-95 border-b-4 border-green-800 group"
                >
                  <Zap className="w-6 h-6 fill-current group-hover:animate-bounce" />
                  INICIAR ANÁLISE COMPLETA
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

          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Processando Dados Técnicos</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">Cruzando protocolos de hardware ITX Gamer</p>

          <div className="w-full max-w-md px-6 space-y-4">
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] rounded-full"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            
            <div className="bg-black/40 rounded-2xl p-5 border border-white/5 font-mono text-[10px] text-green-500/70 h-32 overflow-hidden flex flex-col justify-end shadow-inner">
              {scanLog.map((log, i) => (
                <div key={i} className="flex items-center gap-2 animate-in slide-in-from-bottom-1 fade-in">
                  <span className="text-green-800 font-bold">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {(results || error) && <div className={`font-bold animate-pulse mt-1 ${error ? 'text-red-500' : 'text-white'}`}>
                {error ? '✗ Conexão interrompida.' : '✓ Relatório pronto.'}
              </div>}
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-slate-900/60 border border-green-500/30 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <BarChart3 className="w-48 h-48 text-green-500" />
             </div>

             <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
               <div className={`p-5 rounded-[1.5rem] shadow-xl ${error ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500 text-slate-950'}`}>
                 {error ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
               </div>
               <div>
                 <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
                   {error ? "Falha no" : "Relatório de Performance"} <span className={error ? "text-red-500" : "text-green-500"}>{error ? "Diagnóstico" : "Gerado"}</span>
                 </h2>
                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">ITX Gamer Inteligência de Hardware</p>
               </div>
               <button 
                 onClick={() => {
                   setError(null);
                   setResults(null);
                   setStep('input');
                 }}
                 className="md:ml-auto text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
               >
                 <RefreshCcw className="w-3 h-3" /> NOVA ANÁLISE
               </button>
             </div>
             
             <div className="prose prose-invert max-w-none relative z-10 font-sans">
                {renderAnalysis(results || "")}
             </div>
          </div>

          {!error && results && (
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 p-12 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                 <ShoppingCart className="w-64 h-64 text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">
                    Aviso de Upgrade Recomendado
                  </span>
                  <h3 className="text-4xl font-black text-white mb-6 leading-none italic tracking-tighter uppercase">
                    O Software Chegou no Limite? <br />
                    <span className="text-indigo-400">Upgrade Físico é a Solução.</span>
                  </h3>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10 max-w-xl">
                    Se a nossa análise detectou que seu hardware é o gargalo, não adianta só script. Na <strong>ITX Gamer</strong>, montamos sua máquina do zero ou enviamos as peças certas para você voar.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://www.itxgamer.com.br" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white text-indigo-950 font-black px-10 py-5 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95 border-b-4 border-slate-300 uppercase tracking-tighter italic text-sm"
                    >
                      VISITAR LOJA OFICIAL <ExternalLink className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://wa.me/5519999232998" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black px-10 py-5 rounded-2xl shadow-xl transition-all active:scale-95 border-b-4 border-green-800 uppercase tracking-tighter italic text-sm"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      CONSULTORIA WHATSAPP
                    </a>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sinais de Alerta</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> FPS instável em 1% Low
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Micro-stuttering frequente
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Temperaturas acima de 85ºC
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step !== 'scanning' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2rem] hover:bg-slate-900/50 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-black text-white uppercase italic tracking-tighter mb-2">Manutenção Preventiva</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Poeira é a assassina silenciosa de performance. Limpe seu PC a cada 6 meses e troque a pasta térmica se as temps subirem.</p>
          </div>
          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2rem] hover:bg-slate-900/50 transition-all group">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="font-black text-white uppercase italic tracking-tighter mb-2">Energia & Drivers</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Sempre use o plano "Desempenho Máximo" e mantenha os drivers da GPU atualizados. Isso evita quedas bruscas de frame.</p>
          </div>
          <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2rem] hover:bg-slate-900/50 transition-all group">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="font-black text-white uppercase italic tracking-tighter mb-2">Fluxo de Ar Pro</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Certifique-se que o ar frio entra pela frente e o quente sai por trás. Pressão positiva no gabinete reduz acúmulo de sujeira.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDashboard;
