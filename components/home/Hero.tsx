import Image from "next/image";
import Link from "next/link";
import { getGithubStats } from "@/lib/github";
import { FaGithub, FaStar, FaCodeBranch, FaUsers } from "react-icons/fa6";
import { FiGitCommit, FiArrowUpRight, FiArrowRight, FiCode, FiLayers, FiCpu } from "react-icons/fi";

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

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Drizzle ORM",
  "Tailwind CSS",
  "AI SDK",
  "Docker",
];

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
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-6 md:px-12 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* ── Artistic Starry Background Image with Seamless Bottom Fade ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px] sm:h-[780px] md:h-[900px] overflow-hidden z-0"
        aria-hidden="true"
      >
        <Image
          src="/IMG_20251004_112513486.jpg.jpeg"
          alt="Artistic starry night background"
          fill
          priority
          className="object-cover object-top opacity-20 dark:opacity-45 filter contrast-[1.1] saturate-[0.85] select-none"
          sizes="100vw"
        />

        {/* Top subtle vignette so the fixed navbar is clean and legible */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent" />

        {/* Deep, gentle fade merging seamlessly into the page background below */}
        <div className="absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-t from-background via-background/85 to-transparent" />

        {/* Soft radial aura to focus light on center */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-background/50" />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-border-primary bg-background/70 backdrop-blur-md text-text-secondary mb-6 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Available for new opportunities</span>
        </div>

        {/* Handwritten Main Artist Headline */}
        <div className="max-w-3xl flex flex-col items-center">
          <h1 className="font-handwriting text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-wide leading-none mb-6 select-none">
            <span className="text-foreground">Shreyash</span>{" "}
            <span className="text-[#ff7a59] dark:text-[#ff8f73] inline-block transform -rotate-1 transition-colors">
              Swami
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-normal text-text-secondary leading-relaxed tracking-tight max-w-2xl mb-8">
            Full-stack developer building thoughtful digital experiences, scalable systems, and intelligent tools.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-foreground text-background hover:opacity-90 transition-all shadow-xs"
            >
              Explore Projects
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border border-border-primary bg-background/80 backdrop-blur-xs hover:bg-hover-bg text-foreground transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="https://github.com/Shreyash0712"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-foreground transition-all"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub</span>
              <FiArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Tech Stack Strip */}
        <div className="w-full max-w-4xl pt-8 pb-10 border-t border-border-primary/50 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.16em] text-text-muted font-medium mb-4">
            Core Technologies &amp; Ecosystem
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-hover-bg/70 backdrop-blur-xs text-text-secondary border border-border-primary/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bento Showcase Section (Live Stats or Curated Showcase) */}
        <div className="w-full max-w-5xl mt-2 text-left">
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
      </div>
    </section>
  );
}
