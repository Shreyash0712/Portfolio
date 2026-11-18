"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function HeroArtisticBackground() {
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Smooth, lightweight GPU parallax (capped to avoid overflow past hero)
  const effectiveScroll = Math.min(scrollY, 1200);
  const parallaxOffset = effectiveScroll * 0.35;
  const panOffset = Math.min(effectiveScroll * 0.18, 180);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 w-full h-[145vh] min-h-[960px] overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxOffset}px, 0)`,
        }}
      >
        <div
          className="relative w-full h-[120%] -top-[10%] will-change-transform"
          style={{
            transform: `translate3d(0, -${panOffset}px, 0)`,
          }}
        >
          {/* ── Dark Mode: Nocturnal Sumi-e Ink Wash Nature Art ── */}
          <div className="hidden dark:block absolute inset-0 w-full h-full">
            <Image
              src="/nature-dark.jpg"
              alt="Minimalist sumi-e nocturnal mountain landscape"
              fill
              priority
              className="object-cover object-[62%_center] sm:object-center opacity-85 filter contrast-[1.05] brightness-[0.98] select-none"
              sizes="100vw"
            />
          </div>

          {/* ── Light Mode: Warm Watercolor Sumi-e Nature Art ── */}
          <div className="block dark:hidden absolute inset-0 w-full h-full">
            <Image
              src="/nature-light.jpg"
              alt="Minimalist sumi-e watercolor mountain landscape"
              fill
              priority
              className="object-cover object-[62%_center] sm:object-center opacity-80 filter contrast-[1.04] brightness-[1.02] select-none"
              sizes="100vw"
            />
          </div>
        </div>
      </div>

      {/* ── Soft Ambient Coral/Gold Glow Blends ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 sm:w-[500px] h-64 sm:h-80 rounded-full bg-[#ff7a59]/10 dark:bg-[#ff7a59]/12 blur-[100px] pointer-events-none" />

      {/* ── Seamless Bottom Fade into Page Content ── */}
      <div className="absolute inset-x-0 bottom-0 h-52 sm:h-72 bg-gradient-to-t from-background via-background/75 to-transparent pointer-events-none" />

      {/* ── Subtle Radial Vignette ── */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-background/30 pointer-events-none" />
    </div>
  );
}
