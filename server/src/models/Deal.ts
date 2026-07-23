import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  name: string;
  amount: number;
  stage: 'prospecting' | 'qualification' | 'needs-analysis' | 'value-proposition' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  lead?: mongoose.Types.ObjectId;
  contact?: mongoose.Types.ObjectId;
  company?: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  products: { name: string; quantity: number; price: number }[];
  notes: { text: string; createdBy: mongoose.Types.ObjectId; createdAt: Date }[];
  activities: { type: string; description: string; date: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    stage: {
      type: String,
      enum: ['prospecting', 'qualification', 'needs-analysis', 'value-proposition', 'negotiation', 'closed-won', 'closed-lost'],
      default: 'prospecting',
    },
    probability: { type: Number, default: 0, min: 0, max: 100 },
    expectedCloseDate: { type: Date },
    actualCloseDate: { type: Date },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        name: { type: String },
        quantity: { type: Number, min: 1 },
        price: { type: Number, min: 0 },
      },
    ],
    notes: [
      {
        text: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    activities: [
      {
        type: { type: String },
        description: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

dealSchema.index({ assignedTo: 1 });
dealSchema.index({ stage: 1 });
dealSchema.index({ company: 1 });

export default mongoose.model<IDeal>('Deal', dealSchema);
