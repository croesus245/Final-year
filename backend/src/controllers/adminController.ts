import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Project } from '../models/Project.js';
import { config } from '../config/index.js';
import { ApiResponse, JWTPayload } from '../types/index.js';
import fs from 'fs/promises';

interface AuthenticatedRequest extends Request {
  admin?: any;
}

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
        statusCode: 400,
      } as ApiResponse);
      return;
    }

    const admin = await Admin.findOne({ email }).select('+passwordHash');

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      } as ApiResponse);
      return;
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401,
      } as ApiResponse);
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const getPendingProjects = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ status: 'pending' })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-filePath');

    const total = await Project.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      message: 'Pending projects retrieved',
      data: {
        projects,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Get pending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving pending projects',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const approveProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project approved successfully',
      data: project,
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const rejectProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    // Clean up file
    try {
      await fs.unlink(project.filePath);
    } catch {
      console.warn('Could not delete file:', project.filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Project rejected',
      data: project,
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Reject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    // Clean up file
    try {
      await fs.unlink(project.filePath);
    } catch {
      console.warn('Could not delete file:', project.filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const editProject = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, abstract, supervisor } = req.body;

    const updateData: Record<string, any> = {};
    if (title) updateData.title = title;
    if (abstract) updateData.abstract = abstract;
    if (supervisor) updateData.supervisor = supervisor;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Edit error:', error);
    res.status(500).json({
      success: false,
      message: 'Error editing project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const getAdminStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const totalProjects = await Project.countDocuments();
    const approvedProjects = await Project.countDocuments({ status: 'approved' });
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const rejectedProjects = await Project.countDocuments({ status: 'rejected' });

    const totalViews = await Project.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const totalDownloads = await Project.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloads' } } },
    ]);

    const topProjects = await Project.find({ status: 'approved' })
      .sort({ downloads: -1 })
      .limit(5)
      .select('title author downloads views');

    res.status(200).json({
      success: true,
      message: 'Stats retrieved successfully',
      data: {
        total: totalProjects,
        approved: approvedProjects,
        pending: pendingProjects,
        rejected: rejectedProjects,
        totalViews: totalViews[0]?.totalViews || 0,
        totalDownloads: totalDownloads[0]?.totalDownloads || 0,
        topProjects,
      },
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving stats',
      statusCode: 500,
    } as ApiResponse);
  }
};
