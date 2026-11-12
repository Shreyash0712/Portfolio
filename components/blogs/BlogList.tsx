"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiArrowRight, FiCalendar } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
  stars?: number;
}

interface BlogListProps {
  initialBlogs: Blog[];
  hideSearch?: boolean;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogList({ initialBlogs, hideSearch = false }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = initialBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = blog.title.toLowerCase().includes(query);
    const excerptMatch = blog.excerpt?.toLowerCase().includes(query) || false;

    return titleMatch || excerptMatch;
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
              placeholder="Search articles by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl border border-border-primary bg-background/50">
          <p className="text-text-muted text-sm">No articles found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs text-foreground underline underline-offset-4 hover:text-text-secondary cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group flex flex-col rounded-2xl border border-border-primary bg-background/50 overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image (if available) */}
              {blog.cover_image_url && (
                <div className="relative aspect-[16/10] bg-hover-bg overflow-hidden border-b border-border-primary/40">
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {formatDate(blog.published_at)}
                  </span>
                  {blog.stars !== undefined && blog.stars > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                      <FaStar className="w-3 h-3" />
                      {blog.stars}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug group-hover:text-text-secondary transition-colors mb-2">
                  {blog.title}
                </h3>

                {blog.excerpt && (
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed flex-1 mb-4">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mt-auto pt-4 border-t border-border-primary/40">
                  <span>Read article</span>
                  <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
