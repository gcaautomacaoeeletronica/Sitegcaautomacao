import { MapPin, Mail, Phone, Smartphone, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import EditableText from '../ui/EditableText';

const Footer = () => {
  const global = useAdminStore((state) => state.siteContent.global);
  const homeContent = useAdminStore((state) => state.siteContent.home);

  return (
    <footer className="bg-[#0c0e12] text-gray-400 mt-auto relative overflow-hidden border-t border-white/5">
      {/* Pattern Grid Background */}
      <div className="absolute inset-0 pattern-grid opacity-[0.03] pointer-events-none"></div>
      
      {/* Industrial Glows */}
      <div className="absolute -top-24 -left-20 w-[600px] h-[300px] bg-accent opacity-10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-20 w-[400px] h-[400px] bg-blue-600 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-8 col-span-1 md:col-span-1">
            <Link to="/" className="inline-block group">
              <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-accent transition-colors duration-500">
                GCA <br/><span className="text-xl font-light text-accent/80 group-hover:text-white transition-colors duration-500">Automação</span>
              </h3>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs font-light">
              <EditableText pagina="home" path="expertise.text" tag="span">
                {homeContent?.expertise?.text?.substring(0, 160) || ''}
              </EditableText>...
            </p>

            {/* Social Matrix */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: 'linkedin', url: global?.linkedin, color: 'hover:text-[#0077B5]' },
                { icon: 'instagram', url: global?.instagram, color: 'hover:text-[#E4405F]' },
                { icon: 'facebook', url: global?.facebook, color: 'hover:text-[#1877F2]' }
              ].map((social) => (
                <a 
                  key={social.icon} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-2.5 bg-white/5 rounded-xl border border-white/5 transition-all duration-300 group ${social.color} hover:bg-white/10 hover:-translate-y-1 block`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100">
                    {social.icon === 'linkedin' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></>}
                    {social.icon === 'instagram' && <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>}
                    {social.icon === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase flex items-center gap-3">
              Navegação <span className="h-px flex-grow bg-white/5"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Início', path: '/' },
                { name: 'Sobre a GCA', path: '/sobre-nos' },
                { name: 'Nossa Estrutura', path: '/estrutura' },
                { name: 'Serviços & Reparos', path: '/manutencao-e-automacao-industrial' },
                { name: 'IoT & Telemetria', path: '/iot' },
                { name: 'Manuais Técnicos', path: '/download-de-manuais' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-all duration-300 group">
                     <ChevronRight size={14} className="text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all" /> 
                     <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase flex items-center gap-3">
              Sede Industrial <span className="h-px flex-grow bg-white/5"></span>
            </h4>
            <div className="flex gap-4 group">
              <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                <MapPin className="text-accent" size={18} />
              </div>
              <div className="flex-1 text-sm text-gray-500 leading-relaxed font-light">
                <EditableText pagina="global" path="address" tag="p" className="group-hover:text-gray-300 transition-colors">{global?.address || ''}</EditableText>
                <span className="text-gray-600 font-mono text-[10px] mt-2 block tracking-widest uppercase">
                  CEP <EditableText pagina="global" path="cep" tag="span">{global?.cep || ''}</EditableText> — Americana/SP
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                <Mail className="text-blue-400" size={18} />
              </div>
              <div className="flex-1 text-sm text-gray-500 flex flex-col justify-center">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 font-bold">E-mail Comercial</p>
                <EditableText pagina="global" path="email" tag="span" className="group-hover:text-white transition-colors">{global?.email || ''}</EditableText>
              </div>
            </div>
          </div>

          {/* Support Hotlines Column */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase flex items-center gap-3">
              Plantão 24h <span className="h-px flex-grow bg-white/5"></span>
            </h4>
            <div className="space-y-4">
              <a href={`tel:${global?.phone?.replace(/\D/g, '')}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
                <div className="bg-gray-800 p-2.5 rounded-xl group-hover:bg-accent group-hover:scale-110 transition-all">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Fixo/Reparos</p>
                  <EditableText pagina="global" path="phone" tag="p" className="text-sm text-white font-bold">{global?.phone || ''}</EditableText>
                </div>
              </a>
              
              <a href={`https://wa.me/${global?.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
                <div className="bg-gray-800 p-2.5 rounded-xl group-hover:bg-[#25D366] group-hover:scale-110 transition-all">
                  <Smartphone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">WhatsApp Plantão</p>
                  <EditableText pagina="global" path="whatsapp" tag="p" className="text-sm text-white font-bold">{global?.whatsapp || ''}</EditableText>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Binary/Bottom Line */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 cursor-default">
             <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase mb-1">Security & Data</p>
             <div className="flex gap-3 items-center">
                <ShieldCheck size={14} className="text-green-500/50" />
                <span className="text-[11px] text-gray-600 font-light">SSL Encrypted Site — GCA v2.2</span>
             </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-[11px] text-gray-600 font-medium">
              &copy; {new Date().getFullYear()} GCA Automação e Eletrônica Industrial Americana Ltda.
            </p>
          </div>

          <div className="flex gap-8 items-center">
            <Link to="/admin" className="text-[10px] text-gray-700 hover:text-accent font-black uppercase tracking-[0.2em] transition-all border border-gray-800/50 px-4 py-2 rounded-lg bg-white/[0.02] hover:border-accent/30">
              Admin
            </Link>
            <div className="hidden sm:flex gap-6">
              <Link to="/privacidade" className="text-[11px] text-gray-600 hover:text-white transition-colors">Privacidade</Link>
              <Link to="/termos" className="text-[11px] text-gray-600 hover:text-white transition-colors">Termos</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
