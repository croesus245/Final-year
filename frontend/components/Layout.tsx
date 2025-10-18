'use client';

import React from 'react';

interface HeaderProps {
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showNav = true }) => {
  return (
    <header className="sticky top-0 z-50 bg-matte-black border-b border-medium-gray shadow-soft">
      <div className="container-responsive py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-lg">📚</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-poppins font-bold text-lg md:text-xl">
                Final-Year Repository
              </h1>
              <p className="text-xs md:text-sm text-text-gray">
                Dept. of Surveying & Geoinformatics
              </p>
            </div>
          </div>

          {/* Navigation */}
          {showNav && (
            <nav className="flex items-center gap-2 md:gap-4">
              <a
                href="/"
                className="text-sm md:text-base text-light-gray hover:text-primary-orange transition px-2 md:px-4 py-2 rounded hover:bg-medium-gray"
              >
                Home
              </a>
              <a
                href="/repository"
                className="text-sm md:text-base text-light-gray hover:text-primary-orange transition px-2 md:px-4 py-2 rounded hover:bg-medium-gray"
              >
                Browse
              </a>
              <a
                href="/upload"
                className="btn-primary text-xs md:text-sm"
              >
                Upload
              </a>
              <a
                href="/admin"
                className="btn-secondary text-xs md:text-sm"
              >
                Admin
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-gray border-t border-medium-gray py-8 md:py-12">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-poppins font-bold mb-4">
              About Repository
            </h3>
            <p className="text-text-gray text-sm leading-relaxed">
              A comprehensive platform for students to upload, share, and showcase their
              final-year research projects and academic papers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-poppins font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-text-gray">
              <li>
                <a href="/" className="hover:text-primary-orange transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/repository" className="hover:text-primary-orange transition">
                  Browse Projects
                </a>
              </li>
              <li>
                <a href="/upload" className="hover:text-primary-orange transition">
                  Submit Project
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-poppins font-bold mb-4">Support</h3>
            <p className="text-text-gray text-sm">
              For technical support or inquiries:
              <br />
              <a
                href="mailto:support@university.edu"
                className="text-primary-orange hover:text-secondary-orange transition"
              >
                support@university.edu
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-medium-gray mt-8 pt-8 text-center text-text-gray text-sm">
          <p>
            &copy; {currentYear} Final-Year Project Repository. All rights reserved. |
            Department of Surveying & Geoinformatics
          </p>
        </div>
      </div>
    </footer>
  );
};
