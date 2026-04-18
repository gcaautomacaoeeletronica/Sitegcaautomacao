export const MARCAS_DEFAULT = [
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

export const BLOG_POSTS_DEFAULT = [
  {
    titulo: "Erro F0001 no Inversor WEG CFW500: Causa, Diagnóstico e Solução",
    resumo: "O código F0001 indica sobrecorrente no inversor WEG CFW500. Entenda as principais causas e como nosso laboratório resolve este defeito em 48h.",
    conteudo: "O código de falha F0001 no inversor WEG CFW500 é um dos chamados mais frequentes que recebemos em nosso laboratório em Americana-SP. Ele indica uma condição de sobrecorrente detectada pelo firmware do equipamento, e pode ter diversas origens.\n\n**Principais Causas do F0001:**\n- Curto-circuito no motor ou no cabeamento de potência\n- IGBT de potência danificado (desgaste térmico ou elétrico)\n- Driver de gate com falha, aplicando tensão incorreta nos IGBTs\n- Parãmetros incorretos (corrente nominal do motor acima da capacidade do inversor)\n\n**Como Diagnosticamos:**\nEm nosso laboratório, conectamos o equipamento ao rack de testes dedicado para inversores WEG. Realizamos a leitura de corrente em cada fase de saída, medimos a resistência dos IGBTs fora do circuito e testamos o driver de gate com osciloscópio de alta resolução.\n\n**Tempo de Reparo:**\nNa maioria dos casos, o reparo do F0001 leva de 24 a 48 horas. Após o conserto, o equipamento passa por teste de carga real na nossa bancada, simulando a operação em campo, garantindo que sairá do nosso laboratório com a mesma confiabilidade de um novo. Entre em contato para um orçamento sem compromisso.",
    imageUrl: "https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=1200&q=80",
    data: "2026-04-16T10:00:00Z",
    autor: "Laboratório GCA"
  },
  {
    titulo: "Conserto de Servo Drive Indramat Rexroth: Vale a Pena Reparar?",
    resumo: "Servo drives Indramat e Bosch Rexroth são equipamentos de alto valor. Descubra por que o reparo especializado pode economizar até 70% em relação à compra de um novo.",
    conteudo: "Os servo drives da linha Indramat e Bosch Rexroth – modelos como DKC, HDS, DDS e KDA – são equipamentos de altissima precisão e igualmente alto custo.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    data: "2026-04-15T10:00:00Z",
    autor: "Engenharia GCA"
  }
];

export const SITE_CONTENT_DEFAULT = {
  global: {
    phone: "(19) 3012-6360",
    whatsapp: "(19) 97120-6717",
    whatsappNumber: "5519971206717",
    email: "comercial@servicedrive.com.br",
    address: "Rua São Bento, Nº 44, Cariobinha, Americana - SP",
    cep: "13472-370",
    googleVerificationCode: "LBGMiyIPvQXnIf50DfR8DxPoJQQwKMUgE7Wcf_qpoaE",
    linkedin: "https://linkedin.com/company/gca-automacao",
    instagram: "https://instagram.com/gca.automacao",
    facebook: "https://facebook.com/gca.automacao",
    city: "Americana",
    state: "SP",
    cityState: "Americana/SP"
  },
  home: {
    stats: [
      { label: "Anos de Experiência", value: "10+", icon: "Clock" },
      { label: "Atendimentos / Ano", value: "1500+", icon: "Workflow" },
      { label: "Suporte Técnico", value: "24h", icon: "MessagesSquare" },
      { label: "Garantia Laboratório", value: "100%", icon: "ShieldCheck" }
    ],
    trustBrands: [
      "Bosch Rexroth", "Siemens", "WEG", "Allen-Bradley", "Parker", "Schneider Electric", "Danfoss", "Indramat"
    ],
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
      badge: "Portfólio de Soluções",
      title: "O que fazemos de",
      highlight: "Melhor"
    },
    services: [
      { title: "Laboratório & Gigas", desc: "Ambiente ESD com simulações reais para teste final.", link: "/estrutura", icon: "Layers" },
      { title: "Máquinas Gráficas", desc: "Reparos completos em hardware e lógica KBA.", link: "/manutencao-e-automacao-industrial", icon: "Settings" },
      { title: "Solda Robô Rexroth", desc: "Fontes e controles de painéis dedicados PSI6000.", link: "/manutencao-e-automacao-industrial", icon: "Zap" },
      { title: "Série DKC Ecodrive", desc: "Especialistas plenos na linha completa Bosch Rexroth.", link: "/manutencao-e-automacao-industrial", icon: "Cpu" }
    ]
  },
  about: {
    heroTitle: "A Engenharia Por Trás da Máquina",
    heroSubtitle: "Descubra por que a GCA Automação é o parceiro invisível garantindo que a indústria nunca pare.",
    foundationBadge: "Fundação 2013",
    historyTitle: "Uma trajetória marcada por precisão industrial",
    historyText: "Desde a nossa fundação, focamos em resolver o que outros consideram impossível.",
    quote: "Excelência técnica não é um diferencial, é a nossa estrutura básica de sobrevivência industrial.",
    mission: "Prover soluções em manutenção e automação industrial com máxima agilidade e transparência.",
    vision: "Ser a referência absoluta em reparos eletrônicos industriais complexos na América Latina."
  },
  services: {
    hero: {
      badge: "Especialistas em Automação Industrial",
      title: "Soluções Completas em",
      highlight: "Automação & Eletrônica",
      desc: "Manutenção eletrônica industrial, montagens elétricas, painéis de automação e controle IoT — um parceiro completo para a sua planta."
    },
    catalog: [
      { 
        title: "Manutenção de Inversores & Eletrônica Industrial", 
        icon: "Wrench", 
        items: ["Inversores de frequência", "Servodrives", "Conversores CA/CC", "Retificadores comuns ou regenerativos", "Soft Starter", "IHM", "CLP", "Controladores em geral", "Placas eletrônicas em geral"] 
      },
      { 
        title: "Montagens Elétricas Industriais", 
        icon: "Cable", 
        items: ["Instalações elétricas industriais NR-10", "Cabeamento de força e controle", "Identificação e organização de fiação", "Aterramento técnico e DPS", "Passagem de cabos em eletrocalhas e eletrodutos", "Montagem de quadros de distribuição", "Comissionamento e startup elétrico", "Reforma e modernização de instalações"] 
      },
      { 
        title: "Controle IoT & Monitoramento Remoto", 
        icon: "Wifi", 
        items: ["Desenvolvimento de dashboards industriais", "Aquisição de dados via MQTT e OPC-UA", "Integração com PLCs Siemens, Allen-Bradley e WEG", "Alertas e alarmes remotos via WhatsApp/e-mail", "Monitoramento de temperatura, vibração e corrente", "Automação de relatórios de produção", "Gateways de protocolos industriais", "Integração com sistemas SCADA e MES"] 
      },
      { 
        title: "Montagem de Painéis Elétricos & Automação", 
        icon: "LayoutGrid", 
        items: ["Painéis de comando e controle", "Centros de controle de motores (CCM)", "Painéis de distribuição de energia (QDC/QGBT)", "Painéis de automação com CLP e IHM", "Painéis à prova de explosão (Ex)", "Projeto e documentação elétrica NBR 5410", "Painéis para inversores e softstarters", "Retrofit e modernização de painéis antigos"] 
      },
      { 
        title: "Servodrives — Linhas Especializadas", 
        icon: "Activity", 
        items: ["Sinamics & Simodrive (Siemens)", "Parker SPD, LVD, SLVD", "Bosch Rexroth Indradrive, EcoDrive", "Allen-Bradley Kinetix 6000, 6500, 5500, 5700, Ultra3000", "Axor Minimagnum", "Mitsubishi & Panasonic", "SEW Movidrive", "Simovert Masterdrives MC"] 
      },
      { 
        title: "Reparo e Reforma de Retificadores (Galvanoplastia)", 
        icon: "Zap", 
        items: ["Retificador a tiristor", "Retificadores a transistor (chaveado)", "Retificadores para galvanoplastia e tratamento de superfície", "Reforma e modernização de fontes industriais"] 
      },
      { 
        title: "Máquinas e Equipamentos Gráficos KBA", 
        icon: "Cpu", 
        items: ["Display HMI TA53", "CLP MCGR3", "Servodrive REPW2", "HUB SBAH1", "Servomotores"] 
      }
    ],
    laboratoryMini: {
      title: "Laboratório de",
      highlight: "Reparos Eletrônicos",
      desc: "Ambiente ESD climatizado com bancadas dedicadas, instrumentos calibrados e simulação de carga real para validação 100% antes da entrega.",
      items: [
         "Rack de Testes Contrologix, Compactologix, SLC500...",
         "Rack de Testes para S7-200, S7-300, ET200L...",
         "Rack Atos 4004 e Rack OMRON",
         "Analisador de espectro e osciloscópio digital",
         "Estação de retrabalho BGA/SMD certificada"
      ]
    }
  },
  laboratory: {
    hero: {
      title: "Infraestrutura",
      highlight: "Laboratorial",
      desc: "Equipamentos calibrados e ambiente rigorosamente controlado."
    },
    performance: {
      title: "Performance Testada",
      highlight: "Em Carga Real.",
      text1: "A diferença entre um conserto comum e uma Engenharia de Reparo está nos testes em bancada.",
      text2: "Garantimos que o módulo saia do nosso laboratório validado a 100%."
    },
    features: [
      { title: 'Gigas Dedicadas', desc: 'Paredes de simulação de carga contínua (burn-in) atestadas por analisadores de espectro.', icon: 'Zap' },
      { title: 'Ambiente ESD', desc: 'Controle estrito eletrostático em 100% da área física: pisos, bancadas e vestuário especial.', icon: 'Activity' },
      { title: 'SMD & BGA', desc: 'Estações de retrabalho BGA robotizadas com perfis térmicos computadorizados.', icon: 'Cpu' }
    ]
  }
};

export const SITE_MEDIA_DEFAULT = {
  favicon: { url: '', link: '' },
  logo: { url: '', link: '' },
  home: { url: 'https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&w=2000&q=80', link: '' },
  home_1: { url: '', link: '' },
  home_2: { url: '', link: '' },
  home_3: { url: '', link: '' },
  about: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80', link: '' },
  aboutSide: { url: '', link: '' },
  services: { url: '', link: '' },
  servicesLab: { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', link: '' },
  laboratory: { url: '', link: '' },
  contact: { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000&q=80', link: '' },
};
