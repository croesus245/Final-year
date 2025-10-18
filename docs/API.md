# REST API Documentation

Complete API reference for the Final-Year Project Repository backend.

## 📍 Base URL

- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

---

## 🔍 Public Endpoints (No Authentication Required)

### Projects

#### List Approved Projects (Paginated)

```
GET /projects/approved?page=1
```

**Query Parameters:**
- `page` (optional): Page number, default: 1

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "projects": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "projectId": "PROJ_ABC123DEF456",
        "title": "Advanced GIS Applications",
        "author": "John Doe",
        "department": "Surveying & Geoinformatics",
        "year": 2024,
        "abstract": "This project explores...",
        "supervisor": "Dr. Smith",
        "status": "approved",
        "uploadedAt": "2025-01-15T10:30:00Z",
        "views": 42,
        "downloads": 5,
        "ratings": [5, 4, 5],
        "comments": [
          {
            "_id": "507f1f77bcf86cd799439012",
            "staffName": "Prof. Jane",
            "staffEmail": "jane@university.edu",
            "comment": "Excellent work!",
            "createdAt": "2025-01-16T14:20:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "pages": 4,
      "limit": 12
    }
  },
  "statusCode": 200
}
```

---

#### Get Project Details by ID

```
GET /projects/:id
```

**Parameters:**
- `id`: Project MongoDB ID or projectId

**Response (200 OK):**
Same as single project object above

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Project not found",
  "statusCode": 404
}
```

---

#### Search Projects

```
GET /projects/search?query=gis&year=2024&department=Surveying&page=1
```

**Query Parameters:**
- `query`: Search keyword (searches title, abstract, author)
- `year` (optional): Filter by year
- `department` (optional): Filter by department
- `page` (optional): Page number, default: 1

**Response:** Same pagination structure as list endpoint

---

#### Download Project PDF

```
POST /projects/:id/download
```

**Response (200 OK):**
- Binary PDF file
- Sets `Content-Disposition` header for download

**Error (404):**
```json
{
  "success": false,
  "message": "Project not found",
  "statusCode": 404
}
```

---

### Project Interactions

#### Add Comment

```
POST /projects/:id/comments
Content-Type: application/json
```

**Request Body:**
```json
{
  "staffName": "Dr. Thompson",
  "staffEmail": "thompson@university.edu",
  "comment": "Great research on satellite imagery!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "staffName": "Dr. Thompson",
    "staffEmail": "thompson@university.edu",
    "comment": "Great research on satellite imagery!",
    "createdAt": "2025-01-17T11:45:00Z"
  },
  "statusCode": 201
}
```

---

#### Add Rating

```
POST /projects/:id/ratings
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5
}
```

**Validation:**
- Rating must be an integer between 1 and 5

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Rating added successfully",
  "data": {
    "averageRating": 4.6,
    "totalRatings": 15
  },
  "statusCode": 201
}
```

---

#### Upload Project

```
POST /projects/upload
Content-Type: multipart/form-data
```

**Form Fields:**
- `title` (required): Project title (5-200 chars)
- `author` (required): Author name
- `department` (required): Department name
- `year` (required): Year (2000 or later)
- `abstract` (required): Abstract (50-5000 chars)
- `supervisor` (required): Supervisor name
- `file` (required): PDF file (max 50MB)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Project uploaded successfully. Awaiting admin approval.",
  "data": {
    "projectId": "PROJ_ABC123DEF456",
    "id": "507f1f77bcf86cd799439014",
    "title": "My Research Project",
    "author": "Student Name",
    "status": "pending"
  },
  "statusCode": 201
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Title must be at least 5 characters",
  "statusCode": 400
}
```

---

## 🔐 Admin Endpoints (Authentication Required)

All admin endpoints require JWT token in `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

---

### Authentication

#### Admin Login

```
POST /admin/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@university.edu",
  "password": "YourSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "507f1f77bcf86cd799439015",
      "email": "admin@university.edu",
      "role": "admin"
    }
  },
  "statusCode": 200
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "statusCode": 401
}
```

---

### Project Management

#### Get Pending Projects

```
GET /admin/pending?page=1
Authorization: Bearer <token>
```

**Response (200 OK):**
Same pagination structure as public projects list, but shows only pending projects

---

#### Approve Project

```
PATCH /admin/:id/approve
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project approved successfully",
  "data": {
    "projectId": "PROJ_ABC123DEF456",
    "status": "approved",
    "...": "project object"
  },
  "statusCode": 200
}
```

---

#### Reject Project

```
PATCH /admin/:id/reject
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Does not meet quality standards"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project rejected",
  "data": {
    "projectId": "PROJ_ABC123DEF456",
    "status": "rejected"
  },
  "statusCode": 200
}
```

---

#### Delete Project

```
DELETE /admin/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "statusCode": 200
}
```

---

#### Edit Project

```
PATCH /admin/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (all optional):**
```json
{
  "title": "Updated Title",
  "abstract": "Updated abstract...",
  "supervisor": "New Supervisor Name"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "projectId": "PROJ_ABC123DEF456",
    "title": "Updated Title",
    "...": "updated project object"
  },
  "statusCode": 200
}
```

---

#### Get Admin Statistics

```
GET /admin/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "total": 156,
    "approved": 142,
    "pending": 8,
    "rejected": 6,
    "totalViews": 2847,
    "totalDownloads": 534,
    "topProjects": [
      {
        "title": "Advanced GIS Applications",
        "author": "John Doe",
        "downloads": 87
      }
    ]
  },
  "statusCode": 200
}
```

---

## ⚠️ Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Field error details",
  "statusCode": 400
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Project not found",
  "statusCode": 404
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## 🧪 Testing with cURL

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

### List Projects

```bash
curl http://localhost:5000/api/projects/approved
```

### Upload Project

```bash
curl -X POST http://localhost:5000/api/projects/upload \
  -F "title=My Project" \
  -F "author=John Doe" \
  -F "department=Surveying & Geoinformatics" \
  -F "year=2024" \
  -F "abstract=This is my research project about..." \
  -F "supervisor=Dr. Smith" \
  -F "file=@project.pdf"
```

### Admin Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "YourPassword123"
  }'
```

### Get Admin Stats

```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔄 Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Check `RateLimit-Remaining` and `RateLimit-Reset`

**Error (429 Too Many Requests):**
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "statusCode": 429
}
```

---

## 📋 Data Schemas

### Project Object

```typescript
{
  _id: string;              // MongoDB ID
  projectId: string;        // Unique identifier
  title: string;            // 5-200 chars
  author: string;           // Author name
  department: string;       // Department
  year: number;             // Year (2000+)
  abstract: string;         // 50-5000 chars
  supervisor: string;       // Supervisor name
  filePath: string;         // Server file path
  fileSize: number;         // File size in bytes
  fileName: string;         // Original filename
  status: string;           // pending|approved|rejected
  uploadedAt: string;       // ISO timestamp
  views: number;            // View count
  downloads: number;        // Download count
  ratings: number[];        // Array of 1-5 ratings
  comments: Comment[];      // Array of comments
}
```

### Comment Object

```typescript
{
  _id: string;
  staffName: string;
  staffEmail: string;
  comment: string;
  createdAt: string;        // ISO timestamp
}
```

---

**Last Updated:** October 2025
**API Version:** 1.0.0
**Status:** Production Ready ✅
