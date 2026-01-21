
import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Layout, 
  Monitor, 
  ShieldAlert, 
  ShoppingCart, 
  MessageSquare, 
  Wrench, 
  RefreshCcw, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  Settings,
  Zap,
  MessageCircle
} from 'lucide-react';
import { analyzeHardware } from '../services/geminiService';
import { DiagnosticData } from '../types';

interface DiagnosticDashboardProps {
  onComplete?: (data: DiagnosticData | null) => void;
}

const DiagnosticDashboard: React.FC<DiagnosticDashboardProps> = ({ onComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [specs, setSpecs] = useState({
    case: '',
    cpu: '',
    gpu: '',
    motherboard: '',
    ram: '',
    storage: '',
    psu: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResults(null);
    
    const analysis = await analyzeHardware(specs);
    setResults(analysis);
    setIsAnalyzing(false);
  };

  const renderAnalysis = (content: string) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2 text-slate-300 leading-relaxed text-sm">
        {line}
      </p>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Diagnóstico de Hardware Pro
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Identifique gargalos e receba um plano de ação personalizado para sua máquina.
        </p>
      </header>

      {!results && !isAnalyzing ? (
        <form onSubmit={handleAnalyze} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4" /> Gabinete
                </span>
                <input
                  type="text"
                  name="case"
                  placeholder="Ex: Corsair 4000D, NZXT H510..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4" /> Processador (CPU)
                </span>
                <input
                  type="text"
                  name="cpu"
                  placeholder="Ex: Ryzen 5 5600X, Intel i7-12700K..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4" /> Placa de Vídeo (GPU)
                </span>
                <input
                  type="text"
                  name="gpu"
                  placeholder="Ex: RTX 3060, RX 6600 XT..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <RefreshCcw className="w-4 h-4" /> Memória RAM
                </span>
                <input
                  type="text"
                  name="ram"
                  placeholder="Ex: 16GB (2x8) DDR4 3200MHz..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4" /> Placa Mãe
                </span>
                <input
                  type="text"
                  name="motherboard"
                  placeholder="Ex: ASUS B550M-Plus, Gigabyte Z690..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4" /> Armazenamento
                </span>
                <input
                  type="text"
                  name="storage"
                  placeholder="Ex: SSD NVMe 1TB, HD 2TB..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" /> Fonte (PSU)
                </span>
                <input
                  type="text"
                  name="psu"
                  placeholder="Ex: Corsair 650W 80 Plus Bronze..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all placeholder:text-slate-700"
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] group"
                >
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  ANALISAR MEU SETUP
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-slate-800 rounded-3xl border-dashed">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-slate-200">Consultando a Central Turbo...</h3>
          <p className="text-slate-500 text-sm mt-2">Nossa IA está cruzando dados de hardware para você.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
               <div className="p-3 bg-green-500/10 rounded-2xl">
                 <CheckCircle2 className="w-6 h-6 text-green-400" />
               </div>
               <div>
                 <h2 className="text-xl font-bold">Relatório de Otimização Gerado</h2>
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Baseado no seu hardware específico</p>
               </div>
               <button 
                 onClick={() => setResults(null)}
                 className="ml-auto text-slate-500 hover:text-slate-300 text-xs font-bold flex items-center gap-1"
               >
                 <RefreshCcw className="w-3 h-3" /> NOVO TESTE
               </button>
             </div>
             
             <div className="prose prose-invert max-w-none">
                {results && renderAnalysis(results)}
             </div>
          </div>

          {/* Banner Parceiro ITX Gamer Refinado */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShoppingCart className="w-48 h-48 text-white" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                Consultoria Especializada
              </span>
              <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                Sentiu que é hora de um <span className="text-indigo-400 italic underline decoration-indigo-500/50">Upgrade Insano?</span>
              </h3>
              <p className="text-indigo-100/60 mb-8 text-lg leading-relaxed">
                Na <strong>ITX Gamer</strong>, você encontra as melhores peças do mercado e pode falar diretamente com especialistas para montar o setup perfeito para o seu bolso.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.itxgamer.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-indigo-950 font-black px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95 border-b-4 border-indigo-200"
                >
                  VISITAR ITX GAMER <ExternalLink className="w-4 h-4" />
                </a>
                
                {/* Botão de WhatsApp Atualizado */}
                <a 
                  href="https://wa.me/5519999232998" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95 border-b-4 border-green-800"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  FALAR NO WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dicas de Manutenção Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/50 transition-colors">
          <Wrench className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="font-bold text-slate-100 mb-2">Limpeza Física</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Poeira nos fans e dissipadores é o inimigo nº 1 do FPS. Limpe seu PC a cada 6 meses para evitar thermal throttling.</p>
        </div>
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/50 transition-colors">
          <Sparkles className="w-8 h-8 text-green-400 mb-4" />
          <h4 className="font-bold text-slate-100 mb-2">Pasta Térmica</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Se sua CPU está passando de 80ºC em jogos, pode ser hora de trocar a pasta térmica por uma de alta performance.</p>
        </div>
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/50 transition-colors">
          <ShieldAlert className="w-8 h-8 text-orange-400 mb-4" />
          <h4 className="font-bold text-slate-100 mb-2">Fluxo de Ar</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Garanta que o ar frio entra pela frente/baixo e o ar quente sai por trás/cima. Pressão positiva evita poeira.</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticDashboard;
