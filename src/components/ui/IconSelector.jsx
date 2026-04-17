import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { Pencil, X, Search } from 'lucide-react';

const ICON_CATEGORIES = {
  'Industrial': [
    'Settings', 'Wrench', 'Cpu', 'Zap', 'Activity', 'BarChart2', 'Gauge',
    'Cog', 'Hammer', 'Drill', 'Bolt', 'Cable', 'CircuitBoard', 'HardDrive',
    'Server', 'Battery', 'Power', 'Thermometer', 'Radio', 'Radar'
  ],
  'Negócios': [
    'Shield', 'ShieldCheck', 'Award', 'Star', 'TrendingUp', 'Target',
    'Briefcase', 'Building', 'Building2', 'Factory', 'Layers', 'Package',
    'Box', 'Truck', 'Forklift', 'ClipboardCheck', 'FileCheck', 'BadgeCheck'
  ],
  'Contato': [
    'Phone', 'PhoneCall', 'Mail', 'MessageSquare', 'MapPin', 'Navigation',
    'Globe', 'Headphones', 'User', 'Users', 'UserCheck', 'Contact'
  ],
  'Interface': [
    'Check', 'CheckCircle', 'Clock', 'Calendar', 'Bell', 'Eye',
    'Search', 'Link', 'ExternalLink', 'Download', 'Upload', 'Share2',
    'Bookmark', 'Tag', 'Hash', 'List', 'Grid', 'LayoutGrid'
  ],
  'Tecnologia': [
    'Wifi', 'Bluetooth', 'Monitor', 'Laptop', 'Smartphone', 'Tablet',
    'Database', 'Cloud', 'Lock', 'Unlock', 'Key', 'Fingerprint',
    'Code', 'Terminal', 'GitBranch', 'Scan', 'QrCode', 'Bot'
  ],
  'Mídias': [
    'Image', 'Video', 'Camera', 'Mic', 'Volume2', 'Music',
    'Play', 'Film', 'FileText', 'File', 'Folder', 'Archive'
  ],
};

const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

const IconSelector = ({ pagina, path, currentIcon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Industrial');
  const isVisualEditorActive = useAdminStore((state) => state.isVisualEditorActive);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const saveText = useAdminStore((state) => state.saveText);

  if (!isAuthenticated || !isVisualEditorActive) return null;

  const handleIconClick = (iconName) => {
    saveText(pagina, path, iconName);
    if (onSelect) onSelect(iconName);
    setIsOpen(false);
    setSearch('');
  };

  const filteredIcons = search.trim()
    ? ALL_ICONS.filter(n => n.toLowerCase().includes(search.toLowerCase()))
    : ICON_CATEGORIES[activeCategory] || [];

  return (
    <div className="absolute top-0 right-0 z-[100]">
      {/* Trigger Badge */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); setSearch(''); }}
        className="bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 hover:bg-accent transition-colors whitespace-nowrap"
      >
        {isOpen ? <X size={8} /> : <Pencil size={8} />}
        {isOpen ? 'FECHAR' : 'TROCAR ÍCONE'}
      </button>

      {/* Selector Panel */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl w-72"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
              <Search size={12} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ícone..."
                className="text-xs bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Category Tabs */}
          {!search && (
            <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
              {Object.keys(ICON_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Icons Grid */}
          <div className="p-2 grid grid-cols-6 gap-1 max-h-52 overflow-y-auto">
            {filteredIcons.length === 0 && (
              <p className="col-span-6 text-center text-xs text-gray-400 py-4">Nenhum ícone encontrado.</p>
            )}
            {filteredIcons.map((name) => {
              const Icon = Icons[name];
              return (
                <button
                  key={name}
                  onClick={() => handleIconClick(name)}
                  title={name}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${currentIcon === name ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-primary/10 hover:text-primary'}`}
                >
                  {Icon ? <Icon size={18} /> : <Icons.HelpCircle size={18} />}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-gray-100 text-[9px] text-gray-400 text-right">
            {filteredIcons.length} ícones {search ? 'encontrados' : `em ${activeCategory}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
