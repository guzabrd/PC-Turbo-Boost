
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check, Terminal, AlertCircle } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'E aí, gamer! Meu nome é Gustavo e faço parte do time de IA da ITXGAMER do PC Turbo Boost. Tá sentindo o PC lento ou o FPS caindo no meio da gameplay? Me conta o que tá rolando que eu te ajudo a deixar sua máquina insana sem gastar um tostão!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    // Adiciona a mensagem do usuário na tela
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Prepara o histórico CORRETO (alternando User e Model)
    // Ignoramos a primeira mensagem do Gustavo (intro) para começar o histórico com o User
    // e garantimos que não enviamos a mensagem que acabamos de digitar no histórico, 
    // pois ela vai como 'prompt' principal.
    const apiHistory = messages
      .slice(1) // Pula a saudação inicial
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
      setError("Conexão interrompida. Tente enviar novamente.");
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
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{lang || 'Terminal'}</span>
              </div>
              <button 
                onClick={() => copyToClipboard(code, `${msgId}-${index}`)}
                className="p-1 hover:bg-slate-800 rounded transition-colors"
              >
                {copiedId === `${msgId}-${index}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto mono text-xs text-green-500 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap leading-relaxed">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
            <Bot className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Assistente Técnico</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-slate-400 text-xs">Gustavo está online</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`
                p-4 rounded-2xl text-sm shadow-2xl
                ${msg.role === 'user' 
                  ? 'bg-blue-600/10 text-slate-100 rounded-tr-none border border-blue-500/20' 
                  : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'}
              `}>
                {renderContent(msg.content, msg.id)}
                <div className="mt-2 text-[9px] opacity-30 text-right uppercase font-bold tracking-tighter">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Analisando hardware...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-green-500/30 transition-all shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Descreva o problema do seu PC..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none p-3 h-20 text-slate-200 placeholder:text-slate-600"
          />
          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-[10px] text-slate-600 font-mono">Pressione Enter para enviar</p>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                p-2 rounded-xl transition-all
                ${!input.trim() || isTyping 
                  ? 'text-slate-700 bg-slate-800 cursor-not-allowed' 
                  : 'text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/40'}
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
