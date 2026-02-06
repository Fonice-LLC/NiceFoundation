import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  subCategory?: string;
  brand: string;
  images: string[];
  inStock: boolean;
  quantity: number;
  sku: string;
  featured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  reviews: Array<{
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'makeup',
        'skincare',
        'haircare',
        'fragrance',
        'tools',
        'bath-body',
        'nails',
        'mens',
        'gifts',
        'accessories',
      ],
    },
    subCategory: String,
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
