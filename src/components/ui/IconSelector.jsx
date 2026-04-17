import React from 'react';
import * as Icons from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const ICON_LIST = [
  'Settings', 'Zap', 'Cpu', 'Layers', 'Activity', 'Wrench', 
  'Shield', 'Smartphone', 'Phone', 'Mail', 'MapPin', 'Check',
  'Box', 'Truck', 'Clock', 'User', 'FileText', 'Image', 'Video'
];

const IconSelector = ({ pagina, path, currentIcon, onSelect }) => {
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const saveText = useAdminStore((state) => state.saveText);

  if (!isAuthenticated || !isVisualEditorActive) return null;

  const handleIconClick = (iconName) => {
    saveText(pagina, path, iconName);
    if (onSelect) onSelect(iconName);
  };

  return (
    <div className="absolute top-0 right-0 z-[60] bg-white border border-gray-200 p-2 rounded-lg shadow-xl grid grid-cols-5 gap-2 w-48 max-h-48 overflow-y-auto invisible group-hover:visible transition-all">
      {ICON_LIST.map((name) => {
        const Icon = Icons[name];
        return (
          <button
            key={name}
            onClick={() => handleIconClick(name)}
            className={`p-1.5 rounded hover:bg-primary/10 transition-colors flex items-center justify-center ${currentIcon === name ? 'bg-primary/20 text-primary' : 'text-gray-400'}`}
            title={name}
          >
            {Icon ? <Icon size={16} /> : <Icons.HelpCircle size={16} />}
          </button>
        );
      })}
    </div>
  );
};

export default IconSelector;
