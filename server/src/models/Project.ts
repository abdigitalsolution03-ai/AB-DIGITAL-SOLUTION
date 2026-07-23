import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  client?: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId[];
  department?: mongoose.Types.ObjectId;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  milestones: { name: string; dueDate: Date; completed: boolean }[];
  budget?: number;
  progress: number;
  attachments: { name: string; url: string; type: string }[];
  comments: { user: mongoose.Types.ObjectId; text: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'on-hold', 'completed', 'cancelled'],
      default: 'planning',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    deadline: { type: Date },
    milestones: [
      {
        name: { type: String },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
      },
    ],
    budget: { type: Number },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ manager: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ client: 1 });

export default mongoose.model<IProject>('Project', projectSchema);
