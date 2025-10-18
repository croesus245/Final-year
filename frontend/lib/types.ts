export interface Project {
  _id: string;
  projectId: string;
  title: string;
  author: string;
  department: string;
  year: number;
  abstract: string;
  supervisor: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  ratings?: number[];
  comments?: Comment[];
  views?: number;
  downloads?: number;
  fileName: string;
}

export interface Comment {
  _id: string;
  staffName: string;
  staffEmail: string;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface Admin {
  id: string;
  email: string;
  role: string;
}

export interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  totalViews: number;
  totalDownloads: number;
  topProjects: Project[];
}
