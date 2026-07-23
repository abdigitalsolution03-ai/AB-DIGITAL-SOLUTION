import mongoose, { Schema, Document } from 'mongoose';

export interface IHoliday extends Document {
  name: string;
  date: Date;
  type: 'public' | 'company' | 'optional';
  year: number;
  description?: string;
}

const holidaySchema = new Schema<IHoliday>({
  name: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['public', 'company', 'optional'], required: true },
  year: { type: Number, required: true },
  description: { type: String },
});

holidaySchema.index({ year: 1, date: 1 });

export default mongoose.model<IHoliday>('Holiday', holidaySchema);
