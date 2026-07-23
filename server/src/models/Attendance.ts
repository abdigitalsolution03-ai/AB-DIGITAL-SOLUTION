import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  workingHours: number;
  overtime: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  geoLocation?: { lat: number; lng: number; address?: string };
  browserInfo?: string;
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  createdAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    breakStart: { type: Date },
    breakEnd: { type: Date },
    workingHours: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day'],
      default: 'absent',
    },
    geoLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    browserInfo: { type: String },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: -1 }, { unique: true });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
