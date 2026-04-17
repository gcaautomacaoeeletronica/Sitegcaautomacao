import React, { useEffect } from 'react';
import { FadeIn } from '../components/ui/AnimWrapper';
import SEO from '../components/ui/SEO';
import { FileText } from 'lucide-react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-20">
      <SEO 
        title="Termos de Uso | GCA Automação Industrial"
        description="Termos de uso da infraestrutura e dos manuais hospedados no site da GCA Automação."
        canonical="/termos"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <FadeIn>
          <div className="bg-white p-8 md:p-12 rounded border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded flex items-center justify-center shrink-0">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Termos de Uso</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Última atualização: Abril de 2026</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed">
              <p>Ao navegar ou utilizar os recursos da infraestrutura de portais de <strong>GCA Automação Industrial</strong>, o usuário aceita plenamente e sem reservas a totalidade destes Termos de Uso. O não acordo exige a imediata suspensão da navegação.</p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">1. Uso do Acervo e Repositórios Técnicos</h2>
              <p>
                Os manuais PDF, guias paramétricos, artigos do blog e folhas de dados técnicos presentes no nosso banco são coletâneas concebidas para auxílio da engenharia. <br/>
                Os materiais originam-se de suas respectivas marcas globais ou foram redigidos pelos nossos analistas. É estritamente <strong>proibida</strong> a venda ou lucro com qualquer conteúdo indexado publicamente por intermédio desta plataforma.
              </p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">2. Isenção de Responsabilidade (Disclaimer de Operação)</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded my-6 text-red-900">
                A aplicação indiscriminada ou leiga das orientações dispostas em artigos ou manuais disponíveis no site possui caráter apenas consultivo. A GCA Automação Industrial <strong>declina integralmente qualquer responsabilidade de incidentes cíveis, paradas fabris (downtime), curtos-circuitos corporais, avarias em inversores e servodrives</strong> provocados pela condução dos esquemas baseados em nossos acervos sem um especialista capacitado. Trabalhos em áreas de potência deverão ser executados unicamente perante profissionais regidos pelas normas técnicas de campo legais (ex.: NR-10).
              </div>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">3. Manutenção e Laboratório Físico</h2>
              <p>
                A contratação de ensaios e consertos em laboratório (Retificadores, Servomotores, KBA, Inversores, Controladores) firmados mediante as solicitações de contato obedecerão contratos comerciais apartados via Nota Fiscal e Ordem de Serviço da engenharia, gerindo de maneira distinta do provimento provisório providenciado digitalmente nesta página.
              </p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">4. Propriedade Intelectual Global</h2>
              <p>
                Os símbolos e representações (Logos) de empresas provedoras de equipamentos de fábrica exibidos neste sistema (ABB, WEG, SIEMENS, YASKAWA, etc) referem-se à propriedade de seus respectivos trustes internacionais. A GCA apresenta-os estritamente para o referenciamento corporativo técnico entre fabricantes. Todo código fonte singular deste software, design interativo, textos e estrutura do site constam sob as diretrizes de titularidade restrita.
              </p>

              <h2 className="text-gray-900 font-bold text-xl mt-8 mb-4">5. Modificação nos Termos</h2>
              <p>
                A GCA reserva-se o inalienável poder de reformar sem aviso direto qualquer provisão deste documento para fins de adaptações tributárias, restruturações visuais ou regulamentos judiciários. Alterações entram em vigor imediatamente após sua indexação neste portal.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Terms;
