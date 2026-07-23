import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  title: string;
  content: string;
  category: string;
  createdBy: mongoose.Types.ObjectId;
  attachments: { name: string; url: string }[];
  status: 'active' | 'inactive';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<IPolicy>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{ name: { type: String }, url: { type: String } }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<IPolicy>('Policy', policySchema);
