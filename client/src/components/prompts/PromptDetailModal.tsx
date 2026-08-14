import React, { useState } from 'react';
import { X, Copy, Check, Pin, Heart, Edit, Calendar, Tag as TagIcon } from 'lucide-react';
import type { Prompt } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { useToast } from '../../context/ToastContext';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { toggleFavorite, togglePin } = usePrompts();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  useKeyboardShortcut({ key: 'Escape' }, onClose, isOpen);

  if (!isOpen || !prompt) return null;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(prompt.prompt)
      .then(() => {
        setCopied(true);
        showToast('Prompt copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
  };

  const formattedDate = new Date(prompt.createdAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {prompt.category}
              </span>

              {prompt.isPinned && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white">
                  <Pin className="w-2.5 h-2.5 fill-current" />
                  Pinned
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {prompt.title}
            </h2>
            {prompt.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{prompt.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePin(prompt.id)}
              className={`p-2 rounded-xl transition-colors ${
                prompt.isPinned
                  ? 'text-brand-600 bg-brand-50 dark:bg-brand-950'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={prompt.isPinned ? 'Unpin prompt' : 'Pin prompt'}
            >
              <Pin className={`w-5 h-5 ${prompt.isPinned ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => toggleFavorite(prompt.id)}
              className={`p-2 rounded-xl transition-colors ${
                prompt.isFavorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950'
                  : 'text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
              title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${prompt.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          <div className="relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Prompt Code & Content
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
              </button>
            </div>

            <pre className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl font-mono text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {prompt.prompt}
            </pre>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Associated Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <TagIcon className="w-3 h-3 text-brand-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created on {formattedDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onEdit(prompt);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Prompt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
