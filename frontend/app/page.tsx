'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/Layout';
import { ProjectGrid } from '@/components/ProjectCard';
import { fetchProjects } from '@/lib/api';
import { Project, ApiResponse } from '@/lib/types';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  const loadFeaturedProjects = async () => {
    try {
      const response: ApiResponse<{ projects: Project[] }> = await fetchProjects(1);
      if (response.data) {
        setFeaturedProjects(response.data.projects.slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Clean & Professional */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-orange/10 via-transparent to-transparent" />
          <div className="container-responsive relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white mb-6 leading-tight">
                Department of Surveying & Geoinformatics
              </h1>
              <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-primary-orange mb-6">
                Research Project Repository
              </h2>
              <p className="text-base md:text-lg text-text-gray mb-12 leading-relaxed max-w-2xl mx-auto">
                Explore final-year research projects from our department. Search our comprehensive database of student research, 
                upload your own work, and contribute to our academic community.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <button
                  onClick={() => router.push('/repository')}
                  className="btn-primary px-8 py-3 md:py-4 text-base md:text-lg font-semibold"
                >
                  Browse Repository
                </button>
                <button
                  onClick={() => router.push('/upload')}
                  className="btn-secondary px-8 py-3 md:py-4 text-base md:text-lg font-semibold"
                >
                  Submit Your Project
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 md:py-24 bg-dark-gray">
          <div className="container-responsive">
            <div className="mb-12">
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4">
                Latest Projects
              </h3>
              <p className="text-text-gray text-lg">Recently approved research submissions</p>
            </div>
            <ProjectGrid
              projects={featuredProjects}
              onViewDetails={(id) => router.push(`/project/${id}`)}
              isLoading={isLoading}
            />
            <div className="mt-12 text-center">
              <button
                onClick={() => router.push('/repository')}
                className="text-primary-orange hover:text-accent-orange font-semibold text-lg transition"
              >
                View All Projects →
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
