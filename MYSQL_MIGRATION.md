# 🔄 MongoDB to MySQL Migration Guide

## Overview
Converting your Final-Year Project Repository from MongoDB to MySQL using Prisma ORM.

**Timeline:** 3-4 hours  
**Difficulty:** Medium  
**Reversible:** Yes (Git backup)

---

## Step 1: Setup Local MySQL

### 1.1 Install MySQL Server
- Download: https://dev.mysql.com/downloads/mysql/
- Install MySQL Server 8.0 or later
- Remember the password you set

### 1.2 Install MySQL Workbench
- Download: https://dev.mysql.com/downloads/workbench/
- Install and open
- Connect to local MySQL (localhost:3306)

### 1.3 Create Database
In MySQL Workbench, run:
```sql
CREATE DATABASE IF NOT EXISTS final_year_db;
USE final_year_db;
```

---

## Step 2: Update Backend Dependencies

### 2.1 Remove MongoDB packages
```bash
cd backend
npm uninstall mongoose
```

### 2.2 Install Prisma
```bash
npm install @prisma/client
npm install -D prisma tsx
```

### 2.3 Install MySQL driver
```bash
npm install mysql2
```

### 2.4 Update package.json scripts
Add these scripts:
```json
"prisma": "prisma",
"db:push": "prisma db push",
"db:seed": "node prisma/seed.js",
"db:studio": "prisma studio"
```

---

## Step 3: Setup Prisma

### 3.1 Initialize Prisma
```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### 3.2 Update .env
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/final_year_db"
```

Replace:
- `root` with your MySQL username
- `your_password` with your MySQL password

### 3.3 Create Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Project {
  id              String    @id @default(cuid())
  projectId       String    @unique
  title           String    @db.VarChar(255)
  author          String    @db.VarChar(255)
  department      String    @db.VarChar(255)
  year            Int
  abstract        String    @db.LongText
  supervisor      String    @db.VarChar(255)
  fileName        String    @db.VarChar(255)
  fileSize        Int
  filePath        String    @db.VarChar(500)
  status          String    @default("pending") @db.Enum("pending", "approved", "rejected")
  rejectionReason String?   @db.Text
  views           Int       @default(0)
  downloads       Int       @default(0)
  ratings         Json?
  comments        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([status])
  @@index([department])
  @@index([year])
  @@fulltext([title, author, abstract])
}

model Admin {
  id        String    @id @default(cuid())
  email     String    @unique @db.VarChar(255)
  passwordHash String  @db.VarChar(255)
  role      String    @default("admin") @db.Enum("admin", "superadmin")
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email])
}
```

### 3.4 Push schema to database
```bash
npx prisma db push
```

This creates tables in MySQL automatically!

---

## Step 4: Update Backend Code

### 4.1 Create Prisma client wrapper
Create `backend/src/db/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### 4.2 Update config
Replace `src/config/database.ts` with:

```typescript
import prisma from '../db/prisma.js';

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ MySQL connected successfully');
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma };
```

### 4.3 Delete old Mongoose files
```bash
rm src/models/Project.ts
rm src/models/Admin.ts
```

### 4.4 Create new SQL models
Create `backend/src/models/prisma.ts`:

```typescript
import prisma from '../db/prisma.js';
import bcryptjs from 'bcryptjs';

// Project queries
export const ProjectModel = {
  create: (data: any) => prisma.project.create({ data }),
  findMany: (args?: any) => prisma.project.findMany(args),
  findById: (id: string) => prisma.project.findUnique({ where: { id } }),
  findByProjectId: (projectId: string) => prisma.project.findUnique({ where: { projectId } }),
  update: (id: string, data: any) => prisma.project.update({ where: { id }, data }),
  delete: (id: string) => prisma.project.delete({ where: { id } }),
  findByStatus: (status: string) => prisma.project.findMany({ where: { status } }),
};

// Admin queries
export const AdminModel = {
  create: async (data: any) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data.passwordHash, salt);
    return prisma.admin.create({
      data: { ...data, passwordHash: hashedPassword }
    });
  },
  findByEmail: (email: string) => prisma.admin.findUnique({ where: { email } }),
  update: (id: string, data: any) => prisma.admin.update({ where: { id }, data }),
};
```

### 4.5 Update controllers
Replace Mongoose calls with Prisma:

**Before (Mongoose):**
```typescript
const admin = await Admin.findOne({ email }).select('+passwordHash');
```

**After (Prisma):**
```typescript
const admin = await prisma.admin.findUnique({ where: { email } });
```

---

## Step 5: Update Controllers

### Example: adminController.ts update

Replace the login function:

```typescript
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
        statusCode: 400,
      });
      return;
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      });
      return;
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      });
      return;
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, admin: { id: admin.id, email: admin.email, role: admin.role } },
      statusCode: 200,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      statusCode: 500,
    });
  }
};
```

---

## Step 6: Create SQL Seed Script

Create `prisma/seed.js`:

```javascript
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin
  const adminExists = await prisma.admin.findUnique({
    where: { email: 'admin@university.edu' }
  });

  if (!adminExists) {
    const hashedPassword = await bcryptjs.hash('Admin@123', 10);
    await prisma.admin.create({
      data: {
        email: 'admin@university.edu',
        passwordHash: hashedPassword,
        role: 'admin',
      }
    });
    console.log('✅ Admin created');
  }

  // Create sample projects
  const projects = [
    {
      projectId: 'PROJ-2024-001',
      title: 'Advanced GIS Applications',
      author: 'Kofi Mensah',
      department: 'Surveying & Geoinformatics',
      year: 2024,
      abstract: 'Sample abstract...',
      supervisor: 'Prof. Ama Asante',
      fileName: 'project1.pdf',
      fileSize: 2500000,
      filePath: './uploads/project1.pdf',
      status: 'approved',
      views: 145,
      downloads: 32,
    },
    // Add more projects...
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log('✅ Database seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npm run db:seed
```

---

## Step 7: Update Environment Variables

### Local (.env)
```env
DATABASE_URL="mysql://root:password@localhost:3306/final_year_db"
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### Production (Render)
```env
DATABASE_URL="mysql://username:password@host:3306/final_year_db"
```

---

## Step 8: Test Locally

```bash
cd backend
npm run dev
```

Test admin login:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"Admin@123"}'
```

---

## Step 9: Deploy to Production

### Option A: PlanetScale (Recommended - free tier)
1. Go to https://planetscale.com
2. Create account
3. Create database
4. Get connection string
5. Update Render environment variables

### Option B: Railway
1. Go to https://railway.app
2. Create MySQL service
3. Get connection string
4. Update Render environment variables

---

## 🔄 Rollback Plan

If something goes wrong:
```bash
git checkout HEAD -- src/
npm install mongoose
# Restore from MongoDB backup
```

---

## ✅ Checklist

- [ ] MySQL installed and running
- [ ] Database created in Workbench
- [ ] Prisma installed
- [ ] Schema created and pushed
- [ ] Controllers updated
- [ ] Seed script created and tested
- [ ] Local testing passed
- [ ] Environment variables updated
- [ ] Production database ready
- [ ] Backend redeployed to Render
- [ ] Frontend tested with new backend

---

## 📞 Support

If you get errors:
1. Check `npm run prisma studio` to view database
2. Check `.env` DATABASE_URL format
3. Verify MySQL is running: `mysql -u root -p`
4. Check backend logs for SQL errors

**You've got this! 🚀**
