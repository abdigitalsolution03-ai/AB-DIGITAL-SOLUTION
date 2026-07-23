import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
  name: string;
  department: mongoose.Types.ObjectId;
  description?: string;
  salaryRange: { min: number; max: number };
  createdAt: Date;
}

const designationSchema = new Schema<IDesignation>(
  {
    name: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    description: { type: String },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

designationSchema.index({ department: 1 });
designationSchema.index({ name: 1, department: 1 }, { unique: true });

export default mongoose.model<IDesignation>('Designation', designationSchema);
