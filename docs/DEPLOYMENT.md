# Deployment Guide

Complete production deployment instructions for the Final-Year Project Repository platform.

## 🚀 Quick Start Deployment

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### 1. Frontend Deployment (Vercel)

**Prerequisites:**
- GitHub account with repository
- Vercel account (free tier: https://vercel.com)

**Steps:**
```bash
# Push frontend to GitHub
cd frontend
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Then:
# 1. Go to https://vercel.com
# 2. Click "New Project"
# 3. Select your GitHub repository
# 4. Set framework: Next.js
# 5. Add environment variables:
#    - NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
# 6. Deploy
```

**Environment Variables (.env.production):**
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_ENVIRONMENT=production
```

#### 2. Backend Deployment (Render)

**Prerequisites:**
- Render account (free tier: https://render.com)
- GitHub repository with backend code
- MongoDB Atlas account (free tier: https://mongodb.com/atlas)

**Steps:**

**A. Set up MongoDB Atlas:**
```
1. Go to https://mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for testing)
5. Copy connection string: mongodb+srv://user:password@cluster.mongodb.net/dbname
```

**B. Deploy to Render:**
```
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: final-year-api
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Root Directory: backend
   - Plan: Free (or Starter for production)

5. Set Environment Variables:
   - MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/final-year-db
   - JWT_SECRET=your-very-secure-random-key-here
   - JWT_EXPIRE=7d
   - NODE_ENV=production
   - FRONTEND_URL=https://your-vercel-app.vercel.app
   - ADMIN_EMAIL=admin@university.edu
   - ADMIN_PASSWORD=SecurePasswordHere123!

6. Deploy
```

#### 3. Verify Deployment

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Should return:
# { "success": true, "message": "Server is running" }

# Test API
curl https://your-backend.onrender.com/api/projects/approved

# Test frontend
Open: https://your-app.vercel.app
```

---

## 🔧 Self-Hosted Deployment (Linux Server)

### Prerequisites
- Ubuntu 20.04+ server (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name
- SSH access

### Installation Steps

#### 1. Install Dependencies
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb

# Install Nginx
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

#### 2. Setup Backend

```bash
# Clone repository
cd /opt
git clone https://github.com/yourusername/final-year-repo.git
cd final-year-repo/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/final-year-db
JWT_SECRET=your-very-secure-random-key
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
ADMIN_EMAIL=admin@university.edu
ADMIN_PASSWORD=ChangeMeInProduction
EOF

# Build
npm run build

# Create PM2 startup script
npm install -g pm2
pm2 start dist/server.js --name "final-year-api"
pm2 startup
pm2 save
```

#### 3. Setup Frontend

```bash
# Build Next.js
cd ../frontend
npm install

cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_ENVIRONMENT=production
EOF

npm run build

# Create systemd service for Next.js
cat > /etc/systemd/system/next-app.service << EOF
[Unit]
Description=Next.js App
After=network.target

[Service]
User=root
WorkingDirectory=/opt/final-year-repo/frontend
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl enable next-app
systemctl start next-app
```

#### 4. Configure Nginx Reverse Proxy

```bash
cat > /etc/nginx/sites-available/final-year << 'EOF'
upstream backend {
    server 127.0.0.1:5000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/final-year /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 5. Setup SSL Certificate

```bash
certbot --nginx -d yourdomain.com
# Follow prompts and auto-renew
```

#### 6. Verify Everything

```bash
# Check services
systemctl status mongodb
pm2 status
systemctl status nginx
systemctl status next-app

# Test endpoints
curl https://yourdomain.com/health
curl https://yourdomain.com/api/projects/approved
```

---

## 📦 Database Seeding

### Initial Admin & Sample Data

```bash
# Run seed script
cd backend
npm run seed

# Or manually:
node dist/scripts/seed.js
```

**Creates:**
- Admin account: admin@university.edu / ChangeMeInProduction
- 5 sample projects with realistic data

---

## 🔒 Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up monitoring (PM2 Plus, Sentry)
- [ ] Enable automatic backups
- [ ] Configure CDN for static files
- [ ] Set up error logging
- [ ] Configure email notifications

---

## 🚨 Monitoring & Maintenance

### Health Checks

```bash
# Automated health check
curl -f https://yourdomain.com/health || alert_admin
```

### Logs

```bash
# Backend logs
pm2 logs final-year-api

# Next.js logs
journalctl -u next-app -f

# Nginx logs
tail -f /var/log/nginx/error.log
```

### Backups

```bash
# MongoDB backup
mongodump --out /backups/mongo-$(date +%Y%m%d)

# Uploads backup
tar -czf /backups/uploads-$(date +%Y%m%d).tar.gz /opt/final-year-repo/backend/uploads

# Automate with cron
0 2 * * * /usr/local/bin/backup.sh
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs final-year-api

# Verify MongoDB connection
mongosh "mongodb+srv://user:password@cluster.mongodb.net/final-year-db"
```

### Frontend shows blank page
```bash
# Check browser console for errors
# Verify NEXT_PUBLIC_API_URL is correct
# Check CORS headers
curl -H "Origin: https://yourdomain.com" https://yourdomain.com/api/projects/approved
```

### File uploads fail
```bash
# Check upload directory permissions
ls -la /opt/final-year-repo/backend/uploads
chmod -R 755 uploads

# Check disk space
df -h
```

---

## 📊 Performance Optimization

### Frontend Optimization
- Enable Vercel Analytics
- Use Image Optimization
- Enable ISR (Incremental Static Regeneration)

### Backend Optimization
- Enable database indexing
- Configure caching headers
- Enable gzip compression
- Use CDN for file downloads

```bash
# Test performance
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: curl -X POST ${{ secrets.RENDER_HOOK }}
      - name: Deploy Frontend
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token $VERCEL_TOKEN
```

---

**Last Updated:** October 2025
**Status:** Production Ready ✅
