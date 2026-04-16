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

// Posts Iniciais do Blog
const BLOG_POSTS_DEFAULT = [
  {
    id: "1",
    titulo: "O Impacto da Automação 4.0 na Produtividade Industrial",
    resumo: "Descubra como a integração de sistemas e a análise de dados estão revolucionando o chão de fábrica moderno.",
    conteudo: "A Indústria 4.0 não é mais uma promessa do futuro, mas uma realidade que define a competitividade das empresas hoje. Através da automação 4.0, equipamentos antes isolados agora se comunicam em tempo real, permitindo uma tomada de decisão muito mais ágil e baseada em dados concretos. \n\nNa GCA Automação, vemos diariamente como a implementação de sensoriamento inteligente e sistemas de controle avançados podem reduzir custos operacionais em até 30% e aumentar a disponibilidade das máquinas. A chave para o sucesso nesta nova era é a interoperabilidade: a capacidade de fazer com que diferentes tecnologias falem a mesma língua em prol da eficiência máxima.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    data: "16 Abr 2026",
    autor: "Engenharia GCA"
  },
  {
    id: "2",
    titulo: "Manutenção vs. Troca: Os Benefícios do Conserto de Inversores",
    resumo: "Recuperar um inversor de frequência pode custar até 60% menos do que adquirir um novo. Veja quando vale a pena.",
    conteudo: "Inversores de frequência são o coração do controle de motores na indústria. Quando um equipamento desse porte falha, o impacto na produção é imediato. Muitos gestores acreditam que a única solução segura é a substituição por um novo, mas a realidade técnica mostra que o reparo especializado é, em muitos casos, a melhor escolha financeira e técnica.\n\nAlém da economia direta (um reparo costuma custar entre 20% a 40% do valor de um novo), existe a vantagem do tempo de setup: consertar o equipamento original mantém as parametrizações e o hardware já compatível com seu painel, evitando gastos extras com adaptações físicas ou de software. Em nosso laboratório, utilizamos equipamentos de ponta para garantir que o inversor reparado tenha a mesma confiabilidade de um novo, com garantia e suporte técnico dedicado.",
    imageUrl: "https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=1200&q=80",
    data: "15 Abr 2026",
    autor: "Laboratório GCA"
  }
];

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

      leads: [],
      
      adicionarLead: (lead) => {
        const novoLead = {
          ...lead,
          id: Date.now().toString(),
          data: new Date().toLocaleString('pt-BR'),
          lido: false
        };
        set((state) => ({ leads: [novoLead, ...state.leads] }));
      },

      removerLead: (id) => {
        set((state) => ({ 
          leads: state.leads.filter(l => l.id !== id) 
        }));
      },

      marcarLeadLido: (id) => {
        set((state) => ({
          leads: state.leads.map(l => l.id === id ? { ...l, lido: true } : l)
        }));
      },

      marcarTodosLidos: () => {
        set((state) => ({
          leads: state.leads.map(l => ({ ...l, lido: true }))
        }));
      },

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
      },

      // Blog Logic
      blogPosts: BLOG_POSTS_DEFAULT,
      
      adicionarPost: (post) => {
        const novoPost = {
          ...post,
          id: Date.now().toString(),
          data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        set((state) => ({ blogPosts: [novoPost, ...state.blogPosts] }));
      },

      removerPost: (id) => {
        set((state) => ({ 
          blogPosts: state.blogPosts.filter(p => p.id !== id) 
        }));
      },

      editarPost: (id, updatedPost) => {
        set((state) => ({
          blogPosts: state.blogPosts.map(p => p.id === id ? { ...p, ...updatedPost } : p)
        }));
      },

      // Sistema de Conteúdo Dinâmico (CMS Total)
      siteContent: {
        global: {
          phone: "(19) 3012-6360",
          whatsapp: "(19) 97120-6717",
          email: "comercial@servicedrive.com.br",
          address: "Rua São Bento, Nº 44, Cariobinha, Americana - SP",
          cep: "13472-370"
        },
        home: {
          slides: [
            { title: "Automação e", highlight: "Controle", desc: "Desenvolvemos o coração inteligente da sua indústria." },
            { title: "Manutenção", highlight: "Industrial", desc: "Eficiência e precisão na recuperação dos seus equipamentos vitais." },
            { title: "Máquinas e", highlight: "Sistemas CNC", desc: "Restore o fluxo perfeito da sua linha de montagem e usinagem." }
          ],
          expertise: {
            badge: "Expertise Absoluta",
            title: "Há 10 anos oferecendo o que há de melhor em tecnologia.",
            text: "Nós reduzimos o tempo de máquina parada através de um diagnóstico rápido, manutenção de altíssimo padrão com simulações de carga reais, e transparência técnica ponta a ponta. Sua planta industrial não pode parar."
          },
          portfolio: {
            badge: "Portfólio de Intervenção",
            title: "Sistemas que",
            highlight: "Recuperamos"
          }
        },
        about: {
          heroTitle: "A Engenharia Por Trás da Máquina",
          heroSubtitle: "Descubra por que a GCA Automação é o parceiro invisível garantindo que a indústria nunca pare.",
          foundationBadge: "Fundação 2013",
          historyTitle: "Uma trajetória marcada por precisão industrial",
          historyText: "Desde a nossa fundação, focamos em resolver o que outros consideram impossível. A GCA Automação nasceu da necessidade do mercado por uma manutenção eletrônica que fosse além da troca de peças.",
          quote: "Excelência técnica não é um diferencial, é a nossa estrutura básica de sobrevivência industrial.",
          mission: "Prover soluções em manutenção e automação industrial com máxima agilidade e transparência, garantindo a continuidade operacional de nossos clientes através de engenharia de ponta.",
          vision: "Ser a referência absoluta em reparos eletrônicos industriais complexos na América Latina, reconhecida pela infraestrutura laboratorial e precisão de diagnóstico."
        },
        services: {
          hero: {
            badge: "Especialistas em Manutenção",
            title: "Reparos Eletrônicos",
            highlight: "Industriais",
            desc: "Manutenção Eletrônica Industrial avançada. Da adequação de painéis à reconstrução de inversores e servodrives das maiores marcas do mundo."
          },
          catalog: {
            title: "Catálogo de",
            highlight: "Especialidades",
            subtitle: "Navegue pelas nossas frentes de reparo técnico abaixo."
          },
          laboratoryMini: {
            title: "Laboratório de",
            highlight: "Reparos Eletrônicos",
            desc: "Ambiente climatizado limpo e organizado, equipado com bancadas e equipamentos especializados. Equipe técnica altamente treinada e especializada em reparos eletrônicos a nível de componentes.",
            items: [
               "Rack de Testes Contrologix, Compactologix, SLC500, micrologix 1200 / 1400",
               "Rack de Testes para S7-200, S7-300, ET200L, ET200S",
               "Rack Atos 4004 e Rack OMRON",
               "Rack para servodrive Allen-Bradley Kinetix 6000 / 6500, 5500, Ultra 3000..."
            ]
          }
        },
        laboratory: {
          hero: {
            title: "Infraestrutura",
            highlight: "Laboratorial",
            desc: "Equipamentos calibrados e ambiente rigorosamente controlado. O coração tecnológico da nossa manutenção."
          },
          performance: {
            title: "Performance Testada",
            highlight: "Em Carga Real.",
            text1: "A diferença entre um conserto comum e uma Engenharia de Reparo está nos testes em bancada. Nossas gigas dedicadas simulam servomotores acoplados, CLPs atuando, e a tração real de uma máquina.",
            text2: "Garantimos que o módulo saia do nosso laboratório validado a 100%, pronto para instalação 'Plug & Play', eliminando falhas de campo."
          }
        }
      },

      atualizarConteudo: (pagina, chave, valor) => {
        set((state) => ({
          siteContent: {
            ...state.siteContent,
            [pagina]: {
              ...state.siteContent[pagina],
              [chave]: valor
            }
          }
        }));
      },

      // Helper para atualizar arrays (como slides ou itens de lista)
      atualizarArrayConteudo: (pagina, chave, index, subChave, valor) => {
        set((state) => {
          const novoArray = [...state.siteContent[pagina][chave]];
          if (subChave) {
            novoArray[index] = { ...novoArray[index], [subChave]: valor };
          } else {
            novoArray[index] = valor;
          }
          return {
            siteContent: {
              ...state.siteContent,
              [pagina]: {
                ...state.siteContent[pagina],
                [chave]: novoArray
              }
            }
          };
        });
      }
    }),
    {
      name: 'gca-admin-storage-v8', // Versão 8 para Gerenciador de Leads
      onRehydrateStorage: () => (state) => {
        window.addEventListener('storage', (event) => {
          if (event.key === 'gca-admin-storage-v6') {
            console.log('Sincronização externa detectada. Recarregando banco de dados...');
            window.location.reload();
          }
        });
      }
    }
  )
);
