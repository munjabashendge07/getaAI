import React from 'react';
import { EXACT_CATEGORIES, type Category } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { Tag } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, stats } = usePrompts();

  const categories: (Category | 'All')[] = ['All', ...EXACT_CATEGORIES];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count =
          cat === 'All'
            ? stats.totalPrompts
            : stats.categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isSelected
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 dark:bg-brand-500'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            aria-label={`Filter by category ${cat}`}
          >
            {cat === 'All' && <Tag className="w-3 h-3" />}
            <span>{cat}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
