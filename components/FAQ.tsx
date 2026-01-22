
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck, Zap, Monitor, Cpu, Info, MessageCircle, ExternalLink } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "O que são esses scripts e eles podem danificar meu PC?",
    answer: "Os scripts são comandos nativos do Windows (CMD e PowerShell) que automatizam tarefas de limpeza e configuração. Eles são seguros, pois utilizam ferramentas oficiais do sistema. O time da ITXGAMER validou cada comando para garantir que apenas lixo eletrônico e processos inúteis sejam removidos, sem afetar seus arquivos pessoais ou jogos.",
    icon: ShieldCheck
  },
  {
    question: "Como executo os comandos como Administrador?",
    answer: "Para executar como administrador: Clique no botão Iniciar, digite 'CMD' ou 'PowerShell', clique com o botão direito no ícone que aparecer e selecione 'Executar como administrador'. Isso é fundamental para que o sistema permita alterações de performance em arquivos protegidos.",
    icon: Info
  },
  {
    question: "Qual a diferença entre CMD e PowerShell?",
    answer: "O CMD (Prompt de Comando) é a ferramenta clássica de comandos do Windows para tarefas simples. O PowerShell é uma ferramenta muito mais avançada e moderna, capaz de lidar com automações complexas e gerenciar serviços do sistema de forma profunda. No nosso app, indicamos qual usar em cada script.",
    icon: Cpu
  },
  {
    question: "Por que meu FPS não aumenta mesmo após usar os scripts?",
    answer: "Os scripts eliminam gargalos de software (processos em segundo plano, telemetria, lixo em disco). Se o seu hardware (CPU/GPU) já estiver atingindo 100% de uso por limitações físicas ou altas temperaturas (Thermal Throttling), a otimização de software terá pouco efeito. Nesse caso, um upgrade físico na ITXGAMER é a solução ideal.",
    icon: Zap
  },
  {
    question: "Posso reverter as alterações feitas pelos scripts?",
    answer: "Sim! A maioria dos scripts de limpeza apenas deleta arquivos temporários que seriam criados novamente pelo sistema. Scripts de configurações de rede ou energia podem ser revertidos manualmente voltando para o plano de energia padrão ou usando o comando 'netsh winsock reset' para a rede.",
    icon: Monitor
  },
  {
    question: "O que é 'Thermal Throttling'?",
    answer: "É um mecanismo de defesa do seu hardware: quando o processador ou a placa de vídeo esquentam demais (geralmente acima de 90°C), eles diminuem a própria velocidade para não queimarem. Isso causa quedas bruscas de FPS. Limpeza física e troca de pasta térmica são essenciais nesses casos.",
    icon: Monitor
  },
  {
    question: "A ITXGAMER faz montagem de PCs personalizados?",
    answer: "Com certeza! Somos especialistas em builds de alta performance. Você pode escolher peça por peça ou optar por nossas configurações testadas e aprovadas para cada nível de orçamento, com garantia total e suporte técnico especializado.",
    icon: Info
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
          Dúvidas <span className="text-green-500">Frequentes</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium max-w-2xl leading-relaxed">
          Tudo o que você precisa saber para dominar sua máquina e extrair cada gota de performance. Se sua dúvida não estiver aqui, chame nosso suporte!
        </p>
      </header>

      <div className="space-y-4">
        {FAQ_DATA.map((item, index) => (
          <div 
            key={index}
            className={`
              group border transition-all duration-300 rounded-3xl overflow-hidden
              ${openIndex === index 
                ? 'bg-slate-900/80 border-green-500/30 shadow-[0_10px_30px_rgba(34,197,94,0.1)]' 
                : 'bg-slate-900/30 border-white/5 hover:border-white/10 hover:bg-slate-900/50'}
            `}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  p-3 rounded-2xl transition-all duration-300
                  ${openIndex === index ? 'bg-green-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-white'}
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-black italic uppercase tracking-tighter transition-colors ${openIndex === index ? 'text-white' : 'text-slate-300'}`}>
                  {item.question}
                </h3>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-green-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
            
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="p-6 pt-0 ml-16">
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Contato ITXGAMER */}
      <div className="mt-12 bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-slate-900/60 border border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <HelpCircle className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
              Suporte Técnico ITXGAMER
            </span>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
              Ainda com <span className="text-indigo-400 underline decoration-indigo-500/50 underline-offset-8">Dificuldades?</span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              A ITXGAMER não é apenas uma loja, é o seu parceiro técnico. Nossa equipe de especialistas em hardware está pronta para resolver qualquer problema no seu setup.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://wa.me/551239337524" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95 border-b-4 border-green-800"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                FALAR COM TÉCNICO
              </a>
              <a 
                href="https://www.itxgamer.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-indigo-950 font-black px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95 border-b-4 border-slate-300"
              >
                LOJA OFICIAL <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" /> Canais de Atendimento
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase">São José dos Campos</span>
                <span className="text-sm font-black text-white">(12) 3933-7524</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase">Campinas - SP</span>
                <span className="text-sm font-black text-white">(19) 2018-8383</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Instagram</span>
                <span className="text-sm font-black text-indigo-400">@itx_gamer_officer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
