'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/Layout';
import { ProjectGrid } from '@/components/ProjectCard';
import { fetchProjects, searchProjects } from '@/lib/api';
import { Project, ApiResponse } from '@/lib/types';

const DEPARTMENTS = [
  'Surveying & Geoinformatics',
  'Geoinformatics',
  'Surveying',
  'Cadastral Survey',
  'Other',
];

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export default function Repository() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initialQuery = searchParams.get('q') || '';
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(1, initialQuery);
    } else {
      loadProjects(1);
    }
  }, []);

  const loadProjects = async (page: number) => {
    setIsLoading(true);
    try {
      const response: ApiResponse<{ projects: Project[]; pagination: { pages: number } }> =
        await fetchProjects(page);
      if (response.data) {
        setProjects(response.data.projects);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (page: number, query?: string) => {
    setIsLoading(true);
    try {
      const response: ApiResponse<{ projects: Project[]; pagination: { pages: number } }> =
        await searchProjects(
          query || searchQuery,
          selectedYear ? Number(selectedYear) : undefined,
          selectedDepartment || undefined,
          page
        );
      if (response.data) {
        setProjects(response.data.projects);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedYear('');
    setSelectedDepartment('');
    loadProjects(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-dark-gray border-b border-medium-gray py-8 md:py-12">
          <div className="container-responsive">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">
              Project Repository
            </h1>
            <p className="text-text-gray">Browse all uploaded research projects</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container-responsive">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:col-span-1">
                <div className="card p-6 sticky top-24">
                  <h3 className="font-poppins font-bold text-white mb-4">Filters</h3>

                  {/* Search Form */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none text-sm"
                    />
                    <button
                      type="submit"
                      className="btn-primary w-full mt-3 text-sm"
                    >
                      Search
                    </button>
                  </form>

                  {/* Year Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-light-gray mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value ? Number(e.target.value) : '');
                      }}
                      className="w-full px-3 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none text-sm"
                    >
                      <option value="">All Years</option>
                      {YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-light-gray mb-2">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-medium-gray border border-medium-gray text-light-gray rounded-lg focus:border-primary-orange focus:outline-none text-sm"
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={handleClearFilters}
                    className="btn-secondary w-full text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </aside>

              {/* Projects Grid */}
              <div className="lg:col-span-3">
                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-text-gray text-sm">
                    Found {projects.length} result{projects.length !== 1 ? 's' : ''}
                  </p>
                  <span className="text-primary-orange font-bold">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Projects */}
                <ProjectGrid
                  projects={projects}
                  onViewDetails={(id) => router.push(`/project/${id}`)}
                  isLoading={isLoading}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => loadProjects(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn-secondary px-4 py-2 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage - 2 + i;
                      if (page >= 1 && page <= totalPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => loadProjects(page)}
                            className={`px-3 py-2 rounded ${
                              page === currentPage
                                ? 'btn-primary'
                                : 'btn-secondary'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => loadProjects(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn-secondary px-4 py-2 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
