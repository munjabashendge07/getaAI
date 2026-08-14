export type Category =
  | 'Coding'
  | 'Marketing'
  | 'Content Writing'
  | 'Email'
  | 'Resume'
  | 'SQL'
  | 'Design'
  | 'Social Media'
  | 'Productivity'
  | 'Others';

export const EXACT_CATEGORIES: Category[] = [
  'Coding',
  'Marketing',
  'Content Writing',
  'Email',
  'Resume',
  'SQL',
  'Design',
  'Social Media',
  'Productivity',
  'Others',
];

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: Category;
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPinned: boolean;
  order: number;
}

export type CreatePromptInput = Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePromptInput = Partial<CreatePromptInput>;

export interface DashboardStats {
  totalPrompts: number;
  favoritePrompts: number;
  categoriesCount: number;
  recentlyAddedPrompts: number;
  categoryCounts: Record<Category, number>;
  recentPromptsList: Prompt[];
}

export interface ImportValidationResult {
  isValid: boolean;
  validPrompts: CreatePromptInput[];
  errors: string[];
  totalParsed: number;
}
