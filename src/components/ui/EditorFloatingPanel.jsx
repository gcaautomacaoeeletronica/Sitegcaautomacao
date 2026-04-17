import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Edit3, Eye, ShieldCheck, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditorFloatingPanel = () => {
  const { isVisualEditorActive, toggleVisualEditor, isAuthenticated, isAuthLoading } = useAdminStore();
  const navigate = useNavigate();

  if (isAuthLoading || !isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {/* Botão para Dashboard */}
      <button 
        onClick={() => navigate('/admin/dashboard')}
        className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all group relative"
        title="Painel Administrativo"
      >
        <Settings size={20} />
        <span className="absolute right-14 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          PAINEL ADMIN
        </span>
      </button>

      {/* Toggle Editor Visual */}
      <button 
        onClick={toggleVisualEditor}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${
          isVisualEditorActive 
            ? 'bg-primary border-white text-white scale-110' 
            : 'bg-white border-primary text-primary hover:scale-105'
        } group relative`}
      >
        {isVisualEditorActive ? <Edit3 size={24} /> : <Eye size={24} />}
        
        <div className="absolute right-16 bg-white border border-gray-100 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Controle Visual GCA</span>
          </div>
          <p className="text-xs font-bold text-gray-900">
            {isVisualEditorActive ? 'Modo Edição Ativo' : 'Modo Visualização'}
          </p>
          <p className="text-[10px] text-gray-500 mt-1 leading-tight">
            {isVisualEditorActive 
              ? 'Clique nos textos do site para alterar o conteúdo em tempo real.' 
              : 'Ative para editar textos diretamente nesta tela.'}
          </p>
        </div>
        
        {/* Badge de Status */}
        <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isVisualEditorActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
      </button>
    </div>
  );
};

export default EditorFloatingPanel;
