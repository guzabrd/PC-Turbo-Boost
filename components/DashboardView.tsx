
import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserMinus, TrendingUp, 
  ArrowUpRight, Activity, CheckCircle2, Clock
} from 'lucide-react';
import { mockService } from '../services/mockService';
import { DashboardStats, Customer } from '../types';

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, allCust] = await Promise.all([
        mockService.getDashboardStats(),
        mockService.getCustomers()
      ]);
      setStats(s);
      setRecentCustomers(allCust.slice(-5).reverse());
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) return (
    <div className="flex items-center justify-center h-64">
      <Activity className="w-10 h-10 text-green-500 animate-pulse" />
    </div>
  );

  const cards = [
    { label: 'Total de Clientes', val: stats.totalCustomers, icon: Users, color: 'blue', trend: '+12%' },
    { label: 'Usuários Ativos', val: stats.activeCustomers, icon: UserCheck, color: 'green', trend: '+5%' },
    { label: 'Usuários Inativos', val: stats.inactiveCustomers, icon: UserMinus, color: 'slate', trend: '-2%' },
    { label: 'Taxa de Crescimento', val: `${stats.growthRate}%`, icon: TrendingUp, color: 'emerald', trend: '+18%' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900/60 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-slate-950 border border-white/5`}>
                <card.icon className={`w-6 h-6 text-green-400`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500">
                {card.trend} <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">{card.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" /> Cadastros Recentes
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-950 px-3 py-1 rounded-full border border-white/5">Tempo Real</span>
          </div>

          <div className="space-y-4">
            {recentCustomers.length === 0 ? (
              <div className="py-20 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500/20 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhum cliente cadastrado ainda</p>
              </div>
            ) : (
              recentCustomers.map((cust) => (
                <div key={cust.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500">
                      {cust.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{cust.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cust.email}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cust.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                    {cust.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-16 h-16 text-green-500 mb-6 animate-bounce" />
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-4">Crescimento</h3>
          <p className="text-slate-400 text-sm font-medium mb-8">Sua base de usuários cresceu 15% este mês. Continue otimizando!</p>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div className="h-full bg-green-500 rounded-full w-[85%] shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
