import React, { useState } from 'react';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import { Search, FolderDown, Download, FileText, X, ExternalLink } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAdminStore } from '../store/adminStore';

const Downloads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const marcas = useAdminStore((state) => state.marcas);

  const selectedBrand = marcas.find(m => m.id === selectedBrandId);
  const filtered = marcas.filter(m => {
     const matchName = m.nome.toLowerCase().includes(searchTerm.toLowerCase());
     const matchFile = Array.isArray(m.manuais) && m.manuais.some(man => man.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
     return matchName || matchFile;
  });

  return (
    <div className="w-full bg-[#f6f8f8] min-h-screen relative overflow-hidden">
      <SEO 
        title="Downloads de Manuais e Datasheets"
        description="Acesse nosso acervo técnico de manuais Bosch Rexroth, Indramat, Siemens, ABB e outras grandes marcas industriais."
        canonical="/download-de-manuais"
      />
      
      {/* Drawer / Modal de Documentos selecionados */}
      {selectedBrand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedBrandId(null)}></div>
           <FadeIn className="relative w-full max-w-2xl bg-white rounded-sm shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-[#0a0f18] p-8 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded ${selectedBrand.iconColor} flex items-center justify-center font-bold text-2xl shadow-sm`}>
                       {selectedBrand.nome.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-2xl font-black uppercase tracking-widest">{selectedBrand.nome}</h2>
                       <p className="text-gray-400 text-sm">Arquivos e Manuais Disponíveis</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedBrandId(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto bg-gray-50/50">
                 {selectedBrand.manuais && selectedBrand.manuais.length > 0 ? (
                    <div className="space-y-4">
                       {selectedBrand.manuais.map((manual) => (
                          <a 
                            key={manual.id} 
                            href={manual.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-sm hover:border-primary/50 hover:shadow-md transition-all group"
                          >
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                   <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{manual.titulo}</span>
                                   <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Documento PDF</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 text-primary">
                                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Baixar Agora</span>
                                <Download size={18} />
                             </div>
                          </a>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-16">
                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                          <FolderDown size={32} />
                       </div>
                       <p className="text-gray-900 font-bold text-xl">Nenhum documento anexado</p>
                       <p className="text-gray-500 max-w-xs mx-auto mt-2">Nossa equipe está indexando os manuais desta marca. Tente novamente mais tarde.</p>
                    </div>
                 )}
              </div>
              
              <div className="p-6 bg-white border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-4">Suporte Técnico 24h</p>
                 <a href="/entre-em-contato" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent transition-colors">
                    Solicitar via Chat <ExternalLink size={14} />
                 </a>
              </div>
           </FadeIn>
        </div>
      )}

      {/* Backgrounds Sólidos */}

      {/* Banner Ultra Premium */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#0a0f18] overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f18]/90"></div>
        <div className="absolute inset-0 pattern-grid opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <SlideIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-sm">
               <FolderDown size={14} /> Acervo Técnico Digital
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 uppercase tracking-tight shadow-sm">
              Manuais & <span className="text-accent">Datasheets</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mt-6">
              Acesse nosso acervo de manuais técnicos e guias de parametrização simplificados das maiores marcas do mundo automotivo e fabril.
            </p>
          </SlideIn>
        </div>
      </section>

      <section className="py-20 relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
               <div className="bg-white rounded border border-gray-200 shadow-sm">
                  <div className="p-8 md:p-14">
                     
                     {/* Search Input High-End */}
                     <div className="relative max-w-2xl mx-auto mb-16">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                           <Search className="h-6 w-6 text-primary/50" />
                        </div>
                        <input
                           type="text"
                           placeholder="Qual fabricante você procura?"
                           className="block w-full pl-16 pr-6 py-5 border border-gray-200 rounded focus:ring-0 focus:border-primary/50 bg-white text-gray-900 shadow-sm hover:shadow-md placeholder-gray-400 font-medium text-xl transition-all outline-none"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>

                     {/* Grid de Marcas */}
                     <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filtered.map((marca) => (
                           <StaggerItem key={marca.id}>
                              <button 
                                onClick={() => setSelectedBrandId(marca.id)}
                                className="w-full group relative bg-white border border-gray-200 hover:border-primary/50 rounded shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-4 h-full text-center overflow-hidden hover:-translate-y-1"
                              >
                                 <div className={`h-12 w-12 rounded-sm ${marca.iconColor || 'bg-slate-50'} text-white flex items-center justify-center font-bold transition-all transform group-hover:scale-110 shadow-sm`}>
                                    {marca.nome.charAt(0)}
                                 </div>
                                 <div>
                                    <h3 className="text-sm md:text-base font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-widest">{marca.nome}</h3>
                                    
                                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 font-bold transition-all">
                                       <FileText size={12} /> {Array.isArray(marca.manuais) ? marca.manuais.length : 0} Arquivos
                                    </div>

                                 </div>
                              </button>
                           </StaggerItem>
                        ))}
                     </StaggerContainer>

                     {filtered.length === 0 && (
                        <div className="text-center py-24 bg-white rounded border border-dashed border-gray-200">
                           <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mx-auto mb-4 text-gray-300">
                              <FolderDown size={32} />
                           </div>
                           <p className="text-gray-800 font-bold text-2xl mb-2">Fabricante não encontrado</p>
                           <p className="text-gray-500 text-lg">Não encontramos resultados para "{searchTerm}".</p>
                           <a href="/entre-em-contato" className="mt-6 inline-block px-8 py-3 bg-primary text-white rounded font-bold uppercase tracking-widest text-sm hover:bg-accent transition-colors">
                              Solicitar via Suporte
                           </a>
                        </div>
                     )}
                  </div>
               </div>
            </FadeIn>
         </div>
      </section>
    </div>
  );
};

export default Downloads;
