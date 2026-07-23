import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBase extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  helpful: { yes: number; no: number };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    helpful: { yes: { type: Number, default: 0 }, no: { type: Number, default: 0 } },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

knowledgeBaseSchema.index({ category: 1, status: 1 });
knowledgeBaseSchema.index({ tags: 1 });

export default mongoose.model<IKnowledgeBase>('KnowledgeBase', knowledgeBaseSchema);
