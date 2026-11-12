import Hero from "@/components/home/Hero";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import ProjectList from "@/components/projects/ProjectList";
import BlogList from "@/components/blogs/BlogList";
import { FiArrowRight } from "react-icons/fi";

export const revalidate = 3600;

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  technologies: string[] | null;
  github_link: string | null;
  demo_link: string | null;
}

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string;
  stars: number;
}

async function getLatestProjects(): Promise<ProjectItem[]> {
  try {
    const result = await db
      .select({
        id: projectsSchema.id,
        title: projectsSchema.title,
        slug: projectsSchema.slug,
        excerpt: projectsSchema.excerpt,
        cover_image_url: projectsSchema.coverImageUrl,
        technologies: projectsSchema.technologies,
        github_link: projectsSchema.githubLink,
        demo_link: projectsSchema.demoLink,
      })
      .from(projectsSchema)
      .where(eq(projectsSchema.isPublished, true))
      .orderBy(desc(projectsSchema.publishedAt))
      .limit(3);
    return result as unknown as ProjectItem[];
  } catch {
    return [];
  }
}

async function getLatestBlogs(): Promise<BlogItem[]> {
  try {
    const result = await db
      .select({
        id: blogsSchema.id,
        title: blogsSchema.title,
        slug: blogsSchema.slug,
        excerpt: blogsSchema.excerpt,
        cover_image_url: blogsSchema.coverImageUrl,
        published_at: blogsSchema.publishedAt,
        stars: blogsSchema.stars,
      })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(3);
    return result as unknown as BlogItem[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [projects, blogs] = await Promise.all([
    getLatestProjects(),
    getLatestBlogs(),
  ]);

  return (
    <main className="flex flex-col flex-1 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Sections */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-24">
        {/* Featured Projects Section */}
        <section id="projects" className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-border-primary/60 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted font-medium block mb-1">
                Selected Work
              </span>
              <h2 className="font-handwriting text-4xl sm:text-5xl font-semibold tracking-wide text-foreground">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-foreground transition-colors group"
            >
              <span>View all projects</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <ProjectList initialProjects={projects} hideSearch />
          ) : (
            <div className="rounded-2xl border border-border-primary p-12 text-center bg-background/50">
              <p className="text-sm text-text-muted mb-4">
                Projects are currently being updated in the database.
              </p>
              <Link
                href="https://github.com/Shreyash0712"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-border-primary hover:bg-hover-bg transition-colors"
              >
                Browse repositories on GitHub
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Recent Writings / Blog Section */}
        <section id="blogs" className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-border-primary/60 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted font-medium block mb-1">
                Notes &amp; Insights
              </span>
              <h2 className="font-handwriting text-4xl sm:text-5xl font-semibold tracking-wide text-foreground">
                Recent Writings
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary hover:text-foreground transition-colors group"
            >
              <span>Read all articles</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {blogs.length > 0 ? (
            <BlogList initialBlogs={blogs} hideSearch />
          ) : (
            <div className="rounded-2xl border border-border-primary p-12 text-center bg-background/50">
              <p className="text-sm text-text-muted mb-4">
                Articles and tech notes will be published soon.
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-border-primary hover:bg-hover-bg transition-colors"
              >
                Visit blog archive
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Minimal Collaboration Callout Banner */}
        <section className="relative rounded-3xl border border-border-primary bg-background/60 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden shadow-xs">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted font-medium block mb-2">
              Let&apos;s Connect
            </span>
            <h3 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-foreground mb-3 leading-snug">
              Have a project in mind or want to collaborate?
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              I&apos;m always open to discussing new opportunities, full-stack architecture, or creative development work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Get in Touch
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border border-border-primary hover:bg-hover-bg text-foreground transition-colors"
            >
              View Resume
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
