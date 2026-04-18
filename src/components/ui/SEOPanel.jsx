import React, { useMemo } from 'react';
import { CheckCircle2, AlertCircle, Info, BarChart3, Target, Layout, Type, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const SEOPanel = ({ title, summary, content, imageUrl }) => {
  const analysis = useMemo(() => {
    const checks = [
      {
        id: 'title',
        label: 'Tamanho do Título',
        desc: 'Ideal entre 40 e 70 caracteres.',
        status: title.length >= 40 && title.length <= 70 ? 'success' : 'warning',
        score: title.length >= 40 && title.length <= 70 ? 20 : 5,
        icon: <Target size={16} />
      },
      {
        id: 'summary',
        label: 'Meta Descrição (Resumo)',
        desc: 'Ideal entre 120 e 160 caracteres para o Google.',
        status: summary.length >= 100 && summary.length <= 180 ? 'success' : 'warning',
        score: summary.length >= 100 && summary.length <= 180 ? 20 : 5,
        icon: <Layout size={16} />
      },
      {
        id: 'length',
        label: 'Extensão do Texto',
        desc: 'Mínimo de 300 palavras recomendado para autoridade.',
        status: content.split(' ').length >= 300 ? 'success' : 'warning',
        score: content.split(' ').length >= 300 ? 20 : 10,
        icon: <Type size={16} />
      },
      {
        id: 'headings',
        label: 'Hierarquia (H2/H3)',
        desc: 'Uso de subtítulos melhora a leitura e indexação.',
        status: /<h[2-3]/.test(content) ? 'success' : 'danger',
        score: /<h[2-3]/.test(content) ? 20 : 0,
        icon: <BarChart3 size={16} />
      },
      {
        id: 'media',
        label: 'Imagem de Destaque',
        desc: 'Posts com imagens engajam 2.3x mais.',
        status: imageUrl ? 'success' : 'danger',
        score: imageUrl ? 20 : 0,
        icon: <ImageIcon size={16} />
      }
    ];

    const totalScore = checks.reduce((acc, curr) => acc + curr.score, 0);
    
    return { checks, totalScore };
  }, [title, summary, content, imageUrl]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Target size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">SEO Health Score</h4>
            <div className={`text-4xl font-black ${getScoreColor(analysis.totalScore)}`}>
              {analysis.totalScore}<span className="text-sm text-gray-600 ml-1">/ 100</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="32" cy="32" r="28" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * analysis.totalScore) / 100}
                  className={getScoreColor(analysis.totalScore)}
                />
             </svg>
             <CheckCircle2 size={24} className={getScoreColor(analysis.totalScore)} />
          </div>
        </div>

        <div className="space-y-4">
          {analysis.checks.map((check) => (
            <div key={check.id} className="group cursor-help">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-lg ${
                  check.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                  check.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {check.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-200">{check.label}</span>
                    <span className={`text-[10px] font-black uppercase ${
                      check.status === 'success' ? 'text-emerald-500' : 
                      check.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {check.status === 'success' ? 'Excelente' : check.status === 'warning' ? 'Melhorar' : 'Crítico'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{check.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
           <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 bg-blue-400/5 p-3 rounded-xl border border-blue-400/10">
              <Info size={14} className="shrink-0" />
              <span>DICA: Use palavras-chave como "Automação", "Reparo" e "Industrial" no primeiro parágrafo.</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SEOPanel;
