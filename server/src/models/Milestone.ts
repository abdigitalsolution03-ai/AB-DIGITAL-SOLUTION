import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  project: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

const milestoneSchema = new Schema<IMilestone>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

milestoneSchema.index({ project: 1 });

export default mongoose.model<IMilestone>('Milestone', milestoneSchema);
