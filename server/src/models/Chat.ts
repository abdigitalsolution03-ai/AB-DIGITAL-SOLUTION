import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  type: 'direct' | 'group';
  groupName?: string;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    groupName: { type: String },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

export default mongoose.model<IChat>('Chat', chatSchema);
