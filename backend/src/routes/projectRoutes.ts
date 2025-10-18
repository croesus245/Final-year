import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import {
  uploadProject,
  getApprovedProjects,
  getProjectById,
  searchProjects,
  downloadProject,
  addComment,
  addRating,
} from '../controllers/projectController.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Public routes
router.post(
  '/upload',
  upload.single('file'),
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('year').isInt({ min: 2000 }).withMessage('Year must be 2000 or later'),
    body('abstract').trim().notEmpty().withMessage('Abstract is required').isLength({ min: 50 }).withMessage('Abstract must be at least 50 characters'),
    body('supervisor').trim().notEmpty().withMessage('Supervisor is required'),
  ],
  uploadProject
);

router.get('/approved', getApprovedProjects);
router.get('/search', searchProjects);
router.get('/:id', getProjectById);
router.post('/:id/download', downloadProject);

// Comments and ratings
router.post('/:id/comments', [
  body('staffName').trim().notEmpty().withMessage('Staff name is required'),
  body('staffEmail').isEmail().withMessage('Valid email is required'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
], addComment);

router.post('/:id/ratings', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
], addRating);

export default router;
