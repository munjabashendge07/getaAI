import {
  EXACT_CATEGORIES,
  type CreatePromptInput,
  type Category,
  type ImportValidationResult,
} from '../types/prompt';

export const validateImportJSON = (jsonString: string): ImportValidationResult => {
  const errors: string[] = [];
  const validPrompts: CreatePromptInput[] = [];

  if (!jsonString || !jsonString.trim()) {
    return {
      isValid: false,
      validPrompts: [],
      errors: ['Import text is empty.'],
      totalParsed: 0,
    };
  }

  let parsedData: any;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (err: any) {
    return {
      isValid: false,
      validPrompts: [],
      errors: [`Invalid JSON syntax: ${err.message}`],
      totalParsed: 0,
    };
  }

  // Handle single prompt object vs array of prompts
  let items: any[] = [];
  if (Array.isArray(parsedData)) {
    items = parsedData;
  } else if (typeof parsedData === 'object' && parsedData !== null) {
    if (Array.isArray(parsedData.prompts)) {
      items = parsedData.prompts;
    } else {
      items = [parsedData];
    }
  } else {
    return {
      isValid: false,
      validPrompts: [],
      errors: ['JSON root must be an array of prompts or an object containing a "prompts" array.'],
      totalParsed: 0,
    };
  }

  items.forEach((item, index) => {
    const itemNum = index + 1;
    if (typeof item !== 'object' || item === null) {
      errors.push(`Item #${itemNum}: Not a valid object.`);
      return;
    }

    // Required fields: title, prompt
    if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
      errors.push(`Item #${itemNum}: Missing or invalid "title" string.`);
      return;
    }

    if (!item.prompt || typeof item.prompt !== 'string' || !item.prompt.trim()) {
      errors.push(`Item #${itemNum} ("${item.title.substring(0, 20)}..."): Missing or invalid "prompt" content.`);
      return;
    }

    // Category validation (Exact 10)
    let category: Category = 'Others';
    if (item.category && EXACT_CATEGORIES.includes(item.category as Category)) {
      category = item.category as Category;
    } else if (item.category) {
      errors.push(
        `Item #${itemNum} ("${item.title.substring(0, 20)}"): Invalid category "${item.category}". Defaulted to "Others". Valid choices: ${EXACT_CATEGORIES.join(', ')}`
      );
    }

    // Process tags
    let tags: string[] = [];
    if (Array.isArray(item.tags)) {
      tags = item.tags.map((t: string | number) => String(t).trim()).filter(Boolean);
    } else if (typeof item.tags === 'string') {
      tags = item.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    validPrompts.push({
      title: item.title.trim(),
      prompt: item.prompt.trim(),
      category,
      tags,
      description: item.description ? String(item.description).trim() : '',
      isFavorite: Boolean(item.isFavorite),
      isPinned: Boolean(item.isPinned),
      order: typeof item.order === 'number' ? item.order : validPrompts.length,
    });
  });

  return {
    isValid: validPrompts.length > 0,
    validPrompts,
    errors,
    totalParsed: items.length,
  };
};
