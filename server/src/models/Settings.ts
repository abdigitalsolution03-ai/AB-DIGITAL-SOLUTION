import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  group: string;
  description?: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

settingsSchema.index({ group: 1 });

export default mongoose.model<ISettings>('Settings', settingsSchema);
