import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISalonBooking extends Document {
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  duration: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  stylist?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const SalonBookingSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SalonService',
    },
    date: {
      type: Date,
      required: [true, 'Please provide a booking date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide a booking time'],
    },
    duration: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide your email'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    stylist: String,
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SalonBooking: Model<ISalonBooking> =
  mongoose.models.SalonBooking || mongoose.model<ISalonBooking>('SalonBooking', SalonBookingSchema);

export default SalonBooking;
