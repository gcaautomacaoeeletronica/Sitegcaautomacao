import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { SITE_CONTENT_DEFAULT, SITE_MEDIA_DEFAULT } from '../data/initialData';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminEmail: null,
  isAuthLoading: true,
  isVisualEditorActive: false,
  toggleVisualEditor: () => set(state => ({ isVisualEditorActive: !state.isVisualEditorActive })),
  admins: [],
  leads: [],
  marcas: [],
  blogPosts: [],
  siteMedia: SITE_MEDIA_DEFAULT,
  siteContent: SITE_CONTENT_DEFAULT,

  // Funcões de Fetch (Disponibilizadas globalmente para atualizações manuais)
  fetchLeads: async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) set({ leads: data.map(l => ({ ...l, data: l.created_at, lido: l.read })) });
  },
  fetchBlog: async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) set({ blogPosts: data.map(p => ({ ...p, titulo: p.title, resumo: p.summary, conteudo: p.content, imageUrl: p.image_url, autor: p.author, data: p.created_at })) });
  },
  fetchMarcas: async () => {
    const { data: marcasData } = await supabase.from('marcas').select('*, downloads(*)');
    if (marcasData) {
      set({ 
        marcas: marcasData.map(m => ({ 
          id: m.id, 
          nome: m.name, 
          iconColor: m.icon_color, 
          manuais: m.downloads ? m.downloads.map(d => ({ id: d.id, titulo: d.title, link: d.link })) : []
        })) 
      });
    }
  },
  fetchConfig: async () => {
    const { data } = await supabase.from('site_config').select('*');
    if (data) {
      const content = data.find(c => c.key === 'siteContent')?.data || SITE_CONTENT_DEFAULT;
      const media = data.find(c => c.key === 'siteMedia')?.data || SITE_MEDIA_DEFAULT;
      set({ siteContent: content, siteMedia: media });
    }
  },

  // Inicialização e Listeners
  init: async () => {
    console.log('Iniciando Supabase Sync...');

    const { data: { session } } = await supabase.auth.getSession();
    set({ isAuthenticated: !!session, adminEmail: session ? session.user.email : null, isAuthLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAuthenticated: !!session, adminEmail: session ? session.user.email : null, isAuthLoading: false });
    });

    // 2. Fetch Inicial
    const { fetchLeads, fetchBlog, fetchMarcas, fetchConfig } = get();
    await Promise.all([fetchLeads(), fetchBlog(), fetchMarcas(), fetchConfig()]);

    // 3. Listeners Realtime (se falhar, temos os fetchers diretos agindo nos botões)
    supabase.channel('public_leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchLeads).subscribe();
    supabase.channel('public_blog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchBlog).subscribe();
    supabase.channel('public_marcas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marcas' }, fetchMarcas).subscribe();
    supabase.channel('public_downloads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'downloads' }, fetchMarcas).subscribe();
    supabase.channel('public_config')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchConfig).subscribe();
  },

  // Auth Supabase
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  changePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  createNewAdmin: async (email, password, name) => {
    // No Supabase, a criação de usuários costuma ser via Edge Functions ou pela Dashboard
    // mas podemos usar o signUp direto se as políticas permitirem.
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { name } } 
    });
    if (error) throw error;
    return data;
  },

  // Storage Actions (Supabase Storage)
  uploadFileToStorage: async (file, pathFolder = 'uploads') => {
    if (!file) throw new Error('Nenhum arquivo providenciado.');
    
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${pathFolder}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets') // Bucket name padrão, ajuste se necessário
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Leads Actions
  adicionarLead: async (lead) => {
    const { error } = await supabase.from('leads').insert([{
      name: lead.name, email: lead.email, subject: lead.subject, message: lead.message
    }]);
    if (error) console.error(error);
  },
  removerLead: async (id) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) console.error(error);
  },
  marcarLeadLido: async (id) => {
    const { error } = await supabase.from('leads').update({ read: true }).eq('id', id);
    if (error) console.error(error);
  },
  marcarTodosLidos: async () => {
    const { error } = await supabase.from('leads').update({ read: true }).eq('read', false);
    if (error) console.error(error);
  },

  // Marcas / Manuais Actions
  adicionarMarca: async (nome) => {
    const { error } = await supabase.from('marcas').insert([{ name: nome.toUpperCase(), icon_color: 'bg-primary' }]);
    if (error) { console.error(error); alert('Erro ao adicionar marca: ' + error.message); }
    else get().fetchMarcas();
  },
  removerMarca: async (id) => {
    const { error } = await supabase.from('marcas').delete().eq('id', id);
    if (error) { console.error(error); alert('Erro ao remover: ' + error.message); }
    else get().fetchMarcas();
  },
  adicionarManual: async (idMarca, titulo, link) => {
    const { error } = await supabase.from('downloads').insert([{ marca_id: idMarca, title: titulo, link: link }]);
    if (error) { console.error(error); alert('Erro ao adicionar arquivo: ' + error.message); }
    else get().fetchMarcas();
  },
  removerManual: async (_idMarca, manualId) => {
    const { error } = await supabase.from('downloads').delete().eq('id', manualId);
    if (error) { console.error(error); alert('Erro ao remover: ' + error.message); }
    else get().fetchMarcas();
  },
  editarManual: async (_idMarca, manualId, novoTitulo, novoLink) => {
    const { error } = await supabase.from('downloads').update({ title: novoTitulo, link: novoLink }).eq('id', manualId);
    if (error) { console.error(error); alert('Erro ao editar arquivo: ' + error.message); }
    else get().fetchMarcas();
  },

  // Blog Actions
  adicionarPost: async (post) => {
    const { error } = await supabase.from('blog_posts').insert([{
      title: post.titulo, summary: post.resumo, content: post.conteudo, image_url: post.imageUrl, author: post.autor
    }]);
    if (error) { console.error(error); alert('Erro ao salvar post: ' + error.message); }
    else get().fetchBlog();
  },
  removerPost: async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { console.error(error); alert('Erro ao remover: ' + error.message); }
    else get().fetchBlog();
  },
  editarPost: async (id, updatedPost) => {
    const { error } = await supabase.from('blog_posts').update({
      title: updatedPost.titulo, summary: updatedPost.resumo, content: updatedPost.conteudo, image_url: updatedPost.imageUrl, author: updatedPost.autor
    }).eq('id', id);
    if (error) { console.error(error); alert('Erro ao editar post: ' + error.message); }
    else get().fetchBlog();
  },

  // CMS Actions (Content & Media)
  atualizarMedia: async (chave, tipo, valor) => {
    const { siteMedia } = get();
    const newMedia = { ...siteMedia, [chave]: { ...siteMedia[chave], [tipo]: valor } };
    await supabase.from('site_config').upsert({ key: 'siteMedia', data: newMedia }, { onConflict: 'key' });
  },
  atualizarConteudo: async (pagina, chave, valor) => {
    const { siteContent } = get();
    const newContent = { ...siteContent, [pagina]: { ...siteContent[pagina], [chave]: valor } };
    await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
  },
  saveText: async (pagina, path, newValue) => {
    const { siteContent, fetchConfig } = get();
    try {
      const updateDeep = (obj, pathArray, value) => {
        const newObj = { ...obj };
        let current = newObj;
        for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
          current = current[key];
        }
        current[pathArray[pathArray.length - 1]] = value;
        return newObj;
      };

      const newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), newValue);
      const newContent = { ...siteContent, [pagina]: newPageContent };
      
      set({ siteContent: newContent });
      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;
      
      // Forçar refresh para garantir consistência
      await fetchConfig();
    } catch (err) {
      console.error("Erro ao salvar texto:", err);
      alert("Falha ao salvar alteração. Verifique sua conexão.");
    }
  },
  addItemToArray: async (pagina, path, defaultItem) => {
    const { siteContent, fetchConfig } = get();
    try {
      const updateDeep = (obj, pathArray, value) => {
        const newObj = JSON.parse(JSON.stringify(obj)); // Clone profundo para segurança em arrays
        let current = newObj;
        for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        const lastKey = pathArray[pathArray.length - 1];
        if (!Array.isArray(current[lastKey])) current[lastKey] = [];
        current[lastKey].push(value);
        return newObj;
      };

      const newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), defaultItem);
      const newContent = { ...siteContent, [pagina]: newPageContent };
      
      set({ siteContent: newContent });
      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;

      await fetchConfig();
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      alert("Erro ao adicionar novo item ao site.");
    }
  },
  removeItemFromArray: async (pagina, path, index) => {
    const { siteContent, fetchConfig } = get();
    try {
      const updateDeep = (obj, pathArray, idx) => {
        const newObj = JSON.parse(JSON.stringify(obj));
        let current = newObj;
        for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        const lastKey = pathArray[pathArray.length - 1];
        if (Array.isArray(current[lastKey])) {
          current[lastKey].splice(idx, 1);
        }
        return newObj;
      };

      const newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), index);
      const newContent = { ...siteContent, [pagina]: newPageContent };
      
      set({ siteContent: newContent });
      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;

      await fetchConfig();
    } catch (err) {
      console.error("Erro ao remover item:", err);
      alert("Erro ao remover item do site.");
    }
  },
  atualizarArrayConteudo: async (pagina, chave, index, subChave, valor) => {
    const { siteContent } = get();
    const novoArray = [...siteContent[pagina][chave]];
    if (subChave) {
      novoArray[index] = { ...novoArray[index], [subChave]: valor };
    } else {
      novoArray[index] = valor;
    }
    const newContent = { ...siteContent, [pagina]: { ...siteContent[pagina], [chave]: novoArray } };
    await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
  },

  // Função Seeding Supabase (Opcional, similar ao Firebase)
  seedSupabase: async (initialData) => {
    const { data } = await supabase.from('marcas').select('id');
    if (!data || data.length === 0) {
      console.log('🚀 Supabase vazio. Iniciando seed...');
      
      // Seed Marcas e Downloads
      for (const m of initialData.marcas) {
        const { data: newMarca } = await supabase.from('marcas').insert({ name: m.nome, icon_color: m.iconColor }).select().single();
        if (newMarca) {
          const downloads = m.manuais.map(d => ({ marca_id: newMarca.id, title: d.titulo, link: d.link }));
          await supabase.from('downloads').insert(downloads);
        }
      }

      // Seed Blog
      const blogs = initialData.blogPosts.map(p => ({
        title: p.titulo,
        summary: p.resumo,
        content: p.conteudo,
        image_url: p.imageUrl,
        author: p.autor,
        created_at: p.data
      }));
      await supabase.from('blog_posts').insert(blogs);

      // Seed Config
      await supabase.from('site_config').insert([
        { key: 'siteMedia', data: initialData.siteMedia },
        { key: 'siteContent', data: initialData.siteContent }
      ]);
      
      console.log('✅ Seed concluído!');
    }
  }
}));
