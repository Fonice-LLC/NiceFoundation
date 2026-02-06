# Namecheap Deployment Guide

## Prerequisites

1. **Namecheap VPS or Dedicated Server** (recommended for this app)
2. **Domain name** pointed to your server
3. **SSH access** to your server

## Deployment Options

### Option 1: Static Export (Limited Features)

If you only need static pages without server-side features:

```bash
npm run build
```

Upload the `out` folder to your Namecheap shared hosting public_html directory.

### Option 2: Full Next.js App (Recommended)

#### Step 1: Server Setup

1. **Connect to your VPS via SSH:**

   ```bash
   ssh root@your-server-ip
   ```

2. **Run the server setup script:**
   ```bash
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

#### Step 2: Deploy Application

1. **Build and package locally:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Upload to server:**

   ```bash
   scp deployment.tar.gz root@your-server-ip:/var/www/
   ```

3. **Extract and setup on server:**

   ```bash
   ssh root@your-server-ip
   cd /var/www
   tar -xzf deployment.tar.gz
   npm ci --production
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   nano .env
   ```

#### Step 3: Configure Nginx

1. **Copy Nginx configuration:**

   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/your-domain
   sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   ```

2. **Update paths in nginx.conf:**

   - Replace `/path/to/your/app` with `/var/www`
   - Replace `your-domain.com` with your actual domain

3. **Test and reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Step 4: Start Application

1. **Update PM2 configuration:**

   ```bash
   # Edit ecosystem.config.js
   nano ecosystem.config.js
   # Update the cwd path to /var/www
   ```

2. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Step 5: SSL Certificate (Optional but Recommended)

1. **Install Certbot:**

   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## Environment Variables

Make sure to set these in your production `.env` file:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure random string for JWT tokens
- `STRIPE_SECRET_KEY` - Your Stripe secret key (if using payments)
- `EMAIL_*` - Email configuration (if using email features)

## Monitoring

- **Check application status:** `pm2 status`
- **View logs:** `pm2 logs planetbeauty-app`
- **Restart app:** `pm2 restart planetbeauty-app`

## Troubleshooting

1. **Port 3000 already in use:**

   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Nginx configuration errors:**

   ```bash
   sudo nginx -t
   ```

3. **Check application logs:**
   ```bash
   pm2 logs planetbeauty-app --lines 50
   ```

## Security Checklist

- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key authentication enabled
- [ ] Regular security updates scheduled
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Database access restricted

## Backup Strategy

1. **Database backup:**

   ```bash
   mongodump --db planetbeauty --out /backup/$(date +%Y%m%d)
   ```

2. **Application backup:**
   ```bash
   tar -czf /backup/app-$(date +%Y%m%d).tar.gz /var/www
   ```

## Updates

To update your application:

1. Build new version locally
2. Create new deployment package
3. Upload to server
4. Extract to temporary directory
5. Stop PM2 process
6. Replace files
7. Install new dependencies
8. Restart PM2 process

```bash
pm2 stop planetbeauty-app
# Replace files
npm ci --production
pm2 start planetbeauty-app
```
