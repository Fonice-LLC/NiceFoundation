# 📐 Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
│  (Chrome, Firefox, Safari, Edge)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  NEXT.JS APPLICATION                         │
│                  (Port 3000)                                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           FRONTEND (React Components)                │  │
│  │                                                       │  │
│  │  • Homepage (Hero, Categories, Features)            │  │
│  │  • Products Page (List, Filter, Search)             │  │
│  │  • Salon Page (Services, Booking Form)              │  │
│  │  • Cart Page                                         │  │
│  │  • Layout (Header, Footer)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                     │
│                        │ API Calls                           │
│                        │                                     │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │         BACKEND (API Routes)                        │  │
│  │                                                      │  │
│  │  • /api/products              (CRUD)               │  │
│  │  • /api/orders                (CRUD)               │  │
│  │  • /api/salon/services        (CRUD)               │  │
│  │  • /api/salon/bookings        (CRUD)               │  │
│  └──────────────────────┬──────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          │ Database Queries
                          │ (Mongoose ODM)
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                    MongoDB DATABASE                         │
│                    (Port 27017)                             │
│                                                             │
│  Collections:                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   products   │  │    orders    │  │    users     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │salonservices │  │ salonbookings│                      │
│  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Product Browsing Flow

```
User Browser
    │
    ├─> GET http://localhost:3000/products?category=makeup
    │
    ▼
Next.js Server
    │
    ├─> Render ProductsPage Component
    │   └─> useEffect() triggers on mount
    │
    ├─> Client makes API call
    │   └─> GET /api/products?category=makeup
    │
    ▼
API Route Handler
    │
    ├─> Connect to MongoDB
    │
    ├─> Build query: { category: "makeup" }
    │
    ├─> Execute: Product.find({ category: "makeup" })
    │
    ├─> Format response with pagination
    │
    ▼
Response to Client
    │
    ├─> JSON: { success: true, data: { products: [...] } }
    │
    ▼
React Component
    │
    ├─> Update state: setProducts(data.products)
    │
    ├─> Render product cards in grid
    │
    ▼
User sees products
```

### Salon Booking Flow

```
User Browser
    │
    ├─> Navigate to /salon
    │
    ▼
Salon Services Page
    │
    ├─> Fetch services from API
    │   GET /api/salon/services
    │
    ├─> Display services by category
    │
    ├─> User clicks "Book Now"
    │
    ▼
Booking Form Page
    │
    ├─> User fills form:
    │   • Name, Email, Phone
    │   • Date, Time
    │   • Notes
    │
    ├─> User clicks "Confirm Booking"
    │
    ├─> POST /api/salon/bookings
    │   {
    │     service: "service_id",
    │     date: "2025-01-15",
    │     time: "14:00",
    │     customerName: "John Doe",
    │     customerEmail: "john@example.com",
    │     customerPhone: "555-1234"
    │   }
    │
    ▼
API Route Handler
    │
    ├─> Validate input data
    │
    ├─> Check for conflicts:
    │   SalonBooking.findOne({
    │     date: date,
    │     time: time,
    │     status: { $in: ['pending', 'confirmed'] }
    │   })
    │
    ├─> If slot available:
    │   └─> Create booking
    │       SalonBooking.create(bookingData)
    │
    ├─> If slot taken:
    │   └─> Return error
    │
    ▼
Response
    │
    ├─> Success: { success: true, data: booking }
    │   └─> Show confirmation
    │
    ├─> Error: { success: false, error: "Time slot taken" }
    │   └─> Show error message
```

---

## Technology Stack Layers

```
┌────────────────────────────────────────────────┐
│            PRESENTATION LAYER                   │
│  • React 19                                    │
│  • Next.js 14 App Router                       │
│  • Tailwind CSS 4                              │
│  • TypeScript                                  │
└───────────────────┬────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────┐
│            APPLICATION LAYER                    │
│  • Next.js API Routes                          │
│  • Business Logic                              │
│  • Validation & Error Handling                 │
│  • Authentication (JWT Ready)                  │
└───────────────────┬────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────┐
│            DATA ACCESS LAYER                    │
│  • Mongoose ODM                                │
│  • Schema Definitions                          │
│  • Query Builders                              │
└───────────────────┬────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────┐
│            DATABASE LAYER                       │
│  • MongoDB                                     │
│  • Collections & Indexes                       │
│  • Data Persistence                            │
└────────────────────────────────────────────────┘
```

---

## File Organization

```
planetbeauty-clone-starter/
│
├── app/                          # Next.js App Directory
│   ├── layout.tsx               # Root layout (Header + Footer)
│   ├── page.tsx                 # Homepage
│   │
│   ├── products/                # Products feature
│   │   ├── page.tsx            # Products listing
│   │   └── [id]/               # Individual product
│   │
│   ├── salon/                   # Salon feature
│   │   ├── page.tsx            # Services listing
│   │   └── book/               # Booking form
│   │       └── page.tsx
│   │
│   ├── cart/                    # Shopping cart
│   │   └── page.tsx
│   │
│   └── api/                     # Backend API
│       ├── products/
│       │   ├── route.ts        # GET, POST /api/products
│       │   └── [id]/
│       │       └── route.ts    # GET, PUT, DELETE /api/products/:id
│       ├── orders/
│       │   └── route.ts
│       └── salon/
│           ├── services/
│           │   └── route.ts
│           └── bookings/
│               └── route.ts
│
├── components/                   # Reusable React components
│   ├── layout/
│   │   ├── Header.tsx          # Navigation, search, cart
│   │   └── Footer.tsx          # Links, newsletter
│   ├── ecommerce/              # Product components
│   └── salon/                  # Salon components
│
├── models/                      # Database schemas
│   ├── Product.ts              # Product schema
│   ├── Order.ts                # Order schema
│   ├── User.ts                 # User schema
│   ├── SalonService.ts         # Service schema
│   └── SalonBooking.ts         # Booking schema
│
├── lib/                         # Utilities
│   ├── mongodb.ts              # DB connection
│   └── utils.ts                # Helper functions
│
├── types/                       # TypeScript types
│   └── index.ts
│
└── scripts/                     # Utility scripts
    └── seed.js                 # Database seeding
```

---

## Data Models

### Product Model
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  salePrice?: number,
  category: string,        // makeup, skincare, etc.
  brand: string,
  images: string[],
  inStock: boolean,
  quantity: number,
  sku: string,
  featured: boolean,
  ratings: {
    average: number,
    count: number
  },
  reviews: [{
    user: ObjectId,
    rating: number,
    comment: string,
    createdAt: Date
  }],
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  _id: ObjectId,
  user: ObjectId,
  items: [{
    product: ObjectId,
    name: string,
    price: number,
    quantity: number,
    image: string
  }],
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  paymentMethod: string,
  paymentResult: {
    id: string,
    status: string,
    updateTime: string
  },
  itemsPrice: number,
  taxPrice: number,
  shippingPrice: number,
  totalPrice: number,
  isPaid: boolean,
  paidAt?: Date,
  isDelivered: boolean,
  deliveredAt?: Date,
  status: string,         // pending, processing, shipped, delivered
  trackingNumber?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### SalonBooking Model
```typescript
{
  _id: ObjectId,
  user?: ObjectId,
  service: ObjectId,
  date: Date,
  time: string,           // "14:00"
  duration: number,       // minutes
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  notes?: string,
  status: string,         // pending, confirmed, completed, cancelled
  stylist?: string,
  totalPrice: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## Environment Configuration

```env
# Database
MONGODB_URI=mongodb://localhost:27017/planetbeauty

# Authentication
JWT_SECRET=your-secret-key

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional)
EMAIL_SERVER=smtp.example.com:587
EMAIL_FROM=noreply@planetbeauty.com
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         VERCEL (Hosting)                 │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Next.js Application           │    │
│  │  (Serverless Functions)        │    │
│  └───────────┬────────────────────┘    │
│              │                           │
└──────────────┼───────────────────────────┘
               │
               │ Connection
               │
┌──────────────▼───────────────────────────┐
│      MongoDB Atlas (Cloud)               │
│                                          │
│  • Automatic backups                     │
│  • Global distribution                   │
│  • Auto-scaling                          │
└──────────────────────────────────────────┘
```

---

For detailed setup instructions, see:
- 📖 [TUTORIAL.md](TUTORIAL.md) - Complete step-by-step guide
- ⚡ [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
- 📝 [README.md](README.md) - Full documentation
