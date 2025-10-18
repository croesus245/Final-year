import mongoose, { Schema, Document } from 'mongoose';
import { Project } from '../types/index.js';

interface ProjectDocument extends Project, Document {}

const projectSchema = new Schema<ProjectDocument>(
  {
    projectId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      minlength: [3, 'Author name must be at least 3 characters'],
      maxlength: [100, 'Author name cannot exceed 100 characters'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Surveying & Geoinformatics',
        'Geoinformatics',
        'Surveying',
        'Cadastral Survey',
        'Other',
      ],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      minlength: [50, 'Abstract must be at least 50 characters'],
      maxlength: [5000, 'Abstract cannot exceed 5000 characters'],
      trim: true,
    },
    supervisor: {
      type: String,
      required: [true, 'Supervisor name is required'],
      minlength: [3, 'Supervisor name must be at least 3 characters'],
      maxlength: [100, 'Supervisor name cannot exceed 100 characters'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    ratings: {
      type: [Number],
      default: [],
      validate: {
        validator: (v: number[]) => v.every((rating) => rating >= 1 && rating <= 5),
        message: 'Ratings must be between 1 and 5',
      },
    },
    comments: [
      {
        _id: Schema.Types.ObjectId,
        staffName: String,
        staffEmail: String,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
projectSchema.index({ title: 'text', abstract: 'text', author: 'text' });
projectSchema.index({ year: -1, status: 1 });
projectSchema.index({ department: 1, status: 1 });

export const Project = mongoose.model<ProjectDocument>('Project', projectSchema);
