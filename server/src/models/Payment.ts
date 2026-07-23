import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoice: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  amount: number;
  method: 'cash' | 'check' | 'bank-transfer' | 'credit-card' | 'online';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
  receivedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['cash', 'check', 'bank-transfer', 'credit-card', 'online'],
      required: true,
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    notes: { type: String },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

paymentSchema.index({ invoice: 1 });
paymentSchema.index({ client: 1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);
