import React from 'react';
import { MapPin, Mail, Phone, Smartphone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';

const Footer = () => {
  const global = useAdminStore((state) => state.siteContent.global);
  const homeContent = useAdminStore((state) => state.siteContent.home);

  return (
    <footer className="bg-[#0a0c10] text-gray-400 mt-auto relative overflow-hidden">
      {/* Elemento de iluminação vermelho sutil no fundo */}
      <div className="absolute top-0 left-1/4 w-[500px] h-32 bg-accent opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Faixa Superior com Degradê Vivo */}
      <div className="h-1.5 w-full bg-gradient-to-r from-accent via-red-500 to-primary"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Logo e Briefing */}
          <div className="space-y-6 md:col-span-1">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider">
              GCA <br/><span className="text-xl font-light text-accent">Automação</span>
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {homeContent.expertise.text.substring(0, 150)}...
            </p>
          </div>

          {/* Endereço */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <span className="w-8 h-px bg-gray-700"></span> Localização
            </h3>
            <div className="flex gap-4">
              <MapPin className="text-accent flex-shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-400 leading-loose">
                {global.address}<br />
                <span className="text-gray-500 font-mono text-xs mt-1 block">CEP: {global.cep}</span>
              </p>
            </div>
          </div>

          {/* Menus Rápidos (substituindo Vendas complexo por Links rápidos + Contatos diretos) */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <span className="w-8 h-px bg-gray-700"></span> Links Rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Sobre Nós', path: '/sobre-nos' },
                { name: 'Laboratório', path: '/estrutura' },
                { name: 'Serviços', path: '/manutencao-e-automacao-industrial' },
                { name: 'Downloads Técnicos', path: '/download-de-manuais' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
                     <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" /> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatos Modernos */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <span className="w-8 h-px bg-gray-700"></span> Suporte 24h
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 group cursor-pointer bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                <div className="bg-gray-800 p-2 rounded-md group-hover:bg-accent transition-colors">
                  <Phone size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Fixo Industrial</p>
                  <p className="text-sm text-white">{global.phone}</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                <div className="bg-gray-800 p-2 rounded-md group-hover:bg-green-600 transition-colors">
                  <Smartphone size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">WhatsApp / Plantão</p>
                  <p className="text-sm text-white">{global.whatsapp}</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer mt-4">
                <Mail size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-xs text-gray-400 hover:text-white transition-colors">{global.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Final */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} GCA Automação e Eletrônica Industrial.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-600 hover:text-gray-300 cursor-pointer transition-colors">Política de Privacidade</span>
            <span className="text-xs text-gray-600 hover:text-gray-300 cursor-pointer transition-colors">Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
