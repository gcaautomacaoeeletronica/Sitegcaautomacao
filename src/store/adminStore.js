import { create } from 'zustand';
import { db, storage, auth, secondaryAuth } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
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
  siteMedia: {},
  siteContent: {},

  // Inicialização e Listeners
  init: () => {
    console.log('Iniciando GCA Cloud Sync...');

    // Observar sessão real do Firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ isAuthenticated: true, adminEmail: user.email, isAuthLoading: false });
      } else {
        set({ isAuthenticated: false, adminEmail: null, isAuthLoading: false });
      }
    });

    // 0. Monitorar Administradores
    onSnapshot(collection(db, 'admins'), (snapshot) => {
      const admins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ admins });
    });
    
    // 1. Monitorar Leads
    onSnapshot(query(collection(db, 'leads'), orderBy('data', 'desc')), (snapshot) => {
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ leads });
    });

    // 2. Monitorar Blog
    onSnapshot(query(collection(db, 'blog'), orderBy('data', 'desc')), (snapshot) => {
      const blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ blogPosts });
    });

    // 3. Monitorar Marcas (Downloads)
    onSnapshot(collection(db, 'marcas'), (snapshot) => {
      const marcas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ marcas });
    });

    // 4. Monitorar Conteúdo Global e Mídias
    onSnapshot(doc(db, 'config', 'siteData'), (snapshot) => {
      // Função Auxiliar para Mescla Profunda (Merging)
      const deepMerge = (target, source) => {
        const output = { ...target };
        if (source && typeof source === 'object') {
          Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              if (!(key in target)) {
                Object.assign(output, { [key]: source[key] });
              } else {
                output[key] = deepMerge(target[key], source[key]);
              }
            } else {
              Object.assign(output, { [key]: source[key] });
            }
          });
        }
        return output;
      };

      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        
        // MESCLAR: Dados Iniciais + Dados da Nuvem (Nuvem ganha se existir)
        const mergedContent = deepMerge(SITE_CONTENT_DEFAULT, cloudData.siteContent || {});
        const mergedMedia = deepMerge(SITE_MEDIA_DEFAULT, cloudData.siteMedia || {});
        
        set({ 
          siteMedia: mergedMedia, 
          siteContent: mergedContent 
        });
      } else {
        // Se nem o documento existe, usa só os defaults
        set({ siteMedia: SITE_MEDIA_DEFAULT, siteContent: SITE_CONTENT_DEFAULT });
      }
    });
  },

  // Auth Reais
  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O estado se atualiza pelo onAuthStateChanged do init()
      return true;
    } catch (error) {
      console.error('Erro de Login Firebase:', error);
      throw error;
    }
  },
  logout: async () => {
    await signOut(auth);
  },

  changePassword: async (newPassword) => {
    if(!auth.currentUser) throw new Error('Não há usuário logado para trocar de senha.');
    await updatePassword(auth.currentUser, newPassword);
  },

  createNewAdmin: async (email, password, name) => {
    try {
      // Usar a instância secundária para não deslogar o admin atual
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      // Salvar os dados na collection admins para a tabela do painel
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        email: userCredential.user.email,
        name: name,
        createdAt: new Date().toISOString()
      });
      // Importante: deslogar o secundário para evitar polução
      await signOut(secondaryAuth);
      return true;
    } catch (error) {
      console.error('Erro ao Criar Sub-Admin:', error);
      throw error;
    }
  },

  // Storage Actions
  uploadFileToStorage: (file, pathFolder = 'uploads') => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('Nenhum arquivo providenciado.');
        return;
      }
      const uniqueName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `${pathFolder}/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        () => {
          // Progress can be monitored here if needed
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  },

  // Leads Actions
  adicionarLead: async (lead) => {
    try {
      await addDoc(collection(db, 'leads'), {
        ...lead,
        data: new Date().toISOString(),
        lido: false
      });
    } catch (e) { console.error('Erro ao salvar lead:', e); }
  },
  removerLead: async (id) => {
    await deleteDoc(doc(db, 'leads', id));
  },
  marcarLeadLido: async (id) => {
    await updateDoc(doc(db, 'leads', id), { lido: true });
  },
  marcarTodosLidos: async () => {
    const { leads } = get();
    leads.forEach(async (l) => {
      if(!l.lido) await updateDoc(doc(db, 'leads', l.id), { lido: true });
    });
  },

  // Marcas / Manuais Actions
  adicionarMarca: async (nome) => {
    await addDoc(collection(db, 'marcas'), {
      nome: nome.toUpperCase(),
      manuais: [],
      iconColor: 'bg-primary'
    });
  },
  removerMarca: async (id) => {
    await deleteDoc(doc(db, 'marcas', id));
  },
  adicionarManual: async (idMarca, titulo, link) => {
    const marca = get().marcas.find(m => m.id === idMarca);
    if (!marca) return;
    const novosManuais = [...(marca.manuais || []), { id: Date.now().toString(), titulo, link }];
    await updateDoc(doc(db, 'marcas', idMarca), { manuais: novosManuais });
  },
  removerManual: async (idMarca, manualId) => {
    const marca = get().marcas.find(m => m.id === idMarca);
    if (!marca) return;
    const novosManuais = marca.manuais.filter(m => m.id !== manualId);
    await updateDoc(doc(db, 'marcas', idMarca), { manuais: novosManuais });
  },
  editarManual: async (idMarca, manualId, novoTitulo, novoLink) => {
    const marca = get().marcas.find(m => m.id === idMarca);
    if (!marca) return;
    const novosManuais = marca.manuais.map(m => 
      m.id === manualId ? { ...m, titulo: novoTitulo, link: novoLink } : m
    );
    await updateDoc(doc(db, 'marcas', idMarca), { manuais: novosManuais });
  },

  // Blog Actions
  adicionarPost: async (post) => {
    await addDoc(collection(db, 'blog'), {
      ...post,
      data: new Date().toISOString()
    });
  },
  removerPost: async (id) => {
    await deleteDoc(doc(db, 'blog', id));
  },
  editarPost: async (id, updatedPost) => {
    await updateDoc(doc(db, 'blog', id), updatedPost);
  },

  // CMS Actions (Content & Media)
  atualizarMedia: async (chave, tipo, valor) => {
    const { siteMedia } = get();
    const newMedia = { ...siteMedia, [chave]: { ...siteMedia[chave], [tipo]: valor } };
    await setDoc(doc(db, 'config', 'siteData'), { siteMedia: newMedia }, { merge: true });
  },
  atualizarConteudo: async (pagina, chave, valor) => {
    const { siteContent } = get();
    const newContent = { ...siteContent, [pagina]: { ...siteContent[pagina], [chave]: valor } };
    await setDoc(doc(db, 'config', 'siteData'), { siteContent: newContent }, { merge: true });
  },
  saveText: async (pagina, path, newValue) => {
    const { siteContent } = get();
    // Funçao utilitária para atualizar objeto aninhado
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
    
    set({ siteContent: newContent }); // Update local state immediately for UX
    await setDoc(doc(db, 'config', 'siteData'), { siteContent: newContent }, { merge: true });
  },
  addItemToArray: async (pagina, path, defaultItem) => {
    const { siteContent } = get();
    const updateDeep = (obj, pathArray, value) => {
      const newObj = { ...obj };
      let current = newObj;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
        current = current[key];
      }
      const lastKey = pathArray[pathArray.length - 1];
      const arr = Array.isArray(current[lastKey]) ? [...current[lastKey]] : [];
      arr.push(value);
      current[lastKey] = arr;
      return newObj;
    };
    const newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), defaultItem);
    const newContent = { ...siteContent, [pagina]: newPageContent };
    set({ siteContent: newContent });
    await setDoc(doc(db, 'config', 'siteData'), { siteContent: newContent }, { merge: true });
  },
  removeItemFromArray: async (pagina, path, index) => {
    const { siteContent } = get();
    const updateDeep = (obj, pathArray, idx) => {
      const newObj = { ...obj };
      let current = newObj;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
        current = current[key];
      }
      const lastKey = pathArray[pathArray.length - 1];
      const arr = Array.isArray(current[lastKey]) ? [...current[lastKey]] : [];
      arr.splice(idx, 1);
      current[lastKey] = arr;
      return newObj;
    };
    const newPageContent = updateDeep(siteContent[pagina] || {}, path.split('.'), index);
    const newContent = { ...siteContent, [pagina]: newPageContent };
    set({ siteContent: newContent });
    await setDoc(doc(db, 'config', 'siteData'), { siteContent: newContent }, { merge: true });
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
    await setDoc(doc(db, 'config', 'siteData'), { siteContent: newContent }, { merge: true });
  },

  // Função Seeding (Executar apenas se a nuvem estiver vazia)
  seedFirebase: async (initialData) => {
    const snapshot = await getDocs(collection(db, 'marcas'));
    if (snapshot.empty) {
      console.log('☁️ Nuvem vazia detectada. Iniciando migração de dados...');
      
      // Seed Marcas
      initialData.marcas.forEach(async m => {
        await addDoc(collection(db, 'marcas'), { nome: m.nome, manuais: m.manuais, iconColor: m.iconColor });
      });

      // Seed Blog
      initialData.blogPosts.forEach(async p => {
        await addDoc(collection(db, 'blog'), p);
      });

      // Seed Config
      await setDoc(doc(db, 'config', 'siteData'), { 
        siteMedia: initialData.siteMedia, 
        siteContent: initialData.siteContent 
      });
      
      console.log('✅ Migração concluída com sucesso!');
    }
  }
}));
