import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product";
import SalonService from "../models/SalonService";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/planetbeauty";

const sampleProducts = [
  {
    name: "Luxury Hydrating Face Cream",
    description:
      "A rich, nourishing face cream that deeply hydrates and rejuvenates your skin with natural ingredients.",
    price: 45.99,
    category: "skincare",
    brand: "GlowLux",
    images: [],
    inStock: true,
    quantity: 50,
    sku: "SKI-GLO-001",
    featured: true,
    ratings: { average: 4.5, count: 128 },
    reviews: [],
    tags: ["hydrating", "anti-aging", "natural"],
  },
  {
    name: "Matte Lipstick - Ruby Red",
    description:
      "Long-lasting matte lipstick with rich color payoff and comfortable wear all day.",
    price: 24.99,
    salePrice: 19.99,
    category: "makeup",
    brand: "ColorPop Beauty",
    images: [],
    inStock: true,
    quantity: 100,
    sku: "MAK-COL-002",
    featured: true,
    ratings: { average: 4.8, count: 256 },
    reviews: [],
    tags: ["lipstick", "matte", "long-lasting"],
  },
  {
    name: "Volumizing Shampoo",
    description:
      "Professional-grade shampoo that adds volume and strengthens hair from root to tip.",
    price: 28.5,
    category: "haircare",
    brand: "HairRevive",
    images: [],
    inStock: true,
    quantity: 75,
    sku: "HAI-REV-003",
    featured: false,
    ratings: { average: 4.3, count: 89 },
    reviews: [],
    tags: ["volume", "strengthening", "professional"],
  },
  {
    name: "Rose Blossom Eau de Parfum",
    description:
      "Elegant floral fragrance with notes of rose, jasmine, and vanilla.",
    price: 89.99,
    category: "fragrance",
    brand: "Essence Luxe",
    images: [],
    inStock: true,
    quantity: 30,
    sku: "FRA-ESS-004",
    featured: true,
    ratings: { average: 4.6, count: 145 },
    reviews: [],
    tags: ["floral", "long-lasting", "luxury"],
  },
  {
    name: "Professional Makeup Brush Set",
    description:
      "Complete 12-piece brush set with synthetic and natural bristles for all makeup applications.",
    price: 59.99,
    salePrice: 44.99,
    category: "tools",
    brand: "BeautyTools Pro",
    images: [],
    inStock: true,
    quantity: 45,
    sku: "TOO-BEA-005",
    featured: false,
    ratings: { average: 4.7, count: 203 },
    reviews: [],
    tags: ["brushes", "professional", "complete-set"],
  },
  {
    name: "Lavender Aromatherapy Bath Salts",
    description:
      "Relaxing bath salts infused with lavender essential oils for the ultimate spa experience.",
    price: 18.99,
    category: "bath-body",
    brand: "Spa Essence",
    images: [],
    inStock: true,
    quantity: 60,
    sku: "BAT-SPA-006",
    featured: false,
    ratings: { average: 4.4, count: 92 },
    reviews: [],
    tags: ["bath", "aromatherapy", "relaxing"],
  },
  {
    name: "Gel Nail Polish - Midnight Blue",
    description:
      "Long-lasting gel nail polish with salon-quality shine and chip resistance.",
    price: 12.99,
    category: "nails",
    brand: "NailGlow",
    images: [],
    inStock: true,
    quantity: 120,
    sku: "NAI-GLO-007",
    featured: false,
    ratings: { average: 4.2, count: 78 },
    reviews: [],
    tags: ["gel", "long-lasting", "blue"],
  },
  {
    name: "Men's Energizing Face Wash",
    description:
      "Invigorating face wash designed for men with mint and charcoal to deep clean and refresh.",
    price: 22.99,
    category: "mens",
    brand: "ManCare",
    images: [],
    inStock: true,
    quantity: 55,
    sku: "MEN-MAN-008",
    featured: false,
    ratings: { average: 4.5, count: 67 },
    reviews: [],
    tags: ["mens", "face-wash", "energizing"],
  },
];

const salonServices = [
  {
    name: "Premium Haircut & Style",
    description:
      "Professional haircut with consultation, wash, cut, and style. Includes scalp massage.",
    category: "hair",
    price: 65.0,
    duration: 60,
    featured: true,
    images: [],
  },
  {
    name: "Full Color Treatment",
    description:
      "Complete hair coloring service with premium products. Includes toner and deep conditioning.",
    category: "hair",
    price: 150.0,
    duration: 180,
    featured: true,
    images: [],
  },
  {
    name: "Professional Makeup Application",
    description:
      "Full face makeup application for special events, photo shoots, or daily wear.",
    category: "makeup",
    price: 85.0,
    duration: 90,
    featured: true,
    images: [],
  },
  {
    name: "Bridal Makeup Package",
    description:
      "Complete bridal makeup with trial session, wedding day application, and touch-up kit.",
    category: "makeup",
    price: 250.0,
    duration: 120,
    featured: true,
    images: [],
  },
  {
    name: "Deep Cleansing Facial",
    description:
      "Professional facial treatment that cleanses, exfoliates, and hydrates your skin.",
    category: "skincare",
    price: 95.0,
    duration: 75,
    featured: true,
    images: [],
  },
  {
    name: "Anti-Aging Treatment",
    description:
      "Advanced skincare treatment targeting fine lines and wrinkles with premium serums.",
    category: "skincare",
    price: 175.0,
    duration: 90,
    featured: false,
    images: [],
  },
  {
    name: "Gel Manicure",
    description:
      "Long-lasting gel manicure with nail shaping, cuticle care, and hand massage.",
    category: "nails",
    price: 45.0,
    duration: 60,
    featured: false,
    images: [],
  },
  {
    name: "Spa Pedicure Deluxe",
    description:
      "Luxurious pedicure with exfoliation, massage, and gel polish application.",
    category: "nails",
    price: 65.0,
    duration: 75,
    featured: false,
    images: [],
  },
  {
    name: "Relaxation Massage",
    description:
      "Full body massage therapy to relieve stress and tension with aromatherapy.",
    category: "spa",
    price: 120.0,
    duration: 90,
    featured: true,
    images: [],
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    console.log("MONGODB_URI:", MONGODB_URI);

    // Clear existing data
    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await SalonService.deleteMany({});

    // Insert products
    console.log("Inserting products...");
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);

    // Insert salon services
    console.log("Inserting salon services...");
    await SalonService.insertMany(salonServices);
    console.log(`Inserted ${salonServices.length} salon services`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
