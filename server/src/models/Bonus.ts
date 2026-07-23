import mongoose, { Schema, Document } from 'mongoose';

export interface IBonus extends Document {
  employee: mongoose.Types.ObjectId;
  amount: number;
  type: string;
  reason: string;
  date: Date;
  approvedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bonusSchema = new Schema<IBonus>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBonus>('Bonus', bonusSchema);
