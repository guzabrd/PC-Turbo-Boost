
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check, Terminal } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { Message, Optimization } from '../types';

interface ChatAssistantProps {
  onApplyOptimization: (opt: Optimization) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onApplyOptimization }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'E aí, gamer! Eu sou a IA do PC Turbo Boost. Tá sentindo o PC lento ou o FPS caindo no meio da gameplay? Me conta o que tá rolando que eu te ajudo a deixar sua máquina insana sem gastar um tostão!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const responseText = await chatWithAI(input, history);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown-ish code block extractor
  const renderContent = (content: string, msgId: string) => {
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const langMatch = part.match(/^\w+/);
        const lang = langMatch ? langMatch[0] : '';
        const code = part.replace(/^\w+\s*/, '');
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{lang || 'Script'}</span>
              </div>
              <button 
                onClick={() => copyToClipboard(code, `${msgId}-${index}`)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedId === `${msgId}-${index}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto mono text-sm text-green-400">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap leading-relaxed">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <header className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
          <Bot className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Assistente Técnico AI</h1>
          <p className="text-slate-400 text-sm">Otimização personalizada e suporte em tempo real.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`
                p-4 rounded-2xl shadow-sm text-sm
                ${msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
                  : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'}
              `}>
                {renderContent(msg.content, msg.id)}
                <div className="mt-2 text-[10px] opacity-40 uppercase tracking-tighter">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Analizando cenário para o boost...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative mt-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-green-500/50 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ex: 'Meu CS tá com FPS baixo' ou 'Meu PC tá demorando pra ligar'..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none p-3 h-20 placeholder:text-slate-600"
          />
          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded">Markdown Support</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded">Shift+Enter for newline</span>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                p-2 rounded-xl transition-all
                ${!input.trim() || isTyping 
                  ? 'text-slate-600 bg-slate-800 cursor-not-allowed' 
                  : 'text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20'}
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
