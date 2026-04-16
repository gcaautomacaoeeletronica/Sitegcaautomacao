import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Valores padrão para as marcas
const MARCAS_DEFAULT = [
  "ABB", "ADLEEPOWER", "ALLEN-BRADLEY", "ALTUS", "ATOS", "AUTONICS", 
  "AUTOMOTION", "AXOR", "BALDOR", "BEIJER", "BERGLHAR", "DANFOSS", 
  "DELTA", "FUJI", "HITACHI", "INCONTROL", "KEB", "LS", "M2i", 
  "MITSUBISHI", "MTL", "NOVUS", "PANASONIC", "PARKER", "PROMATECH", 
  "SANTERNO", "SCHINEIDER", "SIEMENS", "THERMA", "TOSHIBA", "WEG", 
  "WEINTEK", "YASKAWA"
].map((nome, index) => ({
  id: index.toString(),
  nome,
  manuais: [], 
  iconColor: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
}));

export const useAdminStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: (email, password) => {
        if (email === 'admin@admin.com' && password === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),

      marcas: MARCAS_DEFAULT,
      
      // Mídia das Páginas - Estrutura Dinâmica Imagem + Link
      siteMedia: {
        favicon: { url: '', link: '' },
        home: { url: 'https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=2000&q=80', link: '' },
        about: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80', link: '' },
        aboutSide: { url: '', link: '' },
        services: { url: '', link: '' },
        servicesLab: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', link: '' },
        laboratory: { url: '', link: '' },
        contact: { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000&q=80', link: '' },
      },
      
      atualizarMedia: (chave, tipo, valor) => {
        // tipo pode ser 'url' ou 'link'
        set((state) => ({
          siteMedia: {
            ...state.siteMedia,
            [chave]: {
              ...state.siteMedia[chave],
              [tipo]: valor
            }
          }
        }));
      },

      adicionarMarca: (nomeMarca) => {
        const nova = {
          id: Date.now().toString(),
          nome: nomeMarca.toUpperCase(),
          manuais: [],
          iconColor: 'bg-primary'
        };
        set((state) => ({ marcas: [nova, ...state.marcas] }));
      },

      removerMarca: (id) => {
        set((state) => ({
          marcas: state.marcas.filter((m) => m.id !== id)
        }));
      },

      adicionarManual: (idMarca, titulo, link) => {
         console.log('Tentando adicionar manual:', { idMarca, titulo });
         set((state) => {
            const novasMarcas = state.marcas.map(m => {
               if(m.id === idMarca) {
                 const manuaisList = Array.isArray(m.manuais) ? m.manuais : [];
                 const novoManual = { id: Date.now().toString(), titulo, link };
                 return {
                    ...m,
                    manuais: [...manuaisList, novoManual]
                 };
               }
               return m;
            });
            console.log('Estado atualizado com sucesso no store.');
            return { marcas: novasMarcas };
         });
      },

      removerManual: (idMarca, manualId) => {
        set((state) => ({
          marcas: state.marcas.map(m => {
            if(m.id === idMarca) {
               return {
                 ...m,
                 manuais: m.manuais.filter(man => man.id !== manualId)
               };
            }
            return m;
          })
        }));
      },

      editarManual: (idMarca, manualId, novoTitulo, novoLink) => {
        set((state) => ({
          marcas: state.marcas.map(m => {
            if(m.id === idMarca) {
               return {
                 ...m,
                 manuais: m.manuais.map(man => 
                    man.id === manualId 
                      ? { ...man, titulo: novoTitulo, link: novoLink }
                      : man
                 )
               };
            }
            return m;
          })
        }));
      }
    }),
    {
      name: 'gca-admin-storage-v5', // Atualizado para v5 para forçar sincronização total
      onRehydrateStorage: () => (state) => {
        window.addEventListener('storage', (event) => {
          if (event.key === 'gca-admin-storage-v5') {
            console.log('Sincronização externa detectada. Recarregando banco de dados...');
            window.location.reload(); // Recarrega para garantir que o estado do React reflita o disco
          }
        });
      }
    }
  )
);
