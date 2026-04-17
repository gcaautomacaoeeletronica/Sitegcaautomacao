import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, Cpu } from 'lucide-react';
import { FadeIn } from '../components/ui/AnimWrapper';
import { useAdminStore } from '../store/adminStore';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useAdminStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* Dynamic Backgrounds */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 pattern-grid opacity-5"></div>

      <FadeIn className="w-full max-w-md z-10">
        <div className="glass-dark border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <Cpu className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Painel de Controle</h1>
            <p className="text-gray-400 text-sm">GCA Automação Industrial ERP</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <ShieldAlert size={18} /> Acesso negado. Credenciais inválidas.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="email">Portal ID</label>
              <input
                id="email"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="password">Senha de Segurança</label>
              <input
                id="password"
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(215,25,32,0.3)] hover:shadow-[0_0_30px_rgba(215,25,32,0.5)]"
            >
              Autenticar Acesso <LogIn size={18} />
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-8 font-mono">
            IP Registrado. Ambiente Seguro.
          </p>
        </div>
      </FadeIn>
    </div>
  );
};

export default AdminAuth;
