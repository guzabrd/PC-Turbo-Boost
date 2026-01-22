
import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Zap, 
  Trash2, 
  Globe, 
  Settings, 
  HardDrive, 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  Search, 
  Layers,
  Activity,
  MousePointer2,
  Lock,
  Wifi
} from 'lucide-react';

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
  // --- ALTO GANHO ---
  {
    id: 's10',
    title: 'Desativar Game Bar e DVR (Xbox)',
    description: 'Remove a sobreposição do Windows que causa stuttering e reduz o uso de CPU em jogos.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'Alto',
    code: 'Get-AppxPackage Microsoft.XboxGamingOverlay | Remove-AppxPackage; reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d 0 /f'
  },
  {
    id: 's13',
    title: 'Desbloquear Desempenho Máximo',
    description: 'Ativa o plano oculto "Ultimate Performance" que remove qualquer limite de energia do hardware.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'Alto',
    code: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
  },
  {
    id: 's9',
    title: 'Desativar Telemetria e SysMain',
    description: 'Desliga serviços que monitoram seu PC e indexam arquivos, liberando muita memória e disco.',
    type: 'PowerShell',
    category: 'system',
    impact: 'Alto',
    code: 'Stop-Service -Name "SysMain" -Force; Set-Service -Name "SysMain" -StartupType Disabled; Get-ScheduledTask | Where-Object {$_.TaskName -match "Telemetry"} | Disable-ScheduledTask'
  },
  {
    id: 's11',
    title: 'Limpar Cache de Windows Update',
    description: 'Exclui arquivos residuais de atualizações passadas que travam o serviço de busca.',
    type: 'CMD',
    category: 'cleaning',
    impact: 'Alto',
    code: 'net stop wuauserv & net stop bits & del /f /s /q %windir%\\SoftwareDistribution\\*.* & net start wuauserv & net start bits'
  },
  {
    id: 's3',
    title: 'Purge Total de Memória RAM',
    description: 'Força o Windows a liberar a memória "standby" ocupada por processos fantasmas.',
    type: 'PowerShell',
    category: 'gaming',
    impact: 'Alto',
    code: 'Get-Process | Where-Object { $_.MainWindowTitle -eq "" -and $_.ProcessName -notmatch "explorer|system|idle|svchost|wininit" } | Stop-Process -Force'
  },

  // --- MÉDIO GANHO ---
  {
    id: 's1',
    title: 'Limpeza de Temporários Profunda',
    description: 'Remove arquivos lixo do sistema, prefetch e logs antigos de erro.',
    type: 'CMD',
    category: 'cleaning',
    impact: 'Médio',
    code: 'del /s /f /q %temp%\\*.* & rd /s /q %temp% & del /s /f /q C:\\Windows\\temp\\*.* & rd /s /q C:\\Windows\\temp & del /s /f /q C:\\Windows\\Prefetch\\*.*'
  },
  {
    id: 's4',
    title: 'Reparo Integridade do Sistema',
    description: 'Verifica se há arquivos do Windows corrompidos e os restaura automaticamente.',
    type: 'CMD',
    category: 'system',
    impact: 'Médio',
    code: 'sfc /scannow'
  },
  {
    id: 's12',
    title: 'Desativar Hibernação',
    description: 'Apaga o arquivo "hiberfil.sys" e libera gigabytes de espaço no seu disco principal.',
    type: 'CMD',
    category: 'system',
    impact: 'Médio',
    code: 'powercfg -h off'
  },
  {
    id: 's16',
    title: 'Otimizar GPU Priority',
    description: 'Dá prioridade máxima de processamento para drivers de vídeo em relação a outros serviços.',
    type: 'CMD',
    category: 'gaming',
    impact: 'Médio',
    code: 'reg add "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f'
  },

  // --- BAIXO GANHO ---
  {
    id: 's2',
    title: 'Flush DNS e Reset Winsock',
    description: 'Resolve problemas de conexão lenta e picos de ping limpando a cache de rede.',
    type: 'CMD',
    category: 'network',
    impact: 'Baixo',
    code: 'ipconfig /flushdns & ipconfig /registerdns & ipconfig /release & ipconfig /renew & netsh winsock reset'
  },
  {
    id: 's14',
    title: 'Otimizar TRIM (SSD Only)',
    description: 'Organiza as células do SSD para manter a velocidade de leitura estável.',
    type: 'PowerShell',
    category: 'system',
    impact: 'Baixo',
    code: 'Optimize-Volume -DriveLetter C -ReTrim -Verbose'
  },
  {
    id: 's15',
    title: 'Limpar Tabela ARP',
    description: 'Limpa o mapeamento de endereços físicos da rede para evitar conflitos de IP.',
    type: 'CMD',
    category: 'network',
    impact: 'Baixo',
    code: 'netsh interface ip delete arpcache'
  },
  {
    id: 's17',
    title: 'Desativar Notificações Inúteis',
    description: 'Reduz interrupções visuais e processamento de background de apps nativos.',
    type: 'PowerShell',
    category: 'system',
    impact: 'Baixo',
    code: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f'
  }
];

const ScriptsLibrary: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeShell, setActiveShell] = useState<'ALL' | 'CMD' | 'PowerShell'>('ALL');

  const filteredScripts = useMemo(() => {
    let result = SCRIPTS;
    if (activeShell !== 'ALL') {
      result = result.filter(s => s.type === activeShell);
    }
    const impactOrder = { 'Alto': 0, 'Médio': 1, 'Baixo': 2 };
    return [...result].sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
  }, [activeShell]);

  const handleCopy = (script: ScriptItem) => {
    navigator.clipboard.writeText(script.code);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">Arsenal de <span className="text-green-500">Performance</span></h1>
          <p className="text-slate-400 text-sm font-medium mt-2 max-w-xl leading-relaxed">
            Selecione o script ideal para o seu objetivo. Cada comando foi validado para garantir segurança e ganho real de FPS.
          </p>
        </div>
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {(['ALL', 'CMD', 'PowerShell'] as const).map((shell) => (
            <button
              key={shell}
              onClick={() => setActiveShell(shell)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeShell === shell 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {shell === 'ALL' ? 'Todos' : shell}
            </button>
          ))}
        </div>
      </header>

      {/* Banner de Segurança */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-black text-yellow-100 uppercase italic tracking-tighter text-sm">
              Atenção: Todos os Scripts são para inserir no CMD ou Powershell
            </h4>
            <p className="text-yellow-500/70 text-[11px] font-bold uppercase tracking-wider mt-0.5">
              Certifique-se de abrir o terminal como Administrador antes de colar qualquer código.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScripts.map((script) => (
          <div key={script.id} className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 flex flex-col group relative overflow-hidden hover:border-green-500/40 transition-all hover:translate-y-[-4px] shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              {script.type === 'CMD' ? <Terminal className="w-32 h-32" /> : <Activity className="w-32 h-32" />}
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl shadow-inner ${
                script.category === 'cleaning' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                script.category === 'gaming' ? 'bg-green-500/10 text-green-400 border border-green-500/10' :
                script.category === 'network' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' :
                'bg-purple-500/10 text-purple-400 border border-purple-500/10'
              }`}>
                {script.category === 'cleaning' ? <Trash2 className="w-6 h-6" /> :
                 script.category === 'gaming' ? <Zap className="w-6 h-6" /> :
                 script.category === 'network' ? <Globe className="w-6 h-6" /> :
                 <Settings className="w-6 h-6" />}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border ${
                  script.impact === 'Alto' ? 'bg-red-500 text-white border-red-400 animate-pulse' :
                  script.impact === 'Médio' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/20'
                }`}>
                  Ganho {script.impact}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${script.type === 'CMD' ? 'bg-slate-500' : 'bg-blue-500'}`}></span>
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{script.type}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 text-white italic tracking-tighter uppercase leading-none">{script.title}</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium min-h-[40px]">{script.description}</p>
            </div>

            <div className="mt-auto space-y-4 relative z-10">
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-[10px] text-slate-500 group-hover:text-green-500/60 transition-colors overflow-hidden relative">
                <div className="truncate">{script.code}</div>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-900 to-transparent"></div>
              </div>
              
              <button 
                onClick={() => handleCopy(script)}
                className={`
                  w-full flex items-center justify-center gap-3 font-black py-5 rounded-[1.5rem] transition-all shadow-xl uppercase italic tracking-tighter text-sm
                  ${copiedId === script.id 
                    ? 'bg-green-500 text-slate-950 scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)]' 
                    : 'bg-white text-slate-950 hover:bg-green-400 hover:scale-[1.03] active:scale-95 border-b-4 border-slate-300 hover:border-green-600'}
                `}
              >
                {copiedId === script.id ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" /> SCRIPT COPIADO!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 stroke-[3]" /> COPIAR COMANDO {script.type}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer interativo */}
      <div className="bg-slate-900/20 rounded-[3rem] p-12 border border-dashed border-white/10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group hover:scale-110 transition-transform">
          <Layers className="w-8 h-8 text-slate-600 group-hover:text-green-500 transition-colors" />
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">
          Não encontrou o que precisava?
        </h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] max-w-lg">
          Peça uma análise de hardware customizada ou chame nosso suporte técnico especializado no WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default ScriptsLibrary;
