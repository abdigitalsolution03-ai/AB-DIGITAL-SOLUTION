import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description?: string;
  hod?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    hod: { type: Schema.Types.ObjectId, ref: 'Employee' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IDepartment>('Department', departmentSchema);
