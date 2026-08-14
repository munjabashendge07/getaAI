import { useEffect } from 'react';

type KeyCombination = {
  key: string;
  ctrlOrCmd?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function useKeyboardShortcut(
  combo: KeyCombination,
  handler: (e: KeyboardEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const keyMatches = event.key.toLowerCase() === combo.key.toLowerCase();

      if (combo.ctrlOrCmd && !isCtrlOrCmd) return;
      if (combo.altKey && !event.altKey) return;
      if (combo.shiftKey && !event.shiftKey) return;

      if (keyMatches) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [combo.key, combo.ctrlOrCmd, combo.altKey, combo.shiftKey, handler, enabled]);
}
