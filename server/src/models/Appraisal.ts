import mongoose, { Schema, Document } from 'mongoose';

export interface IAppraisal extends Document {
  employee: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  period: string;
  currentSalary: number;
  proposedSalary: number;
  performanceSummary: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const appraisalSchema = new Schema<IAppraisal>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, required: true },
    currentSalary: { type: Number, required: true },
    proposedSalary: { type: Number, required: true },
    performanceSummary: { type: String },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'rejected'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

appraisalSchema.index({ employee: 1 });

export default mongoose.model<IAppraisal>('Appraisal', appraisalSchema);
