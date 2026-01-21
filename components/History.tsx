
import React from 'react';
import { History as HistoryIcon, Terminal, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { Optimization } from '../types';

interface HistoryProps {
  history: Optimization[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Optimization Log</h1>
          <p className="text-slate-400 text-sm">Histórico de todas as melhorias aplicadas no sistema.</p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-400">{history.length} Ações</span>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
            <HistoryIcon className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-400">Nenhum registro encontrado</h3>
          <p className="text-slate-500 max-w-xs mt-2">Comece otimizando seu PC através do chat ou da biblioteca de scripts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.type === 'PowerShell' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                <Terminal className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-100 truncate">{item.title}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase">{item.type}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date.toLocaleDateString('pt-BR')} {item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="w-3 h-3" />
                    Aplicado
                  </div>
                </div>
              </div>

              <div className="hidden md:block text-right">
                <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center text-center">
        <p className="text-slate-500 text-sm mb-4">Mantenha seu histórico limpo para melhores recomendações da IA.</p>
        <button className="text-xs font-bold text-red-500/50 hover:text-red-500 transition-colors">LIMPAR HISTÓRICO</button>
      </div>
    </div>
  );
};

export default History;
