# Architecture & Technical Decisions

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FINAL-YEAR PROJECT REPOSITORY               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────┐    │
│  │   FRONTEND (Next.js) │         │   ADMIN DASHBOARD    │    │
│  │   - Home Page        │◄────────┤   - Login            │    │
│  │   - Repository       │         │   - Approve/Reject   │    │
│  │   - Upload Form      │         │   - Statistics       │    │
│  │   - Project Detail   │         └──────────────────────┘    │
│  │   - Dark Orange UI   │                                      │
│  └──────────────────────┘                                      │
│           │                                                     │
│           │ HTTP/REST with JWT Auth                            │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         EXPRESS.JS API SERVER (Port 5000)           │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │                                                      │     │
│  │  Routes:                                             │     │
│  │  - POST   /api/projects/upload          (Validation)│     │
│  │  - GET    /api/projects/approved         (Public)   │     │
│  │  - GET    /api/projects/search           (Public)   │     │
│  │  - GET    /api/projects/:id              (Public)   │     │
│  │  - POST   /api/projects/:id/download     (Public)   │     │
│  │  - POST   /api/projects/:id/comments     (Public)   │     │
│  │  - POST   /api/projects/:id/ratings      (Public)   │     │
│  │  - POST   /api/admin/login               (Public)   │     │
│  │  - GET    /api/admin/pending        (Auth Required) │     │
│  │  - PATCH  /api/admin/:id/approve    (Auth Required) │     │
│  │  - PATCH  /api/admin/:id/reject     (Auth Required) │     │
│  │  - DELETE /api/admin/:id            (Auth Required) │     │
│  │  - GET    /api/admin/stats          (Auth Required) │     │
│  │                                                      │     │
│  │  Middleware:                                         │     │
│  │  - JWT Authentication (admin routes)                │     │
│  │  - CORS (configured origins)                        │     │
│  │  - Rate Limiting (100 req/15min)                    │     │
│  │  - Helmet (security headers)                        │     │
│  │  - Input Validation & Sanitization                  │     │
│  │                                                      │     │
│  │  Controllers:                                        │     │
│  │  - projectController (upload, list, search, etc.)   │     │
│  │  - adminController (auth, approval, stats)          │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│           │                                                     │
│           │ Mongoose ODM                                        │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │        MONGODB DATABASE (MongoDB Atlas/Local)        │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │                                                      │     │
│  │  Collections:                                        │     │
│  │  - projects (title, author, department, etc.)       │     │
│  │  - admins (email, passwordHash, role)               │     │
│  │                                                      │     │
│  │  Indexes:                                            │     │
│  │  - projects (title, abstract, author) - text search │     │
│  │  - projects (year, status) - filtering              │     │
│  │  - projects (department, status) - filtering        │     │
│  │  - projects (projectId) - unique lookup             │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│           │                                                     │
│           │ Local/Cloud Storage                                 │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │         FILE STORAGE (PDFs)                          │     │
│  │  - ./uploads/ (local dev)                           │     │
│  │  - Cloudinary (production optional)                 │     │
│  │  - Max 50MB per file                                │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Patterns & Architecture Decisions

### 1. **Frontend Architecture**

#### Next.js 15 App Router (Server-Side)
- **Why:** Modern, production-ready, built-in optimizations (ISR, image optimization)
- **Benefits:** 
  - File-based routing
  - API routes for backend integration
  - Server-side rendering for SEO
  - Built-in CSS/image optimization

#### Client-Side Pages with React Hooks
- **Why:** Dynamic, interactive user interfaces needed
- **Components:**
  - `Layout.tsx` - Header/Footer wrapper
  - `ProjectCard.tsx` - Reusable card component
  - Individual pages in `app/`

#### TypeScript Everywhere
- **Why:** Type safety, better IDE support, documentation
- **Types defined in:** `lib/types.ts`

#### Tailwind CSS for Styling
- **Why:** Utility-first, fully customizable, dark mode support
- **Configuration:** `tailwind.config.ts` with custom colors

#### API Integration via `lib/api.ts`
- **Why:** Centralized API calls, easy maintenance, error handling
- **Pattern:** Fetch wrapper with proper error handling

---

### 2. **Backend Architecture**

#### Express.js Microservice Pattern
- **Why:** Lightweight, flexible, industry standard
- **Structure:**
  - **Routes** - Define endpoints
  - **Controllers** - Business logic
  - **Models** - Database schemas
  - **Middleware** - Cross-cutting concerns

#### Mongoose for MongoDB
- **Why:** Schema validation, type safety, hooks support
- **Models:** `Project.ts`, `Admin.ts`

#### JWT Authentication
- **Why:** Stateless, scalable, industry standard
- **Flow:** Login → Token → Protected Routes
- **Expiration:** 7 days configurable

#### File Upload with Multer
- **Why:** Multipart form handling, file validation, streaming
- **Configuration:**
  - Destination: `./uploads/`
  - File type: PDF only
  - Size limit: 50MB

#### Input Validation & Sanitization
- **Validation:** Express-validator for schema validation
- **Sanitization:** XSS library to prevent injections
- **Pattern:** Validate → Sanitize → Process → Respond

---

### 3. **Database Design**

#### MongoDB Collections

**Projects Collection:**
```typescript
{
  _id: ObjectId,
  projectId: String (unique),        // PROJ_ABC123DEF456
  title: String (indexed),            // Full-text search
  author: String,                     // Indexed for filtering
  department: String (enum),          // Indexed
  year: Number (indexed),             // Range queries
  abstract: String (full-text),       // Search
  supervisor: String,
  filePath: String,                   // Server path
  fileSize: Number,
  fileName: String,
  status: String (enum),              // pending|approved|rejected
  ratings: [Number],                  // 1-5 scale
  comments: [{
    staffName: String,
    staffEmail: String,
    comment: String,
    createdAt: Date
  }],
  views: Number (counter),
  downloads: Number (counter),
  uploadedAt: Date (indexed),
  timestamps: {
    createdAt: Date,
    updatedAt: Date
  }
}
```

**Admins Collection:**
```typescript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,               // Bcrypt hashed
  role: String (enum),                // admin|superadmin
  lastLogin: Date,
  createdAt: Date
}
```

#### Indexes for Performance
- Text index on `projects(title, abstract, author)` for search
- Compound index on `projects(year, status)` for filtering
- Compound index on `projects(department, status)` for listing
- Unique index on `projectId` for lookups

---

## 🔐 Security Architecture

### Authentication Flow
```
1. User submits email + password
   ↓
2. Backend finds admin by email
   ↓
3. Compare password with bcrypt hash
   ↓
4. Generate JWT token (7 days)
   ↓
5. Return token to client
   ↓
6. Client stores in localStorage
   ↓
7. Include in Authorization header for protected routes
```

### Protection Layers
1. **Helmet.js** - Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
2. **CORS** - Whitelist allowed origins
3. **Rate Limiting** - 100 requests per 15 minutes per IP
4. **Input Validation** - Joi schemas on all inputs
5. **Input Sanitization** - XSS prevention on text fields
6. **JWT** - Secure token-based auth
7. **HTTPS** - Enforced in production
8. **Environment Variables** - No hardcoded secrets

---

## 📊 Data Flow Examples

### Upload Project Flow
```
1. User fills form (frontend)
   ↓
2. Client-side validation (React Hook Form + Zod)
   ↓
3. POST /api/projects/upload with FormData
   ↓
4. Multer validates & stores PDF
   ↓
5. Backend validates inputs (express-validator)
   ↓
6. Sanitize text fields (XSS prevention)
   ↓
7. Generate projectId (UUID)
   ↓
8. Save to MongoDB with status=pending
   ↓
9. Return success with projectId
   ↓
10. Frontend shows success message
   ↓
11. Redirect to repository after 2s
```

### Search Flow
```
1. User enters search query (frontend)
   ↓
2. Optional: filter by year/department
   ↓
3. GET /api/projects/search?query=...&year=...&dept=...
   ↓
4. Backend performs text search on indexed fields
   ↓
5. Apply filters (year, department)
   ↓
6. Filter only approved projects
   ↓
7. Paginate (12 per page)
   ↓
8. Return results with pagination info
   ↓
9. Frontend displays results
```

### Admin Approval Flow
```
1. Admin views pending projects
   ↓
2. GET /api/admin/pending (with JWT token)
   ↓
3. Backend verifies token validity
   ↓
4. Return all pending projects
   ↓
5. Admin clicks "Approve"
   ↓
6. PATCH /api/admin/:id/approve (with JWT)
   ↓
7. Backend verifies admin role
   ↓
8. Update project status to approved
   ↓
9. Project now visible to public
```

---

## 🗂️ Folder Structure Philosophy

### Frontend
- **`app/`** - Pages & layouts (Next.js App Router)
- **`components/`** - Reusable React components
- **`lib/`** - Utilities (API calls, types, helpers)
- **`public/`** - Static assets

### Backend
- **`config/`** - Database, JWT, settings
- **`controllers/`** - Business logic
- **`routes/`** - API endpoint definitions
- **`models/`** - MongoDB schemas
- **`middleware/`** - Auth, validation, error handling
- **`utils/`** - Helper functions
- **`types/`** - TypeScript interfaces
- **`uploads/`** - PDF storage directory

---

## ⚡ Performance Optimizations

### Frontend
1. **Image Optimization** - Next.js automatic image optimization
2. **Code Splitting** - Route-based splitting
3. **Lazy Loading** - Components loaded on demand
4. **CSS Optimization** - Tailwind purges unused styles
5. **Caching** - Vercel edge caching

### Backend
1. **Database Indexes** - Text, compound, unique indexes
2. **Pagination** - Limit results (12 per page)
3. **Query Optimization** - Projection (exclude sensitive fields)
4. **Response Caching** - Cache headers set appropriately
5. **Gzip Compression** - Automatic in production

### Database
1. **Connection Pooling** - Mongoose handles pooling
2. **Aggregation Pipeline** - For stats calculations
3. **TTL Indexes** - Could be added for auto-cleanup

---

## 🚀 Scalability Considerations

### Current Setup (Single Server)
- ✅ MongoDB Atlas (cloud, auto-scaling)
- ✅ File storage (local/Cloudinary)
- ✅ Stateless backend (can scale horizontally)
- ✅ Serverless frontend (Vercel)

### Future Scaling
- Add Redis for caching
- Implement CDN for file downloads
- Queue system for notifications
- Microservices if needed

---

## 🧪 Testing Strategy

### Unit Tests (To Be Added)
- API controllers
- Database models
- Utilities & helpers

### Integration Tests
- Full upload flow
- Auth flow
- Search functionality

### E2E Tests
- Login → Upload → View
- Admin approval workflow

---

## 📦 Deployment Pipeline

### Development
```
Local → GitHub → CI/CD → Staging → Production
```

### Frontend (Vercel)
- Automatic deployments on push to main
- Preview deployments for PRs
- Automatic SSL, CDN, analytics

### Backend (Render)
- Automatic deployments on push to main
- Environment variables configured
- Auto-restart on crash
- Free tier suitable for <1000 users

### Database (MongoDB Atlas)
- Free 512MB cluster
- Auto-scaling available
- Backups configured
- Connection pooling

---

## 🔄 Error Handling Strategy

### Frontend
```
User Action → Validation → API Call → Error Handling → User Feedback
```

### Backend
```
Request → Validation → Processing → Error Catch → Error Response
Response Format:
{
  success: boolean,
  message: string,
  data?: any,
  error?: string,
  statusCode: number
}
```

---

## 📋 Monitoring & Logging

### What We Log
- API request/response times
- Errors with stack traces
- User actions (login, upload)
- Database queries (dev mode)

### Tools Available
- PM2 (backend monitoring)
- Vercel Analytics (frontend)
- MongoDB Atlas Monitoring
- Browser DevTools

---

## 🎓 Learning Path for New Developers

1. **Start with Frontend**
   - Understand React components
   - Explore `components/` and `app/`
   - Modify styling in globals.css

2. **Move to Backend**
   - Understand Express routing
   - Explore controller logic
   - Learn MongoDB schemas

3. **Database**
   - Connect to MongoDB Atlas
   - Run sample queries
   - Understand indexes

4. **Deployment**
   - Follow SETUP.md for local dev
   - Follow DEPLOYMENT.md for production

---

## 🏆 Production Readiness Checklist

✅ TypeScript for type safety
✅ Input validation & sanitization
✅ JWT authentication
✅ Error handling everywhere
✅ CORS properly configured
✅ Rate limiting enabled
✅ Database indexes optimized
✅ Environment variables used
✅ HTTPS ready
✅ Responsive design
✅ Documentation complete
✅ Security headers (Helmet)

---

**Last Updated:** October 2025
**Status:** Production Ready ✅
**Version:** 1.0.0
