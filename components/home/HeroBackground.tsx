"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function HeroBackground() {
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
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

  // Parallax calculations:
  // 1. effectiveScroll: capped to avoid over-translating once past the hero section
  // 2. stickyOffset: lags behind the page scroll by ~48%, creating a stronger sticky floating depth effect
  // 3. panOffset: pans the image upward to reveal the lower landscape and silhouette in full
  const effectiveScroll = Math.min(scrollY, 1400);
  const stickyOffset = effectiveScroll * 0.48;
  const panOffset = Math.min(effectiveScroll * 0.34, 340);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 w-full h-[165vh] min-h-[1150px] overflow-hidden z-0"
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${stickyOffset}px, 0)`,
        }}
      >
        <div
          className="relative w-full h-[135%] -top-[18%] will-change-transform"
          style={{
            transform: `translate3d(0, -${panOffset}px, 0)`,
          }}
        >
          <Image
            src="/img2.png"
            alt="Artistic landscape background"
            fill
            priority
            className="object-cover object-top opacity-60 dark:opacity-70 filter contrast-[1.08] saturate-[0.95] select-none"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Gentle, seamless bottom fade merging into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 bg-gradient-to-t from-background via-background/75 to-transparent" />

      {/* Soft radial aura */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-background/30" />
    </div>
  );
}
