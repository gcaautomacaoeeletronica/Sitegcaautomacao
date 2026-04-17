import React, { useState, useEffect } from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import ServiceCard from '../components/ui/ServiceCard';
import SEO from '../components/ui/SEO';
import * as Icons from 'lucide-react';
import { Settings, Zap, Cpu, Layers, Plus, Trash2, Linkedin, Instagram, Facebook } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';

const Home = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const homeContent = useAdminStore((state) => state.siteContent?.home);
  const global = useAdminStore((state) => state.siteContent?.global);
  const googleVerificationCode = global?.googleVerificationCode;
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = (homeContent?.slides || []).map((s, i) => ({
    ...s,
    bg: i === 0 ? "bg-primary-dark" : i === 1 ? "bg-blue-900" : "bg-gray-900"
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col w-full bg-slate-50 overflow-hidden">
      <SEO 
        title="Automação Industrial e Manutenção Eletrônica em Americana-SP"
        description="GCA Automação Industrial — Especialistas em reparo de servodrives Bosch Rexroth, inversores WEG, Siemens Sinamics, Allen-Bradley Kinetix e CLPs. Americana-SP. Orçamento rápido 24h."
        canonical="/"
        keywords="conserto inversor de frequência americana sp, reparo servodrive bosch rexroth americana, manutenção eletrônica industrial americana sp, laboratório eletrônica industrial, GCA automação"
        googleVerification={googleVerificationCode}
      />
      
      {/* Hero Slider Section Premium */}
      <section className="relative w-full h-[80vh] md:h-[90vh] min-h-[600px] overflow-hidden">
        {slides.map((slide, index) => {
          const content = (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center ${slide.bg} ${
                index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
              }`}
            >
              {/* Mesh Overlay & Tech Grid */}
              <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                   style={{ backgroundImage: `url(${siteMedia.home?.url})`, opacity: index === currentSlide ? 0.8 : 0 }}></div>
              <div className="absolute inset-0 bg-[#0a0c10] opacity-60"></div>
              <div className="absolute inset-0 pattern-grid opacity-10"></div>
              
              <div className="relative z-20 px-4 max-w-5xl mx-auto w-full flex flex-col justify-center translate-y-10">
                <div className="overflow-hidden mb-2 border-l-4 border-accent pl-6">
                    <h1 className={`text-white text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight transition-transform duration-1000 delay-100 ease-out ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                      <EditableText pagina="home" path={`slides.${index}.title`} tag="span">{slide.title}</EditableText> <br/>
                      <EditableText pagina="home" path={`slides.${index}.highlight`} tag="span" className="text-accent">{slide.highlight}</EditableText>
                    </h1>
                 </div>
                 <div className={`mt-6 transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <EditableText pagina="home" path={`slides.${index}.desc`} tag="p" className="text-gray-300 text-lg md:text-2xl font-medium max-w-2xl">
                       {slide.desc}
                    </EditableText>
                 </div>
                
                <div className={`mt-10 flex gap-4 transition-all duration-1000 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                   <a href="/manutencao-e-automacao-industrial" className="px-8 py-4 bg-accent hover:bg-red-700 text-white text-sm font-bold tracking-widest uppercase rounded flex items-center justify-center transition-all min-w-[200px]">
                     Soluções
                   </a>
                   <a href="/entre-em-contato" className="px-8 py-4 bg-transparent hover:bg-gray-800 border-2 border-white/50 hover:border-white text-white text-sm font-bold tracking-widest uppercase rounded flex items-center justify-center transition-all min-w-[200px]">
                     Fale Conosco
                   </a>
                </div>
              </div>
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
                      <EditableText pagina="home" path="expertise.text" tag="p" className="text-gray-600 text-lg leading-relaxed border-l-2 border-gray-200 pl-6">
                        {homeContent?.expertise?.text || ''}
                      </EditableText>
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
              const DynamicIcon = Icons[service.icon] || Icons.HelpCircle;
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
              <StaggerItem className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary/30 transition-all group min-h-[300px]">
                <button 
                  onClick={() => addItemToArray('home', 'services', { 
                    title: 'Novo Serviço', 
                    desc: 'Descrição do novo serviço industrial.', 
                    link: '/manutencao-e-automacao-industrial', 
                    icon: 'Settings' 
                  })}
                  className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors w-full h-full"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Adicionar Card</span>
                </button>
              </StaggerItem>
            )}
          </StaggerContainer>

        </div>
      </section>

      {/* Barra de Redes Sociais Flutuante */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-gray-300 mx-auto"></div>
        
        <a 
          href={global?.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all"
        >
          <Linkedin size={20} className="text-gray-400 group-hover:text-[#0077B5] transition-colors" />
          <span className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            LinkedIn
          </span>
        </a>

        <a 
          href={global?.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all"
        >
          <Instagram size={20} className="text-gray-400 group-hover:text-[#E4405F] transition-colors" />
          <span className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Instagram
          </span>
        </a>

        <a 
          href={global?.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all"
        >
          <Facebook size={20} className="text-gray-400 group-hover:text-[#1877F2] transition-colors" />
          <span className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Facebook
          </span>
        </a>

        <div className="w-px h-24 bg-gradient-to-t from-transparent to-gray-300 mx-auto"></div>
      </div>

    </div>
  );
};

export default Home;
