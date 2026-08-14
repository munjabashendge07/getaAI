import React, { useState } from 'react';
import {
  GripVertical,
  Pin,
  Heart,
  Copy,
  Check,
  Edit,
  CopyPlus,
  Trash2,
  Calendar,
  Eye,
  Tag as TagIcon,
} from 'lucide-react';
import type { Prompt, Category } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { useToast } from '../../context/ToastContext';

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onEdit: (prompt: Prompt) => void;
  onDeleteRequest: (prompt: Prompt) => void;
  onViewDetail: (prompt: Prompt) => void;
  dragHandleProps?: any;
}

const CATEGORY_BADGE_STYLES: Record<Category, string> = {
  Coding: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Marketing: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'Content Writing': 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Email: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Resume: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  SQL: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  Design: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  'Social Media': 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Productivity: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  Others: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDeleteRequest,
  onViewDetail,
  dragHandleProps,
}) => {
  const { toggleFavorite, togglePin, duplicatePrompt } = usePrompts();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-gray-900 border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        prompt.isPinned
          ? 'border-brand-400/80 dark:border-brand-500/80 shadow-md shadow-brand-500/5 bg-gradient-to-b from-brand-50/20 to-transparent dark:from-brand-950/10'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            title="Drag to reorder prompt"
            aria-label="Drag handle"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Category Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              CATEGORY_BADGE_STYLES[prompt.category] || CATEGORY_BADGE_STYLES.Others
            }`}
          >
            {prompt.category}
          </span>

          {/* Pinned Badge */}
          {prompt.isPinned && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Pin className="w-2.5 h-2.5 fill-current" />
              Pinned
            </span>
          )}
        </div>

        {/* Quick Icon Actions (Pin & Favorite) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePin(prompt.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              prompt.isPinned
                ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={prompt.isPinned ? 'Unpin prompt' : 'Pin prompt to top'}
            aria-label={prompt.isPinned ? 'Unpin prompt' : 'Pin prompt'}
          >
            <Pin className={`w-4 h-4 ${prompt.isPinned ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => toggleFavorite(prompt.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              prompt.isFavorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
            title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="mt-3 cursor-pointer" onClick={() => onViewDetail(prompt)}>
        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {prompt.title}
        </h3>

        {prompt.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {prompt.description}
          </p>
        )}

        {/* Prompt Code Snippet Preview */}
        <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800/80 font-mono text-xs text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed relative group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors">
          {prompt.prompt}
        </div>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {prompt.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <TagIcon className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Toolbar */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* View Details */}
          <button
            onClick={() => onViewDetail(prompt)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="View full prompt details"
            aria-label="View prompt details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Copy Prompt */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900'
            }`}
            title="Copy prompt content to clipboard"
            aria-label="Copy prompt content"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() => duplicatePrompt(prompt.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Duplicate prompt"
            aria-label="Duplicate prompt"
          >
            <CopyPlus className="w-4 h-4" />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(prompt)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Edit prompt"
            aria-label="Edit prompt"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeleteRequest(prompt)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete prompt"
            aria-label="Delete prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
