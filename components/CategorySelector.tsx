
import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategorySelectorProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
            activeCategory === cat.id
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105'
              : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700 hover:border-white/10'
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};
