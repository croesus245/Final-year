import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiResponse } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No authorization token provided',
        statusCode: 401,
      } as ApiResponse);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      statusCode: 401,
    } as ApiResponse);
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || 500;
  const isDevelopment = config.server.nodeEnv === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: isDevelopment ? err.stack : undefined,
    statusCode,
  } as ApiResponse);
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    statusCode: 404,
  } as ApiResponse);
};
