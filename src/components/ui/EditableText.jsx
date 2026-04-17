import React, { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Check, Loader2 } from 'lucide-react';

const EditableText = ({ pagina, path, children, className = "", tag = "span" }) => {
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const isAuthLoading = useAdminStore((state) => state.isAuthLoading);
  const saveText = useAdminStore((state) => state.saveText);
  
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children);
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);

  // Sync with prop children when not editing
  useEffect(() => {
    if (!isEditing) {
      setText(children);
    }
  }, [children, isEditing]);

  const canEdit = !isAuthLoading && isAuthenticated && isVisualEditorActive;

  const handleBlur = async () => {
    setIsEditing(false);
    const newText = textRef.current.innerText.trim();
    if (newText !== children) {
      setLoading(true);
      try {
        await saveText(pagina, path, newText);
      } catch (err) {
        console.error("Erro ao salvar texto visual:", err);
        setText(children); // Revert on error
      } finally {
        setLoading(false);
      }
    }
  };

  const Tag = tag;

  if (!canEdit) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag 
      ref={textRef}
      contentEditable={!loading}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onFocus={() => setIsEditing(true)}
      className={`${className} relative group cursor-text outline-none focus:ring-2 focus:ring-primary/30 rounded px-1 transition-all ${
        isEditing ? 'bg-white/10' : 'hover:bg-primary/5'
      }`}
      style={{ minWidth: '1em', display: (tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3') ? 'block' : 'inline-block' }}
    >
      {text}
      
      {/* Visual Indicators */}
      {!isEditing && !loading && (
        <div className="absolute -top-6 left-0 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          CLIQUE PARA EDITAR
        </div>
      )}
      
      {loading && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
          <Loader2 size={14} className="animate-spin text-primary" />
        </div>
      )}
    </Tag>
  );
};

export default EditableText;
