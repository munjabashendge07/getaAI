import React from 'react';
import { Layers, Heart, FolderTree, Clock, TrendingUp } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';

export const DashboardStats: React.FC = () => {
  const { stats } = usePrompts();

  const cards = [
    {
      title: 'Total Prompts',
      value: stats.totalPrompts,
      subtext: 'In your library',
      icon: <Layers className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      bg: 'bg-brand-50 dark:bg-brand-950/40 border-brand-200/60 dark:border-brand-800/60',
    },
    {
      title: 'Favorite Prompts',
      value: stats.favoritePrompts,
      subtext: `${Math.round((stats.favoritePrompts / (stats.totalPrompts || 1)) * 100)}% of total library`,
      icon: <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/60',
    },
    {
      title: 'Active Categories',
      value: `${stats.categoriesCount} / 10`,
      subtext: 'Categories utilized',
      icon: <FolderTree className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60',
    },
    {
      title: 'Recently Added',
      value: stats.recentlyAddedPrompts,
      subtext: 'Latest active items',
      icon: <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl border ${card.bg} backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {card.value}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{card.subtext}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
