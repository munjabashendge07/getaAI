import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { Prompt } from '../../types/prompt';
import { PromptCard } from './PromptCard';
import { usePrompts } from '../../context/PromptContext';
import { Sparkles, SearchX, Plus, RefreshCw } from 'lucide-react';

interface PromptGridProps {
  onEdit: (prompt: Prompt) => void;
  onDeleteRequest: (prompt: Prompt) => void;
  onViewDetail: (prompt: Prompt) => void;
  onOpenCreateModal: () => void;
}

export const PromptGrid: React.FC<PromptGridProps> = ({
  onEdit,
  onDeleteRequest,
  onViewDetail,
  onOpenCreateModal,
}) => {
  const {
    filteredPrompts,
    isLoading,
    reorderPrompts,
    searchQuery,
    selectedCategory,
    favoritesOnly,
    clearFilters,
  } = usePrompts();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(filteredPrompts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order indexes
    const updated = items.map((item, idx) => ({ ...item, order: idx }));
    reorderPrompts(updated);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <RefreshCw className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading prompt library...</p>
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    const isFiltered = searchQuery || selectedCategory !== 'All' || favoritesOnly;

    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl text-center shadow-sm">
        <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-4">
          {isFiltered ? <SearchX className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {isFiltered ? 'No prompts found' : 'Your prompt library is empty'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-6">
          {isFiltered
            ? 'No prompts matched your search query or selected category filter.'
            : 'Get started by creating your first AI prompt or importing sample templates.'}
        </p>

        <div className="flex items-center gap-3">
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          )}

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Prompt</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="prompt-grid-droppable" direction="vertical">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredPrompts.map((prompt, index) => (
              <Draggable key={prompt.id} draggableId={String(prompt.id)} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    style={{ ...dragProvided.draggableProps.style }}
                    className={snapshot.isDragging ? 'opacity-90 scale-[1.02] z-50 shadow-2xl' : ''}
                  >
                    <PromptCard
                      prompt={prompt}
                      index={index}
                      onEdit={onEdit}
                      onDeleteRequest={onDeleteRequest}
                      onViewDetail={onViewDetail}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
