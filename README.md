# Final-Year Project Repository Platform

A production-ready, fully responsive academic research platform for students to upload, showcase, and share their final-year projects. Built with modern tech stack, security-first approach, and elegant dark orange & black UI.

## 🎯 Platform Overview

This platform allows:
- **Students** to upload research papers with metadata (title, author, abstract, supervisor, year)
- **Visitors** to search, filter, and download projects
- **Admins** to moderate, approve, and manage content
- **Staff** to rate and comment on projects (optional)

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Headless (custom-built for consistency)
- **PDF Viewer**: PDF.js
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context API
- **API Client**: Fetch API with custom hooks

### Backend
- **Framework**: Express.js
- **Language**: Node.js (TypeScript)
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Local storage (configurable to Cloudinary/Firebase)
- **Validation**: Joi + express-validator
- **Security**: CORS, helmet, rate-limiting, sanitization

### Deployment
- **Frontend**: Vercel (optimal for Next.js)
- **Backend**: Render or Railway
- **Database**: MongoDB Atlas (free tier)
- **File Storage**: Cloudinary (free tier) or local

## 📁 Project Structure

```
.
├── frontend/                 # Next.js React app
│   ├── app/
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── page.tsx         # Home/Landing page
│   │   ├── upload/          # Student upload portal
│   │   ├── repository/      # Project listing & search
│   │   ├── project/[id]/    # Individual project detail
│   │   ├── admin/           # Admin dashboard
│   │   └── api/             # Frontend utils/helpers
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities, API client, constants
│   ├── styles/              # Global CSS, Tailwind config
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── server.ts        # Express app & middleware setup
│   │   ├── config/          # DB, JWT, file storage config
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # MongoDB schemas
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helpers, sanitization
│   │   └── types/           # TypeScript interfaces
│   ├── uploads/             # PDF storage (local)
│   ├── .env.example         # Environment template
│   └── package.json
│
├── docs/                    # Documentation
│   ├── SETUP.md            # Installation & setup guide
│   ├── DEPLOYMENT.md       # Deployment instructions
│   ├── API.md              # API documentation
│   └── ARCHITECTURE.md     # Architecture decisions
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free)
- Git

### Local Development Setup

**1. Clone and install dependencies:**
```bash
cd "c:\Users\croes\Desktop\Final year"

# Frontend
cd frontend
npm install

# Backend (in new terminal)
cd backend
npm install
```

**2. Set up environment variables:**

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/final-year-db
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@university.edu
ADMIN_PASSWORD=ChangeMeInProduction
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

**3. Start the servers:**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## 📱 Responsive Breakpoints

- **Mobile**: 360px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

All components tested and optimized for these ranges.

## 🎨 Design System

### Colors
- **Primary Orange**: `#FF6B00` (deep, elegant)
- **Secondary Orange**: `#FF8C00` (highlights)
- **Matte Black**: `#0D0D0D` (background)
- **Dark Gray**: `#1A1A1A` (cards, containers)
- **Light Gray**: `#E8E8E8` (text on dark)
- **Accent**: `#FFB347` (hover states)

### Typography
- **Font Family**: Poppins (headings), Inter (body)
- **Headings**: Bold 600-700 weight
- **Body**: Regular 400 weight, 14-16px
- **Line Height**: 1.6 for readability

### Components
- Rounded corners: `8px - 16px`
- Shadows: Soft, dark-themed
- Spacing: 8px grid system
- Icons: 24px default, scalable

## ✨ Key Features

### Student Upload Portal
- Title, author, department, year, abstract, supervisor, PDF upload
- Real-time validation & error messages
- Upload progress bar
- File type validation (PDF only, 50MB max)
- Auto-generated unique project ID
- Success confirmation with project link

### Public Repository
- Grid/list view toggle
- Search by keyword/title/author
- Filter by year, department
- Pagination (12 projects/page)
- Project cards with title, author, abstract preview
- Responsive card layout (1-4 columns based on screen)

### Project Detail Page
- Full project information
- PDF inline viewer (PDF.js)
- Download button
- Share functionality
- Related projects section

### Admin Dashboard
- Secure JWT login
- Approve/reject pending uploads
- Delete projects
- Edit project details
- View upload statistics
- User activity log

## 🔒 Security Features

✅ **JWT Authentication** - Secure admin access
✅ **Input Validation** - Joi schemas on backend
✅ **Input Sanitization** - XSS prevention
✅ **CORS Protection** - Configured whitelist
✅ **Rate Limiting** - Prevent abuse
✅ **Helmet.js** - Security headers
✅ **File Validation** - PDF-only uploads
✅ **Environment Variables** - No hardcoded secrets
✅ **Error Handling** - Safe error messages (no stack traces)
✅ **HTTPS Ready** - Production-safe configuration

## 📊 Performance Targets

- **Lighthouse Performance**: >90
- **Lighthouse Accessibility**: >95
- **Lighthouse Best Practices**: >90
- **Time to Interactive**: <2s
- **First Contentful Paint**: <1.2s

## 🧪 Testing Checklist

- [ ] Upload form validation on mobile
- [ ] PDF viewer on small screens (360px)
- [ ] Search and filter functionality
- [ ] Admin login and approval workflow
- [ ] Download functionality
- [ ] Dark theme rendering on all devices
- [ ] Lighthouse audit >90 on desktop
- [ ] Lighthouse audit >85 on mobile
- [ ] Touch interactions on mobile
- [ ] No horizontal scrolling on any screen

## 📚 Documentation

See detailed guides in `/docs`:
- **SETUP.md** - Detailed installation and local development
- **DEPLOYMENT.md** - Production deployment on Vercel/Render
- **API.md** - Complete REST API documentation
- **ARCHITECTURE.md** - Design decisions and patterns

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Render)
```bash
# Create Render account, connect GitHub repo
# Set environment variables in Render dashboard
# Deploy from main branch
```

See **DEPLOYMENT.md** for detailed steps.

## 📝 API Endpoints

### Public Routes
```
GET  /api/projects              - List all approved projects
GET  /api/projects/:id          - Get project details
GET  /api/projects/search       - Search projects
POST /api/projects              - Upload new project
```

### Admin Routes (JWT Required)
```
POST /api/admin/login           - Admin authentication
GET  /api/admin/projects        - List pending projects
PATCH /api/admin/projects/:id   - Approve/reject project
DELETE /api/admin/projects/:id  - Delete project
GET  /api/admin/stats           - View statistics
```

Full API docs in `/docs/API.md`

## 🎁 Sample Data

Database includes 5 seed projects:
1. "Advanced GIS Applications in Urban Planning" - 2024
2. "Drone Photogrammetry for Terrain Mapping" - 2024
3. "Satellite Image Classification Using ML" - 2023
4. "Building Height Estimation from LiDAR" - 2023
5. "IoT-Based Environmental Monitoring System" - 2024

## 📧 Support & Issues

For bugs or feature requests, check `/docs/TROUBLESHOOTING.md`

## 📄 License

MIT License - Free for educational and commercial use.

---

**Built with ruthless attention to detail, security, and user experience.**

Last Updated: October 2025
