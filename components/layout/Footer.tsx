import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { projects as projectsSchema, blogs as blogsSchema, socials as socialsSchema } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { SocialIcon } from "@/components/SocialIcons";

const pageLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

const MAX_ITEMS = 4;

interface SlimItem {
  title: string;
  slug: string;
}

async function getPublishedProjects(): Promise<SlimItem[]> {
  try {
    const rows = await db
      .select({ title: projectsSchema.title, slug: projectsSchema.slug })
      .from(projectsSchema)
      .where(eq(projectsSchema.isPublished, true))
      .orderBy(desc(projectsSchema.publishedAt))
      .limit(6);
    return rows as SlimItem[];
  } catch {
    return [];
  }
}

async function getPublishedBlogs(): Promise<SlimItem[]> {
  try {
    const rows = await db
      .select({ title: blogsSchema.title, slug: blogsSchema.slug })
      .from(blogsSchema)
      .where(eq(blogsSchema.isPublished, true))
      .orderBy(desc(blogsSchema.publishedAt))
      .limit(6);
    return rows as SlimItem[];
  } catch {
    return [];
  }
}

async function getSocials() {
  try {
    const rows = await db
      .select({ name: socialsSchema.name, url: socialsSchema.url })
      .from(socialsSchema)
      .orderBy(socialsSchema.displayOrder);
    return rows as { name: string; url: string }[];
  } catch {
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
  const visibleBlogs = blogs.slice(0, MAX_ITEMS);

  return (
    <footer className="w-full bg-footer-bg border-t border-border-primary mt-auto">
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-14 md:py-16">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-full overflow-hidden border border-border-primary">
                <Image
                  src="/Logo.svg"
                  alt="Logo"
                  fill
                  className="object-cover dark:invert transition-all"
                  sizes="36px"
                />
              </div>
              <span className="font-handwriting text-2xl font-semibold tracking-wide text-foreground">
                Shreyash Swami
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed max-w-xs">
              Full-stack developer building thoughtful digital experiences, scalable backends, and AI interfaces.
            </p>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-border-primary bg-background/60 hover:bg-hover-bg text-text-secondary hover:text-foreground transition-colors"
                    title={social.name}
                  >
                    <SocialIcon name={social.name} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {pageLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-text-secondary hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Selected Projects
            </h4>
            {visibleProjects.length === 0 ? (
              <p className="text-xs text-text-muted">Coming soon</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {visibleProjects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs text-text-secondary hover:text-foreground transition-colors line-clamp-1"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/projects"
                    className="text-xs font-medium text-text-muted hover:text-foreground transition-colors"
                  >
                    View all projects &rarr;
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Writings Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
              Recent Writings
            </h4>
            {visibleBlogs.length === 0 ? (
              <p className="text-xs text-text-muted">Coming soon</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {visibleBlogs.map((blog) => (
                  <li key={blog.slug}>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-xs text-text-secondary hover:text-foreground transition-colors line-clamp-1"
                    >
                      {blog.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/blogs"
                    className="text-xs font-medium text-text-muted hover:text-foreground transition-colors"
                  >
                    Read all posts &rarr;
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-primary/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>
            &copy; {new Date().getFullYear()} Shreyash Swami. Crafted with minimalism &amp; care.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/sitemap" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <a
              href="#top"
              className="hover:text-foreground transition-colors"
            >
              Back to top &uarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
