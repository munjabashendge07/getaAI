import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Prompt } from '../../types/prompt';
import { usePrompts } from '../../context/PromptContext';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

interface DeleteConfirmModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  prompt,
  isOpen,
  onClose,
}) => {
  const { deletePrompt } = usePrompts();
  const [isDeleting, setIsDeleting] = useState(false);

  useKeyboardShortcut({ key: 'Escape' }, onClose, isOpen);

  if (!isOpen || !prompt) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deletePrompt(prompt.id);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/50 rounded-3xl max-w-md w-full p-6 shadow-2xl overflow-hidden flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Delete Prompt?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{prompt.title}"</span>?
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md shadow-rose-500/20 transition-all"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};
