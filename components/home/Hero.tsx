import Link from "next/link";
import { getGithubStats } from "@/lib/github";
import HeroArtisticBackground from "@/components/home/HeroArtisticBackground";
// Preserved: Previous background experiments (available to switch back anytime)
// import HeroReactiveBackground from "@/components/home/HeroReactiveBackground";
// import HeroBackground from "@/components/home/HeroBackground";
import { FaGithub, FaStar, FaCodeBranch, FaUsers } from "react-icons/fa6";
import {
  FiGitCommit,
  FiArrowUpRight,
  FiCode,
  FiLayers,
  FiCpu,
} from "react-icons/fi";

const heroNavLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GithubStatsData {
  followers: number;
  totalStars: number;
  totalRepos: number;
  totalPRs: number;
  commits: number;
  contributedTo: number;
  linesOfCode: number;
  calendar: ContributionWeek[];
}

export default async function Hero() {
  const token = process.env.GITHUB_TOKEN;
  let stats: GithubStatsData | null = null;

  if (token) {
    try {
      const result = await getGithubStats(token, "Shreyash0712");
      stats = result as unknown as GithubStatsData;
    } catch {
      stats = null;
    }
  }

  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center">
      {/* ── Artistic Minimalist Nature Art Background (Zero-Lag, Dual-Mode) ── */}
      <HeroArtisticBackground />

      {/* ── First Viewport: Full-Page Hero Presentation ── */}
      <div className="min-h-screen min-h-svh w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col justify-center relative z-10 pt-20 sm:pt-24 md:pt-16 pb-12 sm:pb-16">
        {/* Main Content: Headline on Left, Stylized Handwritten Links on Right */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between justify-between my-auto gap-8 sm:gap-12 pt-4 md:pt-0">
          {/* Left: Main Artist Headline (distinct lines across mobile and desktop) */}
          <div className="flex flex-col items-start text-left select-none">
            <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-wide leading-[0.92] sm:leading-[0.95] text-left">
              <span className="block text-foreground">Shreyash</span>
              <span className="block text-[#ff7a59] dark:text-[#ff8f73] transform -rotate-1 transition-colors mt-0.5 sm:mt-1 md:mt-2">
                Swami
              </span>
            </h1>
          </div>

          {/* Right: Modern, Creative Handwritten Navigation */}
          <nav
            aria-label="Hero navigation"
            className="flex flex-col items-start md:items-end justify-center gap-2.5 sm:gap-3.5 md:gap-5 lg:gap-6"
          >
            {heroNavLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-2 sm:gap-3 font-handwriting text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide text-foreground/80 dark:text-foreground/85 hover:text-[#ff7a59] dark:hover:text-[#ff8f73] transition-all duration-300 md:hover:-translate-x-3 hover:translate-x-2 select-none"
              >
                <span className="relative">
                  {label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#ff7a59] dark:bg-[#ff8f73] transition-all duration-300 group-hover:w-full rounded-full" />
                </span>
                <FiArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-[#ff7a59] dark:text-[#ff8f73]" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Below The Fold: Bento Grid & Contributions (Visible on Scroll) ── */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 relative z-10 pt-16 pb-24 text-left">
        {stats ? (
          /* Live GitHub Stats Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 28-day Commits Panel */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-2">
                  <span className="flex items-center gap-1.5">
                    <FiGitCommit className="w-4 h-4 text-emerald-500" />
                    Commit Activity
                  </span>
                  <span>Last 28 Days</span>
                </div>
                <div className="text-3xl font-semibold text-foreground tracking-tight">
                  {stats.commits.toLocaleString()} contributions
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="mt-8 pt-4 border-t border-border-primary/40">
                <div className="flex items-end gap-1 h-20">
                  {(() => {
                    const allDays = stats.calendar.flatMap((week) => week.contributionDays);
                    const last28Days = allDays.slice(-28);

                    return last28Days.map((day, i) => {
                      const count = day.contributionCount;
                      const heightPercent = count === 0 ? 8 : Math.max(20, Math.min(100, (count / 6) * 100));
                      const dateObj = new Date(day.date);
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div key={i} className="relative flex-1 group/bar h-full flex items-end">
                          <div
                            className={`w-full rounded-xs transition-colors duration-200 cursor-pointer ${
                              count === 0
                                ? "bg-hover-bg group-hover/bar:bg-text-muted/40"
                                : "bg-emerald-500/80 group-hover/bar:bg-emerald-400"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-background text-foreground border border-border-primary text-[11px] whitespace-nowrap rounded-md opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none z-50 shadow-md">
                            <span className="font-medium">{count} commits</span>
                            <span className="text-text-muted block text-[10px]">{formattedDate}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Total Stars */}
            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <FaStar className="w-3.5 h-3.5 text-amber-500" />
                  GitHub Stars
                </span>
              </div>
              <div>
                <div className="text-3xl font-semibold text-foreground tracking-tight">
                  {stats.totalStars.toLocaleString()}
                </div>
                <p className="text-xs text-text-muted mt-1">Earned across public repos</p>
              </div>
            </div>

            {/* Repositories */}
            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <FaGithub className="w-3.5 h-3.5 text-foreground" />
                  Repositories
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-hover-bg text-text-secondary">
                  +{stats.contributedTo} contrib
                </span>
              </div>
              <div>
                <div className="text-3xl font-semibold text-foreground tracking-tight">
                  {stats.totalRepos.toLocaleString()}
                </div>
                <p className="text-xs text-text-muted mt-1">Open source projects</p>
              </div>
            </div>

            {/* Pull Requests */}
            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <FaCodeBranch className="w-3.5 h-3.5 text-purple-500" />
                  Pull Requests
                </span>
              </div>
              <div>
                <div className="text-3xl font-semibold text-foreground tracking-tight">
                  {stats.totalPRs.toLocaleString()}
                </div>
                <p className="text-xs text-text-muted mt-1">Merged &amp; contributed</p>
              </div>
            </div>

            {/* Community / Followers */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-hover-bg text-foreground">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Open Source Community</h3>
                  <p className="text-xs text-text-muted">
                    Connecting with developers worldwide on GitHub
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-semibold text-foreground">{stats.followers}</span>
                  <span className="text-xs text-text-muted block">Followers</span>
                </div>
                <Link
                  href="https://github.com/Shreyash0712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  Follow
                  <FiArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Elegant Fallback Showcase (When offline or token is not configured) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-hover-bg flex items-center justify-center text-foreground mb-4">
                  <FiLayers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Modern Web Architecture</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Building reactive, accessible, and fast web applications using Next.js App Router, React Server Components, and optimized APIs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-primary/40 flex items-center gap-2 text-xs text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Next.js &amp; React 19
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-hover-bg flex items-center justify-center text-foreground mb-4">
                  <FiCpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Intelligent AI Tooling</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Integrating modern LLM frameworks, vector search, embeddings, and context-aware chat agents directly into production workflows.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-primary/40 flex items-center gap-2 text-xs text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Vercel AI SDK &amp; Neon
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border-primary bg-background/70 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-hover-bg flex items-center justify-center text-foreground mb-4">
                  <FiCode className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Clean Software Design</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Strong focus on maintainability, type safety, modular design patterns, clean database schemas, and developer ergonomics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-primary/40 flex items-center justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  TypeScript &amp; Drizzle
                </span>
                <Link
                  href="https://github.com/Shreyash0712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline inline-flex items-center gap-0.5"
                >
                  GitHub
                  <FiArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
