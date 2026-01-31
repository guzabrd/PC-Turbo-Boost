
import React, { useState, useEffect } from 'react';
import { Plus, Settings, DollarSign, Loader2, Sparkles } from 'lucide-react';
import { mockService } from '../services/mockService';
import { Plan } from '../types';

const PlansView: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: 0, active: true });

  const load = async () => {
    setLoading(true);
    const data = await mockService.getPlans();
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockService.createPlan(newPlan);
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Modelos de <span className="text-green-500">Planos</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-green-600 text-slate-950 font-black italic px-6 py-3 rounded-2xl transition-all shadow-xl uppercase tracking-tighter">
          <Plus className="w-5 h-5" /> Criar Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-green-500" /></div>
        ) : plans.map(p => (
          <div key={p.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-green-500/30 transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${p.active ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                {p.active ? 'Ativo' : 'Desativado'}
              </span>
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-2">{p.name}</h3>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-slate-500 text-xs font-bold uppercase pb-1">R$</span>
              <span className="text-4xl font-black text-white italic tracking-tighter">{p.price.toFixed(2)}</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase pb-1">/mês</span>
            </div>
            <button className="w-full py-4 rounded-xl border border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">Editar Configuração</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase text-white mb-8">Novo <span className="text-green-500">Plano</span></h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Título do Plano</span>
                <input required className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm" onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Valor Mensal (R$)</span>
                <input required type="number" step="0.01" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm" onChange={e => setNewPlan({...newPlan, price: parseFloat(e.target.value)})} />
              </label>
              <button className="w-full bg-green-600 text-slate-950 font-black italic py-5 rounded-2xl uppercase tracking-tighter">Gerar Plano</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansView;
