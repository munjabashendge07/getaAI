import React, { useState } from 'react';
import { Sparkles, Plus, Download, Menu } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { SearchBar } from '../common/SearchBar';
import { ImportExportModal } from '../common/ImportExportModal';
import { PromptFormModal } from '../prompts/PromptFormModal';

interface NavbarProps {
  toggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleMobileSidebar }) => {
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            {toggleMobileSidebar && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white hidden sm:inline-block">
                Prompt<span className="text-brand-600 dark:text-brand-400">Hub</span>
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl px-2">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={() => setIsImportExportOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"
              aria-label="Import or Export prompts"
            >
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Import / Export</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
              aria-label="Add new prompt"
            >
              <Plus className="w-4 h-4 text-white stroke-[2.5]" />
              <span className="inline-block text-white">New Prompt</span>
            </button>
          </div>
        </div>
      </header>

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      <PromptFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};
