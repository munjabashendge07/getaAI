import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import type { Category } from '../types/prompt';
import { Sparkles, Plus, Layers } from 'lucide-react';

interface DashboardPageProps {
  onNavigatePromptsWithCategory: (cat: Category) => void;
  onNavigateAllPrompts: () => void;
  onOpenCreateModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigatePromptsWithCategory,
  onNavigateAllPrompts,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prompt Management Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to your AI Prompt Library
          </h1>
          <p className="text-sm text-brand-100 leading-relaxed">
            Organize, search, filter, and execute high-performing AI prompts across all 10 specialized categories.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-indigo-900 bg-white hover:bg-gray-100 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              <span className="text-indigo-900 font-extrabold">Create New Prompt</span>
            </button>

            <button
              onClick={onNavigateAllPrompts}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Library</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <DashboardStats />

      {/* Category Breakdown & Recent Prompts */}
      <CategoryBreakdown onSelectCategory={onNavigatePromptsWithCategory} />
    </div>
  );
};
