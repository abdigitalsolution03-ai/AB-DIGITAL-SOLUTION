import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformanceReview extends Document {
  employee: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewPeriod: { start: Date; end: Date };
  rating: number;
  goals: { title: string; achieved: boolean; notes?: string }[];
  achievements: string[];
  improvements: string[];
  overallRating: number;
  status: 'draft' | 'submitted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const performanceReviewSchema = new Schema<IPerformanceReview>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewPeriod: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    rating: { type: Number, min: 1, max: 5 },
    goals: [
      {
        title: { type: String },
        achieved: { type: Boolean, default: false },
        notes: { type: String },
      },
    ],
    achievements: [{ type: String }],
    improvements: [{ type: String }],
    overallRating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ['draft', 'submitted', 'completed'], default: 'draft' },
  },
  { timestamps: true }
);

performanceReviewSchema.index({ employee: 1, status: 1 });
performanceReviewSchema.index({ reviewer: 1 });

export default mongoose.model<IPerformanceReview>('PerformanceReview', performanceReviewSchema);
