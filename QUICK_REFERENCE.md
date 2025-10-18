# ⚡ Quick Reference Guide

## 🚀 Start Development (30 seconds)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Admin: http://localhost:3000/admin
```

**Admin Login**: admin@university.edu / Admin@123456

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `/backend/.env` | Backend configuration |
| `/frontend/.env.local` | Frontend configuration |
| `/backend/src/server.ts` | Express app entry |
| `/frontend/app/page.tsx` | Home page |
| `/backend/seed.ts` | Database seeder |

---

## 🔧 Common Commands

**Backend**
```bash
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Seed database
npm run type-check   # TypeScript check
npm run lint         # ESLint
```

**Frontend**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run type-check   # TypeScript check
npm run lint         # ESLint
```

---

## 📱 Pages

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Home page |
| http://localhost:3000/repository | Browse projects |
| http://localhost:3000/upload | Upload new project |
| http://localhost:3000/project/[id] | Project detail |
| http://localhost:3000/admin | Admin dashboard |

---

## 🔌 API Endpoints

**Public**
```
GET  /api/projects/approved
GET  /api/projects/:id
GET  /api/projects/search
POST /api/projects/upload
```

**Admin** (requires JWT)
```
POST   /api/admin/login
GET    /api/admin/pending
PATCH  /api/admin/:id/approve
PATCH  /api/admin/:id/reject
DELETE /api/admin/:id
GET    /api/admin/stats
```

---

## 📊 Database

**Collections**
- `projects` - Research papers
- `admins` - Admin users

**Default Admin**
- Email: admin@university.edu
- Password: Admin@123456

**Sample Data**
```bash
cd backend && npm run seed
```

---

## 🎨 Colors

```
#FF6B00  Primary Orange
#0D0D0D  Matte Black
#1A1A1A  Dark Gray
#2D2D2D  Medium Gray
#E8E8E8  Light Gray
```

---

## 📚 Documentation

```
/docs/SETUP.md                     - Development setup
/docs/API.md                       - API reference
/docs/DEPLOYMENT.md               - Production deployment
/docs/PRODUCTION_CHECKLIST.md      - Pre-launch
/IMPLEMENTATION_GUIDE.md           - Full guide
/EXECUTIVE_SUMMARY.md              - Overview
```

---

## ❌ Troubleshooting

**MongoDB Connection Error**
```
Solution: mongod  (or use MongoDB Atlas)
```

**Port in Use**
```
Change PORT in .env or kill process
```

**CORS Error**
```
Check ALLOWED_ORIGINS in backend .env
```

**TypeScript Error**
```
npm install && npm run type-check
```

---

## ✅ Deployment

**Frontend (Vercel)**
1. Push to GitHub
2. Import to Vercel
3. Set NEXT_PUBLIC_API_URL
4. Deploy

**Backend (Render)**
1. Connect GitHub
2. Set environment variables
3. Deploy

---

## 🎯 Feature Checklist

### Core
- [x] Student upload
- [x] Project search
- [x] PDF download
- [x] Admin approval
- [x] View tracking
- [x] Download tracking

### UI/UX
- [x] Responsive (360px-1440px)
- [x] Dark theme
- [x] Form validation
- [x] Error messages
- [x] Loading states
- [x] Success messages

### Security
- [x] JWT authentication
- [x] Input validation
- [x] XSS prevention
- [x] CORS
- [x] Rate limiting
- [x] File type validation

### Performance
- [x] Database indexes
- [x] Pagination
- [x] Lazy loading
- [x] Query optimization
- [x] Code splitting

---

## 💾 Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/final-year-db
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@university.edu
ADMIN_PASSWORD=Admin@123456
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 📞 Getting Help

1. Check `/docs/SETUP.md` Troubleshooting
2. Read `/docs/API.md` for endpoint details
3. See `/IMPLEMENTATION_GUIDE.md` for full reference
4. Review `/docs/DEPLOYMENT.md` for production

---

## ✨ Key Features

✅ Upload projects (PDF, 50MB max)
✅ Search & filter results
✅ Browse approved projects
✅ View & download PDFs
✅ Admin approval workflow
✅ Statistics dashboard
✅ Mobile responsive
✅ Professional design
✅ Secure authentication
✅ Database seeding

---

## 🚀 Production Deployment

See `/docs/DEPLOYMENT.md` for:
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- Environment configuration
- Domain setup
- SSL/HTTPS

---

**Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: October 2025
