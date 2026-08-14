import React, { useState, useRef } from 'react';
import { Upload, Download, AlertTriangle, CheckCircle2, FileText, X } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { validateImportJSON } from '../../utils/jsonValidator';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const { importPromptsJSON, exportPromptsJSON } = usePrompts();
  const [jsonText, setJsonText] = useState('');
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    validCount: number;
    errors: string[];
  }>({ tested: false, isValid: false, validCount: 0, errors: [] });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Esc to close modal
  useKeyboardShortcut({ key: 'Escape' }, onClose, isOpen);

  if (!isOpen) return null;

  const handleValidate = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      setValidationResult({ tested: false, isValid: false, validCount: 0, errors: [] });
      return;
    }
    const result = validateImportJSON(text);
    setValidationResult({
      tested: true,
      isValid: result.isValid,
      validCount: result.validPrompts.length,
      errors: result.errors,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleValidate(content);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    if (!jsonText.trim()) return;
    const result = importPromptsJSON(jsonText);
    if (result.success) {
      setJsonText('');
      setValidationResult({ tested: false, isValid: false, validCount: 0, errors: [] });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Import & Export Prompts
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Backup your collection or import external prompt JSON files with validation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                exportPromptsJSON();
                onClose();
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:border-brand-300 text-gray-700 dark:text-gray-200 font-medium text-sm transition-all"
            >
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Export Prompts (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-medium text-sm transition-all"
            >
              <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Upload JSON File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Paste JSON Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Or Paste JSON Code Here:
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => handleValidate(e.target.value)}
              placeholder={`[\n  {\n    "title": "React Component Generator",\n    "prompt": "Create a reusable React component...",\n    "category": "Coding",\n    "tags": ["react", "typescript"]\n  }\n]`}
              className="w-full h-44 p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Validation Feedback */}
          {validationResult.tested && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                validationResult.isValid
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <div className="flex items-center gap-1.5">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span>
                    {validationResult.isValid
                      ? `Valid JSON: Ready to import ${validationResult.validCount} prompt(s)`
                      : 'Validation Warnings / Errors Found'}
                  </span>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-[11px] max-h-24 overflow-y-auto">
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImportSubmit}
            disabled={!validationResult.isValid}
            className="px-5 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            Import Prompts
          </button>
        </div>
      </div>
    </div>
  );
};
