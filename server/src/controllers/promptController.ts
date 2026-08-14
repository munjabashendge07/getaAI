import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Prompt, IPromptDocument } from '../models/Prompt';
import { IPrompt, VALID_CATEGORIES, Category } from '../types/prompt';
import { INITIAL_SAMPLE_PROMPTS } from '../data/samplePrompts';

// In-Memory Fallback Cache when MongoDB is offline
let memoryPrompts: IPrompt[] = INITIAL_SAMPLE_PROMPTS.map((p, idx) => ({
  ...p,
  id: `mem-${idx + 1001}`,
  createdAt: new Date(Date.now() - (10 - idx) * 3600000).toISOString(),
  updatedAt: new Date(Date.now() - (10 - idx) * 3600000).toISOString(),
}));

const isDBConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// GET /api/prompts
export const getPrompts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (isDBConnected()) {
      let prompts = await Prompt.find().sort({ isPinned: -1, order: 1, createdAt: -1 });
      if (prompts.length === 0) {
        // Auto-seed if database is empty
        const seededDocs = await Prompt.insertMany(INITIAL_SAMPLE_PROMPTS);
        const formatted = seededDocs.map((doc) => doc.toJSON());
        res.status(200).json({ success: true, count: formatted.length, data: formatted });
        return;
      }
      const formatted = prompts.map((doc) => doc.toJSON());
      res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } else {
      res.status(200).json({ success: true, count: memoryPrompts.length, data: memoryPrompts });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/prompts
export const createPrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, prompt, category, tags, description, isFavorite, isPinned, order } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }
    if (!prompt || !prompt.trim()) {
      res.status(400).json({ success: false, error: 'Prompt content is required' });
      return;
    }
    if (!category || !VALID_CATEGORIES.includes(category as Category)) {
      res.status(400).json({ success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
      return;
    }

    const cleanedTags = Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [];

    if (isDBConnected()) {
      const newPrompt = await Prompt.create({
        title: title.trim(),
        prompt: prompt.trim(),
        category,
        tags: cleanedTags,
        description: (description || '').trim(),
        isFavorite: Boolean(isFavorite),
        isPinned: Boolean(isPinned),
        order: typeof order === 'number' ? order : 0,
      });
      res.status(201).json({ success: true, data: newPrompt.toJSON() });
    } else {
      const created: IPrompt = {
        id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        prompt: prompt.trim(),
        category,
        tags: cleanedTags,
        description: (description || '').trim(),
        isFavorite: Boolean(isFavorite),
        isPinned: Boolean(isPinned),
        order: typeof order === 'number' ? order : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryPrompts.unshift(created);
      res.status(201).json({ success: true, data: created });
    }
  } catch (error) {
    next(error);
  }
};

// PUT /api/prompts/:id
export const updatePrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, prompt, category, tags, description, isFavorite, isPinned, order } = req.body;

    if (category && !VALID_CATEGORIES.includes(category as Category)) {
      res.status(400).json({ success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
      return;
    }

    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updateData: Partial<IPromptDocument> = {};
      if (title !== undefined) updateData.title = title.trim();
      if (prompt !== undefined) updateData.prompt = prompt.trim();
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [];
      if (description !== undefined) updateData.description = description.trim();
      if (isFavorite !== undefined) updateData.isFavorite = Boolean(isFavorite);
      if (isPinned !== undefined) updateData.isPinned = Boolean(isPinned);
      if (order !== undefined) updateData.order = Number(order);

      const updated = await Prompt.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updated) {
        res.status(404).json({ success: false, error: 'Prompt not found' });
        return;
      }
      res.status(200).json({ success: true, data: updated.toJSON() });
    } else {
      const idx = memoryPrompts.findIndex((p) => p.id === id);
      if (idx === -1) {
        res.status(404).json({ success: false, error: 'Prompt not found' });
        return;
      }
      const existing = memoryPrompts[idx];
      const updated: IPrompt = {
        ...existing,
        title: title !== undefined ? title.trim() : existing.title,
        prompt: prompt !== undefined ? prompt.trim() : existing.prompt,
        category: category !== undefined ? category : existing.category,
        tags: tags !== undefined ? (Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : []) : existing.tags,
        description: description !== undefined ? description.trim() : existing.description,
        isFavorite: isFavorite !== undefined ? Boolean(isFavorite) : existing.isFavorite,
        isPinned: isPinned !== undefined ? Boolean(isPinned) : existing.isPinned,
        order: order !== undefined ? Number(order) : existing.order,
        updatedAt: new Date().toISOString(),
      };
      memoryPrompts[idx] = updated;
      res.status(200).json({ success: true, data: updated });
    }
  } catch (error) {
    next(error);
  }
};

// DELETE /api/prompts/:id
export const deletePrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Prompt.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Prompt not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Prompt deleted successfully', id });
    } else {
      const idx = memoryPrompts.findIndex((p) => p.id === id);
      if (idx === -1) {
        res.status(404).json({ success: false, error: 'Prompt not found' });
        return;
      }
      memoryPrompts.splice(idx, 1);
      res.status(200).json({ success: true, message: 'Prompt deleted successfully', id });
    }
  } catch (error) {
    next(error);
  }
};

// PATCH /api/prompts/reorder
export const reorderPrompts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, error: 'orderedIds array is required' });
      return;
    }

    if (isDBConnected()) {
      const bulkOps = orderedIds.map((id: string, index: number) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return {
            updateOne: {
              filter: { _id: id },
              update: { order: index },
            },
          };
        }
        return null;
      }).filter(Boolean);

      if (bulkOps.length > 0) {
        await Prompt.bulkWrite(bulkOps as any);
      }
      const updatedList = await Prompt.find().sort({ isPinned: -1, order: 1, createdAt: -1 });
      res.status(200).json({ success: true, data: updatedList.map((doc) => doc.toJSON()) });
    } else {
      orderedIds.forEach((id: string, index: number) => {
        const item = memoryPrompts.find((p) => p.id === id);
        if (item) {
          item.order = index;
        }
      });
      res.status(200).json({ success: true, data: memoryPrompts });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/prompts/seed
export const seedPrompts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (isDBConnected()) {
      await Prompt.deleteMany({});
      const seeded = await Prompt.insertMany(INITIAL_SAMPLE_PROMPTS);
      res.status(200).json({ success: true, message: 'Seeded sample prompts', data: seeded.map((s) => s.toJSON()) });
    } else {
      memoryPrompts = INITIAL_SAMPLE_PROMPTS.map((p, idx) => ({
        ...p,
        id: `mem-${idx + 1001}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      res.status(200).json({ success: true, message: 'Seeded sample prompts (memory)', data: memoryPrompts });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/prompts/import
export const importPrompts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { prompts: rawPrompts } = req.body;
    if (!Array.isArray(rawPrompts)) {
      res.status(400).json({ success: false, error: 'Expected an array of prompts in "prompts" key' });
      return;
    }

    const validItems: any[] = [];
    const errors: string[] = [];

    rawPrompts.forEach((item, index) => {
      if (typeof item !== 'object' || item === null) {
        errors.push(`Item #${index + 1}: Not an object`);
        return;
      }
      if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
        errors.push(`Item #${index + 1}: Missing or empty title`);
        return;
      }
      if (!item.prompt || typeof item.prompt !== 'string' || !item.prompt.trim()) {
        errors.push(`Item #${index + 1}: Missing or empty prompt content`);
        return;
      }
      if (!item.category || !VALID_CATEGORIES.includes(item.category)) {
        errors.push(`Item #${index + 1}: Invalid category "${item.category}". Valid options: ${VALID_CATEGORIES.join(', ')}`);
        return;
      }

      validItems.push({
        title: item.title.trim(),
        prompt: item.prompt.trim(),
        category: item.category,
        tags: Array.isArray(item.tags) ? item.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
        description: item.description ? String(item.description).trim() : '',
        isFavorite: Boolean(item.isFavorite),
        isPinned: Boolean(item.isPinned),
        order: typeof item.order === 'number' ? item.order : validItems.length,
      });
    });

    if (validItems.length === 0) {
      res.status(400).json({ success: false, error: 'No valid prompt objects found to import', errors });
      return;
    }

    if (isDBConnected()) {
      const inserted = await Prompt.insertMany(validItems);
      res.status(201).json({
        success: true,
        message: `Successfully imported ${inserted.length} prompts`,
        importedCount: inserted.length,
        errors,
        data: inserted.map((d) => d.toJSON()),
      });
    } else {
      const createdItems: IPrompt[] = validItems.map((v, i) => ({
        ...v,
        id: `mem-imp-${Date.now()}-${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      memoryPrompts.push(...createdItems);
      res.status(201).json({
        success: true,
        message: `Successfully imported ${createdItems.length} prompts`,
        importedCount: createdItems.length,
        errors,
        data: createdItems,
      });
    }
  } catch (error) {
    next(error);
  }
};
