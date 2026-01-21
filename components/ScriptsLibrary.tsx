
import React, { useState } from 'react';
import { Terminal, Shield, Zap, Trash2, Cpu, Copy, Check, PlayCircle, Globe, Settings } from 'lucide-react';

interface ScriptItem {
  id: string;
  title: string;
  description: string;
  code: string;
  type: 'PowerShell' | 'CMD';
  category: 'cleaning' | 'gaming' | 'system' | 'network';
  impact: 'Baixo' | 'Médio' | 'Alto';
}

const SCRIPTS: ScriptItem[] = [
  {
    id: 's1',
    title: 'Limpeza de Arquivos Temporários',
    description: 'Remove arquivos lixo do Windows que ocupam espaço e deixam o sistema lento.',
    type: 'CMD',
    category: 'cleaning',
    impact: 'Médio',
    code: 'del /s /f /q %temp%\\*.* & rd /s /q %temp% & del /s /f /q C:\\Windows\\temp\\*.* & rd /s /q C:\\Windows\\temp & del /s /f /q C:\\Windows\\Prefetch\\*.*'
  },
  {
    id: 's2',
    title: 'Melhorar Conexão e Ping',
    description: 'Limpa a memória da internet e restaura as configurações para jogos online.',
    type: 'CMD',
    category: 'network',
    impact: 'Baixo',
    code: 'ipconfig /flushdns & ipconfig /registerdns & ipconfig /release & ipconfig /renew & netsh winsock reset'
  },
  {
    id: 's3',
    title: 'Liberar Memória RAM Máxima',
    description: 'Fecha processos desnecessários para sobrar mais memória para seus jogos.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'Alto',
    code: 'Get-Process | Where-Object { $_.MainWindowTitle -eq "" -and $_.ProcessName -notmatch "explorer|system|idle|svchost|wininit" } | Stop-Process -Force'
  },
  {
    id: 's4',
    title: 'Reparar Erros do Windows',
    description: 'Verifica e corrige arquivos do sistema que podem estar corrompidos.',
    type: 'CMD',
    category: 'system',
    impact: 'Médio',
    code: 'sfc /scannow'
  },
  {
    id: 's9',
    title: 'Otimizar Inicialização',
    description: 'Acelera o tempo de ligar do computador ao desativar tarefas e serviços que rodam escondidos logo no início, reduzindo o uso de CPU e memória RAM no boot.',
    type: 'PowerShell',
    category: 'system',
    impact: 'Alto',
    code: 'Get-ScheduledTask | Where-Object {$_.TaskName -match "Telemetry" -or $_.TaskName -match "Experience"} | Disable-ScheduledTask; Stop-Service -Name "SysMain" -Force; Set-Service -Name "SysMain" -StartupType Disabled'
  },
  {
    id: 's5',
    title: 'Desativar Coleta de Dados',
    description: 'Bloqueia serviços que ficam vigiando o uso do PC em segundo plano.',
    type: 'PowerShell',
    category: 'system',
    impact: 'Médio',
    code: 'Stop-Service -Name DiagTrack, dmwappushservice; Set-Service -Name DiagTrack, dmwappushservice -StartupType Disabled'
  },
  {
    id: 's6',
    title: 'Plano de Energia Turbo',
    description: 'Ativa o modo de energia escondido do Windows para desempenho total.',
    type: 'CMD',
    category: 'gaming',
    impact: 'Alto',
    code: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
  },
  {
    id: 's7',
    title: 'Reduzir Atraso do Mouse',
    description: 'Ajusta a resposta do sistema para que seus cliques sejam mais rápidos.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'Baixo',
    code: 'New-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 0xffffffff -PropertyType DWord -Force'
  },
  {
    id: 's8',
    title: 'Limpar Cache de Gráficos',
    description: 'Remove dados antigos da placa de vídeo para evitar travamentos em jogos.',
    type: 'CMD',
    category: 'cleaning',
    impact: 'Médio',
    code: 'del /q /s /f "%LocalAppData%\\NVIDIA\\DXCache\\*.*" & del /q /s /f "%LocalAppData%\\AMD\\DxCache\\*.*"'
  }
];

const ScriptsLibrary: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (script: ScriptItem) => {
    navigator.clipboard.writeText(script.code);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Scripts de Aceleração</h1>
        <p className="text-slate-400 text-sm">Biblioteca de comandos rápidos para otimizar seu PC manualmente.</p>
      </header>

      {/* Banner de Destaque Refinado */}
      <div className="bg-yellow-600/5 border border-yellow-500/20 rounded-2xl p-4 md:p-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl self-start">
            <Shield className="w-6 h-6 text-yellow-500/80" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-yellow-100 text-sm md:text-base mb-1.5 leading-tight">
              Seu PC Ainda Tem Muito Poder Oculto: Desbloqueie o Potencial Máximo da Sua Máquina Sem Gastar 1 Centavo em Hardware.
            </h4>
            <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-[11px] md:text-xs font-bold text-yellow-400 uppercase tracking-tight">
                IMPORTANTE: Ao copiar, abra o <span className="underline">PowerShell</span> ou <span className="underline">CMD</span> como ADMINISTRADOR antes de colar o código.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SCRIPTS.map((script) => (
          <div key={script.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col hover:border-green-500/30 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${
                script.category === 'cleaning' ? 'bg-blue-500/10 text-blue-400' :
                script.category === 'gaming' ? 'bg-green-500/10 text-green-400' :
                script.category === 'network' ? 'bg-orange-500/10 text-orange-400' :
                'bg-purple-500/10 text-purple-400'
              }`}>
                {script.category === 'cleaning' ? <Trash2 className="w-6 h-6" /> :
                 script.category === 'gaming' ? <Zap className="w-6 h-6" /> :
                 script.category === 'network' ? <Globe className="w-6 h-6" /> :
                 <Settings className="w-6 h-6" />}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest block mb-1 ${
                  script.impact === 'Alto' ? 'bg-red-500/10 text-red-400' :
                  script.impact === 'Médio' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  Ganho: {script.impact}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{script.type}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2 text-slate-100">{script.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1">{script.description}</p>

            <div className="space-y-3">
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mono text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                {script.code}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCopy(script)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all border border-slate-700 hover:border-slate-600"
                >
                  {copiedId === script.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === script.id ? 'COPIADO!' : 'COPIAR SCRIPT'}
                </button>
                <button className="p-3 bg-green-600/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all flex items-center justify-center">
                  <PlayCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 text-center mt-8 space-y-2">
        <p className="text-slate-300 text-sm font-bold">
          As Lojas de Informática Querem Que Você Compre Outro PC. Nós Queremos Que Você Use o Máximo do Seu.
        </p>
        <p className="text-slate-500 text-xs italic">
          Novos scripts são adicionados semanalmente pela nossa equipe técnica.
        </p>
      </div>
    </div>
  );
};

export default ScriptsLibrary;
