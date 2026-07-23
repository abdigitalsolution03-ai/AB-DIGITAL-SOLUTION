import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  project?: mongoose.Types.ObjectId;
  milestone?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  comments: { user: mongoose.Types.ObjectId; text: string; createdAt: Date }[];
  attachments: { name: string; url: string }[];
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    milestone: { type: Schema.Types.ObjectId, ref: 'Milestone' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo',
    },
    dueDate: { type: Date },
    estimatedHours: { type: Number },
    actualHours: { type: Number },
    recurring: {
      type: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      interval: { type: Number, default: 1 },
      endDate: { type: Date },
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, order: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
