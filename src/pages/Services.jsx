import React, { useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Zap, ChevronDown, X, Plus, ArrowRight, Cable, Wifi, LayoutGrid, Wrench, CheckCircle, Shield, Clock, Phone } from 'lucide-react';
import { ICON_MAP } from '../lib/icons';
import { Link } from 'react-router-dom';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';

/* ─────────────── ACCORDION ITEM (lógica 100% preservada) ─────────────── */
const AccordionItem = ({ title, items, iconName, path, pagina, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);
  
  const Icon = ICON_MAP[iconName] || ICON_MAP.HelpCircle;

  return (
    <div className={`mb-3 rounded-xl border-2 transition-all duration-300 overflow-hidden relative group ${isOpen ? 'bg-white border-primary/20 shadow-lg' : 'bg-white/80 border-gray-100 hover:border-primary/10 hover:shadow-md'}`}>
      {/* Icon Selector */}
      <IconSelector pagina={pagina} path={`${path}.icon`} currentIcon={iconName} />

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-primary to-primary/70 text-white shadow-md' : 'bg-gradient-to-br from-blue-50 to-slate-100 text-primary'}`}>
            <Icon size={20} />
          </div>
          <EditableText pagina={pagina} path={`${path}.title`} tag="h3" className={`text-lg font-bold tracking-tight text-left transition-colors ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
            {title}
          </EditableText>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-6 pt-0 ml-[60px] border-t border-gray-50">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-8 pt-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start group/item relative">
                 <CheckCircle size={14} className="mt-1 mr-2.5 text-accent flex-shrink-0" />
                 <EditableText pagina={pagina} path={`${path}.items.${idx}`} tag="span" className="text-gray-600 text-sm font-medium leading-relaxed">
                   {item}
                 </EditableText>
                 
                 {isVisualEditorActive && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeItemFromArray(pagina, `${path}.items`, idx); }}
                     className="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                   >
                     <X size={12} />
                   </button>
                 )}
              </li>
            ))}
            
            {/* Add Sub-item Button */}
            {isVisualEditorActive && (
              <li className="flex items-center">
                <button 
                  onClick={() => addItemToArray(pagina, `${path}.items`, 'Novo Item')}
                  className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 transition-colors uppercase tracking-widest"
                >
                  <Plus size={12} /> Adicionar Item
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── PILARES DE ESPECIALIDADE (estático, visual) ─────────────── */
const SPECIALTIES = [
  {
    icon: <Cable size={32} />,
    label: 'Montagens Elétricas',
    desc: 'Projetos e execução de montagens elétricas industriais com padrão de qualidade certificado e segurança NR-10.',
    color: 'from-blue-600 to-blue-800',
    light: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
  },
  {
    icon: <Wifi size={32} />,
    label: 'Controle IoT',
    desc: 'Desenvolvimento de soluções de monitoramento e controle remoto via IoT para máquinas e processos industriais.',
    color: 'from-cyan-500 to-teal-700',
    light: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-100',
  },
  {
    icon: <LayoutGrid size={32} />,
    label: 'Montagem de Painéis',
    desc: 'Montagem e comissionamento de painéis elétricos e de automação — CCM, CCW, painéis de comando e distribuição.',
    color: 'from-slate-600 to-slate-900',
    light: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-100',
  },
  {
    icon: <Wrench size={32} />,
    label: 'Manutenção Eletrônica',
    desc: 'Reparo especializado de inversores de frequência, servodrives, CLPs, IHMs e placas eletrônicas industriais.',
    color: 'from-red-600 to-rose-800',
    light: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100',
  },
];

/* ─────────────── TRUST METRICS ─────────────── */
const METRICS = [
  { icon: <Shield size={22} />, value: '100%', label: 'Garantia de Reparo', color: 'text-blue-600' },
  { icon: <Clock size={22} />, value: '48h', label: 'Prazo Médio de Reparo', color: 'text-teal-600' },
  { icon: <CheckCircle size={22} />, value: '10+', label: 'Anos de Experiência', color: 'text-emerald-600' },
  { icon: <Phone size={22} />, value: '24h', label: 'Suporte Técnico', color: 'text-purple-600' },
];

/* ─────────────── COMPONENTE PRINCIPAL ─────────────── */
const Services = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const servicesContent = useAdminStore((state) => state.siteContent?.services);
  const globalContent = useAdminStore((state) => state.siteContent?.global);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  const heroContent = (
    <section className="relative pt-36 pb-32 top-0 bg-[#07090f] overflow-hidden min-h-[520px] flex items-end">
      {/* Background image */}
      <motion.div 
        style={{ y: yImage, backgroundImage: `url(${siteMedia.services?.url})` }}
        className="absolute inset-0 bg-cover bg-center opacity-40"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090f]/60 via-[#07090f]/70 to-[#07090f]" />
      {/* Grid pattern */}
      <div className="absolute inset-0 pattern-grid opacity-5" />

      {/* Accent lines */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-accent to-transparent opacity-60" />

      <motion.div style={{ y: yHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pb-12">
        <SlideIn direction="up">
          <EditableText pagina="services" path="hero.badge" tag="span" className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold tracking-widest uppercase mb-6 text-xs">
            {servicesContent?.hero?.badge || ''}
          </EditableText>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight uppercase leading-[1.05]">
            <EditableText pagina="services" path="hero.title" tag="span">{servicesContent?.hero?.title || ''}</EditableText>{' '}
            <EditableText pagina="services" path="hero.highlight" tag="span" className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">{servicesContent?.hero?.highlight || ''}</EditableText>
          </h1>
          <EditableText pagina="services" path="hero.desc" tag="p" className="text-lg text-gray-400 font-light max-w-2xl leading-relaxed">
            {servicesContent?.hero?.desc || ''}
          </EditableText>

          {/* Quick CTA */}
          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href={`https://wa.me/${globalContent?.whatsappNumber || '5519971206717'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-accent/30 text-sm uppercase tracking-wider"
            >
              Solicitar Orçamento
            </a>
            <a
              href={`tel:${globalContent?.phone || '(19) 3012-6360'}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all text-sm uppercase tracking-wider"
            >
              {globalContent?.phone || '(19) 3012-6360'}
            </a>
          </div>
        </SlideIn>
      </motion.div>
    </section>
  );

  return (
    <div className="w-full bg-[#f4f6f9] relative overflow-hidden">
      <SEO 
        title="Manutenção Eletrônica Industrial | Inversores, Servodrives e CLPs"
        description="Reparo especializado de servodrives Bosch Rexroth Indradrive, inversores WEG, Siemens Sinamics, Allen-Bradley Kinetix, Parker, CLPs e IHMs industriais."
        canonical="/manutencao-e-automacao-industrial"
        keywords="reparo servodrive bosch rexroth, conserto inversor siemens sinamics, manutenção inversor allen-bradley, reparo inversor weg americana, conserto CLP siemens s7, manutenção CLP allen-bradley, montagem de painéis elétricos, montagem elétrica industrial, controle IoT industrial"
        breadcrumbs={[{ name: 'Serviços', path: '/manutencao-e-automacao-industrial' }]}
      />

      {/* ── HERO ── */}
      {siteMedia.services?.link ? (
        <a href={siteMedia.services.link} target="_self">{heroContent}</a>
      ) : heroContent}

      {/* ── 4 PILARES DE ESPECIALIDADE ── */}
      <section className="relative z-20 -mt-1 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <FadeIn className="text-center mb-14">
            <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-accent mb-3">Nossas Áreas de Atuação</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Expertise em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">4 Pilares Industriais</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Da eletrônica ao IoT, da instalação ao painel — um parceiro completo para a sua indústria.</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALTIES.map((sp, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`group relative overflow-hidden rounded-2xl border-2 ${sp.border} bg-white p-8 flex flex-col gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full`}>
                  {/* Gradient accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sp.color} rounded-t-xl`} />

                  <div className={`w-16 h-16 rounded-2xl ${sp.light} flex items-center justify-center ${sp.text} group-hover:scale-110 transition-transform duration-300`}>
                    {sp.icon}
                  </div>

                  <div>
                    <h3 className={`text-lg font-black mb-2 ${sp.text}`}>{sp.label}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{sp.desc}</p>
                  </div>

                  <div className={`mt-auto flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${sp.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Ver especialidades <ArrowRight size={14} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST METRICS BAR ── */}
      <section className="bg-gradient-to-r from-[#07090f] via-[#0d1220] to-[#07090f] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {METRICS.map((m, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`${m.color} opacity-80 mb-1`}>{m.icon}</div>
                  <span className={`text-4xl font-black text-white`}>{m.value}</span>
                  <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">{m.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO DE ESPECIALIDADES (accordion dinâmico via Supabase) ── */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn className="mb-14 text-center">
            <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-accent mb-3">Catálogo Técnico</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Catálogo de <span className="text-accent underline decoration-4 underline-offset-4">Especialidades</span></h2>
            <p className="text-gray-500 text-lg">Selecione a área e explore as frentes de reparo e serviço disponíveis.</p>
          </FadeIn>

          <StaggerContainer>
             {(servicesContent?.catalog || []).map((cat, idx) => (
                <StaggerItem key={idx} className="relative group">
                   {isVisualEditorActive && (
                     <button 
                       onClick={() => removeItemFromArray('services', 'catalog', idx)}
                       className="absolute -top-2 -right-2 z-50 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                     >
                       <X size={12} />
                     </button>
                   )}
                   <AccordionItem 
                     pagina="services" 
                     path={`catalog.${idx}`} 
                     title={cat.title} 
                     items={cat.items} 
                     iconName={cat.icon} 
                     defaultOpen={idx === 0} 
                   />
                </StaggerItem>
             ))}

             {/* Add New Category Button */}
             {isVisualEditorActive && (
               <div className="mt-8 flex justify-center">
                 <button 
                   onClick={() => addItemToArray('services', 'catalog', { 
                     title: 'Nova Categoria', 
                     icon: 'Settings', 
                     items: ['Exemplo de Item'] 
                   })}
                   className="px-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                 >
                   <Plus size={16} /> Adicionar Nova Categoria
                 </button>
               </div>
             )}
          </StaggerContainer>

        </div>
      </section>

      {/* ── LABORATÓRIO MINI ── */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-b border-gray-100">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-50" />
         <div className="absolute top-0 right-0 pattern-dots opacity-20 w-96 h-96" />
         <div className="absolute bottom-0 left-0 pattern-dots opacity-10 w-64 h-64" />

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               <FadeIn>
                  <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-accent mb-4">Infraestrutura Própria</span>
                  <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                    <EditableText pagina="services" path="laboratoryMini.title" tag="span">{servicesContent?.laboratoryMini?.title || ''}</EditableText>{' '}
                    <EditableText pagina="services" path="laboratoryMini.highlight" tag="span" className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{servicesContent?.laboratoryMini?.highlight || ''}</EditableText>
                  </h2>
                  <EditableText pagina="services" path="laboratoryMini.desc" tag="p" className="text-lg text-gray-500 mb-8 leading-relaxed font-light">
                    {servicesContent?.laboratoryMini?.desc || ''}
                  </EditableText>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border border-gray-100 mb-8 shadow-sm">
                     <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                       <Zap size={16} className="text-accent" /> Gigas de teste para CLP e IHM
                     </h4>
                     <ul className="space-y-2.5">
                        {(servicesContent?.laboratoryMini?.items || []).map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                             <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                             <EditableText pagina="services" path={`laboratoryMini.items.${idx}`} tag="span">{item}</EditableText>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Link to="/estrutura" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm uppercase tracking-wider">
                     Conheça Nossa Estrutura <ArrowRight size={18} />
                  </Link>
               </FadeIn>

               <div className="relative">
                  <SlideIn direction="right">
                    {/* Decorative frame */}
                    <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary/10 rounded-2xl" />
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
                        <img 
                          src={siteMedia.servicesLab?.url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"} 
                          alt="Laboratório Eletrônico GCA Automação" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                        {/* Lab badge */}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                          <p className="text-xs font-black text-gray-900 uppercase tracking-wider">Laboratório Próprio</p>
                          <p className="text-[10px] text-gray-500">Ambiente ESD Certificado</p>
                        </div>
                        {siteMedia.servicesLab?.link && (
                          <a href={siteMedia.servicesLab.link} target="_self" className="absolute inset-0 z-10"></a>
                        )}
                    </div>
                  </SlideIn>
               </div>

            </div>
         </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 relative bg-gradient-to-br from-[#07090f] via-[#0a1020] to-[#07090f] overflow-hidden">
        {/* Background accent glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 pattern-grid opacity-5" />

        <FadeIn className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-accent mb-4">Pronto para começar?</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            GCA <span className="text-accent">Automação</span> Industrial
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Mais de 10 anos resolvendo os desafios mais complexos da indústria. Fale com um engenheiro agora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${globalContent?.whatsappNumber || '5519971206717'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-accent/30 uppercase tracking-wider text-sm"
            >
              Solicitar Orçamento Grátis
            </a>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all uppercase tracking-wider text-sm"
            >
              Fale Conosco <ArrowRight size={18} />
            </Link>
          </div>
        </FadeIn>
      </section>

    </div>
  );
};

export default Services;
