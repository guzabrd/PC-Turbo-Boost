
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Terminal, AlertCircle, Cpu, Zap, RefreshCw, ShieldAlert } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'E aí, gamer! Sou o seu Assistente Técnico especializado em performance. Tá sentindo o PC lento ou o FPS caindo no meio da gameplay? Me conta o que tá rolando que eu te ajudo a deixar sua máquina insana com otimizações profissionais de software!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorType, setErrorType] = useState<'AUTH' | 'GENERIC' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    setErrorType(null);
    const userPrompt = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const apiHistory = messages
      .slice(1) 
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

    try {
      const responseText = await chatWithAI(userPrompt, apiHistory);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      if (err.message === 'AUTH_FAILED') {
        setErrorType('AUTH');
      } else {
        setErrorType('GENERIC');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (content: string, msgId: string) => {
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const langMatch = part.match(/^\w+/);
        const lang = langMatch ? langMatch[0] : 'powershell';
        const code = part.replace(/^\w+\s*/, '').trim();
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-green-500/30 bg-black/80 group shadow-lg shadow-green-500/5">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{lang}</span>
              </div>
              <button 
                onClick={() => copyToClipboard(code, `${msgId}-${index}`)}
                className="hover:bg-white/10 p-1.5 rounded transition-colors"
              >
                {copiedId === `${msgId}-${index}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto mono text-xs text-green-400/90 leading-relaxed custom-scrollbar">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap mb-2">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <header className="flex items-center justify-between mb-8 p-5 bg-slate-900/60 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Assistente <span className="text-green-500 not-italic">Técnico</span></h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Protocolo ITX Gamer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-full border border-white/5">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Otimização Ativa</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-green-400" />}
              </div>
              <div className={`
                p-5 rounded-3xl text-sm relative overflow-hidden
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/80 backdrop-blur-md text-slate-200 rounded-tl-none border border-white/10'}
              `}>
                {msg.role === 'model' && <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>}
                
                {renderContent(msg.content, msg.id)}
                
                <div className={`mt-3 text-[9px] font-bold uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-white' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />
              <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Processando Dados...</span>
            </div>
          </div>
        )}

        {errorType && (
          <div className="flex flex-col items-center justify-center p-8 bg-red-500/5 border border-red-500/20 rounded-3xl animate-in zoom-in">
            <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-red-400 font-black uppercase tracking-tighter text-lg">Erro de Comunicação</h3>
            <p className="text-slate-400 text-xs text-center mt-2 max-w-xs">
              {errorType === 'AUTH' 
                ? "A API_KEY não foi detectada. Verifique as configurações do projeto."
                : "Houve um erro no servidor. Tente novamente."}
            </p>
            <button 
              onClick={() => setErrorType(null)}
              className="mt-6 px-6 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all border border-red-500/20"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-auto">
        <div className="bg-slate-900/90 border border-white/10 rounded-[2rem] p-3 shadow-2xl focus-within:ring-2 focus-within:ring-green-500/30 transition-all backdrop-blur-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Descreva o problema ou peça uma dica técnica..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none p-4 h-24 text-slate-100 placeholder:text-slate-600 font-medium"
          />
          <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ITX Core v3</span>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs transition-all
                ${!input.trim() || isTyping 
                  ? 'text-slate-600 bg-slate-800' 
                  : 'text-white bg-green-600 hover:bg-green-500 shadow-[0_5px_15px_rgba(22,163,74,0.3)] hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              ENVIAR <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
