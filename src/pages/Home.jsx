import React, { useState, useEffect } from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import ServiceCard from '../components/ui/ServiceCard';
import SEO from '../components/ui/SEO';
import { ICON_MAP } from '../lib/icons';
const { 
  Settings, Zap, Cpu, Layers, Plus, Trash2, Clock, Workflow, 
  ShieldCheck, MessagesSquare, MessageSquare, HelpCircle,
  Smartphone, Phone, Mail, MapPin
} = ICON_MAP;
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

// Componente Inovador de Marcas (Industrial Glass Marquee)
const InnovativeBrandsCarousel = () => {
  const brands = [
    { name: 'WEG', color: 'hover:text-blue-500' },
    { name: 'Siemens', color: 'hover:text-blue-400' },
    { name: 'Bosch Rexroth', color: 'hover:text-red-500' },
    { name: 'Allen-Bradley', color: 'hover:text-orange-600' },
    { name: 'Schneider', color: 'hover:text-green-500' },
    { name: 'Omron', color: 'hover:text-blue-600' },
    { name: 'SMC', color: 'hover:text-blue-300' },
    { name: 'ABB', color: 'hover:text-red-600' },
    { name: 'Fanuc', color: 'hover:text-yellow-500' },
    { name: 'Yaskawa', color: 'hover:text-blue-500' }
  ];

  return (
    <section className="bg-[#080a0f] py-20 relative overflow-hidden border-y border-white/5">
      {/* Background patterns */}
      <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10 text-center">
        <h4 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mb-2">Padrão de Excelência Global</h4>
        <h3 className="text-xl md:text-2xl font-bold text-white/90">Marcas e Tecnologias de <span className="text-accent underline decoration-2 underline-offset-4">Classe Mundial</span></h3>
      </div>

      <div className="relative group">
        {/* Gradients masks for side fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080a0f] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080a0f] to-transparent z-10"></div>

        <div className="flex animate-marquee whitespace-nowrap gap-8 items-center group-hover:pause py-4">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className={`inline-flex items-center justify-center px-10 py-6 glass-brand-card rounded-2xl min-w-[220px] mx-2 group/card`}
            >
              <span className={`text-2xl md:text-3xl font-black text-white/40 tracking-tighter transition-all duration-500 ${brand.color} group-hover/card:text-white group-hover/card:scale-105 uppercase italic`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente Interno para Estatísticas
const StatsSection = ({ stats = [] }) => (
  <section className="py-20 bg-[#0c0e12] relative overflow-hidden">
    <div className="absolute inset-0 pattern-grid opacity-5"></div>
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, idx) => {
          const Icon = ICON_MAP[stat.icon] || ICON_MAP.Zap;
          return (
            <FadeIn key={idx} delay={idx * 0.1} className="text-center group flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-500 border border-white/5 shadow-2xl">
                <Icon className="text-accent group-hover:text-white" size={28} />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] leading-tight max-w-[120px]">{stat.label}</div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  </section>
);

// Remove <p> wrapper tags that Tiptap inserts — used in single-line title fields
const stripParagraph = (html) => (html || '').replace(/<\/?p[^>]*>/gi, '').trim();

const Home = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const homeContent = useAdminStore((state) => state.siteContent?.home);
  const global = useAdminStore((state) => state.siteContent?.global);
  const googleVerificationCode = global?.googleVerificationCode;
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);
  const whatsappNumber = global?.whatsappNumber;
  
  // Hooks para efeitos de scroll na barra social e progresso global
  const { scrollY, scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Efeito Parallax para seções
  const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
  const yPattern = useTransform(scrollY, [0, 1000], [0, -200]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = (homeContent?.slides || []).map((s, i) => ({
    ...s,
    bg: i === 0 ? "bg-primary-dark" : i === 1 ? "bg-[#0a0f18]" : "bg-[#111827]"
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-slate-50 font-inter selection:bg-accent selection:text-white pt-20">
      <SEO 
        title="GCA Automação Industrial | Excelência em Manutenção e Projetos"
        description="GCA Automação Industrial — Especialistas em reparo de servodrives Bosch Rexroth, inversores WEG, Siemens Sinamics, Allen-Bradley Kinetix e CLPs. Americana-SP. Orçamento rápido 24h."
        canonical="/"
        keywords="conserto inversor de frequência americana sp, reparo servodrive bosch rexroth americana, manutenção eletrônica industrial americana sp, laboratório eletrônica industrial, GCA automação"
        googleVerification={googleVerificationCode}
      />

      {/* Barra de Progresso Global (Topo) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left shadow-[0_0_10px_#D71920]"
        style={{ scaleX }}
      />
      
      {/* Hero Slider Section Premium */}
      <section className="relative w-full h-[80vh] md:h-[90vh] min-h-[600px] overflow-hidden">
        {slides.map((slide, index) => {
          const content = (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center ${slide.bg} ${
                index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            >
              {/* Background Parallax Pattern */}
              <motion.div 
                style={{ y: yPattern }}
                className="absolute inset-0 pattern-grid opacity-10 pointer-events-none"
              />
              
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                   style={{ backgroundImage: `url(${siteMedia.home?.url})`, opacity: index === currentSlide ? 0.8 : 0 }}></div>
              <div className="absolute inset-0 bg-[#0a0c10] opacity-60"></div>
              
              <motion.div 
                style={{ y: yHero }}
                className="relative z-20 px-4 max-w-5xl mx-auto w-full flex flex-col justify-center translate-y-10"
              >
                <div className="overflow-hidden mb-2 border-l-4 border-accent pl-6">
                    <h1 className={`text-white text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight transition-transform duration-1000 delay-100 ease-out ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                      <span className="cms-content-light" dangerouslySetInnerHTML={{ __html: stripParagraph(slide.title) }}></span><br/>
                      <span className="text-accent cms-content-light" dangerouslySetInnerHTML={{ __html: stripParagraph(slide.highlight) }}></span>
                    </h1>
                 </div>
                 <div className={`mt-6 transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <div 
                       className="text-gray-300 text-lg md:text-2xl font-medium max-w-2xl cms-content-light"
                       dangerouslySetInnerHTML={{ __html: slide.desc || '' }}
                    />
                 </div>
                
                <div className={`mt-10 flex gap-4 transition-all duration-1000 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                   <a href="/manutencao-e-automacao-industrial" className="px-8 py-4 bg-accent hover:bg-red-700 text-white text-sm font-bold tracking-widest uppercase rounded flex items-center justify-center transition-all min-w-[200px]">
                     Soluções
                   </a>
                   <a href="/entre-em-contato" className="px-8 py-4 bg-transparent hover:bg-gray-800 border-2 border-white/50 hover:border-white text-white text-sm font-bold tracking-widest uppercase rounded flex items-center justify-center transition-all min-w-[200px]">
                     Fale Conosco
                   </a>
                </div>
              </motion.div>
            </div>
          );

          if (siteMedia.home?.link) {
            return <a key={index} href={siteMedia.home.link} target="_self">{content}</a>;
          }
          return content;
        })}
        
        {/* Slider Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
           {slides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-accent' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              />
           ))}
        </div>
      </section>

      {/* Seção Sobre Resumo (High End Typography) */}
      <section className="py-24 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="md:w-1/2">
                  <SlideIn>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-12 h-px bg-accent block"></span>
                        <EditableText pagina="home" path="expertise.badge" className="text-xs font-bold text-accent tracking-widest uppercase" tag="span">
                          {homeContent?.expertise?.badge || ''}
                        </EditableText>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight mb-8">
                        <EditableText pagina="home" path="expertise.title" tag="span">
                          {homeContent?.expertise?.title || ''}
                        </EditableText>
                      </h2>
                   </SlideIn>
                </div>
                <div className="md:w-1/2">
                   <FadeIn delay={0.2}>
<div 
   className="text-gray-600 text-lg leading-relaxed border-l-2 border-gray-200 pl-6 cms-content"
   dangerouslySetInnerHTML={{ __html: homeContent?.expertise?.text || '' }}
/>
                   </FadeIn>
                </div>
            </div>
         </div>
      </section>

      {/* Grid de Serviços Dinâmico */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-slate-50 transform -skew-y-2 origin-top-left z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <FadeIn className="text-center mb-20">
            <EditableText pagina="home" path="portfolio.badge" tag="h2" className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">
              {homeContent?.portfolio?.badge || ''}
            </EditableText>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              <EditableText pagina="home" path="portfolio.title" tag="span">{homeContent?.portfolio?.title || ''}</EditableText> 
              {' '}
              <EditableText pagina="home" path="portfolio.highlight" tag="span" className="text-accent underline decoration-4 underline-offset-4">
                {homeContent?.portfolio?.highlight || ''}
              </EditableText>
            </h3>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {(homeContent?.services || []).map((service, idx) => {
              const DynamicIcon = ICON_MAP[service.icon] || ICON_MAP.HelpCircle;
              return (
                <StaggerItem key={idx} className="relative group">
                   {/* Delete Button */}
                   {isVisualEditorActive && (
                     <button 
                       onClick={() => removeItemFromArray('home', 'services', idx)}
                       className="absolute -top-3 -right-3 z-50 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 size={14} />
                     </button>
                   )}

                   <ServiceCard 
                     title={<EditableText pagina="home" path={`services.${idx}.title`} tag="span">{service.title}</EditableText>}
                     description={<EditableText pagina="home" path={`services.${idx}.desc`} tag="span">{service.desc}</EditableText>}
                     link={service.link}
                     icon={DynamicIcon}
                   />

                   {/* Icon Selector Overlay */}
                   <IconSelector 
                     pagina="home" 
                     path={`services.${idx}.icon`} 
                     currentIcon={service.icon} 
                   />
                </StaggerItem>
              );
            })}

            {/* Add New Card Button */}
            {isVisualEditorActive && (
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary/30 transition-all group min-h-[300px] cursor-pointer"
                onClick={() => addItemToArray('home', 'services', { 
                  title: 'Novo Serviço', 
                  desc: 'Descrição do novo serviço industrial.', 
                  link: '/manutencao-e-automacao-industrial', 
                  icon: 'Settings' 
                })}
              >
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors w-full h-full justify-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Adicionar Card</span>
                </div>
              </div>
            )}
          </StaggerContainer>
        </div>
      </section>



      {/* Seção de Estatísticas (Stats Section) */}
      <StatsSection stats={homeContent?.stats || []} />

      {/* Carousel Inovador de Marcas (Marcas atendidas) */}
      <InnovativeBrandsCarousel />



      {/* Botão WhatsApp Flutuante (Lead Focus) */}
      <a 
        href={`https://wa.me/${(global?.whatsappNumber || global?.whatsapp || '551930126360').replace(/\D/g, '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50 group flex items-center gap-3"
      >
        <div className="hidden group-hover:flex px-6 py-3 bg-white/90 backdrop-blur-md text-[#25D366] text-xs font-black uppercase tracking-widest rounded-full shadow-2xl border border-[#25D366]/20 animate-in fade-in slide-in-from-right-4">
          Orçamento Rápido
        </div>
        <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/30 hover:scale-110 transition-transform active:scale-95 animate-pulse-subtle p-4">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.045a11.871 11.871 0 001.592 5.96L0 24l6.117-1.604a11.845 11.845 0 005.932 1.583h.005c6.637 0 12.046-5.411 12.05-12.046a11.82 11.82 0 00-3.48-8.492" />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Home;
