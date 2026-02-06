# 📚 Step-by-Step Tutorial: Using Planet Beauty Website

This tutorial will guide you through setting up and using the Planet Beauty e-commerce and salon booking website.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Starting the Application](#starting-the-application)
4. [Using the E-commerce Features](#using-the-e-commerce-features)
5. [Using the Salon Booking System](#using-the-salon-booking-system)
6. [Managing Products (Admin)](#managing-products-admin)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: Open terminal and run `node --version`

2. **MongoDB** (for database)
   - **Option A - Local Installation**:
     - Download from: https://www.mongodb.com/try/download/community
     - Install and start MongoDB service
   - **Option B - Cloud (Recommended for beginners)**:
     - Sign up for free MongoDB Atlas: https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get your connection string

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/
   - Check if installed: `git --version`

4. **Code Editor** (optional but recommended)
   - VS Code: https://code.visualstudio.com/

---

## Installation & Setup

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
# Navigate to where you want to store the project
cd ~/Desktop  # or any folder you prefer

# Clone the repository
git clone https://github.com/Foundation25/planetbeauty-clone-starter.git

# Enter the project folder
cd planetbeauty-clone-starter
```

### Step 2: Install Dependencies

Install all the required packages:

```bash
npm install
```

This will take 1-2 minutes. You'll see a progress bar.

### Step 3: Configure Environment Variables

Create a configuration file for your local environment:

```bash
# Copy the example file
cp .env.example .env.local
```

Now edit the `.env.local` file:

**On Windows:**
```bash
notepad .env.local
```

**On Mac/Linux:**
```bash
nano .env.local
# or
code .env.local  # if you have VS Code
```

Update the following values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/planetbeauty
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planetbeauty

# JWT Secret (generate a random string)
JWT_SECRET=my-super-secret-key-12345

# Stripe Keys (use test keys for now, or leave as is)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: If using MongoDB Atlas, your connection string will look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/planetbeauty?retryWrites=true&w=majority
```

Save and close the file.

### Step 4: Start MongoDB (if using local)

If you installed MongoDB locally:

**On Windows:**
- MongoDB should start automatically as a service
- Or run: `mongod` in a separate terminal window

**On Mac:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

### Step 5: Seed the Database

Populate your database with sample products and services:

```bash
npm run seed
```

You should see output like:
```
Connecting to MongoDB...
Connected to MongoDB
Clearing existing data...
Inserting products...
Inserted 8 products
Inserting salon services...
Inserted 9 salon services
Database seeding completed successfully!
```

---

## Starting the Application

### Step 1: Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 2: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

🎉 **Success!** You should see the Planet Beauty homepage.

---

## Using the E-commerce Features

### Browsing Products

#### Method 1: From Homepage
1. Scroll down to "Shop by Category"
2. Click on any category (Makeup, Skincare, Haircare, etc.)
3. You'll see all products in that category

#### Method 2: From Navigation Menu
1. Click on any category in the top menu
   - Makeup
   - Skincare
   - Haircare
   - Fragrance
   - Tools
   - Bath & Body

#### Method 3: Direct URL
- All Products: http://localhost:3000/products
- Makeup: http://localhost:3000/products?category=makeup
- Skincare: http://localhost:3000/products?category=skincare

### Filtering and Searching Products

On the products page (http://localhost:3000/products):

1. **Filter by Category**:
   - Look at the left sidebar
   - Click radio buttons to filter by category
   - Example: Select "Makeup" to see only makeup products

2. **Sort Products**:
   - Use the "Sort By" dropdown
   - Options:
     - Newest (default)
     - Price: Low to High
     - Price: High to Low
     - Name: A to Z
     - Name: Z to A

3. **Search Products**:
   - Use the search bar in the header
   - Type product name, brand, or description
   - Press Enter or click the search icon
   - Example: Search for "lipstick" or "face cream"

### Viewing Product Details

1. Click on any product card
2. You'll see:
   - Product images
   - Price (with sale price if applicable)
   - Brand name
   - Description
   - Ratings and reviews
   - Stock status

### Adding to Cart

1. On a product page, click "Add to Cart"
2. View cart by clicking the cart icon (top right)
3. Cart shows:
   - Selected items
   - Quantities
   - Subtotal
   - Free shipping notification (if over $59)

---

## Using the Salon Booking System

### Browsing Salon Services

#### Method 1: From Homepage
1. Scroll to "Professional Salon Services"
2. Click "Explore Salon Services"

#### Method 2: From Navigation
1. Click "Salon Services" in the top menu

#### Method 3: Direct URL
- http://localhost:3000/salon

### Filtering Services by Category

On the salon page:

1. You'll see filter buttons:
   - All Services
   - Hair Services
   - Makeup Services
   - Skincare Services
   - Nail Services
   - Spa Services

2. Click any category to filter

### Booking an Appointment

1. **Find a Service**:
   - Browse or filter services
   - Click "Book Now" on any service card

2. **Fill Out Booking Form**:
   You'll see a form with:
   
   - **Personal Information**:
     - Full Name (required)
     - Email (required)
     - Phone Number (required)
   
   - **Date & Time**:
     - Select Date (required - future dates only)
     - Select Time (required - choose from available slots)
   
   - **Special Requests**:
     - Any allergies or special needs (optional)

3. **Review Details**:
   - Service name
   - Price
   - Duration
   - Your selected date/time

4. **Confirm Booking**:
   - Click "Confirm Booking"
   - You'll see a confirmation message
   - An alert will show: "Booking confirmed! We will contact you shortly."

### Time Slots

Available time slots are from 9:00 AM to 6:00 PM, in 30-minute intervals:
- 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
- 12:00, 12:30, 13:00, 13:30, 14:00, 14:30
- 15:00, 15:30, 16:00, 16:30, 17:00, 17:30

**Note**: The system prevents double-booking. If a time slot is taken, you'll see an error message.

---

## Managing Products (Admin)

### Adding Products via API

You can add products using the API endpoints:

#### Using cURL (Command Line)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Lipstick",
    "description": "Beautiful matte lipstick",
    "price": 24.99,
    "category": "makeup",
    "brand": "Beauty Brand",
    "sku": "MAK-BEA-001",
    "quantity": 100,
    "inStock": true,
    "images": ["https://example.com/image.jpg"],
    "featured": false,
    "tags": ["lipstick", "matte"]
  }'
```

#### Using Postman or Thunder Client

1. **Install Postman** (https://www.postman.com/) or **Thunder Client** (VS Code extension)

2. **Create New Request**:
   - Method: POST
   - URL: `http://localhost:3000/api/products`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "name": "Luxury Face Serum",
     "description": "Anti-aging serum with vitamin C",
     "price": 79.99,
     "salePrice": 59.99,
     "category": "skincare",
     "brand": "Premium Beauty",
     "sku": "SKI-PRE-002",
     "quantity": 50,
     "inStock": true,
     "images": [],
     "featured": true,
     "tags": ["serum", "anti-aging", "vitamin-c"]
   }
   ```

3. Click **Send**

### Adding Salon Services via API

```bash
curl -X POST http://localhost:3000/api/salon/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Express Manicure",
    "description": "Quick manicure with polish",
    "category": "nails",
    "price": 35.00,
    "duration": 30,
    "featured": false
  }'
```

### Viewing All Products

**In Browser**:
- http://localhost:3000/api/products

**In Terminal**:
```bash
curl http://localhost:3000/api/products
```

### Viewing All Bookings

```bash
curl http://localhost:3000/api/salon/bookings
```

---

## Troubleshooting

### Issue 1: "Failed to connect to MongoDB"

**Solution**:
1. Check if MongoDB is running:
   ```bash
   # On Mac/Linux
   mongosh
   
   # On Windows
   mongo
   ```

2. If not running, start it:
   ```bash
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. Verify your `.env.local` has the correct MongoDB URI

### Issue 2: "npm install" fails

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue 3: Port 3000 is already in use

**Solution**:
1. Kill the process using port 3000:
   ```bash
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

2. Or use a different port:
   ```bash
   npm run dev -- -p 3001
   ```

### Issue 4: No products showing

**Solution**:
1. Make sure you ran the seed script:
   ```bash
   npm run seed
   ```

2. Check if data exists:
   ```bash
   mongosh
   use planetbeauty
   db.products.find().pretty()
   ```

### Issue 5: "Module not found" errors

**Solution**:
1. Rebuild the project:
   ```bash
   npm run build
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## Quick Reference

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Install new package
npm install package-name
```

### Important URLs

- **Homepage**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Salon**: http://localhost:3000/salon
- **Cart**: http://localhost:3000/cart

### API Endpoints

```
GET    /api/products              - List all products
POST   /api/products              - Create new product
GET    /api/products/[id]         - Get single product
PUT    /api/products/[id]         - Update product
DELETE /api/products/[id]         - Delete product

GET    /api/orders                - List orders
POST   /api/orders                - Create order

GET    /api/salon/services        - List services
POST   /api/salon/services        - Create service

GET    /api/salon/bookings        - List bookings
POST   /api/salon/bookings        - Create booking
```

---

## Next Steps

Now that you have the website running, you can:

1. **Customize the Design**:
   - Edit files in `app/` for pages
   - Edit files in `components/` for reusable components
   - Modify `app/globals.css` for styling

2. **Add Authentication**:
   - Implement user login/registration
   - Use the User model in `models/User.ts`

3. **Integrate Payment**:
   - Set up Stripe account
   - Add your real Stripe keys to `.env.local`
   - Implement checkout flow

4. **Deploy to Production**:
   - Deploy to Vercel: https://vercel.com
   - Or use any Node.js hosting platform

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the main [README.md](README.md)
3. Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
4. Open an issue on GitHub

---

## Summary

You've learned how to:
- ✅ Install and set up the project
- ✅ Start the development server
- ✅ Browse and filter products
- ✅ Book salon appointments
- ✅ Use the API to add products and services
- ✅ Troubleshoot common issues

**Congratulations! You're ready to use and customize your Planet Beauty website!** 🎉
