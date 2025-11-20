import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISalonService extends Document {
  name: string;
  description: string;
  category: 'hair' | 'makeup' | 'skincare' | 'nails' | 'spa';
  price: number;
  duration: number; // in minutes
  featured: boolean;
  images: string[];
  stylist?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalonServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a service name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['hair', 'makeup', 'skincare', 'nails', 'spa'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Please provide a duration'],
      min: 15,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    stylist: String,
  },
  {
    timestamps: true,
  }
);

const SalonService: Model<ISalonService> =
  mongoose.models.SalonService || mongoose.model<ISalonService>('SalonService', SalonServiceSchema);

export default SalonService;
