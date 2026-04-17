import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Pencil, X } from 'lucide-react';

const ICON_LIST = [
  'Settings', 'Zap', 'Cpu', 'Layers', 'Activity', 'Wrench', 
  'Shield', 'Smartphone', 'Phone', 'Mail', 'MapPin', 'Check',
  'Box', 'Truck', 'Clock', 'User', 'FileText', 'Image', 'Video'
];

const IconSelector = ({ pagina, path, currentIcon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const saveText = useAdminStore((state) => state.saveText);

  if (!isAuthenticated || !isVisualEditorActive) return null;

  const handleIconClick = (iconName) => {
    saveText(pagina, path, iconName);
    if (onSelect) onSelect(iconName);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-0 right-0 z-[100]">
      {/* Trigger Badge */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 hover:bg-accent transition-colors whitespace-nowrap"
      >
        {isOpen ? <X size={8} /> : <Pencil size={8} />}
        {isOpen ? 'FECHAR' : 'TROCAR ÍCONE'}
      </button>

      {/* Selector Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 p-2 rounded-lg shadow-2xl grid grid-cols-5 gap-2 w-48 max-h-48 overflow-y-auto animate-in fade-in zoom-in duration-200">
          {ICON_LIST.map((name) => {
            const Icon = Icons[name];
            return (
              <button
                key={name}
                onClick={(e) => { e.stopPropagation(); handleIconClick(name); }}
                className={`p-1.5 rounded hover:bg-primary/10 transition-colors flex items-center justify-center ${currentIcon === name ? 'bg-primary/20 text-primary' : 'text-gray-400'}`}
                title={name}
              >
                {Icon ? <Icon size={16} /> : <Icons.HelpCircle size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IconSelector;
