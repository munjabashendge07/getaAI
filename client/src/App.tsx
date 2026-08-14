import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { PromptProvider, usePrompts } from './context/PromptContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { PromptsPage } from './pages/PromptsPage';
import { PromptFormModal } from './components/prompts/PromptFormModal';
import { ImportExportModal } from './components/common/ImportExportModal';
import type { Category } from './types/prompt';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prompts'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  const { setSelectedCategory, setFavoritesOnly } = usePrompts();

  const handleNavigateCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setFavoritesOnly(false);
    setActiveTab('prompts');
  };

  const handleNavigateAllPrompts = () => {
    setSelectedCategory('All');
    setFavoritesOnly(false);
    setActiveTab('prompts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenImportExport={() => setIsImportExportOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' ? (
            <DashboardPage
              onNavigatePromptsWithCategory={handleNavigateCategory}
              onNavigateAllPrompts={handleNavigateAllPrompts}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <PromptsPage onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Global Create Prompt Modal */}
      <PromptFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Global Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PromptProvider>
          <MainAppContent />
        </PromptProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
