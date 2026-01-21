
import React, { useState } from 'react';
import { 
  Zap, 
  Terminal, 
  MessageSquare, 
  Activity, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { View, Message, Optimization, DiagnosticData } from './types';
import ChatAssistant from './components/ChatAssistant';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import ScriptsLibrary from './components/ScriptsLibrary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);

  const navItems = [
    { id: View.CHAT, label: 'Assistente Turbo', icon: MessageSquare },
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

          <div className="p-4 mt-auto">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Status do Sistema</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Seu PC está protegido e pronto para ganhar mais FPS.</p>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[85%] animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {currentView === View.CHAT && (
              <ChatAssistant />
            )}
            {currentView === View.DIAGNOSTIC && (
              <DiagnosticDashboard onComplete={setDiagnostic} />
            )}
            {currentView === View.SCRIPTS && (
              <ScriptsLibrary />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
