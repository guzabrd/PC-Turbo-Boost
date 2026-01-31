
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Terminal, AlertCircle, Cpu, Zap, RefreshCw, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, 3);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'E aí, gamer! Sou o seu Assistente Técnico especializado em performance. Me conta o que tá rolando que eu te ajudo a deixar sua máquina insana sem gastar nada!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickActions = [
    "Meu PC está travando",
    "Como ganhar FPS no Valorant?",
    "Limpar arquivos inúteis",
    "Otimizar memória RAM"
  ];

  const handleSend = async (customPrompt?: string) => {
    const promptValue = customPrompt || input.trim();
    if (!promptValue || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: promptValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const apiHistory = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));

    try {
      const responseText = await chatWithAI(promptValue, apiHistory);
      if (responseText) {
        const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: new Date() };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err: any) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: 'Ops, tive um problema de conexão com o banco de dados de performance. Pode tentar de novo?', 
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

  const renderContent = (content: string, msgId: string, isLastModel: boolean) => {
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const langMatch = part.match(/^\w+/);
        const lang = langMatch ? langMatch[0] : 'powershell';
        const code = part.replace(/^\w+\s*/, '').trim();
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-green-500/30 bg-black/80 group shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{lang}</span>
              </div>
              <button onClick={() => copyToClipboard(code, `${msgId}-${index}`)} className="hover:bg-white/10 p-1.5 rounded transition-colors">
                {copiedId === `${msgId}-${index}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs text-green-400/90 leading-relaxed"><code>{code}</code></pre>
          </div>
        );
      }
      return <div key={index} className="whitespace-pre-wrap mb-2 leading-relaxed">
        {isLastModel && index === parts.length - 1 ? <TypewriterText text={part} /> : part}
      </div>;
    });
  };

  return (
    <div className="flex flex-col h-full relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden">
      <header className="flex items-center justify-between mb-6 p-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tighter uppercase italic">Turbo <span className="text-green-500">Assistant</span></h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Especialista em Performance</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${msg.role === 'user' ? 'bg-green-600' : 'bg-slate-800 border border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-950" /> : <Bot className="w-4 h-4 text-green-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-green-600/20 border border-green-500/30 text-slate-100' : 'bg-slate-950/50 border border-white/5 text-slate-200'}`}>
                {renderContent(msg.content, msg.id, msg.role === 'model' && idx === messages.length - 1)}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-950/30 p-3 rounded-2xl flex items-center gap-3">
              <RefreshCw className="w-3 h-3 text-green-500 animate-spin" />
              <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Sintonizando Performance...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="space-y-4">
        {!isTyping && messages.length < 3 && (
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, i) => (
              <button key={i} onClick={() => handleSend(action)} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5 text-[10px] font-bold text-slate-400 hover:text-green-400 hover:border-green-500/30 transition-all">
                {action}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ex: Como diminuir o uso de CPU?"
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 pr-16 text-sm resize-none h-20 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-4 bottom-4 p-2 bg-green-600 rounded-xl text-slate-950 hover:bg-green-500 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
