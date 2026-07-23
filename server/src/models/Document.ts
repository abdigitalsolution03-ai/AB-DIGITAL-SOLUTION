import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  name: string;
  originalName?: string;
  description?: string;
  folder?: mongoose.Types.ObjectId;
  category?: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  url?: string;
  publicId?: string;
  uploadedBy: mongoose.Types.ObjectId;
  permissions: { viewRoles: string[]; editRoles: string[] };
  version: number;
  versions: { version: number; url: string; uploadedAt: Date }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true, trim: true },
    originalName: { type: String },
    description: { type: String },
    folder: { type: Schema.Types.ObjectId, ref: 'Document' },
    category: { type: String },
    type: { type: String, enum: ['file', 'folder'], default: 'file' },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String },
    publicId: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    permissions: {
      viewRoles: [{ type: String }],
      editRoles: [{ type: String }],
    },
    version: { type: Number, default: 1 },
    versions: [
      {
        version: { type: Number },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

documentSchema.index({ folder: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ type: 1 });

export default mongoose.model<IDocument>('Document', documentSchema);
