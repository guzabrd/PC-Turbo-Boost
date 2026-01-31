
import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { mockService } from '../services/mockService';
import { Payment, Subscription, Customer } from '../types';

const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [p, s, c] = await Promise.all([
        mockService.getPayments(),
        mockService.getSubscriptions(),
        mockService.getCustomers()
      ]);
      setPayments(p.sort((a,b) => b.paidAt.localeCompare(a.paidAt)));
      setSubs(s);
      setCustomers(c);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Log de <span className="text-green-500">Pagamentos</span></h2>
      
      <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Data / Hora</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Cliente Associado</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Valor Transacionado</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Assinatura ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-500 font-bold uppercase text-xs">Nenhum pagamento registrado ainda</td></tr>
            ) : payments.map(p => {
              const sub = subs.find(s => s.id === p.subscriptionId);
              const customer = customers.find(c => c.id === sub?.customerId);
              return (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Calendar className="w-3 h-3 text-green-500" /> {new Date(p.paidAt).toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-200 uppercase tracking-tighter italic">{customer?.name}</td>
                  <td className="px-8 py-6">
                    <span className="text-green-400 font-black italic">R$ {p.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6 font-mono text-[10px] text-slate-500">#{p.subscriptionId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsView;
