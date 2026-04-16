import React, { useState } from 'react';
import { FadeIn, SlideIn } from '../components/ui/AnimWrapper';
import { MapPin, Phone, Mail, Clock, Send, ShieldAlert } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';

const Contact = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const global = useAdminStore((state) => state.siteContent.global);
  const adicionarLead = useAdminStore((state) => state.adicionarLead);
  const whatsappNumber = useAdminStore((state) => state.siteContent.global.whatsappNumber) || '5519971206717';
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarLead(formData);
    setSubmitted(true);

    // Notificacao automatica via WhatsApp
    const txt = `Nova Mensagem no Site GCA%0A%0ACliente: ${encodeURIComponent(formData.name)}%0AEmail: ${encodeURIComponent(formData.email)}%0AAssunto: ${encodeURIComponent(formData.subject)}%0A%0AMensagem: ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${txt}`, '_blank');

    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const heroContent = (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url(${siteMedia.contact?.url})` }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-[#18426d] opacity-90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <SlideIn direction="up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight">
            Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-accent underline decoration-8 decoration-accent/50 underline-offset-8">GCA</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            Máquina parada? Precisando de um orçamento comissionado? Preencha os campos ou acione nosso plantão iminente.
          </p>
        </SlideIn>
      </div>
    </section>
  );

  return (
    <div className="w-full bg-[#f6f8f8] relative">
      <SEO 
        title="Contato e Localização | GCA Automação"
        description="Fale com nosso plantão técnico, solicite orçamentos ou visite nosso laboratório em Americana-SP. Atendimento ágil para todo o parque industrial."
        canonical="/entre-em-contato"
      />
      {/* Geometric bg pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none"></div>

      {siteMedia.contact?.link ? (
        <a href={siteMedia.contact.link} target="_self">{heroContent}</a>
      ) : heroContent}

      <section className="py-20 relative z-10 -mt-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <FadeIn>
               <div className="glass rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                  
                  {/* Formulário Hi-End */}
                  <div className="p-10 lg:p-16 lg:w-3/5 bg-white/90 backdrop-blur-xl">
                     <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-accent rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-red-100">
                           <ShieldAlert size={14} /> Atendimento Ágil
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Abra um Chamado de Orçamento</h2>
                     </div>

                     {submitted ? (
                       <FadeIn className="py-12 text-center bg-green-50 rounded-2xl border border-green-100">
                          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                             <Send size={32} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h3>
                          <p className="text-gray-600 max-w-sm mx-auto">Recebemos sua solicitação. Um especialista técnico entrará em contato em breve.</p>
                          <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-bold text-green-700 underline underline-offset-4 hover:text-green-800">Enviar outra mensagem</button>
                       </FadeIn>
                     ) : (
                       <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome do Contato</label>
                              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors" placeholder="João Exemplo" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail Corporativo</label>
                              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors" placeholder="joao@industria.com.br" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assunto Inicial</label>
                           <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors" placeholder="Ex: Cotação de Reparo Indramat" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mensagem e Sintoma do Equipamento</label>
                           <textarea name="message" required rows="4" value={formData.message} onChange={handleChange} className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors resize-none" placeholder="Qual a falha apresentada?"></textarea>
                        </div>
                        
                        <button type="submit" className="group flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-gray-900 hover:bg-accent text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all duration-300 hover:shadow-[0_10px_20px_rgba(215,25,32,0.3)] hover:-translate-y-1">
                           <Send size={18} className="mr-3 group-hover:animate-bounce" />
                           Submeter Pedido
                        </button>
                      </form>
                     )}
                  </div>

                  {/* Infos Lateral Super Dark Mode */}
                  <div className="lg:w-2/5 bg-gray-900 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                     <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent opacity-30 blur-[100px] rounded-full"></div>
                     
                     <div className="relative z-10 p-10 lg:p-16 h-full flex flex-col justify-center text-white space-y-12">
                        
                        <div className="group">
                           <div className="flex items-center gap-3 mb-2 font-mono text-xs text-accent tracking-widest uppercase">
                              <Phone size={14} /> Plantão Direto
                           </div>
                           <p className="text-2xl font-light tracking-tight">{global.phone}</p>
                           <p className="text-xl font-medium tracking-tight text-gray-300">Whatsapp: {global.whatsapp}</p>
                        </div>
                        
                        <div className="group">
                           <div className="flex items-center gap-3 mb-2 font-mono text-xs text-blue-400 tracking-widest uppercase">
                              <Mail size={14} /> E-mail Geral
                           </div>
                           <p className="text-lg font-light tracking-tight">{global.email}</p>
                        </div>
                        
                        <div className="group">
                           <div className="flex items-center gap-3 mb-2 font-mono text-xs text-gray-400 tracking-widest uppercase">
                              <MapPin size={14} /> Laboratório Central
                           </div>
                           <p className="text-base font-light tracking-wide leading-relaxed text-gray-300">
                              {global.address}<br/>
                              CEP {global.cep}
                           </p>
                        </div>

                     </div>
                  </div>

               </div>
            </FadeIn>

         </div>
      </section>

    </div>
  );
};

export default Contact;
