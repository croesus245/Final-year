'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/Layout';
import {
  adminLogin,
  getPendingProjects,
  approveProject,
  deleteProject,
  getAdminStats,
} from '@/lib/api';
import { Project, ApiResponse, Stats } from '@/lib/types';

export default function Admin() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin dashboard
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      loadDashboard(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response: ApiResponse<{ token: string }> = await adminLogin(
        loginForm.email,
        loginForm.password
      );

      if (response.success && response.data?.token) {
        setToken(response.data.token);
        localStorage.setItem('admin_token', response.data.token);
        setIsLoggedIn(true);
        setLoginForm({ email: '', password: '' });
        loadDashboard(response.data.token);
      } else {
        setLoginError(response.message);
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      console.error(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const loadDashboard = async (authToken: string) => {
    setProjectsLoading(true);
    try {
      // Load pending projects
      const projectsRes: ApiResponse<{ projects: Project[] }> = await getPendingProjects(authToken);
      if (projectsRes.data) {
        setProjects(projectsRes.data.projects);
      }

      // Load stats
      const statsRes: ApiResponse<Stats> = await getAdminStats(authToken);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleApprove = async (projectId: string) => {
    if (!token) return;

    try {
      const response = await approveProject(projectId, token);
      if (response.success) {
        loadDashboard(token);
      }
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!token || !confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await deleteProject(projectId, token);
      if (response.success) {
        loadDashboard(token);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('admin_token');
    setProjects([]);
    setStats(null);
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-matte-black">
        <Header showNav={false} />

        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="card p-8 md:p-12 w-full max-w-md">
            <h1 className="text-3xl font-poppins font-bold text-white mb-2">Admin Login</h1>
            <p className="text-text-gray mb-8">Enter your credentials to access the dashboard</p>

            {loginError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-300 rounded">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-gray mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-medium-gray rounded text-text-gray text-sm">
              <p className="font-bold mb-2">Demo Credentials:</p>
              <p>Email: admin@university.edu</p>
              <p>Password: ChangeMeInProduction</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Dashboard Page
  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Header showNav={false} />

      <main className="flex-grow py-8 md:py-12">
        <div className="container-responsive">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="btn-secondary px-6 py-2"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="card p-6 text-center">
                <p className="text-text-gray text-sm mb-2">Total Projects</p>
                <p className="text-3xl font-bold text-primary-orange">{stats.total}</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-text-gray text-sm mb-2">Approved</p>
                <p className="text-3xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-text-gray text-sm mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-text-gray text-sm mb-2">Total Downloads</p>
                <p className="text-3xl font-bold text-primary-orange">{stats.totalDownloads}</p>
              </div>
            </div>
          )}

          {/* Pending Projects */}
          <div>
            <h2 className="text-2xl font-poppins font-bold text-white mb-6">
              Pending Approval ({projects.length})
            </h2>

            {projectsLoading ? (
              <div className="text-center text-text-gray">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-text-gray">No pending projects</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project._id} className="card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-text-gray">Title</p>
                        <p className="font-semibold text-light-gray">{project.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-gray">Author</p>
                        <p className="font-semibold text-light-gray">{project.author}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-gray">Submitted</p>
                        <p className="font-semibold text-light-gray">
                          {new Date(project.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-light-gray mb-4 line-clamp-2">
                      {project.abstract}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(project._id)}
                        className="btn-primary px-4 py-2 text-sm flex-1"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="btn-secondary px-4 py-2 text-sm flex-1 border-red-500 text-red-300"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
