"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const currentPath = pathname || "/";
  const isHome = currentPath === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  // Helper to determine active link
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return currentPath === "/";
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  // Close menu on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Track scroll position to transition from transparent to frosted glass
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[72px] md:h-[80px] transition-all duration-300 ease-in-out ${
          isHome && !scrolled
            ? "bg-transparent border-b border-transparent md:-translate-y-full md:opacity-0 md:pointer-events-none"
            : "bg-background/80 backdrop-blur-md border-b border-border-primary/40 shadow-xs translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        {/* Clean Logo without enclosing circle */}
        <Link href="/" className="flex items-center group py-1" aria-label="Home">
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/Logo.svg"
              alt="Shreyash Swami Logo"
              fill
              className="object-contain dark:invert transition-all duration-300"
              priority
              sizes="56px"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-hover-bg/60 px-2.5 py-1.5 rounded-full border border-border-primary/40 backdrop-blur-xs shadow-xs">
          {links.map(({ label, href }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-200 ${
                  active
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-text-muted hover:text-foreground hover:bg-hover-bg/70"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions (Sponsor & Theme Toggle Only) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://github.com/sponsors/Shreyash0712"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border-primary/50 hover:bg-hover-bg text-text-secondary hover:text-foreground transition-all"
            title="Sponsor on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-pink-500"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-[11px] tracking-wide">Sponsor</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-hover-bg text-foreground transition-colors"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground rounded transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Full-Page Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-xs px-6">
          <div className="relative h-16 w-16 mb-2">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain dark:invert"
              sizes="64px"
            />
          </div>
          {links.map(({ label, href }, i) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${i * 30}ms` : "0ms" }}
                className={`w-full text-center py-2 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                } ${
                  active
                    ? "text-foreground font-semibold"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <div className="w-12 h-px bg-border-primary my-2" />

          <Link
            href="https://github.com/sponsors/Shreyash0712"
            target="_blank"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-border-primary hover:bg-hover-bg text-text-secondary hover:text-foreground transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-pink-500"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Sponsor
          </Link>
        </div>
      </div>

      {/* Spacer so content doesn't hide under fixed navbar on non-home pages */}
      {!isHome && <div className="h-[var(--navbar-h)]" />}
    </>
  );
}
