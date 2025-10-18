# Local Development Setup Guide

Complete instructions for setting up the Final-Year Project Repository on your local machine.

## ✅ Prerequisites

- Node.js 18.x or higher ([Download](https://nodejs.org))
- npm 9.x or higher (comes with Node.js)
- Git ([Download](https://git-scm.com))
- MongoDB Community Edition ([Download](https://www.mongodb.com/try/download/community)) OR MongoDB Atlas free account
- A code editor (VS Code recommended: https://code.visualstudio.com)

**Verify Installation:**
```bash
node --version      # Should be v18.x or higher
npm --version       # Should be 9.x or higher
git --version       # Should be 2.x or higher
```

---

## 🚀 Project Setup (Windows, Mac, Linux)

### 1. Clone Repository

```bash
# Clone the project
git clone https://github.com/yourusername/final-year-repo.git
cd "Final year"

# You should see:
# - frontend/
# - backend/
# - docs/
# - README.md
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

**Expected output:**
- Added ~150+ packages
- No critical errors

#### 2.2 Create Environment File

Create `.env` file in `backend/` folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/final-year-db

# Or use MongoDB Atlas (recommended):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/final-year-db

# JWT Settings
JWT_SECRET=your-super-secret-key-change-in-production-12345
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Admin (change these!)
ADMIN_EMAIL=admin@university.edu
ADMIN_PASSWORD=Admin123456

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

#### 2.3 Verify MongoDB Connection

**Option A: Use Local MongoDB**

```bash
# Windows (if installed)
mongod

# Mac (if installed with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

**Option B: Use MongoDB Atlas (Recommended for beginners)**

1. Go to https://mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string and paste in `.env` as `MONGODB_URI`

#### 2.4 Build and Start Backend

```bash
# Build TypeScript to JavaScript
npm run build

# Start development server
npm run dev

# Expected output:
# ╔════════════════════════════════════════╗
# ║   🚀 Final-Year Project Repository    ║
# ║   📌 API Server Started                ║
# ╠════════════════════════════════════════╣
# ║   Port: 5000                           ║
# ║   Environment: development             ║
# ║   CORS Origins: http://localhost:3000  ║
# ╚════════════════════════════════════════╝

# ✅ Backend is ready at http://localhost:5000
```

#### 2.5 Test Backend

In a new terminal:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return JSON like:
# {"success":true,"message":"Server is running","timestamp":"2025-01-15T..."}

# Test API
curl http://localhost:5000/api/projects/approved

# Should return projects array (initially empty)
```

---

### 3. Frontend Setup

#### 3.1 Install Dependencies

Open NEW terminal (keep backend running in the first terminal):

```bash
cd frontend
npm install
```

#### 3.2 Create Environment File

Create `.env.local` in `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

#### 3.3 Start Development Server

```bash
npm run dev

# Expected output:
# ▲ Next.js 15.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
#
# ✓ Ready in 2.5s
```

#### 3.4 Open in Browser

Go to: **http://localhost:3000**

You should see the home page with:
- ✅ Logo and header
- ✅ Hero section
- ✅ Featured projects (empty initially)
- ✅ Feature cards
- ✅ Footer

---

## 🧪 Testing the Application

### 1. Navigate Pages

- [Home](http://localhost:3000) - Landing page
- [Repository](http://localhost:3000/repository) - Browse projects
- [Upload](http://localhost:3000/upload) - Submit project
- [Admin](http://localhost:3000/admin) - Admin dashboard

### 2. Test Upload

1. Go to http://localhost:3000/upload
2. Fill in form:
   - Title: "Test Project"
   - Author: "Your Name"
   - Department: "Surveying & Geoinformatics"
   - Year: 2024
   - Abstract: "This is a test project for the repository platform..." (50+ chars)
   - Supervisor: "Dr. Test"
3. Upload PDF file
4. Click "Upload Project"
5. Should see success message

### 3. Admin Panel

1. Create sample admin:
   ```bash
   # In backend terminal, create admin manually via database or API
   ```

2. Go to http://localhost:3000/admin
3. Login with credentials from `.env`
4. Should see pending projects dashboard

---

## 🛠️ Common Issues & Solutions

### Issue: Backend won't start

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: MongoDB connection error

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

Option 1 - Start local MongoDB:
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

Option 2 - Use MongoDB Atlas:
- Get connection string from Atlas
- Update `.env` MONGODB_URI
- Restart backend

### Issue: Port already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Frontend shows API errors

**Error:** `Failed to fetch from http://localhost:5000/api`

**Solutions:**
1. Check backend is running (port 5000)
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check browser console for CORS errors
4. Verify `FRONTEND_URL` in backend `.env`

### Issue: Tailwind CSS not working

**Symptoms:** No styling, ugly layout

**Solution:**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

---

## 📁 Project Structure

```
Final year/
├── frontend/                  # Next.js React app
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── repository/page.tsx # Browse projects
│   │   ├── upload/page.tsx    # Upload form
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── Layout.tsx         # Header/Footer
│   │   └── ProjectCard.tsx    # Project card component
│   ├── lib/
│   │   ├── api.ts             # API calls
│   │   └── types.ts           # TypeScript types
│   ├── package.json
│   ├── .env.local             # Local environment (gitignored)
│   └── tsconfig.json
│
├── backend/                   # Express.js API
│   ├── src/
│   │   ├── server.ts          # Express app setup
│   │   ├── config/
│   │   │   ├── database.ts    # MongoDB connection
│   │   │   └── index.ts       # Configuration
│   │   ├── models/            # Database schemas
│   │   │   ├── Project.ts
│   │   │   └── Admin.ts
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, validation
│   │   ├── utils/             # Helpers
│   │   └── types/             # TypeScript types
│   ├── uploads/               # Uploaded PDFs
│   ├── package.json
│   ├── .env                   # Environment (gitignored)
│   ├── tsconfig.json
│   └── dist/                  # Compiled JS
│
├── docs/
│   ├── DEPLOYMENT.md          # Production deployment
│   ├── API.md                 # API documentation
│   └── SETUP.md               # This file
│
└── README.md                  # Project overview
```

---

## 🎨 Frontend Development

### Adding a New Page

Create file: `frontend/app/[page-name]/page.tsx`

```tsx
'use client';

import React from 'react';
import { Header, Footer } from '@/components/Layout';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Content here */}
      </main>
      <Footer />
    </div>
  );
}
```

### Adding a Component

Create file: `frontend/components/MyComponent.tsx`

```tsx
'use client';

import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

---

## 🔧 Backend Development

### Adding a New API Route

1. Create controller: `backend/src/controllers/myController.ts`
2. Create route: Add to `backend/src/routes/projectRoutes.ts`

```typescript
import { Request, Response } from 'express';

export const myEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
```

---

## 📚 Useful Commands

### Frontend

```bash
cd frontend

npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production build
npm run lint         # Check code quality
npm run type-check   # Check TypeScript types
```

### Backend

```bash
cd backend

npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm start            # Start compiled server
npm run lint         # Check code quality
npm run type-check   # Check TypeScript types
```

---

## 🔐 Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

- ❌ Never commit `.env` files to git
- ✅ Use `.env.example` for template
- ✅ Change default passwords immediately
- ✅ Use strong JWT_SECRET (40+ chars)
- ✅ Enable HTTPS in production
- ✅ Keep dependencies updated: `npm audit fix`

---

## 🐛 Debugging

### Enable Verbose Logging

Backend: Set `DEBUG=*` before running
```bash
DEBUG=* npm run dev
```

### Browser DevTools

- Press `F12` to open
- Go to Console tab for frontend errors
- Go to Network tab to see API calls

### MongoDB

```bash
# View database
mongosh
use final-year-db
db.projects.find()
```

---

## 📞 Getting Help

Check these resources:

1. **Error Messages** - Read the full error in terminal/console
2. **API Docs** - See `/docs/API.md`
3. **Deployment** - See `/docs/DEPLOYMENT.md`
4. **Main README** - See `/README.md`

---

## ✨ Next Steps

1. ✅ Setup is complete!
2. 👁️ Browse the application at http://localhost:3000
3. 📤 Try uploading a project at http://localhost:3000/upload
4. 🔍 Search projects at http://localhost:3000/repository
5. 🚀 Deploy to production when ready (see DEPLOYMENT.md)

---

**Last Updated:** October 2025
**Status:** Ready for Development ✅
