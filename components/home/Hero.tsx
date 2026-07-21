import { getGithubStats } from "@/lib/github";
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFileCode } from "react-icons/fa6";
import { FiGitCommit } from "react-icons/fi";

export default async function Hero() {
  const token = process.env.GITHUB_TOKEN;
  let stats = null;
  let error = null;

  try {
    if (token) {
      stats = await getGithubStats(token, "Shreyash0712");
    } else {
      error = "GitHub token not configured";
    }
  } catch (e: any) {
    error = e.message || "Failed to load GitHub stats";
  }

  return (
    <section className="pb-6 md:pb-12 flex-1 flex flex-col items-center relative overflow-hidden">
      <div className="speed-lines-bg" />
      <div className="w-full flex-1 flex flex-col">
        {/* Intro */}
        <div className="pt-6 md:pt-10 mb-8 px-4 md:px-6 relative z-10 w-full">
          <div className="cursor-target manga-panel bg-background p-8 md:p-16 panel-skew-1 relative overflow-hidden flex flex-col items-center text-center">
            <div className="screentone-dots absolute inset-0 opacity-[0.05] pointer-events-none z-0" />
            <div className="relative z-10 flex flex-col items-center w-full px-2">
              <h1 className="text-[13vw] md:text-[8rem] leading-none kinetic-text manga-title-font mb-4 tracking-tighter w-full break-words">
                SHREYASH SWAMI
              </h1>
            </div>
          </div>
        </div>

        {/* GitHub Bento Grid (Manga Style - Full Width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(110px,auto)] p-4 md:p-8 bg-border-primary border-y-[6px] border-border-primary shadow-[0_12px_0px_0px_rgba(0,0,0,0.2)] w-full">
          {error && (
            <div className="col-span-full p-6 bg-background text-foreground border-[4px] border-border-primary flex items-center gap-3 panel-skew-1">
              <FaGithub className="text-xl" />
              <span className="font-bold uppercase tracking-wider">{error}</span>
            </div>
          )}

          {stats && (
            <>
              {/* Contributions Card - Large Splash Panel */}
              <div className="cursor-target col-span-1 md:col-span-2 row-span-3 manga-panel p-6 md:p-8 flex flex-col justify-between panel-skew-1 relative overflow-hidden bg-background">
                <div className="screentone-dots absolute inset-0 opacity-10 pointer-events-none z-0" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 mb-4 bg-foreground text-background px-4 py-2 border-[3px] border-border-primary transform -rotate-2">
                    <FiGitCommit className="text-xl" />
                    <h3 className="font-black tracking-widest text-sm uppercase">Commits Log</h3>
                  </div>
                  <div className="text-5xl md:text-7xl font-black tracking-tighter kinetic-text-sub mt-2">
                    {stats.commits.toLocaleString()}
                  </div>
                  <p className="text-background font-bold uppercase mt-2 text-sm bg-foreground inline-block px-2 border-2 border-border-primary">LAST 28 DAYS</p>
                </div>

                {/* Interactive Bar Chart Graph */}
                <div className="mt-8 flex items-end gap-1.5 flex-1 min-h-[120px]">
                  {/* The Graph */}
                  <div className="flex-1 flex items-end gap-[3px] h-full pt-4">
                    {(() => {
                      const allDays = stats.calendar.flatMap((week: any) => week.contributionDays);
                      const last28Days = allDays.slice(-28);

                      return last28Days.map((day: any, i: number) => {
                        const total = day.contributionCount;
                        
                        // 0 commits: tiny subtle bar. Active days: scale up to 6 commits max for clear variation
                        const height = total === 0 ? 4 : Math.max(15, Math.min(100, (total / 6) * 100));
                        
                        const dateObj = new Date(day.date);
                        const dayDate = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

                        // distinct colors for active vs inactive days
                        const barColor = total === 0 
                          ? "bg-hover-bg group-hover/bar:bg-border-primary" 
                          : "bg-border-primary group-hover/bar:bg-green-500 dark:group-hover/bar:bg-[var(--accent-green)]";

                        return (
                          <div key={i} className="cursor-target relative flex-1 group/bar h-full flex items-end">
                            <div
                              className={`w-full rounded-t-sm transition-all duration-300 cursor-pointer ${barColor}`}
                              style={{ height: `${height}%` }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-background text-foreground border border-border-primary text-xs whitespace-nowrap rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg flex flex-col items-center scale-95 group-hover/bar:scale-100">
                              <span className="font-semibold">{total} commits</span>
                              <span className="text-text-muted text-[10px]">{dayDate}</span>
                              {/* Tooltip Arrow */}
                              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-background border-b border-r border-border-primary transform rotate-45"></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="cursor-target col-span-1 md:col-span-1 row-span-1 manga-panel-interactive p-6 flex items-center justify-between panel-skew-2 bg-background relative overflow-hidden">
                <div className="screentone-lines absolute inset-0 opacity-10 pointer-events-none z-0" />
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-2xl" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Total Stars</h3>
                  </div>
                </div>
                <div className="relative z-10 text-4xl md:text-5xl font-black kinetic-text-sub">{stats.totalStars.toLocaleString()}</div>
              </div>

              {/* Followers */}
              <div className="cursor-target col-span-1 md:col-span-1 row-span-1 manga-panel-interactive p-6 flex items-center justify-between panel-skew-3 bg-background relative overflow-hidden">
                <div className="screentone-dots absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-2xl" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Followers</h3>
                  </div>
                </div>
                <div className="relative z-10 text-4xl md:text-5xl font-black kinetic-text-sub">{stats.followers.toLocaleString()}</div>
              </div>

              {/* PRs */}
              <div className="cursor-target col-span-1 md:col-span-1 row-span-1 manga-panel-interactive p-6 flex items-center justify-between panel-skew-1 bg-background relative overflow-hidden">
                <div className="screentone-lines absolute inset-0 opacity-[0.15] pointer-events-none z-0" />
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-2 bg-foreground text-background px-2 py-1 transform rotate-1">
                    <FaCodeBranch className="text-2xl" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Pull Requests</h3>
                  </div>
                </div>
                <div className="relative z-10 text-4xl md:text-5xl font-black kinetic-text-sub">{stats.totalPRs.toLocaleString()}</div>
              </div>

              {/* Repositories */}
              <div className="cursor-target col-span-1 md:col-span-1 row-span-2 manga-panel-interactive p-6 flex flex-col justify-center panel-skew-2 bg-background relative overflow-hidden">
                <div className="screentone-lines absolute inset-0 opacity-10 pointer-events-none z-0" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-1.5 border-[3px] border-border-primary self-start transform rotate-1">
                    <FaGithub className="text-xl" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Repositories</h3>
                  </div>
                  <div className="flex items-baseline gap-3 mt-2">
                    <div className="text-5xl md:text-6xl font-black kinetic-text-sub">{stats.totalRepos.toLocaleString()}</div>
                    <div className="text-xs font-black uppercase text-foreground bg-background border-[3px] border-border-primary px-3 py-1 shadow-[4px_4px_0px_0px_var(--text-muted)] transform -rotate-2">
                      Contrib: {stats.contributedTo.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lines of Code */}
              <div className="cursor-target col-span-1 md:col-span-2 row-span-1 manga-panel-interactive p-8 flex flex-col justify-center panel-skew-3 bg-foreground text-background text-center relative overflow-hidden">
                <div className="screentone-dots absolute inset-0 opacity-20 pointer-events-none z-0" style={{ filter: "invert(1)" }} />
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2 border-[3px] border-background transform -rotate-1 shadow-[6px_6px_0px_0px_var(--text-muted)]">
                    <FaFileCode className="text-xl" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Lines of Code Written</h3>
                  </div>
                  <div className="text-5xl md:text-7xl font-black truncate mt-4 tracking-tighter" style={{textShadow: '4px 4px 0px var(--text-muted)'}}>
                    ~{stats.linesOfCode.toLocaleString()}
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </section>
  );
}
