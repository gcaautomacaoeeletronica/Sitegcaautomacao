import React, { useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { ICON_MAP } from '../lib/icons';
import { Link } from 'react-router-dom';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';

const AccordionItem = ({ title, items, iconName, path, pagina, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);
  
  const Icon = ICON_MAP[iconName] || ICON_MAP.HelpCircle;

  return (
    <div className={`mb-4 rounded border transition-all duration-300 overflow-hidden relative group ${isOpen ? 'bg-white border-accent/30 shadow-sm' : 'bg-white/50 border-gray-100 hover:border-gray-200'}`}>
      {/* Icon Selector */}
      <IconSelector pagina={pagina} path={`${path}.icon`} currentIcon={iconName} />

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${isOpen ? 'bg-red-50 text-accent' : 'bg-blue-50 text-primary'}`}>
            <Icon size={20} />
          </div>
          <EditableText pagina={pagina} path={`${path}.title`} tag="h3" className="text-xl font-bold text-gray-900 tracking-tight text-left">
            {title}
          </EditableText>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-0 ml-14">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start group/item relative">
                 <span className="mt-1.5 mr-3 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                 <EditableText pagina={pagina} path={`${path}.items.${idx}`} tag="span" className="text-gray-600 font-medium leading-relaxed">
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

const Services = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const servicesContent = useAdminStore((state) => state.siteContent?.services);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  const heroContent = (
    <section className="relative pt-32 pb-24 top-0 bg-[#0a0f18] overflow-hidden">
      <motion.div 
        style={{ y: yImage }}
        className="absolute inset-0 bg-cover bg-center opacity-70 shadow-inner" 
        style={{ backgroundImage: `url(${siteMedia.services?.url})` }}
      />
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      <div className="absolute inset-0 bg-[#0a0f18]/80"></div>
      <motion.div style={{ y: yHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <SlideIn direction="up">
          <EditableText pagina="services" path="hero.badge" tag="span" className="inline-block py-1.5 px-4 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold tracking-widest uppercase mb-6 text-xs">
            {servicesContent?.hero?.badge || ''}
          </EditableText>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight uppercase leading-[1.1]">
            <EditableText pagina="services" path="hero.title" tag="span">{servicesContent?.hero?.title || ''}</EditableText> <br/>
            <EditableText pagina="services" path="hero.highlight" tag="span" className="text-gray-300">{servicesContent?.hero?.highlight || ''}</EditableText>
          </h1>
          <EditableText pagina="services" path="hero.desc" tag="p" className="text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
            {servicesContent?.hero?.desc || ''}
          </EditableText>
        </SlideIn>
      </motion.div>
    </section>
  );

  return (
    <div className="w-full bg-[#f8fafb] relative overflow-hidden">
      <SEO 
        title="Manutenção Eletrônica Industrial | Inversores, Servodrives e CLPs"
        description="Reparo especializado de servodrives Bosch Rexroth Indradrive, inversores WEG, Siemens Sinamics, Allen-Bradley Kinetix, Parker, CLPs e IHMs industriais."
        canonical="/manutencao-e-automacao-industrial"
        keywords="reparo servodrive bosch rexroth, conserto inversor siemens sinamics, manutenção inversor allen-bradley, reparo inversor weg americana, conserto CLP siemens s7, manutenção CLP allen-bradley"
        breadcrumbs={[{ name: 'Serviços', path: '/manutencao-e-automacao-industrial' }]}
      />
      
      {/* Background Sólido */}

      {siteMedia.services?.link ? (
        <a href={siteMedia.services.link} target="_self">{heroContent}</a>
      ) : heroContent}

      {/* Divisor Técnico */}
      <div className="relative h-16 bg-[#f8fafb] overflow-hidden -mt-16 z-20">
        <svg className="absolute bottom-0 w-full h-16 text-[#f8fafb] fill-current" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0 54L120 45C240 36 480 18 720 18C960 18 1200 36 1320 45L1440 54V0H1320C1200 0 960 0 720 0C480 0 240 0 120 0H0V54Z"></path>
        </svg>
      </div>

      {/* Accordion Sections - Catalog */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn className="mb-12 text-center">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Catálogo de <span className="text-accent underline decoration-4 underline-offset-4">Especialidades</span></h2>
            <p className="text-gray-500 text-lg">Navegue pelas nossas frentes de reparo técnico abaixo.</p>
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
                   <Plus size={16} /> Adicionar Nova Categoria de Reparo
                 </button>
               </div>
             )}
          </StaggerContainer>

        </div>
      </section>

      {/* Laboratório Section Mini */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
         <div className="absolute top-0 right-0 pattern-dots opacity-30 w-64 h-64"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               <FadeIn>
                  <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    <EditableText pagina="services" path="laboratoryMini.title" tag="span">{servicesContent?.laboratoryMini?.title || ''}</EditableText> <br/>
                    <EditableText pagina="services" path="laboratoryMini.highlight" tag="span" className="text-primary">{servicesContent?.laboratoryMini?.highlight || ''}</EditableText>
                  </h2>
                  <EditableText pagina="services" path="laboratoryMini.desc" tag="p" className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
                    {servicesContent?.laboratoryMini?.desc || ''}
                  </EditableText>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 mb-8">
                     <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Zap size={18} className="text-accent" /> Gigas de teste para CLP e IHM</h4>
                     <ul className="space-y-2 text-sm text-gray-600">
                        {(servicesContent?.laboratoryMini?.items || []).map((item, idx) => (
                           <li key={idx}>• <EditableText pagina="services" path={`laboratoryMini.items.${idx}`} tag="span">{item}</EditableText></li>
                        ))}
                     </ul>
                  </div>

                  <Link to="/estrutura" className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
                     Conheça Nossa Estrutura Completa <ArrowRight size={20} />
                  </Link>
               </FadeIn>

               <div className="relative">
                  <SlideIn direction="right">
                    <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg relative border border-gray-200 group">
                        <img 
                          src={siteMedia.servicesLab?.url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"} 
                          alt="Laboratório Eletrônico" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                        {siteMedia.servicesLab?.link && (
                          <a href={siteMedia.servicesLab.link} target="_self" className="absolute inset-0 z-10"></a>
                        )}
                    </div>
                  </SlideIn>
               </div>

            </div>
         </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative bg-[#0a0f18] flex justify-center text-center">
         <FadeIn className="px-4">
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">
               GCA <span className="text-accent">Automação</span>
            </h3>
            <p className="text-gray-400 italic">Manutenção Eletrônica Industrial</p>
         </FadeIn>
      </section>

    </div>
  );
};

export default Services;
