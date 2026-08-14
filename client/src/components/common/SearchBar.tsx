import React, { useRef, useEffect, useState } from 'react';
import { Search, X, Command } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = usePrompts();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 250);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync debounced search to context
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  // Keep local query in sync if context query is reset externally
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Shortcut Cmd+K to focus search input
  useKeyboardShortcut(
    { key: 'k', ctrlOrCmd: true },
    () => {
      inputRef.current?.focus();
    }
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search title, prompt content, tags..."
        className="w-full pl-10 pr-20 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
        aria-label="Search prompts"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
        {localQuery ? (
          <button
            onClick={() => setLocalQuery('')}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  );
};
