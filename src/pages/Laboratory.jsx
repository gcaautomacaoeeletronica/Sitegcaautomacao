import React from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import * as Icons from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';
import IconSelector from '../components/ui/IconSelector';
import { Plus, Trash2, Zap, Activity, Cpu } from 'lucide-react';

const Laboratory = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const labContent = useAdminStore((state) => state.siteContent?.laboratory);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const addItemToArray = useAdminStore((state) => state.addItemToArray);
  const removeItemFromArray = useAdminStore((state) => state.removeItemFromArray);

  const heroContent = (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url(${siteMedia.laboratory?.url})` }}></div>
      <div className="absolute inset-0 bg-primary-dark/80 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideIn>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tighter">
            <EditableText pagina="laboratory" path="hero.title" tag="span">{labContent?.hero?.title || ''}</EditableText> <br/>
            <EditableText pagina="laboratory" path="hero.highlight" tag="span" className="font-light">{labContent?.hero?.highlight || ''}</EditableText>
          </h1>
          <EditableText pagina="laboratory" path="hero.desc" tag="p" className="text-xl text-blue-100 max-w-2xl font-light">
            {labContent?.hero?.desc || ''}
          </EditableText>
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
                    <EditableText pagina="laboratory" path="performance.title" tag="span">{labContent?.performance?.title || ''}</EditableText> <br/>
                    <EditableText pagina="laboratory" path="performance.highlight" tag="span" className="text-accent underline decoration-4 underline-offset-4">{labContent?.performance?.highlight || ''}</EditableText>
                  </h2>
                  <EditableText pagina="laboratory" path="performance.text1" tag="p" className="text-lg text-gray-600 leading-relaxed mb-6 font-light">
                    {labContent?.performance?.text1 || ''}
                  </EditableText>
                  <EditableText pagina="laboratory" path="performance.text2" tag="p" className="text-lg text-gray-600 leading-relaxed font-light">
                    {labContent?.performance?.text2 || ''}
                  </EditableText>
               </FadeIn>
               
               <div className="order-1 lg:order-2 w-full aspect-square md:aspect-video lg:aspect-square bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center shadow-sm">
                   <span className="text-gray-400 font-bold uppercase tracking-widest text-sm text-center px-4">
                      {siteMedia.laboratory?.url ? (
                        <img src={siteMedia.laboratory.url} alt="Lab" className="w-full h-full object-cover rounded-sm absolute inset-0 mix-blend-multiply opacity-50" />
                      ) : "Área Restrita (Laboratório)"}
                   </span>
               </div>

            </div>

            {/* Feature Cards Modernos Dinâmicos */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(labContent?.features || []).map((feature, idx) => {
                  const DynamicIcon = Icons[feature.icon] || Icons.HelpCircle;
                  return (
                    <StaggerItem key={idx} className={`group ${idx === 1 ? 'mt-0 md:mt-8' : idx === 2 ? 'mt-0 md:mt-16' : ''}`}>
                      <div className="bg-white rounded-sm p-10 shadow-sm hover:shadow-md border border-gray-200 h-full transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
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

                         <div className="relative mb-8">
                            <div className="w-14 h-14 bg-blue-50 rounded flex items-center justify-center border border-blue-100 group-hover:bg-primary group-hover:text-white transition-all">
                               <DynamicIcon size={28} className="transition-transform group-hover:scale-110" />
                            </div>
                            {/* Icon Selector */}
                            <IconSelector pagina="laboratory" path={`features.${idx}.icon`} currentIcon={feature.icon} />
                         </div>

                         <h3 className="font-bold text-gray-900 text-2xl mb-4">
                            <EditableText pagina="laboratory" path={`features.${idx}.title`} tag="span">{feature.title}</EditableText>
                         </h3>
                         <EditableText pagina="laboratory" path={`features.${idx}.desc`} tag="p" className="text-gray-600 font-light leading-relaxed">
                            {feature.desc}
                         </EditableText>
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
