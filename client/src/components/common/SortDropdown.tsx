import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import type { SortOption } from '../../types/prompt';

export const SortDropdown: React.FC = () => {
  const { sortBy, setSortBy } = usePrompts();

  const options: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'a-z', label: 'Title: A → Z' },
    { value: 'z-a', label: 'Title: Z → A' },
  ];

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-3 pointer-events-none text-gray-400 dark:text-gray-500">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="pl-8 pr-8 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm appearance-none cursor-pointer"
        aria-label="Sort prompts"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-gray-400">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
