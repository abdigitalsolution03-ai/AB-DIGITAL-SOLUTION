import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  attachments: { name: string; url: string; type: string }[];
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

chatMessageSchema.index({ chat: 1, createdAt: 1 });

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
