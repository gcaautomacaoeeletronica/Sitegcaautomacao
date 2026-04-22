import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';
import { ICON_MAP } from '../lib/icons';
import SmartImage from '../components/ui/SmartImage';

// Remove <p> wrapper e inline font-size do Tiptap em campos de título
const stripP = (html) =>
  (html || '')
    .replace(/<\/?p[^>]*>/gi, '')
    .replace(/\s*style\s*=\s*"[^"]*font-size[^"]*"/gi, '')
    .trim();


const Laboratory = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const labContent = useAdminStore((state) => state.siteContent?.laboratory);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  const heroContent = (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#0a111a] overflow-hidden">
      {/* Background Image colorido e vibrante */}
      <motion.div 
        style={{ y: yImage }}
        className="absolute inset-0 bg-cover bg-center opacity-80" 
        style={{ backgroundImage: `url(${siteMedia.laboratory?.url})` }}
      />
      {/* Dynamic Gradient Overlay for better text focus */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a111a] via-[#0a111a]/80 to-transparent z-0"></div>
      
      <motion.div style={{ y: yHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideIn>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
            <span className="cms-content drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" dangerouslySetInnerHTML={{ __html: stripP(labContent?.hero?.title) }}></span> <br/>
            <span className="text-accent drop-shadow-[0_2px_8px_rgba(192,57,43,0.4)]" dangerouslySetInnerHTML={{ __html: stripP(labContent?.hero?.highlight) }}></span>
          </h1>
          <div 
             className="text-xl md:text-2xl text-slate-200 font-medium max-w-2xl leading-relaxed cms-content drop-shadow-md"
             dangerouslySetInnerHTML={{ __html: labContent?.hero?.desc || '' }}
           />
        </SlideIn>
      </motion.div>
    </section>
  );

  return (
    <div className="w-full bg-[#f6f8f8] relative overflow-hidden">
      <SEO 
        title="Infraestrutura e Laboratório | GCA Cuiabá MT"
        description="Nosso laboratório em Cuiabá-MT conta com ambiente ESD controlado e gigas de teste para manutenção de inversores Weg, Danfoss e CLP. Atendimento de excelência em Mato Grosso."
        canonical="/estrutura"
        keywords="laboratório eletrônica industrial cuiabá mt, conserto de inversores mato grosso, testes de clp cuiabá, reparo de painéis industriais mt"
        breadcrumbs={[{ name: 'Estrutura / Laboratório', path: '/estrutura' }]}
      />
      

      {siteMedia.laboratory?.link ? (
        <a href={siteMedia.laboratory.link} target="_self">{heroContent}</a>
      ) : heroContent}

      {/* Divisor Técnico */}
      <div className="relative h-16 bg-[#f6f8f8] overflow-hidden -mt-16 z-20">
        <svg className="absolute bottom-0 w-full h-16 text-[#f6f8f8] fill-current" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0 54L120 45C240 36 480 18 720 18C960 18 1200 36 1320 45L1440 54V0H1320C1200 0 960 0 720 0C480 0 240 0 120 0H0V54Z"></path>
        </svg>
      </div>

      <section className="py-24 relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
               
<FadeIn className="order-2 lg:order-1">
                   <h2 className="text-3xl lg:text-5xl font-black text-primary mb-6 tracking-tight">
                     <span className="cms-content" dangerouslySetInnerHTML={{ __html: stripP(labContent?.performance?.title) }}></span> <br/>
                     <span className="text-accent underline decoration-4 underline-offset-4 cms-content" dangerouslySetInnerHTML={{ __html: stripP(labContent?.performance?.highlight) }}></span>
                   </h2>
                   <div 
                     className="text-lg text-white leading-relaxed mb-6 font-medium cms-content drop-shadow-md"
                     dangerouslySetInnerHTML={{ __html: labContent?.performance?.text1 || '' }}
                   />
                   <div 
                     className="text-lg text-white leading-relaxed font-medium cms-content drop-shadow-md"
                     dangerouslySetInnerHTML={{ __html: labContent?.performance?.text2 || '' }}
                   />
                </FadeIn>
               
               <div className="order-1 lg:order-2 w-full aspect-square md:aspect-video lg:aspect-square bg-[#0a111a] rounded-sm border border-gray-200 flex items-center justify-center shadow-sm relative overflow-hidden group">
                   <span className="text-gray-400 font-bold uppercase tracking-widest text-sm text-center px-4 z-10 relative">
                      {siteMedia.laboratory?.url ? (
                        <SmartImage src={siteMedia.laboratory.url} alt="Lab" className="absolute inset-0" />
                      ) : "Área Restrita (Laboratório)"}
                   </span>
               </div>

            </div>

            {/* Feature Cards Modernos Dinâmicos */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(labContent?.features || []).map((feature, idx) => {
                  const DynamicIcon = ICON_MAP[feature.icon] || ICON_MAP.HelpCircle;
                  return (
                    <StaggerItem key={idx} className={`group ${idx === 1 ? 'mt-0 md:mt-8' : idx === 2 ? 'mt-0 md:mt-16' : ''}`}>
                      <div className={`bg-white rounded-sm p-10 shadow-sm hover:shadow-md border border-gray-200 h-full transition-all duration-300 hover:-translate-y-1 relative ${isVisualEditorActive ? 'overflow-visible' : 'overflow-hidden'}`}>
                         {/* Delete Button */}
                         {isVisualEditorActive && (
                           <button 
                             onClick={() => removeItemFromArray('laboratory', 'features', idx)}
                             className="absolute top-2 right-2 z-50 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 size={12} />
                           </button>
                         )}

                         <div className="absolute -top-4 -right-4 text-9xl text-gray-50 opacity-50 font-black pointer-events-none text-blue-500/10">
                            <DynamicIcon />
                         </div>

                         <div className="relative mb-8 flex items-start justify-between">
                            <div className="w-14 h-14 bg-blue-50 rounded flex items-center justify-center border border-blue-100 group-hover:bg-primary group-hover:text-white transition-all">
                               <DynamicIcon size={28} className="transition-transform group-hover:scale-110" />
                            </div>
                            {/* Icon Selector Button stays on top right of the icon group */}
                            <IconSelector pagina="laboratory" path={`features.${idx}.icon`} currentIcon={feature.icon} />
                         </div>

                         <h3 className="font-bold text-gray-900 text-2xl mb-4">
                            <EditableText pagina="laboratory" path={`features.${idx}.title`} tag="span">{feature.title}</EditableText>
                         </h3>
                         <EditableText pagina="laboratory" path={`features.${idx}.desc`} tag="p" className="text-gray-600 font-light leading-relaxed">
                            {feature.desc}
                         </EditableText>

                         {/* Scanner Effect */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 overflow-hidden">
                            <div className="scanner-line"></div>
                         </div>
                      </div>
                    </StaggerItem>
                  );
                })}

                {/* Add New Card Button */}
                {isVisualEditorActive && (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary/30 transition-all group min-h-[300px]">
                    <button 
                      onClick={() => addItemToArray('laboratory', 'features', { 
                        title: 'Nova Infraestrutura', 
                        desc: 'Descrição detalhada do novo equipamento ou área laboratorial.', 
                        icon: 'Activity' 
                      })}
                      className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10">
                        <Plus size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Adicionar Item Lab</span>
                    </button>
                  </div>
                )}
            </StaggerContainer>

         </div>
      </section>
    </div>
  );
};

export default Laboratory;
