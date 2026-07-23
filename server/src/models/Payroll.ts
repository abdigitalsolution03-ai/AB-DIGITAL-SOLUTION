import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  grossPay: number;
  netPay: number;
  bonus: number;
  tax: number;
  paymentStatus: 'pending' | 'paid';
  paymentDate?: Date;
  paymentMethod?: string;
  createdAt: Date;
}

const payrollSchema = new Schema<IPayroll>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: [
      {
        name: { type: String },
        amount: { type: Number },
      },
    ],
    deductions: [
      {
        name: { type: String },
        amount: { type: Number },
      },
    ],
    grossPay: { type: Number, required: true },
    netPay: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', payrollSchema);
