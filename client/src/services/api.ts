import type { Prompt, CreatePromptInput, UpdatePromptInput } from '../types/prompt';
import { INITIAL_SAMPLE_PROMPTS } from '../utils/samplePrompts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'ai_prompt_library_prompts_v1';

// Helper to interact with LocalStorage
export const getLocalPrompts = (): Prompt[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_PROMPTS));
      return INITIAL_SAMPLE_PROMPTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read from LocalStorage:', error);
    return INITIAL_SAMPLE_PROMPTS;
  }
};

export const saveLocalPrompts = (prompts: Prompt[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error('Failed to save to LocalStorage:', error);
  }
};

export const apiService = {
  // GET all prompts
  async fetchPrompts(): Promise<Prompt[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        saveLocalPrompts(result.data);
        return result.data;
      }
      return getLocalPrompts();
    } catch (error) {
      console.warn('API fetch failed, utilizing LocalStorage fallback:', error);
      return getLocalPrompts();
    }
  },

  // POST create prompt
  async createPrompt(input: CreatePromptInput): Promise<Prompt> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create prompt');
      }

      const result = await response.json();
      const newPrompt: Prompt = result.data;

      const current = getLocalPrompts();
      saveLocalPrompts([newPrompt, ...current]);
      return newPrompt;
    } catch (error) {
      console.warn('API create failed, generating local prompt:', error);
      const newPrompt: Prompt = {
        ...input,
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const current = getLocalPrompts();
      const updated = [newPrompt, ...current];
      saveLocalPrompts(updated);
      return newPrompt;
    }
  },

  // PUT update prompt
  async updatePrompt(id: string, input: UpdatePromptInput): Promise<Prompt> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update prompt');
      }

      const result = await response.json();
      const updatedPrompt: Prompt = result.data;

      const current = getLocalPrompts();
      const idx = current.findIndex((p) => p.id === id);
      if (idx !== -1) {
        current[idx] = updatedPrompt;
        saveLocalPrompts(current);
      }
      return updatedPrompt;
    } catch (error) {
      console.warn('API update failed, updating local prompt:', error);
      const current = getLocalPrompts();
      const idx = current.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Prompt not found');

      const updatedPrompt: Prompt = {
        ...current[idx],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      current[idx] = updatedPrompt;
      saveLocalPrompts(current);
      return updatedPrompt;
    }
  },

  // DELETE prompt
  async deletePrompt(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete prompt');
      }
    } catch (error) {
      console.warn('API delete failed, deleting from LocalStorage:', error);
    } finally {
      const current = getLocalPrompts();
      const filtered = current.filter((p) => p.id !== id);
      saveLocalPrompts(filtered);
    }
  },

  // PATCH reorder prompts
  async reorderPrompts(orderedIds: string[]): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/prompts/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (error) {
      console.warn('API reorder sync failed, persisting locally:', error);
    }
  },

  // POST import prompts
  async importPrompts(validInputs: CreatePromptInput[]): Promise<Prompt[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: validInputs }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const current = getLocalPrompts();
          const combined = [...result.data, ...current];
          saveLocalPrompts(combined);
          return combined;
        }
      }
    } catch (error) {
      console.warn('API import failed, adding to LocalStorage:', error);
    }

    const localCreated: Prompt[] = validInputs.map((input, i) => ({
      ...input,
      id: `local-imp-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const current = getLocalPrompts();
    const combined = [...localCreated, ...current];
    saveLocalPrompts(combined);
    return combined;
  },
};
