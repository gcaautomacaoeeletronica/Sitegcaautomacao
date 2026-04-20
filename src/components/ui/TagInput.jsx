import React, { useState, useEffect } from 'react';
import { X, Tag as TagIcon, Plus } from 'lucide-react';

const TagInput = ({ tags = [], onChange, placeholder = "Adicionar palavra-chave..." }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim().replace(/,$/, '');
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg shadow-sm group animate-in fade-in zoom-in duration-200"
          >
            <TagIcon size={12} className="text-primary/60" />
            {tag}
            <button 
              type="button"
              onClick={() => removeTag(index)}
              className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 px-2 min-w-[120px]"
        />
      </div>
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center gap-1">
        <Plus size={10} /> Pressione Enter ou vírgula para adicionar
      </p>
    </div>
  );
};

export default TagInput;
