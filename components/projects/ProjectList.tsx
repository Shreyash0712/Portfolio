"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { FiArrowUpRight, FiSearch, FiArrowRight } from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  technologies: string[] | null;
  github_link: string | null;
  demo_link: string | null;
}

interface ProjectListProps {
  initialProjects: Project[];
  hideSearch?: boolean;
}

export default function ProjectList({ initialProjects, hideSearch = false }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = initialProjects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(query);
    const excerptMatch = project.excerpt?.toLowerCase().includes(query) || false;
    const techMatch = project.technologies?.some((tech) => tech.toLowerCase().includes(query)) || false;

    return titleMatch || excerptMatch || techMatch;
  });

  return (
    <>
      {!hideSearch && (
        <div className="mb-10 max-w-md">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-foreground transition-colors">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground bg-hover-bg/60 border border-border-primary rounded-xl focus:bg-background focus:border-foreground/40 focus:outline-hidden transition-all placeholder:text-text-muted"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl border border-border-primary bg-background/50">
          <p className="text-text-muted text-sm">No projects found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs text-foreground underline underline-offset-4 hover:text-text-secondary cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col rounded-2xl border border-border-primary bg-background/50 overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <Link
                href={`/projects/${project.slug}`}
                className="block relative aspect-[16/10] bg-hover-bg overflow-hidden"
              >
                {project.cover_image_url ? (
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted/30">
                    <span className="text-4xl font-light tracking-tight">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </Link>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-text-secondary bg-hover-bg px-2.5 py-0.5 rounded-full border border-border-primary/50"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-medium text-text-muted bg-hover-bg px-2 py-0.5 rounded-full">
                      Project
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="block group-hover:text-text-secondary transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug">
                    {project.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                {project.excerpt && (
                  <p className="text-xs text-text-muted line-clamp-2 mt-2 mb-4 leading-relaxed flex-1">
                    {project.excerpt}
                  </p>
                )}

                {/* Card Footer Links */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border-primary/50 text-xs">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-foreground transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-foreground transition-colors"
                    >
                      <span>Live Demo</span>
                      <FiArrowUpRight className="w-3 h-3 opacity-70" />
                    </a>
                  )}
                  {!project.github_link && !project.demo_link && (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-text-secondary hover:text-foreground transition-colors"
                    >
                      <span>View details</span>
                      <FiArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
