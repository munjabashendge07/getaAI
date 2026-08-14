import mongoose, { Schema, Document } from 'mongoose';
import { VALID_CATEGORIES } from '../types/prompt';

export interface IPromptDocument extends Document {
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  description: string;
  isFavorite: boolean;
  isPinned: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPromptDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    prompt: {
      type: String,
      required: [true, 'Prompt content is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: VALID_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_, ret) {
        ret.id = ret._id ? ret._id.toString() : '';
        const obj = ret as any;
        delete obj._id;
        delete obj.__v;
        return ret;
      },
    },
  }
);

PromptSchema.index({ isPinned: -1, order: 1, createdAt: -1 });

export const Prompt = mongoose.model<IPromptDocument>('Prompt', PromptSchema);
