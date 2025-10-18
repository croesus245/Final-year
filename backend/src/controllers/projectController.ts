import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Project } from '../models/Project.js';
import { generateProjectId, sanitizeObject, validatePDFFile } from '../utils/helpers.js';
import { ApiResponse } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

export const uploadProject = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
        statusCode: 400,
      } as ApiResponse);
      return;
    }

    // Validate file
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No PDF file uploaded',
        statusCode: 400,
      } as ApiResponse);
      return;
    }

    const isPdfValid = validatePDFFile(req.file.originalname, req.file.mimetype);
    if (!isPdfValid) {
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(() => {});
      res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
        statusCode: 400,
      } as ApiResponse);
      return;
    }

    // Sanitize input
    const sanitizedData = sanitizeObject({
      title: req.body.title,
      author: req.body.author,
      department: req.body.department,
      year: req.body.year,
      abstract: req.body.abstract,
      supervisor: req.body.supervisor,
    });

    // Generate unique project ID
    const projectId = generateProjectId();

    // Create project document
    const project = new Project({
      projectId,
      title: sanitizedData.title,
      author: sanitizedData.author,
      department: sanitizedData.department,
      year: parseInt(req.body.year),
      abstract: sanitizedData.abstract,
      supervisor: sanitizedData.supervisor,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileName: req.file.originalname,
      status: 'pending',
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project uploaded successfully. Awaiting admin approval.',
      data: {
        projectId: project.projectId,
        id: project._id,
        title: project.title,
        author: project.author,
        status: project.status,
      },
      statusCode: 201,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Upload error:', error);
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const getApprovedProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ status: 'approved' })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-filePath'); // Don't expose file path in list

    const total = await Project.countDocuments({ status: 'approved' });

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
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
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving projects',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      $or: [{ _id: id }, { projectId: id }],
      status: 'approved',
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    // Increment views
    project.views = (project.views || 0) + 1;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
      statusCode: 200,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const searchProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, year, department, author } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { status: 'approved' };

    if (query) {
      filter.$text = { $search: query };
    }

    if (year) {
      filter.year = parseInt(year as string);
    }

    if (department) {
      filter.department = department;
    }

    if (author) {
      filter.author = new RegExp(author as string, 'i');
    }

    const projects = await Project.find(filter)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-filePath');

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Search results retrieved',
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
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching projects',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const downloadProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      $or: [{ _id: id }, { projectId: id }],
      status: 'approved',
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    const filePath = project.filePath;

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        message: 'File not found on server',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    // Increment downloads
    project.downloads = (project.downloads || 0) + 1;
    await project.save();

    // Send file
    res.download(filePath, project.fileName);
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading project',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { staffName, staffEmail, comment } = req.body;

    const project = await Project.findOne({
      $or: [{ _id: id }, { projectId: id }],
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    const newComment = {
      _id: new (require('mongoose')).Types.ObjectId(),
      staffName: sanitizeObject({ staffName }).staffName,
      staffEmail: sanitizeObject({ staffEmail }).staffEmail,
      comment: sanitizeObject({ comment }).comment,
      createdAt: new Date(),
    };

    if (!project.comments) project.comments = [];
    project.comments.push(newComment);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
      statusCode: 201,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      statusCode: 500,
    } as ApiResponse);
  }
};

export const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
        statusCode: 400,
      } as ApiResponse);
      return;
    }

    const project = await Project.findOne({
      $or: [{ _id: id }, { projectId: id }],
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
        statusCode: 404,
      } as ApiResponse);
      return;
    }

    if (!project.ratings) project.ratings = [];
    project.ratings.push(rating);
    await project.save();

    const avgRating = Math.round((project.ratings.reduce((a, b) => a + b, 0) / project.ratings.length) * 10) / 10;

    res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: avgRating,
        totalRatings: project.ratings.length,
      },
      statusCode: 201,
    } as ApiResponse);
  } catch (error) {
    console.error('❌ Rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      statusCode: 500,
    } as ApiResponse);
  }
};
