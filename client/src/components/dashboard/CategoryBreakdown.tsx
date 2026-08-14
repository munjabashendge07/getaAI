import React from 'react';
import { EXACT_CATEGORIES, type Category } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { PieChart, Clock, Tag } from 'lucide-react';

export const CategoryBreakdown: React.FC<{ onSelectCategory: (cat: Category) => void }> = ({
  onSelectCategory,
}) => {
  const { stats } = usePrompts();
  const total = stats.totalPrompts || 1;

  const categoryColors: Record<Category, string> = {
    Coding: 'bg-blue-500',
    Marketing: 'bg-orange-500',
    'Content Writing': 'bg-emerald-500',
    Email: 'bg-purple-500',
    Resume: 'bg-amber-500',
    SQL: 'bg-cyan-500',
    Design: 'bg-pink-500',
    'Social Media': 'bg-indigo-500',
    Productivity: 'bg-teal-500',
    Others: 'bg-gray-500',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Breakdown Progress Bars */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Category Distribution (Exact 10)
            </h3>
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {stats.totalPrompts} Total Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
          {EXACT_CATEGORIES.map((cat) => {
            const count = stats.categoryCounts[cat] || 0;
            const percentage = Math.round((count / total) * 100);

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="group flex flex-col space-y-1.5 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${categoryColors[cat]}`} />
                    <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cat}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${categoryColors[cat]} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recently Added Feed */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recently Added
            </h3>
          </div>

          <div className="space-y-3">
            {stats.recentPromptsList.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No prompts found.</p>
            ) : (
              stats.recentPromptsList.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-800 transition-all cursor-pointer"
                  onClick={() => onSelectCategory(prompt.category)}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                    <span className="truncate pr-2">{prompt.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex-shrink-0">
                      {prompt.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {prompt.description || prompt.prompt}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> 10 Categories Active
          </span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold">Live Synced</span>
        </div>
      </div>
    </div>
  );
};
