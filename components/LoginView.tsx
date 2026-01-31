
import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-green-500 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-6">
              <Zap className="w-10 h-10 text-slate-950 fill-current" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              PC TURBO <span className="text-green-500">BOOST</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Acesso Administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Identificação (Email)</span>
                <input 
                  type="email" 
                  required
                  placeholder="admin@pcturbo.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-700"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Chave de Acesso</span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder:text-slate-700"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </label>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-slate-950 font-black italic py-5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>ACESSAR TERMINAL <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-600 pt-4">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Criptografia End-to-End Ativa</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
