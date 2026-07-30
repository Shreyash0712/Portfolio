import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema, socials as socialsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { SocialIcon } from "@/components/SocialIcons";

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

const MAX_ITEMS = 5;

interface SlimItem {
  title: string;
  slug: string;
}

async function getPublishedProjects(): Promise<SlimItem[]> {
  try {
    const rows = await db.select({ title: projectsSchema.title, slug: projectsSchema.slug })
      .from(projectsSchema)
      .where(eq(projectsSchema.isPublished, true))
      .orderBy(desc(projectsSchema.publishedAt))
      .limit(6);
    return rows as SlimItem[];
  } catch (err) {
    console.error("Footer: Failed to fetch projects", err);
    return [];
  }
}

async function getPublishedBlogs(): Promise<SlimItem[]> {
  try {
    const rows = await db.select({ title: blogsSchema.title, slug: blogsSchema.slug })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(6);
    return rows as SlimItem[];
  } catch (err) {
    console.error("Footer: Failed to fetch blogs", err);
    return [];
  }
}

async function getSocials() {
  try {
    const rows = await db.select({ name: socialsSchema.name, url: socialsSchema.url })
      .from(socialsSchema)
      .orderBy(socialsSchema.displayOrder);
    return rows as { name: string; url: string }[];
  } catch (err) {
    console.error("Footer: Failed to fetch socials", err);
    return [];
  }
}

export default async function Footer() {
  const [projects, blogs, socials] = await Promise.all([
    getPublishedProjects(),
    getPublishedBlogs(),
    getSocials(),
  ]);

  const visibleProjects = projects.slice(0, MAX_ITEMS);
  const hasMoreProjects = projects.length > MAX_ITEMS;

  const visibleBlogs = blogs.slice(0, MAX_ITEMS);
  const hasMoreBlogs = blogs.length > MAX_ITEMS;

  return (
    <footer className="w-full bg-footer-bg border-t-[6px] border-border-primary relative overflow-hidden">
      <div className="screentone-dots opacity-5" />
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16 relative z-10">

        {/* TO BE CONTINUED Banner */}
        <div className="w-full flex justify-center mb-16 relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-4 border-border-primary"></div>
          <div className="bg-footer-bg px-8 relative z-10 flex flex-col items-center">
             <div className="border-[4px] border-border-primary bg-background px-6 py-3 shadow-[8px_8px_0px_0px_var(--border-primary)] transform -rotate-2 hover:rotate-0 transition-transform">
               <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">
                 To Be Continued...
               </h2>
             </div>
          </div>
        </div>

        {/* Top section: Logo + columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Brand */}
          <div className="flex-shrink-0 flex flex-col items-start gap-4">
            <Link href="/" className="">
              <div className="relative h-16 w-16 md:h-20 md:w-20">
                <Image
                  src="/Logo.svg"
                  alt="Logo"
                  fill
                  className="rounded-full object-cover dark:invert transition-all duration-300"
                  priority
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
            </Link>
            <p className="text-sm text-text-muted max-w-[200px] leading-relaxed">
              Lost among the stars, I found myself.
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-1">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-background text-text-primary border-[3px] border-border-primary hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--border-primary)] hover:bg-[var(--accent-manga-magenta)] hover:text-white transition-all duration-200 flex items-center justify-center manga-panel"
                    title={social.name}
                  >
                    <SocialIcon name={social.name} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:ml-auto">

            {/* Pages */}
            <div className="min-w-[120px]">
              <p className="text-xs font-black uppercase tracking-widest text-text-primary mb-5 kinetic-text-sub">
                Pages
              </p>
              <ul className="flex flex-col gap-2.5">
                {pageLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                    >
                      {label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div className="min-w-[140px]">
              <p className="text-xs font-black uppercase tracking-widest text-text-primary mb-5 kinetic-text-sub">
                Projects
              </p>
              {visibleProjects.length === 0 ? (
                <p className="text-sm text-text-muted italic">No projects yet</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {visibleProjects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                      >
                        {project.title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                  {hasMoreProjects && (
                    <li className="mt-1">
                      <Link
                        href="/projects"
                        className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                      >
                        More <span className="text-xs">→</span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Blog */}
            <div className="min-w-[140px]">
              <p className="text-xs font-black uppercase tracking-widest text-text-primary mb-5 kinetic-text-sub">
                Blog
              </p>
              {visibleBlogs.length === 0 ? (
                <p className="text-sm text-text-muted italic">No posts yet</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {visibleBlogs.map((blog) => (
                    <li key={blog.slug}>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 flex items-center gap-0.5 group"
                      >
                        {blog.title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs leading-none">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                  {hasMoreBlogs && (
                    <li className="mt-1">
                      <Link
                        href="/blogs"
                        className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                      >
                        More <span className="text-xs">→</span>
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t-[4px] border-border-primary" />

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-text-primary font-bold uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} Shreyash Swami. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link href="/sitemap" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
