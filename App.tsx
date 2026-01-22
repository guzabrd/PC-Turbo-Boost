
import React, { useState } from 'react';
import { 
  Zap, 
  Terminal, 
  HelpCircle, 
  Activity, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Gamepad2,
  Cpu,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { View, DiagnosticData } from './types';
import FAQ from './components/FAQ';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import ScriptsLibrary from './components/ScriptsLibrary';
import GamesLibrary from './components/GamesLibrary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.FAQ);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);

  const navItems = [
    { id: View.FAQ, label: 'Dúvidas Frequentes', icon: HelpCircle },
    { id: View.GAMES, label: 'Central de Jogos', icon: Gamepad2 },
    { id: View.DIAGNOSTIC, label: 'Diagnóstico Inteligente', icon: Activity },
    { id: View.SCRIPTS, label: 'Scripts de Aceleração', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Cabeçalho Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-400 fill-green-400" />
          <span className="font-bold text-xl tracking-tight">PC TURBO <span className="text-green-500">BOOST</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Barra Lateral */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="hidden md:flex items-center gap-2 px-6 py-8">
            <Zap className="w-8 h-8 text-green-400 fill-green-400" />
            <span className="font-extrabold text-2xl tracking-tighter">TURBO <span className="text-green-500">BOOST</span></span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-20 md:mt-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${currentView === item.id 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {currentView === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
          
          <div className="p-6 mt-auto flex flex-col items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Otimização Ativa</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {currentView === View.FAQ && <FAQ />}
            {currentView === View.GAMES && <GamesLibrary />}
            {currentView === View.DIAGNOSTIC && (
              <DiagnosticDashboard onComplete={setDiagnostic} />
            )}
            {currentView === View.SCRIPTS && <ScriptsLibrary />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
