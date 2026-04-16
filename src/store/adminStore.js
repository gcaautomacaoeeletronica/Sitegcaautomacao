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

// Posts Iniciais do Blog (SEO Otimizado para termos industriais)
const BLOG_POSTS_DEFAULT = [
  {
    id: "1",
    titulo: "Erro F0001 no Inversor WEG CFW500: Causa, Diagnóstico e Solução",
    resumo: "O código F0001 indica sobrecorrente no inversor WEG CFW500. Entenda as principais causas e como nosso laboratório resolve este defeito em 48h.",
    conteudo: "O código de falha F0001 no inversor WEG CFW500 é um dos chamados mais frequentes que recebemos em nosso laboratório em Americana-SP. Ele indica uma condição de sobrecorrente detectada pelo firmware do equipamento, e pode ter diversas origens.\n\n**Principais Causas do F0001:**\n- Curto-circuito no motor ou no cabeamento de potência\n- IGBT de potência danificado (desgaste térmico ou elétrico)\n- Driver de gate com falha, aplicando tensão incorreta nos IGBTs\n- Parãmetros incorretos (corrente nominal do motor acima da capacidade do inversor)\n\n**Como Diagnosticamos:**\nEm nosso laboratório, conectamos o equipamento ao rack de testes dedicado para inversores WEG. Realizamos a leitura de corrente em cada fase de saída, medimos a resistência dos IGBTs fora do circuito e testamos o driver de gate com osciloscópio de alta resolução.\n\n**Tempo de Reparo:**\nNa maioria dos casos, o reparo do F0001 leva de 24 a 48 horas. Após o conserto, o equipamento passa por teste de carga real na nossa bancada, simulando a operação em campo, garantindo que sairá do nosso laboratório com a mesma confiabilidade de um novo. Entre em contato para um orçamento sem compromisso.",
    imageUrl: "https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=1200&q=80",
    data: "16 Abr 2026",
    autor: "Laboratório GCA"
  },
  {
    id: "2",
    titulo: "Conserto de Servo Drive Indramat Rexroth: Vale a Pena Reparar?",
    resumo: "Servo drives Indramat e Bosch Rexroth são equipamentos de alto valor. Descubra por que o reparo especializado pode economizar até 70% em relação à compra de um novo.",
    conteudo: "Os servo drives da linha Indramat e Bosch Rexroth – modelos como DKC, HDS, DDS e KDA – são equipamentos de altissima precisão e igualmente alto custo. Um modelo HDS02.2 novo pode ultrapassar R$ 15.000,00 no mercado brasileiro, e a demora na importação pode paralisar uma linha de produção por semanas.\n\n**Por Que Reparar em vez de Comprar?**\nO reparo especializado de um servo drive Rexroth/Indramat custa, em média, entre 25% e 45% do valor de um equipamento novo. Além da economia direta, não é necessário aguardar prazo de importação e o equipamento reparado já está calibrado para o seu sistema.\n\n**Nossa Infraestrutura:**\nA GCA Automação conta com racks de teste específicos para servodrives Rexroth, com alimentação trifásica controlada e simulância de servomotor acoplado. Isso nos permite testar o equipamento em condições reais antes da entrega, com garantia de 6 meses. Entre em contato e receba um diagnóstico gratuito.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    data: "15 Abr 2026",
    autor: "Engenharia GCA"
  },
  {
    id: "3",
    titulo: "Alarme no CLP Siemens S7-300: Como Diagnosticar e Resolver",
    resumo: "Falhas no CLP Siemens S7-300 podem parar toda uma linha de produção. Conheça os alarmes mais comuns e como o laboratório da GCA resolve em 24h.",
    conteudo: "O CLP Siemens S7-300 é um dos controladores lógicos programáveis mais utilizados na indústria brasileira. Sua robustez é reconhecida mundialmente, mas módulos de CPU, módulos de I/O digitais e analógicos e fontes de alimentação estão sujeitos a desgaste natural.\n\n**Alarmes e Falhas Mais Comuns:**\n- LED SF (System Fault) vermelho piscando na CPU\n- Módulo de saída digital não ativando (canal preso em 0)\n- Fonte PS307 sem tensão de saída\n- BATF (Battery Fault) – bateria da CPU descarregada\n- Módulo de comunicação Profibus DP em falha\n\n**Nosso Processo:**\nA GCA Automação possui racks de teste dedicados para CLPs Siemens S7-300, S7-200 e ET200. Cada módulo recebido é testado individualmente, mapeando o canal específico com defeito, e então submetido à reparação a nível de componente.\n\nEnviamos laudos técnicos com a descrição completa da falha encontrada e da intervenção realizada. Atendemos toda a região de Americana, Campinas, São Paulo e interior do estado.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    data: "14 Abr 2026",
    autor: "Laboratório GCA"
  },
  {
    id: "4",
    titulo: "Manutenção Preventiva de Inversores de Frequência: Guia Completo",
    resumo: "A manutenção preventiva correta pode triplicar a vida útil do seu inversor de frequência. Descubra o checklist completo utilizado pelos nossos técnicos.",
    conteudo: "Em nosso laboratório, recebemos diariamente inversores de frequência das mais diversas marcas – WEG, Siemens, ABB, Danfoss, Yaskawa – com defeitos que poderiam ter sido evitados com manutenção preventiva adequada. A boa notícia é que um programa de manutenção simples pode multiplicar a vida útil destes equipamentos.\n\n**Checklist de Manutenção Preventiva Anual:**\n1. Limpeza interna com ar comprimido filtrado (nunca jato d\'agua)\n2. Inspeção visual dos capacitores do barramento DC (verificar abaulamento)\n3. Substituição dos capacitores eletrolíticos a cada 5-7 anos preventivamente\n4. Lubrificação ou substituição dos ventiladores internos\n5. Verificação dos terminais de potência (aperto e oxidação)\n6. Leitura e registro dos parãmetros principais\n7. Teste de carga com analisador de qualidade de energia\n\n**Atenção com os Capacitores:**\nCapacitores eletrolíticos são os componentes com maior índice de falha em inversores com mais de 8 anos. A substituição preventiva, antes do defeito manifesto, é o investimento mais inteligente que um gestor de manutenção pode fazer. A GCA Automacao realiza essa avaliação gratuitamente para equipamentos que chegam ao nosso laboratório.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    data: "13 Abr 2026",
    autor: "Engenharia GCA"
  },
  {
    id: "5",
    titulo: "Allen-Bradley PowerFlex 753: Falhas Comuns e Soluções",
    resumo: "O PowerFlex 753 da Allen-Bradley é um inversor robusto mas com falhas típicas após anos de uso. Veja os defeitos mais comuns e como os resolvemos.",
    conteudo: "O inversor Allen-Bradley PowerFlex 753 é amplamente utilizado na indústria automotiva, química e alimentícia. Sua eletrônica de alta precisão o torna muito eficiente em campo, porém também mais delicado que inversores orientais quando exposto a ambientes agressivos.\n\n**Falhas Mais Frequentes:**\n- Fault 12 (Hardware Overtemperature) – Superaquecimento\n- Fault 71 (Power Loss) – Queda de alimentação trifásica\n- Fault 33 (Auto-Tune Fail) – Falha na autossintonia\n- Faults 70-72 relacionados ao módulo de comunicação EtherNet/IP\n- Barramento DC em curto (igbts danificados)\n\n**O Que Nos Diferencia:**\nA GCA Automacao possui racks de teste específicos para inversores Allen-Bradley da linha PowerFlex (700, 753, 755). Isso nos permite validar não apenas a potência do equipamento, mas também os módulos de I/O e de comunicação (DeviceNet, EtherNet/IP, Profibus). Atendemos fábricas em todo o interior paulista com coleta e entrega inclusa.",
    imageUrl: "https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=1200&q=80",
    data: "12 Abr 2026",
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
          whatsappNumber: "5519971206717",
          email: "comercial@servicedrive.com.br",
          address: "Rua São Bento, Nº 44, Cariobinha, Americana - SP",
          cep: "13472-370",
          googleVerificationCode: ""
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
      name: 'gca-admin-storage-v9', // Versão 9 para Blog SEO + WhatsApp + GSC
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
