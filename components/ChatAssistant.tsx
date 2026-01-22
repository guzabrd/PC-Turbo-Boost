
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Terminal, AlertCircle, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'E aí, gamer! Gustavo na área. 🚀\n\nTá sentindo o PC engasgar ou quer aquele boost extra pra subir de elo? Me conta seu problema ou manda seu setup que eu vou tunar essa máquina agora!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('Analisando hardware...');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efeito de texto de digitação dinâmico
  useEffect(() => {
    if (isTyping) {
      const texts = ["Otimizando threads...", "Limpando cache...", "Calculando FPS...", "Ajustando registros..."];
      let i = 0;
      const interval = setInterval(() => {
        setTypingText(texts[i % texts.length]);
        i++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    setError(null);
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
      setError("O Gustavo perdeu a conexão com o servidor. Verifique a API_KEY na Vercel.");
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
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const langMatch = part.match(/^\w+/);
        const lang = langMatch ? langMatch[0] : '';
        const code = part.replace(/^\w+\s*/, '').trim();
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-green-500/30 bg-black/40 backdrop-blur-md group shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{lang || 'Terminal'}</span>
              </div>
              <button 
                onClick={() => copyToClipboard(code, `${msgId}-${index}`)}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 rounded transition-all text-[10px] font-bold text-slate-400"
              >
                {copiedId === `${msgId}-${index}` ? (
                  <><Check className="w-3 h-3 text-green-500" /> COPIADO</>
                ) : (
                  <><Copy className="w-3 h-3" /> COPIAR</>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto mono text-xs text-green-400/90 leading-relaxed bg-black/20">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap leading-relaxed mb-2">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-140px)]">
      <header className="flex items-center justify-between mb-8 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Gustavo <span className="text-green-500 text-sm font-normal ml-2">AI Assistant</span></h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500" /> Engenheiro ITXGAMER
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-green-400" />}
              </div>
              <div className={`
                p-5 rounded-3xl text-sm shadow-2xl relative
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/80 backdrop-blur-md text-slate-200 rounded-tl-none border border-white/5'}
              `}>
                {renderContent(msg.content, msg.id)}
                <div className={`mt-3 text-[9px] font-bold uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-white' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-4 shadow-xl">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">{typingText}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center animate-in zoom-in duration-300">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 backdrop-blur-md">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative mt-auto">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 focus-within:ring-4 focus-within:ring-green-500/20 transition-all shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Diga qual jogo está travando ou mande seu setup..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none p-4 h-24 text-slate-100 placeholder:text-slate-600 font-medium"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gustavo está pronto</p>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all
                ${!input.trim() || isTyping 
                  ? 'text-slate-600 bg-slate-800 cursor-not-allowed opacity-50' 
                  : 'text-white bg-green-600 hover:bg-green-500 shadow-xl shadow-green-600/20 hover:-translate-y-0.5 active:translate-y-0'}
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
