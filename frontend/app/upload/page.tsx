'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/Layout';
import { uploadProject } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

const DEPARTMENTS = [
  'Surveying & Geoinformatics',
  'Geoinformatics',
  'Surveying',
  'Cadastral Survey',
  'Other',
];

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    department: DEPARTMENTS[0],
    year: new Date().getFullYear().toString(),
    abstract: '',
    supervisor: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Only PDF files are allowed' });
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 50MB' });
        return;
      }
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.title || !formData.author || !formData.abstract || !formData.supervisor) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (formData.abstract.length < 50) {
      setMessage({ type: 'error', text: 'Abstract must be at least 50 characters' });
      return;
    }

    if (!file) {
      setMessage({ type: 'error', text: 'Please select a PDF file' });
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('author', formData.author);
      form.append('department', formData.department);
      form.append('year', formData.year.toString());
      form.append('abstract', formData.abstract);
      form.append('supervisor', formData.supervisor);
      form.append('file', file);

      const response: ApiResponse = await uploadProject(form);

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Project uploaded successfully! Awaiting admin approval.',
        });
        setFormData({
          title: '',
          author: '',
          department: DEPARTMENTS[0],
          year: new Date().getFullYear().toString(),
          abstract: '',
          supervisor: '',
        });
        setFile(null);

        setTimeout(() => {
          router.push('/repository');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to upload project. Please try again.',
      });
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-dark-gray border-b border-medium-gray py-8 md:py-12">
          <div className="container-responsive">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">
              Upload Project
            </h1>
            <p className="text-text-gray">
              Submit your final-year research project to our repository
            </p>
          </div>
        </section>

        {/* Upload Form */}
        <section className="py-12 md:py-16">
          <div className="container-responsive max-w-2xl">
            <div className="card p-8">
              {/* Message */}
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border border-green-500 text-green-300'
                      : 'bg-red-500/10 border border-red-500 text-red-300'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    maxLength={200}
                    required
                    className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                  <p className="text-xs text-text-gray mt-1">
                    {formData.title.length}/200
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-light-gray mb-2">
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-light-gray mb-2">
                      Year *
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    Abstract (50-5000 characters) *
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    placeholder="Enter project abstract..."
                    minLength={50}
                    maxLength={5000}
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none resize-none"
                  />
                  <p className="text-xs text-text-gray mt-1">
                    {formData.abstract.length}/5000
                  </p>
                </div>

                {/* Supervisor */}
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    Supervisor Name *
                  </label>
                  <input
                    type="text"
                    name="supervisor"
                    value={formData.supervisor}
                    onChange={handleInputChange}
                    placeholder="Project supervisor's name"
                    required
                    className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-light-gray mb-2">
                    PDF File (Max 50MB) *
                  </label>
                  <div className="border-2 border-dashed border-medium-gray rounded-lg p-6 text-center hover:border-primary-orange transition">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer block"
                    >
                      <p className="text-text-gray mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-gray">PDF files only</p>
                    </label>
                    {file && (
                      <p className="mt-3 text-primary-orange text-sm">
                        ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Project'}
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-8 bg-medium-gray border border-medium-gray rounded-lg p-4">
                <h4 className="font-bold text-light-gray mb-2">📋 Upload Guidelines</h4>
                <ul className="text-xs md:text-sm text-text-gray space-y-1">
                  <li>• Only PDF files are accepted (max 50MB)</li>
                  <li>• Title must be descriptive and unique</li>
                  <li>• Abstract should clearly describe your research</li>
                  <li>• All uploads must be approved by an administrator</li>
                  <li>• Avoid sensitive or confidential information</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
