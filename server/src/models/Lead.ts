import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: 'website' | 'referral' | 'social-media' | 'cold-call' | 'email-campaign' | 'partner' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: number;
  assignedTo?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  notes: { text: string; createdBy: mongoose.Types.ObjectId; createdAt: Date }[];
  activities: { type: string; description: string; date: Date }[];
  convertedToClient: boolean;
  client?: mongoose.Types.ObjectId;
  lostReason?: string;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    leadId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    company: { type: String },
    jobTitle: { type: String },
    source: {
      type: String,
      enum: ['website', 'referral', 'social-media', 'cold-call', 'email-campaign', 'partner', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new',
    },
    score: { type: Number, default: 0, min: 0, max: 100 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    followUpDate: { type: Date },
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
    convertedToClient: { type: Boolean, default: false },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    lostReason: { type: String },
    budget: { type: Number },
  },
  { timestamps: true }
);

leadSchema.index({ leadId: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });

export default mongoose.model<ILead>('Lead', leadSchema);
