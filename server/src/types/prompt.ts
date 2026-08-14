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

export const VALID_CATEGORIES: Category[] = [
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

export interface IPrompt {
  id?: string;
  title: string;
  prompt: string;
  category: Category;
  tags: string[];
  description: string;
  isFavorite: boolean;
  isPinned: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
