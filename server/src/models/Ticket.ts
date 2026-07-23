import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  ticketNumber: string;
  subject: string;
  description: string;
  client?: mongoose.Types.ObjectId;
  employee?: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category?: string;
  attachments: { name: string; url: string }[];
  comments: { user: mongoose.Types.ObjectId; text: string; attachments: string[]; createdAt: Date }[];
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    employee: { type: Schema.Types.ObjectId, ref: 'User' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    category: { type: String },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        attachments: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ status: 1, assignedTo: 1 });

export default mongoose.model<ITicket>('Ticket', ticketSchema);
