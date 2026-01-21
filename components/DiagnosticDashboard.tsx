
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Gauge, Cpu, HardDrive, RefreshCcw, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { DiagnosticData } from '../types';

interface DiagnosticDashboardProps {
  onComplete: (data: DiagnosticData) => void;
}

const DiagnosticDashboard: React.FC<DiagnosticDashboardProps> = ({ onComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [mockData, setMockData] = useState<any[]>([]);
  const [results, setResults] = useState<DiagnosticData | null>(null);

  useEffect(() => {
    // Generate some initial random performance data
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        time: i,
        cpu: Math.floor(Math.random() * 30) + 10,
        ram: Math.floor(Math.random() * 20) + 40,
      });
    }
    setMockData(data);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setResults(null);
    
    const steps = [
      'Identificando hardware...',
      'Calculando latência de sistema...',
      'Analisando processos em segundo plano...',
      'Verificando fragmentação de disco...',
      'Testando largura de banda de memória...',
      'Finalizando diagnóstico...'
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScan();
          return 100;
        }
        
        if (prev % 20 === 0 && currentStepIdx < steps.length) {
          setCurrentStep(steps[currentStepIdx]);
          currentStepIdx++;
        }

        // Add some noise to chart data while scanning
        setMockData(prevData => [
          ...prevData.slice(1),
          {
            time: prevData[prevData.length - 1].time + 1,
            cpu: Math.floor(Math.random() * 60) + 20,
            ram: Math.floor(Math.random() * 10) + 60,
          }
        ]);

        return prev + 2;
      });
    }, 100);
  };

  const finishScan = () => {
    const finalData: DiagnosticData = {
      cpuUsage: 45,
      ramUsage: 78,
      diskSpeed: 450, // MB/s
      temp: 62,
      os: 'Windows 11 Home 22H2',
      score: 64
    };
    setResults(finalData);
    setIsScanning(false);
    onComplete(finalData);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Smart Diagnostic</h1>
          <p className="text-slate-400 text-sm">Escaneie seu sistema para encontrar gargalos de performance.</p>
        </div>
        {!isScanning && !results && (
          <button
            onClick={startScan}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            INICIAR SCAN TURBO
          </button>
        )}
        {isScanning && (
          <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <RefreshCcw className="w-5 h-5 text-green-400 animate-spin" />
            <span className="text-sm font-bold text-green-400">ESCANEANDO: {progress}%</span>
          </div>
        )}
      </header>

      {/* Real-time Graph simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-green-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="font-bold text-slate-300 uppercase tracking-widest text-xs">Sistema em Tempo Real</h2>
          </div>
          {isScanning && (
            <span className="text-xs font-mono text-green-400 animate-pulse">{currentStep}</span>
          )}
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis hide dataKey="time" />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#22c55e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                name="Uso de CPU %"
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="ram" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRam)" 
                name="Uso de RAM %"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Score Geral</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-green-400">{results.score}</span>
              <span className="text-slate-500 mb-1">/ 100</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded-lg">
              <AlertTriangle className="w-3 h-3" />
              <span>Otimização recomendada</span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">CPU Temp</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-slate-100">{results.temp}</span>
              <span className="text-slate-500 mb-1">°C</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[62%]"></div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <HardDrive className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Disco</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-slate-100">{results.diskSpeed}</span>
              <span className="text-slate-500 mb-1">MB/s</span>
            </div>
            <p className="mt-4 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">SSD Detectado - Performance OK</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <button 
              onClick={() => window.location.hash = '#chat'}
              className="w-full h-full flex flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-500 rounded-2xl transition-colors p-4 group"
            >
              <CheckCircle2 className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-center leading-tight">SOLUCIONAR COM IA</span>
            </button>
          </div>
        </div>
      )}

      {results && (
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-blue-100 mb-1">Análise da Central de Boost</h3>
              <p className="text-sm text-blue-300/80 leading-relaxed">
                Detectamos que seu uso de RAM está alto ({results.ramUsage}%), provavelmente devido a muitos processos de inicialização. 
                Sua pontuação de {results.score}/100 indica que há espaço para um ganho de pelo menos 15-20% em FPS com ajustes simples.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Limpador de RAM</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Debloat Windows</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">Modo Game</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDashboard;
