import Hero from "@/components/home/Hero";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import ProjectList from "@/components/projects/ProjectList";
import BlogList from "@/components/blogs/BlogList";

export const revalidate = 3600;

async function getLatestProjects() {
  try {
    const result = await db.select({
      id: projectsSchema.id,
      title: projectsSchema.title,
      slug: projectsSchema.slug,
      excerpt: projectsSchema.excerpt,
      cover_image_url: projectsSchema.coverImageUrl,
      technologies: projectsSchema.technologies,
      github_link: projectsSchema.githubLink,
      demo_link: projectsSchema.demoLink,
    }).from(projectsSchema).where(eq(projectsSchema.isPublished, true)).orderBy(desc(projectsSchema.publishedAt)).limit(3);
    return result as any[];
  } catch {
    return [];
  }
}

async function getLatestBlogs() {
  try {
    const result = await db.select({
      id: blogsSchema.id,
      title: blogsSchema.title,
      slug: blogsSchema.slug,
      excerpt: blogsSchema.excerpt,
      cover_image_url: blogsSchema.coverImageUrl,
      published_at: blogsSchema.publishedAt,
      stars: blogsSchema.stars,
    }).from(blogsSchema).where(eq(blogsSchema.isPublished, true)).orderBy(desc(blogsSchema.publishedAt)).limit(3);
    return result as any[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [projects, blogs] = await Promise.all([
    getLatestProjects(),
    getLatestBlogs()
  ]);

  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <div className="px-4 md:px-6 py-12 w-full flex flex-col gap-12 md:gap-16 relative z-10">
        <section className="manga-panel bg-background p-6 md:p-12 panel-skew-2 relative overflow-hidden">
          <div className="screentone-lines absolute inset-0 opacity-[0.04] pointer-events-none z-0" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-[6px] border-border-primary pb-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black kinetic-text tracking-tight mb-2">Recent Writings</h2>
                <p className="text-text-primary font-bold uppercase tracking-widest text-sm bg-foreground text-background inline-block px-2 py-1 transform -rotate-1">Thoughts on engineering, AI, and software development.</p>
              </div>
              <Link 
                href="/blogs" 
                className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-wider text-background bg-foreground px-4 py-2 border-[3px] border-border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--border-primary)] transition-all group"
              >
                View all posts
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {blogs.length > 0 ? (
            <BlogList initialBlogs={blogs} hideSearch />
          ) : (
            <p className="text-text-muted">No posts to show.</p>
          )}
          
            <div className="mt-10 flex justify-center md:hidden">
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-background bg-foreground px-6 py-3 border-[3px] border-border-primary shadow-[4px_4px_0px_0px_var(--border-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              >
                View all posts
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="manga-panel bg-background p-6 md:p-12 panel-skew-1 relative overflow-hidden">
          <div className="screentone-dots absolute inset-0 opacity-[0.04] pointer-events-none z-0" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-[6px] border-border-primary pb-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black kinetic-text tracking-tight mb-2">Featured Projects</h2>
                <p className="text-text-primary font-bold uppercase tracking-widest text-sm bg-foreground text-background inline-block px-2 py-1 transform rotate-1">Some of the things I've been working on recently.</p>
              </div>
              <Link 
                href="/projects" 
                className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-wider text-background bg-foreground px-4 py-2 border-[3px] border-border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--border-primary)] transition-all group"
              >
                View all projects
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {projects.length > 0 ? (
            <ProjectList initialProjects={projects} hideSearch />
          ) : (
            <p className="text-text-muted">No projects to show.</p>
          )}
          
            <div className="mt-10 flex justify-center md:hidden">
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-background bg-foreground px-6 py-3 border-[3px] border-border-primary shadow-[4px_4px_0px_0px_var(--border-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              >
                View all projects
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
