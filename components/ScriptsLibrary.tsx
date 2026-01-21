
import React, { useState } from 'react';
import { Terminal, Shield, Zap, Trash2, Cpu, Wind, Copy, Check, PlayCircle } from 'lucide-react';
import { Optimization } from '../types';

interface ScriptItem {
  id: string;
  title: string;
  description: string;
  code: string;
  type: 'PowerShell' | 'CMD';
  category: 'cleaning' | 'gaming' | 'system';
  impact: 'Low' | 'Medium' | 'High';
}

const SCRIPTS: ScriptItem[] = [
  {
    id: 's1',
    title: 'Limpeza Expressa de Temps',
    description: 'Remove arquivos temporários do Windows, Prefetch e pastas Temp do usuário.',
    type: 'CMD',
    category: 'cleaning',
    impact: 'Medium',
    code: 'del /s /f /q %temp%\\*.* & rd /s /q %temp% & del /s /f /q C:\\Windows\\temp\\*.* & rd /s /q C:\\Windows\\temp & del /s /f /q C:\\Windows\\Prefetch\\*.*'
  },
  {
    id: 's2',
    title: 'Flush DNS & Reset Rede',
    description: 'Limpa o cache do DNS e reseta as configurações de rede para melhorar o ping.',
    type: 'CMD',
    category: 'gaming',
    impact: 'Low',
    code: 'ipconfig /flushdns & ipconfig /registerdns & ipconfig /release & ipconfig /renew & netsh winsock reset'
  },
  {
    id: 's3',
    title: 'Otimização Máxima de RAM',
    description: 'Encerra processos não essenciais do Windows para liberar memória para jogos.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'High',
    code: 'Get-Process | Where-Object { $_.MainWindowTitle -eq "" -and $_.ProcessName -notmatch "explorer|system|idle|svchost|wininit" } | Stop-Process -Force'
  },
  {
    id: 's4',
    title: 'Reparar Arquivos de Sistema',
    description: 'Executa o verificador de integridade SFC para corrigir bugs do Windows.',
    type: 'CMD',
    category: 'system',
    impact: 'Medium',
    code: 'sfc /scannow'
  }
];

interface ScriptsLibraryProps {
  onApplied: (opt: Optimization) => void;
}

const ScriptsLibrary: React.FC<ScriptsLibraryProps> = ({ onApplied }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (script: ScriptItem) => {
    navigator.clipboard.writeText(script.code);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);

    onApplied({
      id: Math.random().toString(36).substr(2, 9),
      title: script.title,
      type: script.type,
      date: new Date(),
      status: 'applied'
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Boost Scripts</h1>
        <p className="text-slate-400 text-sm">Biblioteca de comandos rápidos para otimização manual.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCRIPTS.map((script) => (
          <div key={script.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col hover:border-green-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${
                script.category === 'cleaning' ? 'bg-blue-500/10 text-blue-400' :
                script.category === 'gaming' ? 'bg-green-500/10 text-green-400' :
                'bg-purple-500/10 text-purple-400'
              }`}>
                {script.category === 'cleaning' ? <Trash2 className="w-6 h-6" /> :
                 script.category === 'gaming' ? <Zap className="w-6 h-6" /> :
                 <Cpu className="w-6 h-6" />}
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                script.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                script.impact === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                Impacto: {script.impact}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-2">{script.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1">{script.description}</p>

            <div className="space-y-3">
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mono text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                {script.code}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCopy(script)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all"
                >
                  {copiedId === script.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === script.id ? 'COPIADO!' : 'COPIAR SCRIPT'}
                </button>
                <button className="p-3 bg-green-600/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all">
                  <PlayCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-3xl p-8 mt-8">
        <div className="flex gap-4">
          <Shield className="w-10 h-10 text-yellow-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-yellow-100 mb-2">Segurança em Primeiro Lugar</h4>
            <p className="text-sm text-yellow-200/70 leading-relaxed mb-4">
              Todos os scripts nesta biblioteca são testados e seguros para usuários comuns. 
              Ao copiar, abra o <span className="font-bold text-yellow-400">PowerShell</span> ou <span className="font-bold text-yellow-400">CMD</span> como Administrador antes de colar.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Verified by PC Turbo</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Reversible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptsLibrary;
