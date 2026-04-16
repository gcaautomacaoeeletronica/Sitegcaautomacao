import React, { useState } from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import { ChevronDown, Cpu, Zap, Settings, Activity, Wrench, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';

const AccordionItem = ({ title, items, icon: Icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mb-4 rounded border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white border-accent/30 shadow-sm' : 'bg-white/50 border-gray-100 hover:border-gray-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${isOpen ? 'bg-red-50 text-accent' : 'bg-blue-50 text-primary'}`}>
            <Icon size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight text-left">{title}</h3>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-0 ml-14">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start">
                 <span className="mt-1.5 mr-3 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                 <span className="text-gray-600 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const servicesContent = useAdminStore((state) => state.siteContent?.services);

  const generalEquipments = [
    "Inversores de frequência", "Servodrives", "Conversores CA/CC", "Retificadores comuns ou regenerativos",
    "Soft Starter", "IHM", "CLP", "Controladores em geral", "Placas eletrônicas em geral"
  ];

  const servodrives = [
    "Sinamics", "Simodrive", "Parker SPD, LVD, SLVD", "Bosch Rexroth Indradrive, EcoDrive",
    "Allen-Bradley Kinetix6000, 6500, 5500, 5700, Ultra3000", "Axor Minimagnum", "Mitsubishi", 
    "Panasonic", "SEW Movidrive", "Simovert Masterdrives MC"
  ];

  const galvanoplastia = ["Retificador a tiristor", "Retificadores a transistor (chaveado)"];
  const kba = ["Display HMI TA53", "CLP MCGR3", "Servodrive REPW2", "HUB SBAH1", "Servomotores"];
  const teares = ["Servodrive/Controlador HI-DRIVE PROMATECH ITEMA", "DEIMOTION SL TEX N' 0565"];
  const siemens = ["Fonte chaveada SITOP", "Inversores de Frequência MM440", "Inversores Simovert Masterdrives"];
  const robots = ["Solda ponto REXROTH PSI6000", "Cartão de Controle / CPU ABB", "Pendent ABB", "Módulo de potência SERVOPACK Yaskawa"];
  const injetoras = ["Teachbox", "Wittmann EU-186 W-DRIVE 20A/30A/40A", "Controlador de temperatura Yudo CW662", "Controlador de temperatura Winmold / Polimold / Tecnoserv", "Sequenciador Yudo CW-661", "Console de operação", "CLP"];
  const eletrica = ["Reles de Proteção", "Disjuntores de Média Tensão", "Retificador carregador de baterias"];
  const camaraQuente = ["Yudo CW301", "Yudo TW600", "Yudo CW661", "Yudo CW662", "Yudo CGF-560S", "Heuroheaters", "Polimold", "Tecnoserv"];

  const heroContent = (
    <section className="relative pt-32 pb-24 top-0 bg-[#0a0f18] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-70 shadow-inner" style={{ backgroundImage: `url(${siteMedia.services?.url})` }}></div>
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      <div className="absolute inset-0 bg-[#0a0f18]/80"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <SlideIn direction="up">
          <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold tracking-widest uppercase mb-6 text-xs">
            {servicesContent?.hero?.badge || ''}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight uppercase leading-[1.1]">
            {servicesContent?.hero?.title || ''} <br/>
            <span className="text-gray-300">{servicesContent?.hero?.highlight || ''}</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
            {servicesContent?.hero?.desc || ''}
          </p>
        </SlideIn>
      </div>
    </section>
  );

  return (
    <div className="w-full bg-[#f8fafb] relative overflow-hidden">
      <SEO 
        title="Manutenção Eletrônica Industrial | Especializada"
        description="Reparo de servodrives, inversores de frequência, CLPs e IHMs. Especialistas Bosch Rexroth, Allen-Bradley, Siemens e Weg."
        canonical="/manutencao-e-automacao-industrial"
      />
      
      {/* Background Sólido */}

      {siteMedia.services?.link ? (
        <a href={siteMedia.services.link} target="_self">{heroContent}</a>
      ) : heroContent}

      {/* Accordion Sections - Catalog */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn className="mb-12 text-center">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Catálogo de <span className="text-accent underline decoration-4 underline-offset-4">Especialidades</span></h2>
            <p className="text-gray-500 text-lg">Navegue pelas nossas frentes de reparo técnico abaixo.</p>
          </FadeIn>

          <StaggerContainer>
             <StaggerItem><AccordionItem title="Reparo Geral de Equipamentos Eletrônicos" items={generalEquipments} icon={Settings} defaultOpen={true} /></StaggerItem>
             <StaggerItem><AccordionItem title="Servodrives" items={servodrives} icon={Activity} /></StaggerItem>
             <StaggerItem><AccordionItem title="Reparo e Reforma de Retificadores (Galvanoplastia)" items={galvanoplastia} icon={Zap} /></StaggerItem>
             <StaggerItem><AccordionItem title="Máquinas e Equipamentos Gráficos KBA" items={kba} icon={Cpu} /></StaggerItem>
             <StaggerItem><AccordionItem title="Reparos de Acionamentos de Teares" items={teares} icon={Wrench} /></StaggerItem>
             <StaggerItem><AccordionItem title="Equipamentos SIEMENS" items={siemens} icon={Cpu} /></StaggerItem>
             <StaggerItem><AccordionItem title="Robôs e Equipamentos de Solda" items={robots} icon={Settings} /></StaggerItem>
             <StaggerItem><AccordionItem title="Equipamentos de Injetoras" items={injetoras} icon={Activity} /></StaggerItem>
             <StaggerItem><AccordionItem title="Reparo de Controladores de Câmara Quente" items={camaraQuente} icon={Zap} /></StaggerItem>
             <StaggerItem><AccordionItem title="Equipamentos de Distribuição Elétrica" items={eletrica} icon={Shield} /></StaggerItem>
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
                    {servicesContent?.laboratoryMini?.title || ''} <br/>
                    <span className="text-primary">{servicesContent?.laboratoryMini?.highlight || ''}</span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
                    {servicesContent?.laboratoryMini?.desc || ''}
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 mb-8">
                     <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Zap size={18} className="text-accent" /> Gigas de teste para CLP e IHM</h4>
                     <ul className="space-y-2 text-sm text-gray-600">
                        {(servicesContent?.laboratoryMini?.items || []).map((item, idx) => (
                           <li key={idx}>• {item}</li>
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
