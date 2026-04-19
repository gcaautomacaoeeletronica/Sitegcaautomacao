import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/ui/SEO';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/AnimWrapper';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const { blogPosts, isInitialLoading } = useAdminStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO 
        title="Blog Técnico GCA | Automação e Inversores em Cuiabá MT"
        description="Artigos sobre montagem de painéis, manutenção de inversores Weg/Danfoss e IoT industrial. Conteúdo técnico especializado da GCA Automação em Mato Grosso."
        canonical="/blog"
        keywords="blog automação cuiabá, dicas manutenção inversores mt, montagem painéis elétricos artigos, tecnologia iot industrial cuiabá"
        breadcrumbs={[{ name: 'Blog Técnico', path: '/blog' }]}
      />
      {/* Banner de Cabeçalho Corporativo */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#0a0f18] overflow-hidden">
        <div className="absolute inset-0 bg-primary-dark/90"></div>
        <div className="absolute inset-0 pattern-grid opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded text-accent text-xs font-bold uppercase tracking-widest mb-6">
               <Newspaper size={14} /> GCA Insight & Tecnologia
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 uppercase tracking-tight">
              Nosso <span className="text-accent">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mt-6">
              Conteúdo técnico, tendências da indústria 4.0 e dicas especializadas para otimizar sua linha de produção.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid de Artigos */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isInitialLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden p-6 space-y-4">
                  <Skeleton height="224px" rounded="rounded-sm" />
                  <div className="space-y-2">
                    <Skeleton width="40%" height="14px" />
                    <Skeleton width="80%" height="24px" />
                    <Skeleton width="100%" height="60px" />
                  </div>
                </div>
              ))
            ) : blogPosts.filter(p => new Date(p.data) <= new Date()).map((post) => (
              <StaggerItem key={post.id}>
                <Link to={`/blog/${post.id}`} className="group block h-full bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                  {/* Container da Imagem */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'} 
                      alt={post.titulo}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                       <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                         {post.autor ? post.autor.split(' ')[1] || 'Técnico' : 'Técnico'}
                       </span>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6 flex flex-col h-[calc(100%-14rem)]">
                    <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                       <span className="flex items-center gap-1"><Calendar size={12} className="text-accent"/> {new Date(post.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                       <span className="flex items-center gap-1"><User size={12}/> {post.autor || 'Admin'}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                       {post.titulo}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                       {post.resumo}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                       Leia mais <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {blogPosts.filter(p => new Date(p.data) <= new Date()).length === 0 && (
            <div className="text-center py-20 bg-white rounded border border-dashed border-gray-200">
               <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">Nenhum artigo publicado ainda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
