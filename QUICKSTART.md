# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed  
✅ MongoDB installed (local) OR MongoDB Atlas account (cloud)

## Installation

### 1. Clone & Install

```bash
git clone https://github.com/Foundation25/planetbeauty-clone-starter.git
cd planetbeauty-clone-starter
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/planetbeauty
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planetbeauty
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**
- Already running in the cloud ✓

### 4. Seed Database

```bash
npm run seed
```

Expected output:
```
✓ Connected to MongoDB
✓ Inserted 8 products
✓ Inserted 9 salon services
✓ Database seeding completed!
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Open in Browser

Visit: **http://localhost:3000**

---

## What You Can Do Now

### 🛍️ E-commerce Features

- **Browse Products**: http://localhost:3000/products
- **Filter by Category**: Click categories in sidebar
- **Search**: Use search bar in header
- **Sort**: By price, name, or newest

### 💇 Salon Booking

- **View Services**: http://localhost:3000/salon
- **Book Appointment**: Click "Book Now" on any service
- **Fill Form**: Name, email, phone, date, time
- **Confirm**: Get instant confirmation

### 🔧 Admin Tasks (via API)

**Add a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Amazing product",
    "price": 29.99,
    "category": "makeup",
    "brand": "Beauty Co",
    "sku": "MAK-BEA-001",
    "quantity": 100,
    "inStock": true
  }'
```

**View all products:**
```bash
curl http://localhost:3000/api/products
```

---

## Common Issues

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh  # or mongo

# If not, start it
brew services start mongodb-community  # Mac
sudo systemctl start mongod             # Linux
net start MongoDB                       # Windows
```

### Port 3000 in Use

```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill  # Mac/Linux
```

### No Products Showing

```bash
# Re-run seed script
npm run seed
```

---

## Project Structure

```
planetbeauty-clone-starter/
├── app/                    # Pages & API routes
│   ├── page.tsx           # Homepage
│   ├── products/          # Products page
│   ├── salon/             # Salon pages
│   └── api/               # Backend API
├── components/            # React components
├── models/                # Database schemas
├── lib/                   # Utilities
└── .env.local            # Your config (create this)
```

---

## Key URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| All Products | http://localhost:3000/products |
| Makeup | http://localhost:3000/products?category=makeup |
| Salon Services | http://localhost:3000/salon |
| Cart | http://localhost:3000/cart |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products |
| POST | /api/products | Add product |
| GET | /api/products/[id] | Get product |
| GET | /api/salon/services | List services |
| POST | /api/salon/bookings | Book appointment |

---

## Next Steps

📖 **Full Tutorial**: See [TUTORIAL.md](TUTORIAL.md) for detailed instructions  
📝 **Documentation**: Check [README.md](README.md) for complete features  
🛠️ **Tech Details**: Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## Need Help?

1. Check [TUTORIAL.md](TUTORIAL.md) troubleshooting section
2. Review error messages in terminal
3. Verify MongoDB is running
4. Ensure `.env.local` is configured correctly

---

**You're all set! Enjoy your Planet Beauty website!** 🎉
