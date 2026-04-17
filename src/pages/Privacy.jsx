import React, { useEffect } from 'react';
import { FadeIn } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-20">
      <SEO 
        title="Política de Privacidade | GCA Automação Industrial"
        description="Termos de como a GCA Automação Industrial trata, analisa e protege seus dados conforme a LGPD."
        canonical="/privacidade"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <FadeIn>
          <div className="bg-white p-8 md:p-12 rounded border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded flex items-center justify-center shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Política de Privacidade</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Última atualização: Abril de 2026</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed">
              <p>A <strong>GCA Automação Industrial</strong> compromete-se a assegurar a privacidade e a proteção rigorosa dos dados pessoais de nossos clientes, parceiros de negócios e visitantes, atuando em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">1. Coleta de Informações</h2>
              <p>Ao navegar em nosso portal (especialmente as áreas de Acervo Técnico, Dashboard IoT e Contato), poderemos coletar e armazenar informações como:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Informações Fornecidas Voluntariamente:</strong> Como Nome, E-mail, Telefone, e Endereço Físico submetidos em formulários de atendimento e suporte.</li>
                <li><strong>Dados de Navegação:</strong> Informações recolhidas pelos nossos protocolos de acesso padrão (Cookies essenciais e de performance) focados na estabilidade da sessão.</li>
              </ul>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">2. Utilização e Propósito</h2>
              <p>Tratamos as informações coletadas estritamente sob as premissas B2B (Business-to-Business) voltadas para o cenário industrial. Utilizaremos essas informações para os seguintes fins:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Conceder acesso ou orçar reparos relativos às máquinas industriais submetidas para análise.</li>
                <li>Liberar ou registrar acessos ao acervo de Manuais Técnicos de terceiros fornecidos na plataforma.</li>
                <li>Enviar avisos contratuais fundamentais sobre os equipamentos no Laboratório ou acesso à Telemetria (Dashboard IoT Connect).</li>
              </ul>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">3. Sigilo e Proteção (Segurança de Carga Criptografada)</h2>
              <p>Reconhecemos que dados industriais são críticos. A GCA emprega criptografia em trânsito (SSL/TLS) e utiliza serviços em nuvem (Cloud Computing) de alto padrão providos por sistemas independentes com certificação ISO 27001 para a custódia das informações cadastradas.</p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">4. Conduta com Terceiros</h2>
              <p>O seu sigilo corporativo é prioridade. As informações coletadas <strong>não serão alugadas, vendidas ou transferidas a terceiros</strong>, exceto no cumprimento de deveres legais aplicáveis exigidas por ordem de autoridades judiciais ou regulatórias.</p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">5. Direitos do Titular (LGPD)</h2>
              <p>Mediante solictação por vias oficiais corporativas, todo cliente registrado pode exigir, de acordo com as leis vigentes: portabilidade de dados, correção de erros, negação de tratamento opcional e eliminação sumária dos históricos de atendimento da base principal.</p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">6. Fale Conosco</h2>
              <p>Caso persista alguma dúvida técnica a respeito deste tratamento de dados ou dos mecanismos da LGPD enquadrados no nosso serviço, contate nossa engenharia:</p>
              <p className="font-bold text-gray-900">E-mail Técnico Exclusivo: comercial@servicedrive.com.br</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Privacy;
