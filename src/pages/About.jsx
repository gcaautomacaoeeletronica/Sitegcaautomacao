import React from 'react';
import { Target, Lightbulb, CheckCircle2, Eye } from 'lucide-react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';

const About = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const aboutContent = useAdminStore((state) => state.siteContent?.about);
  
  const bannerContent = (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#0a0f18] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${siteMedia.about?.url})` }}></div>
      <div className="absolute inset-0 bg-gray-900/80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideIn direction="up">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Nossa História
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            <EditableText pagina="about" path="heroTitle" tag="span">
              {(aboutContent?.heroTitle || '').split(' ').map((word, i) => i === (aboutContent?.heroTitle || '').split(' ').length - 1 ? <span key={i} className="text-accent">{word}</span> : word + ' ')}
            </EditableText>
          </h1>
          <EditableText pagina="about" path="heroSubtitle" tag="p" className="text-xl text-blue-100 max-w-2xl font-light leading-relaxed">
            {aboutContent?.heroSubtitle || ''}
          </EditableText>
        </SlideIn>
      </div>
    </section>
  );

  return (
    <div className="w-full bg-slate-50 relative overflow-hidden">
      <SEO 
        title="Sobre a GCA | Experiência e Precisão"
        description="Conheça a história e os valores da GCA Automação. Desde 2013 liderando o mercado de manutenção eletrônica industrial de alta complexidade."
        canonical="/sobre-nos"
      />
      
      {/* Background patterns genéricos */}
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none"></div>

      {siteMedia.about?.link ? (
        <a href={siteMedia.about.link} target="_self">{bannerContent}</a>
      ) : bannerContent}

      {/* Institucional (Split Screen Style) */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-px bg-accent"></div>
                  <EditableText pagina="about" path="foundationBadge" tag="h2" className="text-sm font-bold text-accent tracking-widest uppercase">
                    {aboutContent?.foundationBadge || ''}
                  </EditableText>
                </div>
                <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  <EditableText pagina="about" path="historyTitle" tag="span">
                    {(aboutContent?.historyTitle || '').split(' ').map((word, i) => i >= 4 ? <span key={i} className="text-primary font-light block md:inline"> {word}</span> : i === 3 ? word + ' ' : word + ' ')}
                  </EditableText>
                </h3>
                <EditableText pagina="about" path="historyText" tag="p" className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {aboutContent?.historyText || ''}
                </EditableText>
                <div className="relative pl-8 py-4 my-10 bg-white border border-gray-200 shadow-sm before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-accent">
                  <p className="text-gray-800 italic text-lg leading-relaxed font-medium">
                    "<EditableText pagina="about" path="quote" tag="span">{aboutContent?.quote || ''}</EditableText>"
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="w-full lg:w-1/2 relative">
               <SlideIn direction="right">
                 {/* Decorative Elements */}
                 <div className="relative group">
                   <div className="relative aspect-[4/3] bg-gray-900 rounded-sm overflow-hidden shadow-lg border border-gray-200">
                      {siteMedia.aboutSide?.url ? (
                        <div className="w-full h-full">
                           <img src={siteMedia.aboutSide.url} alt="Sobre Nós" className="w-full h-full object-cover" />
                           {siteMedia.aboutSide.link && (
                             <a href={siteMedia.aboutSide.link} className="absolute inset-0 z-10" target="_self"></a>
                           )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0f18] to-primary-dark">
                          <div className="w-24 h-24 mb-6 relative">
                             <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin"></div>
                             <div className="absolute inset-2 border-b-2 border-blue-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                          </div>
                          <h2 className="text-2xl text-blue-300 font-mono tracking-widest">GCA_HQ_SYS</h2>
                          <p className="text-xs text-gray-500 mt-2 font-mono">ONLINE // SYSTEM ACTIVE</p>
                        </div>
                      )}
                   </div>
                 </div>
               </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* MVV com Cards Premium */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <FadeIn>
               <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Pilares</h2>
               <p className="text-gray-500">A base ética e profissional que rege nossas ações estruturais.</p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            <StaggerItem className="group relative bg-white p-10 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black leading-none group-hover:text-primary transition-colors duration-500">01</div>
              <div className="relative w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <EditableText pagina="about" path="mission" tag="p" className="text-gray-600 leading-relaxed relative z-10">
                {aboutContent?.mission || ''}
              </EditableText>
            </StaggerItem>

            <StaggerItem className="group relative bg-white p-10 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 transform md:translate-y-8">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black leading-none group-hover:text-primary transition-colors duration-500">02</div>
              <div className="relative w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <EditableText pagina="about" path="vision" tag="p" className="text-gray-600 leading-relaxed relative z-10">
                {aboutContent?.vision || ''}
              </EditableText>
            </StaggerItem>

            <StaggerItem className="group relative bg-white p-10 rounded-sm border border-gray-200 shadow-sm hover:border-accent hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black leading-none group-hover:text-accent transition-colors duration-500">03</div>
              <div className="relative w-16 h-16 bg-red-50 text-accent rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Lightbulb size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-accent transition-colors">Valores</h3>
              <ul className="text-gray-600 space-y-3 relative z-10">
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Transparência Integral</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Qualidade Técnica Elevada</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Comprometimento Absoluto</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Ética Profissional Intacta</li>
              </ul>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

export default About;
