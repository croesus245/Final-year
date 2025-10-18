'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/Layout';
import { fetchProjectById, downloadProject, addComment, addRating } from '@/lib/api';
import { Project, ApiResponse, Comment } from '@/lib/types';

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment form
  const [commentForm, setCommentForm] = useState({
    staffName: '',
    staffEmail: '',
    comment: '',
  });
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');

  // Rating
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Project> = await fetchProjectById(projectId);
      if (response.data) {
        setProject(response.data);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadProject(projectId);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = project?.fileName || 'project.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);

    try {
      const response: ApiResponse = await addComment(
        projectId,
        commentForm.staffName,
        commentForm.staffEmail,
        commentForm.comment
      );

      if (response.success) {
        setCommentMessage('Comment added successfully!');
        setCommentForm({ staffName: '', staffEmail: '', comment: '' });
        setTimeout(() => setCommentMessage(''), 3000);
        loadProject(); // Reload to see new comment
      }
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    setRatingLoading(true);
    try {
      const response: ApiResponse = await addRating(projectId, rating);
      if (response.success) {
        setSelectedRating(rating);
        loadProject();
      }
    } catch (err) {
      console.error('Rating failed:', err);
    } finally {
      setRatingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-matte-black">
        <Header />
        <main className="flex-grow container-responsive py-12">
          <div className="skeleton h-96 rounded-lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-matte-black">
        <Header />
        <main className="flex-grow container-responsive py-12 text-center">
          <p className="text-xl text-text-gray mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/repository')}
            className="btn-primary"
          >
            Back to Repository
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating =
    project.ratings && project.ratings.length > 0
      ? (project.ratings.reduce((a: number, b: number) => a + b, 0) / project.ratings.length).toFixed(1)
      : 'N/A';

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container-responsive">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-primary-orange hover:text-secondary-orange mb-4 text-sm"
            >
              ← Back
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-white mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="badge-orange">{project.year}</span>
              <span className="badge">{project.department}</span>
              <span className={`badge ${project.status === 'approved' ? 'bg-green-500/20 text-green-300' : ''}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Info Card */}
              <div className="card p-6 md:p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-text-gray text-sm mb-1">Author</p>
                    <p className="text-white font-semibold">{project.author}</p>
                  </div>
                  <div>
                    <p className="text-text-gray text-sm mb-1">Supervisor</p>
                    <p className="text-white font-semibold">{project.supervisor}</p>
                  </div>
                </div>

                {/* Abstract */}
                <div className="mb-6">
                  <h2 className="text-xl font-poppins font-bold text-white mb-3">Abstract</h2>
                  <p className="text-light-gray leading-relaxed text-justify">
                    {project.abstract}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-medium-gray">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-orange">
                      {project.views || 0}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-orange">
                      {project.downloads || 0}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Downloads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-orange">
                      {avgRating}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Rating</p>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="card p-6 md:p-8">
                <h2 className="text-xl font-poppins font-bold text-white mb-4">Rate This Project</h2>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      disabled={ratingLoading}
                      className="text-3xl transition hover:scale-110 disabled:opacity-50"
                    >
                      {star <= selectedRating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-text-gray text-sm">
                  {project.ratings?.length || 0} rating{(project.ratings?.length || 0) !== 1 ? 's' : ''} from community members
                </p>
              </div>

              {/* Comments Section */}
              <div className="card p-6 md:p-8">
                <h2 className="text-xl font-poppins font-bold text-white mb-6">
                  Comments & Feedback
                </h2>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b border-medium-gray">
                  {commentMessage && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-300 rounded text-sm">
                      {commentMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={commentForm.staffName}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, staffName: e.target.value })
                      }
                      className="px-4 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none text-sm"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={commentForm.staffEmail}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, staffEmail: e.target.value })
                      }
                      className="px-4 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none text-sm"
                      required
                    />
                  </div>

                  <textarea
                    placeholder="Add your feedback..."
                    value={commentForm.comment}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, comment: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none resize-none text-sm"
                    required
                  />

                  <button
                    type="submit"
                    disabled={commentLoading}
                    className="btn-primary mt-3 disabled:opacity-50"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {project.comments && project.comments.length > 0 ? (
                    project.comments.map((comment: Comment) => (
                      <div key={comment._id} className="bg-medium-gray rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-light-gray">{comment.staffName}</p>
                            <p className="text-xs text-text-gray">{comment.staffEmail}</p>
                          </div>
                          <p className="text-xs text-text-gray">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-light-gray">{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-gray text-sm">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-poppins font-bold text-white mb-4">Project File</h2>

                <div className="mb-6">
                  <p className="text-text-gray text-xs mb-2">Uploaded</p>
                  <p className="text-light-gray text-sm">
                    {new Date(project.uploadedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  className="btn-primary w-full py-3 mb-3 flex items-center justify-center gap-2"
                >
                  📥 Download PDF
                </button>

                <button
                  onClick={() => {
                    const url = `mailto:?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(window.location.href)}`;
                    window.location.href = url;
                  }}
                  className="btn-secondary w-full py-2 text-sm"
                >
                  Share
                </button>

                {/* Info Box */}
                <div className="mt-6 bg-medium-gray rounded-lg p-4">
                  <h3 className="font-bold text-light-gray mb-3">About This Project</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-text-gray">
                    <li>
                      <span className="text-primary-orange">Department:</span> {project.department}
                    </li>
                    <li>
                      <span className="text-primary-orange">Year:</span> {project.year}
                    </li>
                    <li>
                      <span className="text-primary-orange">Project ID:</span> {project.projectId}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
