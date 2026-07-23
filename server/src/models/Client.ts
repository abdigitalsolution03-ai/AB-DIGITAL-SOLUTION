import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  industry?: string;
  notes: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    website: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    industry: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

clientSchema.index({ email: 1 });

export default mongoose.model<IClient>('Client', clientSchema);
