# Vercel Deployment Setup Guide

## Environment Variables Required

Your Vercel deployment needs these environment variables configured in the Vercel dashboard:

### Required Variables

1. **STRIPE_SECRET_KEY**
   - Your Stripe secret key (starts with `sk_`)
   - Get from: https://dashboard.stripe.com/apikeys
   - Example: `sk_test_...` or `sk_live_...`

2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Your Stripe publishable key (starts with `pk_`)
   - Get from: https://dashboard.stripe.com/apikeys
   - Example: `pk_test_...` or `pk_live_...`

3. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - For MongoDB Atlas: https://cloud.mongodb.com

4. **JWT_SECRET**
   - A secure random string for JWT token signing
   - Generate with: `openssl rand -base64 32`
   - Example: `your-super-secure-random-string-here`

5. **NEXT_PUBLIC_APP_URL**
   - Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`
   - Or your custom domain: `https://yourdomain.com`

### Optional Variables (for email features)

6. **EMAIL_HOST**
   - SMTP server hostname
   - Example: `smtp.gmail.com`

7. **EMAIL_PORT**
   - SMTP port
   - Example: `587`

8. **EMAIL_USER**
   - Email account username
   - Example: `your-email@gmail.com`

9. **EMAIL_PASS**
   - Email account password or app password
   - Example: `your-app-password`

10. **NEXT_PUBLIC_BUILDER_API_KEY**
    - Builder.io API key (already in .env)
    - Example: `5e6544c852184347a37075dff7f190e6`

## How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard

1. Go to your project on Vercel: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `STRIPE_SECRET_KEY`)
   - **Value**: Variable value
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

### Method 3: Import from .env file

1. Create a `.env.production` file with all your variables
2. In Vercel Dashboard → Settings → Environment Variables
3. Click **Add** → **Import .env**
4. Upload your `.env.production` file

## After Adding Environment Variables

1. **Redeploy your application**:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

   OR

   ```bash
   vercel --prod
   ```

2. **Verify the deployment**:
   - Check the build logs for any errors
   - Visit your deployed URL
   - Test the checkout flow

## MongoDB Atlas Setup (if needed)

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Vercel)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password
7. Add `/planetbeauty` at the end for database name

## Stripe Setup

1. Go to https://dashboard.stripe.com
2. Get your API keys from Developers → API keys
3. For testing: Use test keys (starts with `sk_test_` and `pk_test_`)
4. For production: Use live keys (starts with `sk_live_` and `pk_live_`)

## Common Issues

### Build fails with "Neither apiKey nor config.authenticator provided"

- **Solution**: Make sure `STRIPE_SECRET_KEY` is set in Vercel environment variables

### Database connection fails

- **Solution**:
  - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
  - Verify `MONGODB_URI` is correct
  - Ensure database user has read/write permissions

### JWT authentication not working

- **Solution**: Make sure `JWT_SECRET` is set and is the same across all deployments

### Checkout redirects to wrong URL

- **Solution**: Update `NEXT_PUBLIC_APP_URL` to match your Vercel deployment URL

## Quick Setup Checklist

- [ ] Add `STRIPE_SECRET_KEY` to Vercel
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel
- [ ] Add `MONGODB_URI` to Vercel
- [ ] Add `JWT_SECRET` to Vercel
- [ ] Add `NEXT_PUBLIC_APP_URL` to Vercel
- [ ] Add `NEXT_PUBLIC_BUILDER_API_KEY` to Vercel
- [ ] Whitelist `0.0.0.0/0` in MongoDB Atlas
- [ ] Redeploy on Vercel
- [ ] Test the application

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test locally with the same environment variables
4. Check MongoDB Atlas network access settings
