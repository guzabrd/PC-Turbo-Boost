
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Calendar, User, Zap, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { mockService } from '../services/mockService';
import { Subscription, Customer, Plan } from '../types';

const SubscriptionsView: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ customerId: '', planId: '' });

  const load = async () => {
    setLoading(true);
    const [s, c, p] = await Promise.all([
      mockService.getSubscriptions(),
      mockService.getCustomers(),
      mockService.getPlans()
    ]);
    setSubs(s);
    setCustomers(c.filter(cust => cust.status === 'active'));
    setPlans(p.filter(plan => plan.active));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRegisterPayment = async (sub: Subscription) => {
    const plan = plans.find(p => p.id === sub.planId);
    if (!plan) return;
    if (confirm(`Confirmar recebimento de R$ ${plan.price.toFixed(2)}?`)) {
      setLoading(true);
      await mockService.createPayment(sub.id, plan.price);
      load();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.customerId || !newSub.planId) return;
    await mockService.createSubscription({
      customerId: newSub.customerId,
      planId: newSub.planId,
      startDate: new Date().toISOString().split('T')[0],
      nextRenewal: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    });
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Fluxo de <span className="text-green-500">Recorrência</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-green-600 text-slate-950 font-black italic px-6 py-3 rounded-2xl shadow-xl">
          <Plus className="w-5 h-5" /> Nova Assinatura
        </button>
      </div>

      <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">ID / Cliente</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Plano Ativo</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Próximo Ciclo</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></td></tr>
            ) : subs.map(sub => {
              const customer = customers.find(c => c.id === sub.customerId);
              const plan = plans.find(p => p.id === sub.planId);
              return (
                <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-500">#{sub.id.slice(-4)}</div>
                      <span className="font-bold text-slate-200">{customer?.name || '---'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-300 uppercase">{plan?.name}</span>
                      <span className="text-[10px] font-bold text-green-500">R$ {plan?.price.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Calendar className="w-3 h-3" /> {sub.nextRenewal}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit 
                      ${sub.status === 'active' ? 'bg-green-500/10 text-green-400' : 
                        sub.status === 'overdue' ? 'bg-red-500/10 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                      {sub.status === 'active' ? 'Ativa' : sub.status === 'overdue' ? 'Vencida' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleRegisterPayment(sub)}
                      className="px-4 py-2 bg-slate-950 border border-white/5 hover:bg-green-500 hover:text-slate-950 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                    >
                      Pagar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase text-white mb-8">Vincular <span className="text-green-500">Assinatura</span></h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Selecionar Cliente</span>
                <select className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-slate-300 outline-none" onChange={e => setNewSub({...newSub, customerId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Escolher Plano</span>
                <select className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm text-slate-300 outline-none" onChange={e => setNewSub({...newSub, planId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {plans.map(p => <option key={p.id} value={p.id}>{p.name} (R$ {p.price.toFixed(2)})</option>)}
                </select>
              </label>
              <button className="w-full bg-green-600 text-slate-950 font-black italic py-5 rounded-2xl uppercase tracking-tighter">Ativar Ciclo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsView;
