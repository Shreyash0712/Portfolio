"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  isAccent: boolean;
  alpha: number;
  baseAlpha: number;
  pulseAngle: number;
  pulseSpeed: number;
}

export default function HeroReactiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Mouse tracking with smooth lerp
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isActive: false,
  });

  // Spotlight element ref for smooth GPU glow tracking
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    // Check motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Determine current theme
    const isDark =
      resolvedTheme === "dark" ||
      document.documentElement.classList.contains("dark");

    // Palette configuration
    const accentColor = isDark
      ? { r: 255, g: 122, b: 89 } // Signature warm coral #ff7a59
      : { r: 235, g: 105, b: 75 };

    const baseColor = isDark
      ? { r: 244, g: 244, b: 246 } // Starlight silver/white
      : { r: 55, g: 55, b: 65 }; // Soft slate graphite

    // Resize canvas with pixel ratio for crisp Retina rendering
    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Initialize particles based on screen area
      initParticles();
    };

    const initParticles = () => {
      // Density: ~55 on mobile, ~85 on desktop
      const isMobile = width < 768;
      const particleCount = isMobile
        ? Math.floor(width * 0.08)
        : Math.floor(width * 0.06);

      const count = Math.max(28, Math.min(particleCount, 85));

      particles = Array.from({ length: count }, () => {
        const isAccent = Math.random() < 0.28; // ~28% coral accent particles
        const baseRadius = isAccent
          ? 1.6 + Math.random() * 1.4
          : 1.0 + Math.random() * 1.5;
        const baseAlpha = isAccent
          ? 0.45 + Math.random() * 0.35
          : 0.2 + Math.random() * 0.35;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.32),
          vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.32),
          baseRadius,
          radius: baseRadius,
          isAccent,
          alpha: baseAlpha,
          baseAlpha,
          pulseAngle: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        };
      });
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse & Touch pointer events
    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= -40 && x <= width + 40 && y >= -40 && y <= height + 40) {
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;
        mouseRef.current.isActive = true;

        if (glowRef.current) {
          glowRef.current.style.opacity = "1";
          glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      } else {
        mouseRef.current.isActive = false;
        if (glowRef.current) {
          glowRef.current.style.opacity = "0";
        }
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.isActive = false;
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Pause animation when hero is scrolled out of view to save 100% GPU/CPU
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            render();
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Render loop
    const connectionDistance = width < 768 ? 75 : 95;
    const mouseInfluenceRadius = 130;

    const render = () => {
      if (!isVisible) return;

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic breathing pulsation
        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle) * 0.25;
        p.radius = Math.max(0.8, p.baseRadius + pulse);

        // Position drift
        p.x += p.vx;
        p.y += p.vy;

        // Soft screen edge bounce
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Pointer repulsion / interaction
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseInfluenceRadius && dist > 0) {
            const force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
            const angle = Math.atan2(dy, dx);
            const repelStrength = force * 1.8;

            p.x += Math.cos(angle) * repelStrength;
            p.y += Math.sin(angle) * repelStrength;
            p.alpha = Math.min(0.95, p.baseAlpha + force * 0.4);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Draw particle dot
        const color = p.isAccent ? accentColor : baseColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${p.alpha})`;
        ctx.fill();

        // 2. Connect neighboring particles (constellation web)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const lineAlpha =
              (1 - dist / connectionDistance) * (isDark ? 0.12 : 0.07);

            const hasAccent = p.isAccent || p2.isAccent;
            const lineColor = hasAccent ? accentColor : baseColor;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // 3. Connect particles to mouse cursor when close
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 105) {
            const mouseLineAlpha = (1 - dist / 105) * (isDark ? 0.22 : 0.14);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${mouseLineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ── Soft Ambient Aurora/Glow Clouds (Minimal & Subtle) ── */}
      {/* Top-left warm coral aura */}
      <div className="absolute -top-24 -left-24 w-80 sm:w-96 md:w-[480px] h-80 sm:h-96 md:h-[480px] rounded-full bg-[#ff7a59]/10 dark:bg-[#ff7a59]/12 blur-[100px] sm:blur-[130px] pointer-events-none transition-colors duration-700" />

      {/* Center-right soft ambient aura */}
      <div className="absolute top-1/4 right-0 sm:-right-20 w-72 sm:w-88 md:w-[420px] h-72 sm:h-88 md:h-[420px] rounded-full bg-amber-500/8 dark:bg-amber-400/8 blur-[90px] sm:blur-[120px] pointer-events-none transition-colors duration-700" />

      {/* Bottom-left delicate indigo/cyan grounding aura */}
      <div className="absolute -bottom-16 left-1/4 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-[100px] pointer-events-none transition-colors duration-700" />

      {/* ── Interactive Pointer Spotlight (Follows cursor smoothly) ── */}
      <div
        ref={glowRef}
        className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-radial from-[#ff7a59]/15 dark:from-[#ff7a59]/20 via-[#ff7a59]/4 to-transparent blur-2xl opacity-0 pointer-events-none transition-opacity duration-300 will-change-transform"
      />

      {/* ── Interactive Canvas Particle & Constellation Field ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── Subtle Geometric Grid / Texture Lines ── */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Seamless Bottom Fade into Page Content ── */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />

      {/* ── Radial Edge Vignette ── */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-background/40 pointer-events-none" />
    </div>
  );
}
