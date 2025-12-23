import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  items: Array<{
    product: mongoose.Types.ObjectId;
    name?: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
  };
  total: number;
  itemsPrice?: number;
  taxPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    guestEmail: {
      type: String,
      required: false,
    },
    guestName: {
      type: String,
      required: false,
    },
    guestPhone: {
      type: String,
      required: false,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        name: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
      phone: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    itemsPrice: {
      type: Number,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
    stripeSessionId: String,
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
