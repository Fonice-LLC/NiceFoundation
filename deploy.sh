#!/bin/bash

# Deployment script for Namecheap VPS
# Make sure to run: chmod +x deploy.sh

echo "🚀 Starting deployment to Namecheap VPS..."

# Build the application
echo "📦 Building application..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
tar -czf deployment.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.ts \
  --exclude=node_modules

echo "✅ Deployment package created: deployment.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Upload deployment.tar.gz to your VPS"
echo "2. Extract: tar -xzf deployment.tar.gz"
echo "3. Install dependencies: npm ci --production"
echo "4. Set environment variables"
echo "5. Start with PM2: pm2 start ecosystem.config.js"