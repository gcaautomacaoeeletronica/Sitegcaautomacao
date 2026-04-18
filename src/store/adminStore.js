import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { SITE_CONTENT_DEFAULT, SITE_MEDIA_DEFAULT } from '../data/initialData';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminEmail: null,
  isAuthLoading: true,
  isInitialLoading: true,
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
    if (data) set({ 
        blogPosts: data.map(p => ({ 
            id: p.id, 
            titulo: p.title, 
            resumo: p.summary, 
            conteudo: p.content, 
            imageUrl: p.image_url, 
            autor: p.author, 
            data: p.published_at || p.created_at 
        })) 
    });
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
  fetchAdmins: async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) set({ admins: data.map(a => ({ id: a.id, name: a.name, email: a.email, createdAt: a.created_at })) });
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
    const { fetchLeads, fetchBlog, fetchMarcas, fetchConfig, fetchAdmins } = get();
    await Promise.all([fetchLeads(), fetchBlog(), fetchMarcas(), fetchConfig(), fetchAdmins()]);
    set({ isInitialLoading: false });

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
    supabase.channel('public_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, get().fetchAdmins).subscribe();
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
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { name } } 
    });
    if (error) throw error;
    
    // Inserir no profile também para listagem no dashboard
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert([{
        id: data.user.id,
        email: email,
        name: name
      }]);
      if (profileError) console.error('Erro ao criar perfil:', profileError);
    }

    get().fetchAdmins();
    return data;
  },

  // Helper de Compressão de Imagem (Canvas)
  compressImage: async (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', quality);
        };
      };
    });
  },

  // Storage Actions (Supabase Storage)
  uploadFileToStorage: async (file, pathFolder = 'uploads') => {
    if (!file) throw new Error('Nenhum arquivo providenciado.');
    
    // Otimização automática para imagens
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
        console.log('🖼️ Comprimindo imagem...');
        fileToUpload = await get().compressImage(file);
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `${pathFolder}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, fileToUpload);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Leads Actions
  adicionarLead: async (lead) => {
    try {
      const { error } = await supabase.from('leads').insert([{
        name: lead.name, email: lead.email, subject: lead.subject, message: lead.message
      }]);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao adicionar lead:', err);
    }
  },
  removerLead: async (id) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao remover lead:', err);
      alert('Falha ao remover mensagem.');
    }
  },
  marcarLeadLido: async (id) => {
    try {
      const { error } = await supabase.from('leads').update({ read: true }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao marcar como lido:', err);
    }
  },
  marcarTodosLidos: async () => {
    try {
      const { error } = await supabase.from('leads').update({ read: true }).eq('read', false);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao marcar todos como lidos:', err);
    }
  },

  // Marcas / Manuais Actions
  adicionarMarca: async (nome) => {
    try {
      const { error } = await supabase.from('marcas').insert([{ name: nome.toUpperCase(), icon_color: 'bg-primary' }]);
      if (error) throw error;
      get().fetchMarcas();
    } catch (err) {
      console.error('Erro ao adicionar marca:', err);
      alert('Erro ao adicionar marca: ' + err.message);
    }
  },
  removerMarca: async (id) => {
    try {
      const { error } = await supabase.from('marcas').delete().eq('id', id);
      if (error) throw error;
      get().fetchMarcas();
    } catch (err) {
      console.error('Erro ao remover marca:', err);
      alert('Erro ao remover: ' + err.message);
    }
  },
  adicionarManual: async (idMarca, titulo, link) => {
    try {
      const { error } = await supabase.from('downloads').insert([{ marca_id: idMarca, title: titulo, link: link }]);
      if (error) throw error;
      get().fetchMarcas();
    } catch (err) {
      console.error('Erro ao adicionar arquivo:', err);
      alert('Erro ao adicionar arquivo: ' + err.message);
    }
  },
  removerManual: async (_idMarca, manualId) => {
    try {
      const { error } = await supabase.from('downloads').delete().eq('id', manualId);
      if (error) throw error;
      get().fetchMarcas();
    } catch (err) {
      console.error('Erro ao remover manual:', err);
      alert('Erro ao remover: ' + err.message);
    }
  },
  editarManual: async (_idMarca, manualId, novoTitulo, novoLink) => {
    try {
      const { error } = await supabase.from('downloads').update({ title: novoTitulo, link: novoLink }).eq('id', manualId);
      if (error) throw error;
      get().fetchMarcas();
    } catch (err) {
      console.error('Erro ao editar manual:', err);
      alert('Erro ao editar arquivo: ' + err.message);
    }
  },

  // Blog Actions
  adicionarPost: async (post) => {
    try {
      const { error } = await supabase.from('blog_posts').insert([{
        title: post.titulo, 
        summary: post.resumo, 
        content: post.conteudo, 
        image_url: post.imageUrl, 
        author: post.autor,
        published_at: post.data || new Date().toISOString()
      }]);
      if (error) throw error;
      get().fetchBlog();
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      alert('Erro ao salvar post: ' + err.message);
    }
  },
  removerPost: async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      get().fetchBlog();
    } catch (err) {
      console.error('Erro ao remover post:', err);
      alert('Erro ao remover: ' + err.message);
    }
  },
  editarPost: async (id, updatedPost) => {
    try {
      const { error } = await supabase.from('blog_posts').update({
        title: updatedPost.titulo, 
        summary: updatedPost.resumo, 
        content: updatedPost.conteudo, 
        image_url: updatedPost.imageUrl, 
        author: updatedPost.autor,
        published_at: updatedPost.data
      }).eq('id', id);
      if (error) throw error;
      get().fetchBlog();
    } catch (err) {
      console.error('Erro ao editar post:', err);
      alert('Erro ao editar post: ' + err.message);
    }
  },

  // CMS Actions (Content & Media)
  atualizarMedia: async (chave, tipo, valor) => {
    try {
      const { siteMedia } = get();
      const newMedia = { ...siteMedia, [chave]: { ...siteMedia[chave], [tipo]: valor } };
      set({ siteMedia: newMedia });
      const { error } = await supabase.from('site_config').upsert({ key: 'siteMedia', data: newMedia }, { onConflict: 'key' });
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao salvar mídia:', err);
      alert('Erro ao salvar alteração de mídia.');
    }
  },
  atualizarConteudo: async (pagina, chave, valor) => {
    try {
      const { siteContent } = get();
      let newPageContent = { ...siteContent[pagina], [chave]: valor };
      
      if (pagina === 'global' && chave === 'whatsapp') {
        const cleanNumber = valor.replace(/\D/g, '');
        const finalNumber = cleanNumber.startsWith('55') || cleanNumber.length > 11 ? cleanNumber : `55${cleanNumber}`;
        newPageContent = { ...newPageContent, whatsappNumber: finalNumber };
      }

      const newContent = { ...siteContent, [pagina]: newPageContent };
      set({ siteContent: newContent });
      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar conteúdo:', err);
    }
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

      let newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), newValue);
      
      // Auto-sincronizar whatsappNumber quando o whatsapp formatado mudar
      if (pagina === 'global' && path === 'whatsapp') {
        const cleanNumber = newValue.replace(/\D/g, '');
        // Se o número não tem DDI, assume 55 (Brasil) por ser o foco da GCA
        const finalNumber = cleanNumber.startsWith('55') || cleanNumber.length > 11 ? cleanNumber : `55${cleanNumber}`;
        newPageContent = { ...newPageContent, whatsappNumber: finalNumber };
      }

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
    const { siteContent } = get();
    try {
      const updateDeep = (obj, pathArray, value) => {
        const newObj = JSON.parse(JSON.stringify(obj));
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
      
      // Atualiza estado local IMEDIATAMENTE para resposta visual instantânea
      set({ siteContent: newContent });

      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      alert("Erro ao adicionar novo item ao site. Verifique sua conexão.");
    }
  },
  removeItemFromArray: async (pagina, path, index) => {
    const { siteContent } = get();
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
      
      // Atualiza estado local IMEDIATAMENTE para resposta visual instantânea
      set({ siteContent: newContent });

      const { error } = await supabase.from('site_config').upsert({ key: 'siteContent', data: newContent }, { onConflict: 'key' });
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao remover item:", err);
      alert("Erro ao remover item do site. Verifique sua conexão.");
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
