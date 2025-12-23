#!/bin/bash

# Server setup script for Namecheap VPS (Ubuntu/CentOS)
# Run this on your VPS after initial setup

echo "🔧 Setting up server for Next.js deployment..."

# Update system
sudo apt update && sudo apt upgrade -y  # For Ubuntu
# sudo yum update -y  # For CentOS

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Start and enable services
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start mongodb
sudo systemctl enable mongodb

echo "✅ Server setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Nginx (see nginx.conf)"
echo "2. Set up SSL certificate"
echo "3. Configure firewall"
echo "4. Upload and deploy your application"