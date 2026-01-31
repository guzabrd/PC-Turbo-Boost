
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Filter, 
  MoreVertical, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { mockService } from '../services/mockService';
import { Customer } from '../types';

const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', status: 'active' as const });

  const load = async () => {
    setLoading(true);
    const data = await mockService.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockService.createCustomer(newCustomer);
    setIsModalOpen(false);
    setNewCustomer({ name: '', email: '', status: 'active' });
    load();
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Base de <span className="text-green-500">Usuários</span></h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-slate-950 font-black italic px-6 py-3 rounded-2xl transition-all shadow-xl uppercase tracking-tighter"
        >
          <Plus className="w-5 h-5" /> Adicionar Cliente
        </button>
      </div>

      <div className="relative group max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-green-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Filtrar por nome ou email..."
          className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-sm outline-none focus:ring-2 focus:ring-green-500/20"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Nome do Cliente</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-200">{c.name}</td>
                <td className="px-8 py-6 text-slate-400 font-medium">{c.email}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                    {c.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {c.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button 
                      onClick={() => { if(confirm('Excluir cliente?')) { mockService.deleteCustomer(c.id); load(); } }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    ><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase text-white mb-8">Novo <span className="text-green-500">Cadastro</span></h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Nome Completo</span>
                <input required className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm" onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Endereço de Email</span>
                <input required type="email" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm" onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </label>
              <button className="w-full bg-green-600 text-slate-950 font-black italic py-5 rounded-2xl uppercase tracking-tighter">Confirmar Registro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersView;
