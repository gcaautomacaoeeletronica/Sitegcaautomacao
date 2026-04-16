import React, { useState, useEffect } from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import ServiceCard from '../components/ui/ServiceCard';
import SEO from '../components/ui/SEO';
import { Settings, Zap, Cpu, Layers } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

const Home = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const homeContent = useAdminStore((state) => state.siteContent.home);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = homeContent.slides.map((s, i) => ({
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
        title="Automação Industrial e Manutenção Eletrônica"
        description="Especialistas em manutenção de servodrives, inversores Bosch Rexroth, Indramat e sistemas CNC. Precisão e agilidade em Americana-SP."
        canonical="/"
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
                     {slide.title} <br/>
                     <span className="text-accent">{slide.highlight}</span>
                   </h1>
                </div>
                <p className={`text-gray-300 text-lg md:text-2xl mt-6 font-medium max-w-2xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                   {slide.desc}
                </p>
                
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
                       <span className="text-xs font-bold text-accent tracking-widest uppercase">{homeContent.expertise.badge}</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight mb-8">
                       {homeContent.expertise.title}
                     </h2>
                  </SlideIn>
               </div>
               <div className="md:w-1/2">
                  <FadeIn delay={0.2}>
                     <p className="text-gray-600 text-lg leading-relaxed border-l-2 border-gray-200 pl-6">
                       {homeContent.expertise.text}
                     </p>
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
            <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">{homeContent.portfolio.badge}</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              {homeContent.portfolio.title} <span className="text-accent underline decoration-4 underline-offset-4">{homeContent.portfolio.highlight}</span>
            </h3>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StaggerItem>
               <ServiceCard 
                 title="Laboratório & Gigas" 
                 description="Ambiente ESD com simulações reais para teste final."
                 link="/estrutura"
                 icon={Layers}
               />
            </StaggerItem>
            <StaggerItem>
               <ServiceCard 
                  title="Máquinas Gráficas" 
                  description="Reparos completos em hardware e lógica KBA."
                  link="/manutencao-e-automacao-industrial"
                  icon={Settings}
               />
            </StaggerItem>
            <StaggerItem>
               <ServiceCard 
                 title="Solda Robô Rexroth" 
                 description="Fontes e controles de painéis dedicados PSI6000."
                 link="/manutencao-e-automacao-industrial"
                 icon={Zap}
               />
            </StaggerItem>
            <StaggerItem>
               <ServiceCard 
                 title="Série DKC Ecodrive" 
                 description="Especialistas plenos na linha completa Bosch Rexroth."
                 link="/manutencao-e-automacao-industrial"
                 icon={Cpu}
               />
            </StaggerItem>
          </StaggerContainer>

        </div>
      </section>

    </div>
  );
};

export default Home;
