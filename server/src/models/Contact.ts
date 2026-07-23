import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: mongoose.Types.ObjectId;
  jobTitle?: string;
  lead?: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes: { text: string; createdBy: mongoose.Types.ObjectId; createdAt: Date }[];
  socialProfiles: { platform: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    jobTitle: { type: String },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    notes: [
      {
        text: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    socialProfiles: [
      {
        platform: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

contactSchema.index({ email: 1 });
contactSchema.index({ company: 1 });

export default mongoose.model<IContact>('Contact', contactSchema);
