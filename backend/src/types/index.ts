export interface Project {
  _id?: string;
  projectId: string;
  title: string;
  author: string;
  department: string;
  year: number;
  abstract: string;
  supervisor: string;
  filePath: string;
  fileSize: number;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  ratings?: number[];
  comments?: Comment[];
  views?: number;
  downloads?: number;
}

export interface Comment {
  _id?: string;
  staffName: string;
  staffEmail: string;
  comment: string;
  createdAt: Date;
}

export interface Admin {
  _id?: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}
