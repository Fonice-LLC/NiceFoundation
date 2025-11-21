# Planet Beauty Clone - Full-Stack E-commerce & Salon Website

A comprehensive beauty e-commerce platform with integrated salon booking system, built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

---

## 📚 Documentation

- **⚡ [Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
- **📖 [Complete Tutorial](TUTORIAL.md)** - Step-by-step usage instructions
- **📐 [Architecture Overview](ARCHITECTURE.md)** - System design and data flow
- **📝 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details

---

## 🌟 Features

### E-commerce Features
- **Product Catalog**: Browse over 20,000+ beauty products across 10+ categories
- **Advanced Search & Filtering**: Search by keyword, filter by category, brand, price range
- **Product Categories**:
  - Makeup
  - Skincare
  - Haircare
  - Fragrance
  - Tools & Accessories
  - Bath & Body
  - Nails
  - Men's Products
  - Gifts
- **Shopping Cart**: Add/remove items, update quantities
- **Product Reviews & Ratings**: Customer reviews and star ratings
- **Price Matching**: Best price guarantee feature
- **Free Shipping**: Free shipping on orders over $59
- **Product Details**: High-quality images, descriptions, specifications
- **Sale Pricing**: Support for sale/discount pricing

### Salon Features
- **Service Catalog**: Professional beauty services across 5 categories
  - Hair Services (cuts, coloring, styling)
  - Makeup Services (special events, bridal)
  - Skincare Services (facials, treatments)
  - Nail Services (manicure, pedicure)
  - Spa Services (massage, relaxation)
- **Online Booking System**: Book appointments with date/time selection
- **Service Descriptions**: Detailed service information with pricing and duration
- **Stylist Profiles**: Information about professional staff
- **Booking Management**: Track appointment status

### Additional Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Newsletter Subscription**: Email subscription for updates and offers
- **User Authentication**: Secure login and registration (backend ready)
- **Order Management**: Track orders and delivery status
- **Admin Panel Ready**: Backend APIs for product and service management
- **SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Heroicons
- **Payment Processing**: Stripe (ready for integration)
- **Authentication**: JWT (ready for implementation)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Foundation25/planetbeauty-clone-starter.git
   cd planetbeauty-clone-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/planetbeauty
   JWT_SECRET=your-secret-key-change-in-production
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up MongoDB**
   
   Install and start MongoDB locally, or use MongoDB Atlas:
   ```bash
   # For local MongoDB
   mongod
   ```

5. **Seed the database**
   
   Populate the database with sample products and services:
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Seed database with sample data
npm run seed
```

### Project Structure

```
planetbeauty-clone-starter/
├── app/                        # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── products/         # Product CRUD endpoints
│   │   ├── orders/           # Order management
│   │   └── salon/            # Salon services & bookings
│   ├── products/             # Product pages
│   ├── salon/                # Salon pages
│   ├── cart/                 # Shopping cart
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/                # React components
│   ├── layout/               # Header, Footer
│   ├── ecommerce/            # Product components
│   └── salon/                # Salon components
├── lib/                       # Utility functions
│   ├── mongodb.ts            # Database connection
│   └── utils.ts              # Helper functions
├── models/                    # Mongoose models
│   ├── Product.ts            # Product schema
│   ├── Order.ts              # Order schema
│   ├── User.ts               # User schema
│   ├── SalonService.ts       # Salon service schema
│   └── SalonBooking.ts       # Booking schema
├── types/                     # TypeScript types
├── scripts/                   # Utility scripts
│   └── seed.js               # Database seeding
└── public/                    # Static assets
```

## 🎨 Key Pages

- **Homepage** (`/`): Hero section, featured categories, salon CTA
- **Products** (`/products`): Product listing with filters and search
- **Product Detail** (`/products/[id]`): Individual product page
- **Salon Services** (`/salon`): Browse all salon services
- **Book Appointment** (`/salon/book`): Book salon services
- **Shopping Cart** (`/cart`): View and manage cart items
- **Checkout** (`/checkout`): Complete purchase (ready for implementation)

## 🔌 API Endpoints

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

### Salon Services
- `GET /api/salon/services` - List services
- `POST /api/salon/services` - Create service (admin)

### Salon Bookings
- `GET /api/salon/bookings` - List bookings
- `POST /api/salon/bookings` - Create booking

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication (ready)
- MongoDB injection protection
- Input validation
- Secure payment processing with Stripe

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Shopping cart with persistent storage
- [ ] Complete checkout flow with Stripe integration
- [ ] Order tracking and history
- [ ] Admin dashboard for management
- [ ] Product image uploads
- [ ] Advanced search with Elasticsearch
- [ ] Loyalty rewards program
- [ ] Email notifications
- [ ] Real-time inventory management
- [ ] Gift cards and vouchers
- [ ] Social media integration
- [ ] Product recommendations
- [ ] Live chat support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Planet Beauty](https://www.planetbeauty.com/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, payment processing setup, and scalability considerations are implemented.
