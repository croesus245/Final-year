# 🚀 Complete Render Deployment Guide

## Step 1: Create MongoDB Atlas Database

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Start Free"**
3. Sign up with email
4. Create new organization and project
5. Click **"Create a Deployment"**
   - Select **Shared** (free tier)
   - Provider: AWS (or your preference)
   - Region: Your closest region
   - Cluster name: `final-year-db`
   - Click **Create**
6. Wait for cluster to deploy (2-5 minutes)

### Get Connection String:
1. Click **"Connect"** button
2. Select **"Drivers"**
3. Copy connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/final-year-db?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database password
5. Save for later ✅

---

## Step 2: Deploy to Render

### 2.1 Go to Render Dashboard
1. Visit: https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"**
4. Choose **GitHub** (or GitLab)
5. Select your repository: `Final-year`
6. Click **"Connect"**

### 2.2 Configure Web Service

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `final-year-backend` |
| **Environment** | `Node` |
| **Region** | Your closest (e.g., `US East`) |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.3 Set Environment Variables

Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/final-year-db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate random: [Random Key Generator](https://randomkeygen.com/) (copy "CodeIgniter Encryption Keys") |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `ALLOWED_ORIGINS` | `https://svgfuta.vercel.app,https://www.svgfuta.vercel.app` |
| `FRONTEND_URL` | `https://svgfuta.vercel.app` |
| `ADMIN_EMAIL` | `admin@university.edu` |
| `ADMIN_PASSWORD` | `Admin@123` |
| `MAX_FILE_SIZE` | `52428800` |
| `UPLOAD_DIR` | `./uploads` |

### 2.4 Deploy

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Wait for deployment (2-5 minutes)
4. You'll get a URL like: `https://final-year-backend.onrender.com`

---

## Step 3: Update Frontend Environment Variables

In `/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://final-year-backend.onrender.com/api
```

Push to GitHub:
```bash
git add frontend/.env.local
git commit -m "Update API URL for production"
git push origin main
```

Vercel will auto-redeploy! ✅

---

## Step 4: Verify Deployment

Test your backend API:
```
https://final-year-backend.onrender.com/api/admin/login
```

Should return:
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

---

## 🎯 Final Check

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://svgfuta.vercel.app | ✅ |
| **Backend** | https://final-year-backend.onrender.com | ✅ |
| **Database** | MongoDB Atlas | ✅ |

---

## ⚠️ Important Notes

1. **MongoDB Atlas** requires:
   - IP Whitelist: Add `0.0.0.0/0` (allow all) in Security → Network Access
   - Or add Render IP after deployment

2. **Render Free Tier** has limitations:
   - Shuts down after 15 min of inactivity
   - Limited to 1 instance
   - Perfect for development/testing

3. **Production Considerations:**
   - Upgrade to paid plans for reliability
   - Use stronger JWT_SECRET
   - Enable HTTPS (automatic on Render)
   - Set up monitoring and alerts

---

## 🆘 Troubleshooting

### Backend shows "Deployment Failed"
- Check build logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- Verify backend URL in `ALLOWED_ORIGINS`
- Check CORS headers in backend response

### Admin login not working
- Verify admin user exists: `npm run seed`
- Check JWT_SECRET is same on backend
- Test with Postman: POST to `/api/admin/login`

---

## ✅ Deployment Complete!

Your application is now **fully deployed and production-ready**!

- 🌐 Frontend: https://svgfuta.vercel.app
- 🔧 Backend API: https://final-year-backend.onrender.com
- 📊 Database: MongoDB Atlas
- ✨ Features: All working!
