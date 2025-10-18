'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const averageRating = project.ratings && project.ratings.length > 0
    ? (project.ratings.reduce((a: number, b: number) => a + b, 0) / project.ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div
      className="card p-5 md:p-6 cursor-pointer group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm md:text-base font-poppins font-bold text-white group-hover:text-primary-orange transition line-clamp-2">
            {project.title}
          </h3>
          <span className="badge-orange text-xs whitespace-nowrap">
            {project.year}
          </span>
        </div>
        <p className="text-xs md:text-sm text-text-gray">{project.author}</p>
      </div>

      {/* Department */}
      <div className="mb-3">
        <span className="badge text-xs">{project.department}</span>
      </div>

      {/* Abstract */}
      <p className="text-xs md:text-sm text-light-gray mb-4 line-clamp-3 leading-relaxed">
        {truncateText(project.abstract, 150)}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs md:text-sm">
        <div className="bg-medium-gray rounded p-2">
          <p className="text-text-gray">Views</p>
          <p className="text-primary-orange font-bold">{project.views || 0}</p>
        </div>
        <div className="bg-medium-gray rounded p-2">
          <p className="text-text-gray">Downloads</p>
          <p className="text-primary-orange font-bold">{project.downloads || 0}</p>
        </div>
        <div className="bg-medium-gray rounded p-2">
          <p className="text-text-gray">Rating</p>
          <p className="text-primary-orange font-bold">⭐ {averageRating}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-medium-gray">
        <span className="text-xs text-text-gray">
          Supervisor: {project.supervisor}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onViewDetails(project._id)}
        className={`btn-primary w-full mt-4 text-sm transition-all ${
          isHovered ? 'scale-105' : ''
        }`}
      >
        View Details →
      </button>
    </div>
  );
};

interface ProjectGridProps {
  projects: Project[];
  onViewDetails: (id: string) => void;
  isLoading?: boolean;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onViewDetails,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid-responsive">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-80 skeleton rounded-lg" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-gray text-lg">No projects found</p>
        <p className="text-sm text-text-gray mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid-responsive">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
