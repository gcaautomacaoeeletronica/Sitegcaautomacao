import React, { useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Zap, ChevronDown, X, Plus, ArrowRight, Cable, Wifi, LayoutGrid, Wrench, CheckCircle, Shield, Clock, Phone, Play } from 'lucide-react';
import { ICON_MAP } from '../lib/icons';
import { Link } from 'react-router-dom';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';
import Skeleton from '../components/ui/Skeleton';
import SmartImage from '../components/ui/SmartImage';

// Remove <p> wrapper e inline font-size do Tiptap em campos de título
const stripP = (html) =>
  (html || '')
    .replace(/<\/?p[^>]*>/gi, '')
    .replace(/\s*style\s*=\s*"[^"]*font-size[^"]*"/gi, '')
    .trim();


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
  const isInitialLoading = useAdminStore((state) => state.isInitialLoading);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  const heroContent = (
    <section className="relative pt-36 pb-32 top-0 bg-[#05070a] overflow-hidden min-h-[520px] flex items-end">
      {/* Background image with enhanced scale and contrast */}
      <motion.div 
        style={{ y: yImage, backgroundImage: `url(${siteMedia.services?.url})` }}
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 grayscale-[30%] brightness-75"
      />
      {/* Precision Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/80 to-transparent z-0" />
      
      {/* Accent lines */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-accent to-transparent opacity-40" />

      <motion.div style={{ y: yHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pb-12">
        <SlideIn direction="up">
          <EditableText pagina="services" path="hero.badge" tag="span" className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent/20 border border-accent/40 text-white font-black tracking-[0.3em] uppercase mb-8 text-xs backdrop-blur-md shadow-2xl">
            {servicesContent?.hero?.badge || ''}
          </EditableText>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95] drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
            <span className="cms-content" dangerouslySetInnerHTML={{ __html: stripP(servicesContent?.hero?.title) }}></span>{' '} <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 cms-content" dangerouslySetInnerHTML={{ __html: stripP(servicesContent?.hero?.highlight) }}></span>
          </h1>
          <div 
            className="text-xl md:text-2xl text-white font-semibold max-w-3xl leading-relaxed cms-content drop-shadow-lg"
            dangerouslySetInnerHTML={{ __html: servicesContent?.hero?.desc || '' }}
          />

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
        title="Montagem de Painéis e Manutenção de Inversores | Cuiabá MT"
        description="Montagem de painéis elétricos industriais NR-10 em Cuiabá. Manutenção e venda de inversores de frequência Weg e Danfoss. Atendemos raio de 700km de Cuiabá MT."
        canonical="/manutencao-e-automacao-industrial"
        keywords="montagem de painéis elétricos cuiabá mt, manutenção inversor weg cuiabá, conserto inversor danfoss mato grosso, quadros elétricos industriais cuiabá, automação industrial mt"
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
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
              Expertise em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">4 Pilares Industriais</span>
            </h2>
            <p className="text-white mt-4 max-w-xl mx-auto text-lg font-medium drop-shadow-md">Da eletrônica ao IoT, da instalação ao painel — um parceiro completo para a sua indústria.</p>
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
            <h2 className="text-4xl font-black text-primary tracking-tight mb-3">Catálogo de <span className="text-accent underline decoration-4 underline-offset-4">Especialidades</span></h2>
            <p className="text-white text-lg font-medium drop-shadow-md">Selecione a área e explore as frentes de reparo e serviço disponíveis.</p>
          </FadeIn>

          <StaggerContainer>
             {isInitialLoading ? (
               [1, 2, 3].map(i => (
                 <div key={i} className="mb-4 bg-white p-6 rounded-xl border border-gray-100 space-y-3">
                   <div className="flex items-center gap-4">
                     <Skeleton width="44px" height="44px" />
                     <Skeleton width="60%" height="24px" />
                   </div>
                 </div>
               ))
             ) : (servicesContent?.catalog || []).map((cat, idx) => (
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

      {/* ── GALERIA DE FOTOS E VÍDEOS ── */}
      {siteMedia.servicesGallery_0?.url || siteMedia.servicesGallery_1?.url || siteMedia.servicesGallery_2?.url || siteMedia.servicesGallery_3?.url || siteMedia.servicesGallery_4?.url || siteMedia.servicesGallery_5?.url ? (
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-14">
            <span className="inline-block text-xs font-black tracking-[0.25em] uppercase text-accent mb-3">Galeria de Projetos</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Trabalhos</span></h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Veja alguns dos projetos executados pela GCA Automação Industrial.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0,1,2,3,4,5].map((idx) => {
              const mediaKey = `servicesGallery_${idx}`;
              const media = siteMedia[mediaKey];
              if (!media?.url) return null;
              
              const isVideo = media.url?.match(/\.(mp4|webm|mov|avi)$/i) || media.url?.includes('video');
              const hasText = media.title || media.desc;
              
              return (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-primary/30 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-[4/3] relative overflow-hidden bg-[#0a111a]">
                      <SmartImage 
                        src={media.url} 
                        alt={media.title || `Projeto ${idx + 1}`}
                        className="group-hover:scale-110 image-filter-premium group-hover:image-filter-premium-off"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    {hasText && (
                      <div className="p-5 bg-white border-t border-gray-100">
                        {media.title && (
                          <h4 className="font-bold text-gray-900 text-lg leading-tight">{media.title}</h4>
                        )}
                        {media.desc && (
                          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{media.desc}</p>
                        )}
                      </div>
                    )}
                    {!hasText && (
                      <div className="p-5 bg-gray-50 border-t border-gray-100">
                        <p className="text-gray-400 text-sm font-medium">Projeto {idx + 1}</p>
                      </div>
                    )}
                    {media.link && (
                      <a href={media.link} target="_self" className="absolute inset-0 z-20" />
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

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
                    <span className="cms-content" dangerouslySetInnerHTML={{ __html: servicesContent?.laboratoryMini?.title || '' }}></span>{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent cms-content" dangerouslySetInnerHTML={{ __html: servicesContent?.laboratoryMini?.highlight || '' }}></span>
                  </h2>
                  <div 
                    className="text-lg text-gray-500 mb-8 leading-relaxed font-light cms-content"
                    dangerouslySetInnerHTML={{ __html: servicesContent?.laboratoryMini?.desc || '' }}
                  />
                  
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
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group bg-[#0a111a]">
                        <SmartImage 
                          src={siteMedia.servicesLab?.url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"} 
                          alt="Laboratório Eletrônico GCA Automação" 
                          className="group-hover:scale-105 image-filter-premium group-hover:image-filter-premium-off"
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
