import React, { useState, useEffect } from 'react';
import { X, Sparkles, Pin, Heart, Tag as TagIcon, Command } from 'lucide-react';
import { EXACT_CATEGORIES, type Prompt, type Category, type CreatePromptInput } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: Prompt | null;
}

export const PromptFormModal: React.FC<PromptFormModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const { addPrompt, updatePrompt } = usePrompts();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Coding');
  const [description, setDescription] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; prompt?: string }>({});

  const isEditMode = Boolean(initialPrompt);

  useEffect(() => {
    if (initialPrompt) {
      setTitle(initialPrompt.title);
      setCategory(initialPrompt.category);
      setDescription(initialPrompt.description || '');
      setPromptContent(initialPrompt.prompt);
      setTagsInput(initialPrompt.tags.join(', '));
      setIsFavorite(initialPrompt.isFavorite);
      setIsPinned(initialPrompt.isPinned);
    } else {
      setTitle('');
      setCategory('Coding');
      setDescription('');
      setPromptContent('');
      setTagsInput('');
      setIsFavorite(false);
      setIsPinned(false);
    }
    setErrors({});
  }, [initialPrompt, isOpen]);

  // Keyboard shortcut Esc to close
  useKeyboardShortcut({ key: 'Escape' }, onClose, isOpen);

  // Keyboard shortcut Cmd/Ctrl + Enter to submit
  useKeyboardShortcut(
    { key: 'Enter', ctrlOrCmd: true },
    () => {
      handleSubmit();
    },
    isOpen
  );

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: { title?: string; prompt?: string } = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    if (!promptContent.trim()) {
      errs.prompt = 'Prompt content is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const inputData: CreatePromptInput = {
      title: title.trim(),
      category,
      description: description.trim(),
      prompt: promptContent.trim(),
      tags: tagsArray,
      isFavorite,
      isPinned,
      order: initialPrompt ? initialPrompt.order : 0,
    };

    let success = false;
    if (isEditMode && initialPrompt) {
      success = await updatePrompt(initialPrompt.id, inputData);
    } else {
      success = await addPrompt(inputData);
    }

    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Prompt' : 'Create New Prompt'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEditMode
                  ? 'Update your AI prompt template details below.'
                  : 'Add a new reusable AI prompt to your hub.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Prompt Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Senior Code Reviewer"
                className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border ${
                  errors.title ? 'border-rose-500' : 'border-gray-200 dark:border-gray-800'
                } rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
                autoFocus
              />
              {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {EXACT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of when to use this prompt"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Prompt Content */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Prompt Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={promptContent}
              onChange={(e) => {
                setPromptContent(e.target.value);
                if (errors.prompt) setErrors((prev) => ({ ...prev, prompt: undefined }));
              }}
              rows={6}
              placeholder="Act as a Senior Software Engineer..."
              className={`w-full p-3.5 bg-gray-50 dark:bg-gray-950 border ${
                errors.prompt ? 'border-rose-500' : 'border-gray-200 dark:border-gray-800'
              } rounded-xl text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed`}
            />
            {errors.prompt && <p className="text-[11px] text-rose-500 mt-1">{errors.prompt}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Tags (Comma separated)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <TagIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, typescript, security"
                className="w-full pl-9 pr-3.5 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Checkboxes: Pin & Favorite */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700"
              />
              <Pin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Pin to top of list</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 dark:border-gray-700"
              />
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Add to favorites</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
            <Command className="w-3 h-3" />
            <span>+ Enter to save</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md shadow-brand-500/20 transition-all"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Prompt'
                : 'Create Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
