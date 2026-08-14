import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EXACT_CATEGORIES,
  type Prompt,
  type Category,
  type SortOption,
  type CreatePromptInput,
  type UpdatePromptInput,
  type DashboardStats,
} from '../types/prompt';
import { apiService, getLocalPrompts, saveLocalPrompts } from '../services/api';
import { validateImportJSON } from '../utils/jsonValidator';
import { useToast } from './ToastContext';

interface PromptContextType {
  prompts: Prompt[];
  filteredPrompts: Prompt[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  favoritesOnly: boolean;
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats;
  
  // Handlers
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  setFavoritesOnly: (favOnly: boolean | ((prev: boolean) => boolean)) => void;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;
  
  // CRUD
  addPrompt: (input: CreatePromptInput) => Promise<boolean>;
  updatePrompt: (id: string, input: UpdatePromptInput) => Promise<boolean>;
  deletePrompt: (id: string) => Promise<boolean>;
  duplicatePrompt: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  reorderPrompts: (newOrder: Prompt[]) => Promise<void>;
  
  // Import/Export
  importPromptsJSON: (jsonString: string) => { success: boolean; importedCount: number; errors: string[] };
  exportPromptsJSON: () => void;
  refreshPrompts: () => Promise<void>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [favoritesOnly, setFavoritesOnlyState] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const setFavoritesOnly = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setFavoritesOnlyState(val);
  }, []);

  // Fetch prompts on mount
  const refreshPrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchPrompts();
      setPrompts(data);
    } catch (err: any) {
      console.error('Failed to load prompts:', err);
      setError(err.message || 'Failed to load prompts');
      const localData = getLocalPrompts();
      setPrompts(localData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPrompts();
  }, [refreshPrompts]);

  // Compute Dashboard Statistics automatically
  const stats: DashboardStats = useMemo(() => {
    const categoryCounts: Record<Category, number> = {
      Coding: 0,
      Marketing: 0,
      'Content Writing': 0,
      Email: 0,
      Resume: 0,
      SQL: 0,
      Design: 0,
      'Social Media': 0,
      Productivity: 0,
      Others: 0,
    };

    let favoriteCount = 0;
    const activeCategories = new Set<string>();

    prompts.forEach((p) => {
      if (p.isFavorite) favoriteCount++;
      if (EXACT_CATEGORIES.includes(p.category)) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        activeCategories.add(p.category);
      } else {
        categoryCounts['Others'] = (categoryCounts['Others'] || 0) + 1;
        activeCategories.add('Others');
      }
    });

    const recentPromptsList = [...prompts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalPrompts: prompts.length,
      favoritePrompts: favoriteCount,
      categoriesCount: activeCategories.size,
      recentlyAddedPrompts: Math.min(prompts.length, 5),
      categoryCounts,
      recentPromptsList,
    };
  }, [prompts]);

  // Combined Search / Filter / Sort
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Search filter (title & prompt content)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.prompt.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Favorites only filter
    if (favoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }

    // Sort: Pinned prompts always stay at top unless sorting explicitly changes order
    result.sort((a, b) => {
      // Pinned precedence
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [prompts, searchQuery, selectedCategory, favoritesOnly, sortBy]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFavoritesOnlyState(false);
    setSortBy('newest');
  }, []);

  // CRUD Actions
  const addPrompt = useCallback(
    async (input: CreatePromptInput): Promise<boolean> => {
      try {
        const created = await apiService.createPrompt(input);
        setPrompts((prev) => [created, ...prev]);
        showToast('Prompt created successfully!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to create prompt', 'error');
        return false;
      }
    },
    [showToast]
  );

  const updatePrompt = useCallback(
    async (id: string, input: UpdatePromptInput): Promise<boolean> => {
      try {
        const updated = await apiService.updatePrompt(id, input);
        setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast('Prompt updated successfully!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to update prompt', 'error');
        return false;
      }
    },
    [showToast]
  );

  const deletePrompt = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await apiService.deletePrompt(id);
        setPrompts((prev) => prev.filter((p) => p.id !== id));
        showToast('Prompt deleted successfully', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to delete prompt', 'error');
        return false;
      }
    },
    [showToast]
  );

  const duplicatePrompt = useCallback(
    async (id: string): Promise<boolean> => {
      const original = prompts.find((p) => p.id === id);
      if (!original) {
        showToast('Original prompt not found', 'error');
        return false;
      }

      const duplicateInput: CreatePromptInput = {
        title: `${original.title} (Copy)`,
        prompt: original.prompt,
        category: original.category,
        tags: [...original.tags],
        description: original.description,
        isFavorite: original.isFavorite,
        isPinned: false,
        order: (original.order || 0) + 1,
      };

      try {
        const created = await apiService.createPrompt(duplicateInput);
        setPrompts((prev) => [created, ...prev]);
        showToast(`Duplicated "${original.title}"`, 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to duplicate prompt', 'error');
        return false;
      }
    },
    [prompts, showToast]
  );

  const toggleFavorite = useCallback(
    async (id: string): Promise<void> => {
      const target = prompts.find((p) => p.id === id);
      if (!target) return;
      const nextFavState = !target.isFavorite;

      // Optimistic UI update
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: nextFavState } : p))
      );

      try {
        await apiService.updatePrompt(id, { isFavorite: nextFavState });
        showToast(
          nextFavState ? 'Added to favorites' : 'Removed from favorites',
          'info'
        );
      } catch (err) {
        // Revert on failure
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFavorite: !nextFavState } : p))
        );
        showToast('Failed to toggle favorite', 'error');
      }
    },
    [prompts, showToast]
  );

  const togglePin = useCallback(
    async (id: string): Promise<void> => {
      const target = prompts.find((p) => p.id === id);
      if (!target) return;
      const nextPinState = !target.isPinned;

      // Optimistic update
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPinned: nextPinState } : p))
      );

      try {
        await apiService.updatePrompt(id, { isPinned: nextPinState });
        showToast(
          nextPinState ? 'Prompt pinned to top' : 'Prompt unpinned',
          'info'
        );
      } catch (err) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPinned: !nextPinState } : p))
        );
        showToast('Failed to toggle pin', 'error');
      }
    },
    [prompts, showToast]
  );

  const reorderPrompts = useCallback(
    async (newOrder: Prompt[]): Promise<void> => {
      setPrompts(newOrder);
      saveLocalPrompts(newOrder);
      const orderedIds = newOrder.map((p) => p.id);
      await apiService.reorderPrompts(orderedIds);
    },
    []
  );

  // Import / Export
  const importPromptsJSON = useCallback(
    (jsonString: string) => {
      const validation = validateImportJSON(jsonString);
      if (!validation.isValid) {
        showToast(`Import failed: ${validation.errors[0] || 'Invalid data'}`, 'error');
        return { success: false, importedCount: 0, errors: validation.errors };
      }

      apiService.importPrompts(validation.validPrompts).then((updatedPrompts) => {
        setPrompts(updatedPrompts);
        showToast(
          `Successfully imported ${validation.validPrompts.length} prompt(s)`,
          'success'
        );
      });

      return {
        success: true,
        importedCount: validation.validPrompts.length,
        errors: validation.errors,
      };
    },
    [showToast]
  );

  const exportPromptsJSON = useCallback(() => {
    try {
      const exportData = prompts.map(({ id, title, prompt, category, tags, description, isFavorite, isPinned, createdAt, updatedAt }) => ({
        id,
        title,
        prompt,
        category,
        tags,
        description,
        isFavorite,
        isPinned,
        createdAt,
        updatedAt,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-prompts-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Exported prompts to JSON file', 'success');
    } catch (err) {
      showToast('Failed to export prompts', 'error');
    }
  }, [prompts, showToast]);

  return (
    <PromptContext.Provider
      value={{
        prompts,
        filteredPrompts,
        searchQuery,
        selectedCategory,
        favoritesOnly,
        sortBy,
        isLoading,
        error,
        stats,
        setSearchQuery,
        setSelectedCategory,
        setFavoritesOnly,
        setSortBy,
        clearFilters,
        addPrompt,
        updatePrompt,
        deletePrompt,
        duplicatePrompt,
        toggleFavorite,
        togglePin,
        reorderPrompts,
        importPromptsJSON,
        exportPromptsJSON,
        refreshPrompts,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = (): PromptContextType => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};
