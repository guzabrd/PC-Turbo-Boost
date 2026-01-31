
import React, { useState, useEffect } from 'react';
import { 
  Zap, Users, LayoutDashboard, LogOut, Menu, 
  BotMessageSquare, Terminal, Gamepad2, Activity, HelpCircle
} from 'lucide-react';
import { View } from './types';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import ChatAssistant from './components/ChatAssistant';
import ScriptsLibrary from './components/ScriptsLibrary';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import GamesLibrary from './components/GamesLibrary';
import FAQ from './components/FAQ';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem('pcturbo_session');
    if (session) {
      setIsAuthenticated(true);
      setCurrentView(View.DASHBOARD);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('pcturbo_session', 'true');
    setIsAuthenticated(true);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pcturbo_session');
    setIsAuthenticated(false);
    setCurrentView(View.LOGIN);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const sections = [
    {
      title: 'Gestão Turbo',
      items: [
        { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { id: View.CUSTOMERS, label: 'Clientes', icon: Users },
      ]
    },
    {
      title: 'Arsenal Técnico',
      items: [
        { id: View.AI_ASSISTANT, label: 'Assistente AI', icon: BotMessageSquare },
        { id: View.DIAGNOSTIC, label: 'Diagnóstico', icon: Activity },
        { id: View.SCRIPTS, label: 'Aceleração', icon: Terminal },
        { id: View.GAMES, label: 'Central Jogos', icon: Gamepad2 },
        { id: View.FAQ, label: 'Dúvidas/FAQ', icon: HelpCircle },
      ]
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <DashboardView />;
      case View.CUSTOMERS: return <CustomersView />;
      case View.DIAGNOSTIC: return <DiagnosticDashboard onComplete={() => {}} />;
      case View.SCRIPTS: return <ScriptsLibrary />;
      case View.GAMES: return <GamesLibrary />;
      case View.FAQ: return <FAQ />;
      case View.AI_ASSISTANT: return (
        <div className="h-[calc(100vh-12rem)] min-h-[500px]">
          <ChatAssistant />
        </div>
      );
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-10">
            <div className="p-2 bg-green-500 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Zap className="w-6 h-6 text-slate-950 fill-current" />
            </div>
            <span className="font-black text-xl tracking-tighter italic uppercase">
              TURBO <span className="text-green-500">BOOST</span>
            </span>
          </div>

          <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-[0.2em]">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                        ${currentView === item.id 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-lg' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
                      `}
                    >
                      <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-green-400' : 'text-slate-500'}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          <div className="p-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-black italic uppercase tracking-tight text-white/90">
              Terminal <span className="text-green-500">Operacional</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">IA Conectada</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
