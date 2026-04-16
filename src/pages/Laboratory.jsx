import React from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import { Cpu, Zap, Activity } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';

const Laboratory = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const labContent = useAdminStore((state) => state.siteContent.laboratory);

  const heroContent = (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url(${siteMedia.laboratory?.url})` }}></div>
      <div className="absolute inset-0 bg-primary-dark/80 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideIn>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tighter">
            {labContent.hero.title} <br/><span className="font-light">{labContent.hero.highlight}</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl font-light">
            {labContent.hero.desc}
          </p>
        </SlideIn>
      </div>
    </section>
  );

  return (
    <div className="w-full bg-[#f6f8f8] relative overflow-hidden">
      <SEO 
        title="Infraestrutura Laboratorial | GCA Automação"
        description="Nosso laboratório conta com ambiente ESD controlado, estações de retrabalho BGA e gigas de teste dedicadas para garantir a qualidade de cada reparo."
        canonical="/estrutura"
      />
      

      {siteMedia.laboratory?.link ? (
        <a href={siteMedia.laboratory.link} target="_self">{heroContent}</a>
      ) : heroContent}

      <section className="py-24 relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
               
               <FadeIn className="order-2 lg:order-1">
                  <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    {labContent.performance.title} <br/><span className="text-accent underline decoration-4 underline-offset-4">{labContent.performance.highlight}</span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6 font-light">
                    {labContent.performance.text1}
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed font-light">
                    {labContent.performance.text2}
                  </p>
               </FadeIn>
               
               <div className="order-1 lg:order-2 w-full aspect-square md:aspect-video lg:aspect-square bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center shadow-sm">
                   <span className="text-gray-400 font-bold uppercase tracking-widest text-sm text-center px-4">
                      {siteMedia.laboratory?.url ? (
                        <img src={siteMedia.laboratory.url} alt="Lab" className="w-full h-full object-cover rounded-sm absolute inset-0 mix-blend-multiply opacity-50" />
                      ) : "Área Restrita (Laboratório)"}
                   </span>
               </div>

            </div>

            {/* Feature Cards Modernos */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <StaggerItem className="group">
                  <div className="bg-white rounded-sm p-10 shadow-sm hover:shadow-md border border-gray-200 h-full transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute -top-4 -right-4 text-9xl text-gray-50 opacity-50 font-black pointer-events-none text-blue-500/10"><Zap /></div>
                     <div className="w-14 h-14 bg-blue-50 rounded flex items-center justify-center mb-8 border border-blue-100">
                        <Zap size={28} className="text-primary group-hover:scale-110 transition-transform" />
                     </div>
                     <h3 className="font-bold text-gray-900 text-2xl mb-4">Gigas Dedicadas</h3>
                     <p className="text-gray-600 font-light leading-relaxed">
                       Paredes de simulação de carga contínua (burn-in) atestadas por analisadores de espectro.
                     </p>
                  </div>
                </StaggerItem>

                <StaggerItem className="group mt-0 md:mt-8">
                  <div className="bg-white rounded-sm p-10 shadow-sm hover:shadow-md border border-gray-200 h-full transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute -top-4 -right-4 text-9xl text-gray-50 opacity-50 font-black pointer-events-none text-blue-500/10"><Activity /></div>
                     <div className="w-14 h-14 bg-blue-50 rounded flex items-center justify-center mb-8 border border-blue-100">
                        <Activity size={28} className="text-primary group-hover:scale-110 transition-transform" />
                     </div>
                     <h3 className="font-bold text-gray-900 text-2xl mb-4">Ambiente ESD</h3>
                     <p className="text-gray-600 font-light leading-relaxed">
                       Controle estrito eletrostático em 100% da área física: pisos, bancadas e vestuário especial.
                     </p>
                  </div>
                </StaggerItem>

                <StaggerItem className="group mt-0 md:mt-16">
                  <div className="bg-white rounded-sm p-10 shadow-sm hover:shadow-md border border-gray-200 h-full transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                     <div className="absolute -top-4 -right-4 text-9xl text-gray-50 opacity-50 font-black pointer-events-none text-blue-500/10"><Cpu /></div>
                     <div className="w-14 h-14 bg-blue-50 rounded flex items-center justify-center mb-8 border border-blue-100">
                        <Cpu size={28} className="text-primary group-hover:scale-110 transition-transform" />
                     </div>
                     <h3 className="font-bold text-gray-900 text-2xl mb-4">SMD & BGA</h3>
                     <p className="text-gray-600 font-light leading-relaxed">
                       Estações de retrabalho BGA robotizadas com perfis térmicos computadorizados.
                     </p>
                  </div>
                </StaggerItem>

            </StaggerContainer>

         </div>
      </section>
    </div>
  );
};

export default Laboratory;
