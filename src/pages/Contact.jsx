import React, { useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { FadeIn, SlideIn } from '../components/ui/AnimWrapper';
import { MapPin, Phone, Mail, Send, ShieldAlert, Clock, MessageSquare } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';
import EditableText from '../components/ui/EditableText';

const Contact = () => {
  const siteMedia = useAdminStore((state) => state.siteMedia);
  const global = useAdminStore((state) => state.siteContent?.global);
  const adicionarLead = useAdminStore((state) => state.adicionarLead);
  const whatsappNumber = (global?.whatsappNumber || global?.whatsapp || '551930126360').replace(/\D/g, '');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [contactMode, setContactMode] = useState('message'); // 'message' | 'whatsapp'

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const yImage = useTransform(scrollY, [0, 500], [0, 100]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salva sempre no painel de leads (CRM interno)
    adicionarLead(formData);

    if (contactMode === 'whatsapp') {
      // Limpa caracteres não numéricos do número
      const cleanPhone = whatsappNumber.replace(/\D/g, '');
      
      // Abre o WhatsApp com os dados preenchidos
      const txt = `Nova Mensagem no Site GCA%0A%0ACliente: ${encodeURIComponent(formData.name)}%0ATelefone/WhatsApp: ${encodeURIComponent(formData.phone)}%0AEmail: ${encodeURIComponent(formData.email)}%0AAssunto: ${encodeURIComponent(formData.subject)}%0A%0AMensagem: ${encodeURIComponent(formData.message)}`;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://wa.me/${cleanPhone}?text=${txt}`;
      } else {
        window.open(`https://wa.me/${cleanPhone}?text=${txt}`, '_blank');
      }
    }

    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const heroContent = (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-primary overflow-hidden">
      <motion.div 
        style={{ y: yImage }}
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" 
        style={{ backgroundImage: `url(${siteMedia.contact?.url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-[#18426d] opacity-90"></div>
      <motion.div style={{ y: yHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <SlideIn direction="up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight">
            <EditableText pagina="contact" path="heroTitle" tag="span">Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-accent underline decoration-8 decoration-accent/50 underline-offset-8">GCA</span></EditableText>
          </h1>
          <EditableText pagina="contact" path="heroSubtitle" tag="p" className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            Máquina parada? Precisando de um orçamento comissionado? Preencha os campos ou acione nosso plantão iminente.
          </EditableText>
        </SlideIn>
      </motion.div>
    </section>
  );

  return (
    <div className="w-full bg-[#f6f8f8] relative">
      <SEO
        title="Contato e Localização | GCA Cuiabá MT"
        description="Fale com nosso plantão técnico em Cuiabá-MT. Atendimento para montagem de painéis, manutenção de inversores e IoT em todo Mato Grosso e região (700km)."
        canonical="/entre-em-contato"
      />
      {/* Geometric bg pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none"></div>

      {siteMedia.contact?.link ? (
        <a href={siteMedia.contact.link} target="_self">{heroContent}</a>
      ) : heroContent}

      {/* Divisor Técnico */}
      <div className="relative h-16 bg-[#f6f8f8] overflow-hidden -mt-16 z-20">
        <svg className="absolute bottom-0 w-full h-16 text-[#f6f8f8] fill-current" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path d="M0 54L120 45C240 36 480 18 720 18C960 18 1200 36 1320 45L1440 54V0H1320C1200 0 960 0 720 0C480 0 240 0 120 0H0V54Z"></path>
        </svg>
      </div>

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
                  <EditableText pagina="contact" path="formTitle" tag="h2" className="text-3xl font-black text-gray-900 tracking-tight">Abra um Chamado de Orçamento</EditableText>
                </div>

                {/* Seletor de Modo de Contato */}
                <div className="flex gap-3 mb-8 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setContactMode('message')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${contactMode === 'message' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Mail size={16} /> Enviar Mensagem
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMode('whatsapp')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${contactMode === 'whatsapp' ? 'bg-[#25D366] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Phone size={16} /> Via WhatsApp
                  </button>
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
                      {/* Nome */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome do Contato</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                          className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors"
                          placeholder="João da Silva" />
                      </div>
                      {/* Telefone / WhatsApp — campo principal */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Telefone / WhatsApp <span className="text-accent font-black">*</span>
                        </label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                          className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors"
                          placeholder="(19) 99999-9999" />
                      </div>
                      {/* E-mail */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail Corporativo</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors"
                          placeholder="joao@industria.com.br" />
                      </div>
                      {/* Assunto */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assunto / Equipamento</label>
                        <input type="text" name="subject" required value={formData.subject} onChange={handleChange}
                          className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors"
                          placeholder="Ex: Cotação de Reparo Indramat" />
                      </div>
                    </div>

                    {/* Mensagem */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mensagem e Sintoma do Equipamento</label>
                      <textarea name="message" required rows="4" value={formData.message} onChange={handleChange}
                        className="w-full border-b-2 border-gray-200 px-0 py-3 bg-transparent focus:outline-none focus:border-accent text-gray-900 font-medium transition-colors resize-none"
                        placeholder="Qual a falha apresentada?"></textarea>
                    </div>

                    <button
                      type="submit"
                      className={`group flex items-center justify-center w-full sm:w-auto px-10 py-5 font-black uppercase tracking-widest text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 text-white ${
                        contactMode === 'whatsapp'
                          ? 'bg-[#25D366] hover:bg-[#1ebc59] hover:shadow-[0_10px_20px_rgba(37,211,102,0.35)]'
                          : 'bg-gray-900 hover:bg-accent hover:shadow-[0_10px_20px_rgba(215,25,32,0.3)]'
                      }`}
                    >
                      {contactMode === 'whatsapp' ? (
                        <><Phone size={18} className="mr-3 group-hover:animate-bounce" /> Abrir WhatsApp</>
                      ) : (
                        <><Send size={18} className="mr-3 group-hover:animate-bounce" /> Enviar Mensagem</>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Infos Lateral Dark Mode */}
              <div className="lg:w-2/5 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent opacity-30 blur-[100px] rounded-full"></div>

                <div className="relative z-10 p-10 lg:p-16 h-full flex flex-col justify-center text-white space-y-12">
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2 font-mono text-xs text-accent tracking-widest uppercase">
                      <Phone size={14} /> Plantão Direto
                    </div>
                    <EditableText pagina="global" path="phone" tag="p" className="text-2xl font-light tracking-tight">{global?.phone || ''}</EditableText>
                    <p className="text-xl font-medium tracking-tight text-gray-300">Whatsapp: <EditableText pagina="global" path="whatsapp" tag="span">{global?.whatsapp || ''}</EditableText></p>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-3 mb-2 font-mono text-xs text-blue-400 tracking-widest uppercase">
                      <Mail size={14} /> E-mail Geral
                    </div>
                    <EditableText pagina="global" path="email" tag="p" className="text-lg font-light tracking-tight">{global?.email || ''}</EditableText>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-3 mb-2 font-mono text-xs text-gray-400 tracking-widest uppercase">
                      <MapPin size={14} /> Laboratório Central
                    </div>
                    <div className="text-base font-light tracking-wide leading-relaxed text-gray-300">
                      <EditableText pagina="global" path="address" tag="p">{global?.address || ''}</EditableText>
                      CEP <EditableText pagina="global" path="cep" tag="span">{global?.cep || ''}</EditableText> — <EditableText pagina="global" path="cityState" tag="span">{global?.cityState || ''}</EditableText>
                    </div>
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
