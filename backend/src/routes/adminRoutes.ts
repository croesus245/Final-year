import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateAdmin } from '../middleware/index.js';
import {
  adminLogin,
  getPendingProjects,
  approveProject,
  rejectProject,
  deleteProject,
  editProject,
  getAdminStats,
} from '../controllers/adminController.js';

const router = Router();

// Admin login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  adminLogin
);

// Protected routes (require authentication)
router.get('/pending', authenticateAdmin, getPendingProjects);
router.patch('/:id/approve', authenticateAdmin, approveProject);
router.patch('/:id/reject', authenticateAdmin, rejectProject);
router.delete('/:id', authenticateAdmin, deleteProject);
router.patch('/:id', authenticateAdmin, editProject);
router.get('/stats', authenticateAdmin, getAdminStats);

export default router;
