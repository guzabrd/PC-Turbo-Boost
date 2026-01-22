
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Terminal, AlertTriangle, Cpu, Zap } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'SISTEMA INICIALIZADO... [GUSTAVO_AI_v2.5]\n\nFala, gamer! Estou conectado ao banco de dados da ITXGAMER. O que vamos tunar hoje? Manda o setup ou o problema!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

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
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        content: "⚠️ CRITICAL_ERROR: Falha na ponte de comunicação com a IA. Verifique se a API_KEY foi configurada como variável de ambiente na Vercel.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
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
    if (!content) return null;
    
    // Identifica se é uma mensagem de erro
    const isError = content.includes('ERRO_CONFIG') || content.includes('FALHA') || content.includes('CRITICAL_ERROR');

    const parts = content.split('```');
    return (
      <div className={isError ? 'text-red-400 font-bold' : ''}>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const langMatch = part.match(/^\w+/);
            const lang = langMatch ? langMatch[0] : '';
            const code = part.replace(/^\w+\s*/, '').trim();
            
            return (
              <div key={index} className="my-4 rounded-lg overflow-hidden border border-green-500/20 bg-black/60 group shadow-2xl">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-green-400" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{lang || 'Script'}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(code, `${msgId}-${index}`)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedId === `${msgId}-${index}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto mono text-xs text-green-400/80 leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }
          return <p key={index} className="whitespace-pre-wrap leading-relaxed mb-2">{part}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] relative">
      {/* HUD de Status */}
      <div className="absolute top-0 right-0 z-20 hidden lg:flex flex-col gap-2 p-4 text-[10px] font-mono opacity-50">
        <div className="flex items-center gap-2 text-green-500">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          CORE_GUSTAVO: ONLINE
        </div>
        <div className="flex items-center gap-2 text-blue-500">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          ITX_DATABASE: CONNECTED
        </div>
      </div>

      <header className="flex items-center gap-4 mb-6 p-4 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <Zap className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white italic tracking-tighter">GUSTAVO <span className="text-green-500 font-normal not-italic text-sm">Turbo Assistant</span></h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-widest">IA Especialista</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-green-400" />}
              </div>
              <div className={`
                p-4 rounded-2xl text-sm shadow-xl
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/90 backdrop-blur-sm text-slate-200 rounded-tl-none border border-white/10'}
              `}>
                {renderContent(msg.content, msg.id)}
                <div className="mt-2 text-[9px] font-mono opacity-30 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
              <Bot className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-[10px] font-mono text-green-500 uppercase tracking-widest bg-green-500/5 px-3 py-1.5 rounded-full border border-green-500/20">
              Processando Threads de Otimização...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-green-500/50 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ex: 'Meu PC está com stuttering no Warzone, ajuda!'"
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none p-4 h-24 text-slate-200 placeholder:text-slate-600 font-mono"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <Terminal className="w-3 h-3" />
              <span>Shift+Enter para pular linha</span>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all
                ${!input.trim() || isTyping 
                  ? 'text-slate-600 bg-slate-800 cursor-not-allowed' 
                  : 'text-white bg-green-600 hover:bg-green-500 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20'}
              `}
            >
              EXECUTAR <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
