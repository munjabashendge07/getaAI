import React, { useState } from 'react';
import { CategoryFilter } from '../components/common/CategoryFilter';
import { SortDropdown } from '../components/common/SortDropdown';
import { PromptGrid } from '../components/prompts/PromptGrid';
import { PromptFormModal } from '../components/prompts/PromptFormModal';
import { PromptDetailModal } from '../components/prompts/PromptDetailModal';
import { DeleteConfirmModal } from '../components/prompts/DeleteConfirmModal';
import { usePrompts } from '../context/PromptContext';
import type { Prompt } from '../types/prompt';
import { Heart, Plus, FilterX } from 'lucide-react';

interface PromptsPageProps {
  onOpenCreateModal: () => void;
}

export const PromptsPage: React.FC<PromptsPageProps> = ({ onOpenCreateModal }) => {
  const {
    selectedCategory,
    favoritesOnly,
    setFavoritesOnly,
    searchQuery,
    filteredPrompts,
    clearFilters,
  } = usePrompts();

  // Modals state
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deletingPrompt, setDeletingPrompt] = useState<Prompt | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (prompt: Prompt) => {
    setDeletingPrompt(prompt);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetail = (prompt: Prompt) => {
    setViewingPrompt(prompt);
    setIsDetailModalOpen(true);
  };

  const isFiltered = selectedCategory !== 'All' || favoritesOnly || searchQuery;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {favoritesOnly
                ? 'Favorite Prompts'
                : selectedCategory !== 'All'
                ? `${selectedCategory} Prompts`
                : 'All AI Prompts'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              {filteredPrompts.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Browse, reorder with drag & drop, copy, or manage reusable prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Favorites Only Toggle */}
          <button
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              favoritesOnly
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Sort Dropdown */}
          <SortDropdown />

          {/* Add Prompt Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Prompt</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <CategoryFilter />
      </div>

      {/* Active Filters Bar */}
      {isFiltered && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/40 dark:border-brand-900/40 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-medium">
                Category: {selectedCategory}
              </span>
            )}
            {favoritesOnly && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-medium">
                Favorites Only
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium">
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline ml-2"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Prompt Cards Grid */}
      <PromptGrid
        onEdit={handleEdit}
        onDeleteRequest={handleDeleteRequest}
        onViewDetail={handleViewDetail}
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* Modals */}
      <PromptFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPrompt(null);
        }}
        initialPrompt={editingPrompt}
      />

      <PromptDetailModal
        prompt={viewingPrompt}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingPrompt(null);
        }}
        onEdit={handleEdit}
      />

      <DeleteConfirmModal
        prompt={deletingPrompt}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingPrompt(null);
        }}
      />
    </div>
  );
};
