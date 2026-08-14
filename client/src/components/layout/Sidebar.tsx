import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Heart,
  Tag,
  Download,
  FilterX,
  X,
  Code,
  Megaphone,
  PenTool,
  Mail,
  FileText,
  Database,
  Palette,
  Share2,
  CheckSquare,
  Folder,
} from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import { type Category, EXACT_CATEGORIES } from '../../types/prompt';

interface SidebarProps {
  activeTab: 'dashboard' | 'prompts';
  setActiveTab: (tab: 'dashboard' | 'prompts') => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenImportExport?: () => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Coding: <Code className="w-4 h-4 text-blue-500" />,
  Marketing: <Megaphone className="w-4 h-4 text-orange-500" />,
  'Content Writing': <PenTool className="w-4 h-4 text-emerald-500" />,
  Email: <Mail className="w-4 h-4 text-purple-500" />,
  Resume: <FileText className="w-4 h-4 text-amber-500" />,
  SQL: <Database className="w-4 h-4 text-cyan-500" />,
  Design: <Palette className="w-4 h-4 text-pink-500" />,
  'Social Media': <Share2 className="w-4 h-4 text-indigo-500" />,
  Productivity: <CheckSquare className="w-4 h-4 text-teal-500" />,
  Others: <Folder className="w-4 h-4 text-gray-500" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenImportExport,
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    favoritesOnly,
    setFavoritesOnly,
    stats,
    clearFilters,
    searchQuery,
  } = usePrompts();

  const isFiltered = selectedCategory !== 'All' || favoritesOnly || searchQuery;

  const content = (
    <div className="flex flex-col h-full py-5 px-4 space-y-6">
      {/* Primary Navigation */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          Navigation
        </p>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            onCloseMobile?.();
          }}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('prompts');
            setFavoritesOnly(false);
            setSelectedCategory('All');
            onCloseMobile?.();
          }}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'prompts' && !favoritesOnly && selectedCategory === 'All'
              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" />
            <span>All Prompts</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {stats.totalPrompts}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('prompts');
            setFavoritesOnly(true);
            onCloseMobile?.();
          }}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'prompts' && favoritesOnly
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>Favorites</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            {stats.favoritePrompts}
          </span>
        </button>
      </div>

      {/* Categories (Exact 10) */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Categories (10)
          </p>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[10px] font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              <FilterX className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {EXACT_CATEGORIES.map((cat) => {
          const count = stats.categoryCounts[cat] || 0;
          const isSelected = activeTab === 'prompts' && selectedCategory === cat && !favoritesOnly;

          return (
            <button
              key={cat}
              onClick={() => {
                setActiveTab('prompts');
                setFavoritesOnly(false);
                setSelectedCategory(cat);
                onCloseMobile?.();
              }}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold border border-brand-200/40 dark:border-brand-800/40'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {CATEGORY_ICONS[cat]}
                <span className="truncate max-w-[110px]">{cat}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isSelected
                    ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {onOpenImportExport && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onOpenImportExport}
            className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Import / Export Data</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0b0f19]/50 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white dark:bg-gray-900 h-full shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span className="font-bold text-gray-900 dark:text-white text-sm">Navigation</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
