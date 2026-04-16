import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { FadeIn } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts } = useAdminStore();
  
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={post.titulo}
        description={post.resumo}
        ogImage={post.imageUrl}
        ogType="article"
        canonical={`/blog/${post.id}`}
      />
      {/* Header do Artigo */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#0a0f18] overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/90"></div>
        <div className="absolute inset-0 pattern-grid opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <Link to="/blog" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 group">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Blog
            </Link>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight uppercase">
              {post.titulo}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" /> {post.data}</span>
               <span className="flex items-center gap-2"><User size={16} className="text-accent" /> {post.autor}</span>
               <span className="flex items-center gap-2"><Clock size={16} className="text-accent" /> 5 min de leitura</span>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Conteúdo do Artigo */}
      <article className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            {/* Imagem de Destaque Sólida */}
            <div className="mb-16 rounded border border-gray-200 overflow-hidden shadow-2xl">
               <img 
                 src={post.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200'} 
                 alt={post.titulo}
                 className="w-full h-auto object-cover"
               />
            </div>

            {/* Corpo do Texto */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-light">
               <p className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-6 mb-12 italic">
                  {post.resumo}
               </p>
               
               {/* Transforma quebras de linha em parágrafos */}
               {post.conteudo.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-8 last:mb-0">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {line}
                        {lIdx !== paragraph.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
               ))}
            </div>

            {/* Footer do Artigo / Share */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-white font-bold">
                     GCA
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold uppercase tracking-wider text-xs">{post.autor}</p>
                    <p className="text-gray-500 text-xs">Especialista em Automação Industrial</p>
                  </div>
               </div>
               
               <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold uppercase tracking-widest text-xs transition-colors">
                  <Share2 size={16} /> Compartilhar Artigo
               </button>
            </div>
          </FadeIn>
        </div>
      </article>

      {/* CTA Final */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Precisa de soluções técnicas para sua indústria?</h3>
            <Link to="/entre-em-contato" className="inline-block bg-primary hover:bg-accent text-white font-bold px-10 py-4 rounded uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-primary/20">
               Fale com nossos especialistas
            </Link>
         </div>
      </section>
    </div>
  );
};

export default BlogPost;
