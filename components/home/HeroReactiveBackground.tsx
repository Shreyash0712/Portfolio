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
  isAmber: boolean;
  alpha: number;
  baseAlpha: number;
  pulseAngle: number;
  pulseSpeed: number;
  flash: number;
}

interface Spark {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export default function HeroReactiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Mouse & touch tracking with smooth lerp
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
    let sparks: Spark[] = [];
    const startTime = performance.now();

    // Check motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Determine current theme
    const isDark =
      resolvedTheme === "dark" ||
      document.documentElement.classList.contains("dark");

    // Colors
    const coralColor = isDark
      ? { r: 255, g: 122, b: 89 } // Signature warm coral #ff7a59
      : { r: 240, g: 100, b: 70 };

    const amberColor = isDark
      ? { r: 245, g: 158, b: 11 } // Radiant amber #f59e0b
      : { r: 217, g: 119, b: 6 };

    const baseColor = isDark
      ? { r: 244, g: 244, b: 246 } // Starlight silver
      : { r: 70, g: 70, b: 85 }; // Graphite

    // Resize canvas with devicePixelRatio for Retina clarity
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

      initParticles();
    };

    const initParticles = () => {
      const isMobile = width < 768;
      const count = isMobile
        ? Math.max(38, Math.min(Math.floor(width * 0.11), 58))
        : Math.max(55, Math.min(Math.floor(width * 0.075), 95));

      particles = Array.from({ length: count }, () => {
        const isAccent = Math.random() < 0.38; // 38% accent particles
        const isAmber = isAccent && Math.random() < 0.45;
        const baseRadius = isAccent
          ? 2.2 + Math.random() * 1.8
          : 1.4 + Math.random() * 1.6;
        const baseAlpha = isAccent
          ? 0.55 + Math.random() * 0.35
          : 0.35 + Math.random() * 0.35;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.04 : 0.38),
          vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.04 : 0.38),
          baseRadius,
          radius: baseRadius,
          isAccent,
          isAmber,
          alpha: baseAlpha,
          baseAlpha,
          pulseAngle: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.025,
          flash: 0,
        };
      });

      sparks = [];
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Pointer events (Desktop mouse + Phone touch)
    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= -60 && x <= width + 60 && y >= -60 && y <= height + 60) {
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

    const handlePointerDown = (e: PointerEvent) => {
      handlePointerMove(e);
    };

    const handlePointerLeave = () => {
      mouseRef.current.isActive = false;
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // IntersectionObserver to pause animation when scrolled past hero
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

    // Flowing Wave Lines configuration (fills vertical spaces with dynamic life)
    const waves = [
      {
        baseYFraction: 0.28,
        amplitude: 28,
        frequency: 0.0032,
        speed: 0.0012,
        phase: 0,
        color: isDark ? "rgba(255, 122, 89, 0.35)" : "rgba(235, 105, 75, 0.28)",
        glowColor: "#ff7a59",
        lineWidth: 1.75,
      },
      {
        baseYFraction: 0.52,
        amplitude: 36,
        frequency: 0.0026,
        speed: -0.0009,
        phase: 2.2,
        color: isDark ? "rgba(245, 158, 11, 0.30)" : "rgba(217, 119, 6, 0.24)",
        glowColor: "#f59e0b",
        lineWidth: 1.5,
      },
      {
        baseYFraction: 0.74,
        amplitude: 32,
        frequency: 0.0030,
        speed: 0.0015,
        phase: 4.4,
        color: isDark ? "rgba(244, 244, 246, 0.25)" : "rgba(80, 80, 95, 0.20)",
        glowColor: isDark ? "#ffffff" : "#4a4a52",
        lineWidth: 1.35,
      },
    ];

    const connectionDistance = width < 768 ? 105 : 138;
    const mouseInfluenceRadius = 150;

    // Render loop
    const render = () => {
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = now - startTime;

      // Autonomous attractor: glides in an infinity / Lissajous path
      // Keeps phones and idle desktop active and visually rich
      const autoTime = elapsed * 0.0008;
      const autoAttractor = {
        x: width * 0.5 + Math.sin(autoTime * 0.9) * (width * 0.38),
        y: height * 0.5 + Math.cos(autoTime * 1.3) * (height * 0.28),
      };

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Draw Flowing Topographic Wave Lines (React Bits Wave Lines) ──
      for (const wave of waves) {
        ctx.beginPath();
        const step = 14;

        for (let x = 0; x <= width + step; x += step) {
          let y =
            wave.baseYFraction * height +
            Math.sin(x * wave.frequency + elapsed * wave.speed + wave.phase) *
              wave.amplitude +
            Math.cos(
              x * wave.frequency * 0.55 + elapsed * wave.speed * 0.75
            ) *
              (wave.amplitude * 0.45);

          // Interaction: ripple from cursor or auto-attractor
          if (mouse.isActive) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 190) {
              const push =
                (1 - dist / 190) *
                Math.sin((dist / 190) * Math.PI) *
                38;
              y += push;
            }
          } else {
            const adx = x - autoAttractor.x;
            const ady = y - autoAttractor.y;
            const adist = Math.hypot(adx, ady);
            if (adist < 220) {
              const apush =
                (1 - adist / 220) *
                Math.sin((adist / 220) * Math.PI) *
                18;
              y += apush;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowBlur = isDark ? 9 : 4;
        ctx.shadowColor = wave.glowColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ── 2. Update and Draw Particles & Constellation Network ──
      const connections: [number, number, number][] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Breathing pulsation
        p.pulseAngle += p.pulseSpeed;
        const pulse = Math.sin(p.pulseAngle) * 0.35;
        p.radius = Math.max(1.0, p.baseRadius + pulse);

        // Flash decay
        if (p.flash > 0) {
          p.flash = Math.max(0, p.flash - 0.04);
        }

        // Position drift
        p.x += p.vx;
        p.y += p.vy;

        // Screen edge wrapping
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Interaction with cursor / auto-attractor
        const target = mouse.isActive ? mouse : autoAttractor;
        const targetRadius = mouse.isActive ? mouseInfluenceRadius : 110;
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dist = Math.hypot(dx, dy);

        if (dist < targetRadius && dist > 0) {
          const force = (targetRadius - dist) / targetRadius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = force * (mouse.isActive ? 2.2 : 0.8);

          p.x += Math.cos(angle) * pushStrength;
          p.y += Math.sin(angle) * pushStrength;
          p.alpha = Math.min(1.0, p.baseAlpha + force * 0.45);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Draw particle node
        const color = p.isAmber
          ? amberColor
          : p.isAccent
          ? coralColor
          : baseColor;
        const currentAlpha = Math.min(1, p.alpha + p.flash * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + p.flash * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentAlpha})`;

        if (p.isAccent || p.flash > 0) {
          const glow = p.isAmber ? amberColor : coralColor;
          ctx.shadowBlur = isDark ? 10 : 5;
          ctx.shadowColor = `rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.8)`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Collect connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.hypot(cdx, cdy);

          if (cdist < connectionDistance) {
            connections.push([i, j, cdist]);

            const lineAlpha =
              (1 - cdist / connectionDistance) * (isDark ? 0.32 : 0.22);
            const hasAccent = p.isAccent || p2.isAccent;
            const lineColor = hasAccent ? coralColor : baseColor;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${lineAlpha})`;
            ctx.lineWidth = hasAccent ? 1.2 : 0.9;
            ctx.stroke();
          }
        }

        // Draw reactive tether line to pointer
        if (mouse.isActive && dist < 125) {
          const tetherAlpha = (1 - dist / 125) * (isDark ? 0.36 : 0.26);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${coralColor.r}, ${coralColor.g}, ${coralColor.b}, ${tetherAlpha})`;
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }
      }

      // ── 3. Traveling Energy Sparks (Electrifying React Bits effect) ──
      // Spawn sparks if needed
      if (sparks.length < 5 && connections.length > 0 && Math.random() < 0.08) {
        const randConn =
          connections[Math.floor(Math.random() * connections.length)];
        sparks.push({
          fromIndex: randConn[0],
          toIndex: randConn[1],
          progress: 0,
          speed: 0.022 + Math.random() * 0.025,
        });
      }

      // Update and draw traveling sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        spark.progress += spark.speed;

        if (spark.progress >= 1) {
          if (particles[spark.toIndex]) {
            particles[spark.toIndex].flash = 1.0;
          }
          sparks.splice(s, 1);
        } else {
          const p1 = particles[spark.fromIndex];
          const p2 = particles[spark.toIndex];
          if (p1 && p2) {
            const sx = p1.x + (p2.x - p1.x) * spark.progress;
            const sy = p1.y + (p2.y - p1.y) * spark.progress;

            ctx.beginPath();
            ctx.arc(sx, sy, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = isDark
              ? "rgba(255, 200, 180, 0.95)"
              : "rgba(255, 95, 60, 0.95)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${coralColor.r}, ${coralColor.g}, ${coralColor.b}, 1)`;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            sparks.splice(s, 1);
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
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ── Soft Ambient Aurora/Glow Clouds (Rich & Warm) ── */}
      {/* Top-left warm coral aura */}
      <div className="absolute -top-20 -left-20 w-88 sm:w-[450px] md:w-[540px] h-88 sm:h-[450px] md:h-[540px] rounded-full bg-[#ff7a59]/16 dark:bg-[#ff7a59]/20 blur-[90px] sm:blur-[130px] pointer-events-none transition-colors duration-700" />

      {/* Center-right amber/gold aura */}
      <div className="absolute top-1/4 -right-10 sm:-right-20 w-80 sm:w-[400px] md:w-[480px] h-80 sm:h-[400px] md:h-[480px] rounded-full bg-amber-500/12 dark:bg-amber-400/14 blur-[90px] sm:blur-[120px] pointer-events-none transition-colors duration-700" />

      {/* Bottom-left grounding indigo aura */}
      <div className="absolute -bottom-12 left-1/4 w-72 sm:w-88 md:w-[420px] h-72 sm:h-88 md:h-[420px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/12 blur-[100px] pointer-events-none transition-colors duration-700" />

      {/* ── Interactive Pointer Spotlight (Follows cursor/touch smoothly) ── */}
      <div
        ref={glowRef}
        className="absolute -top-56 -left-56 w-[450px] h-[450px] rounded-full bg-radial from-[#ff7a59]/24 dark:from-[#ff7a59]/28 via-[#ff7a59]/8 to-transparent blur-3xl opacity-0 pointer-events-none transition-opacity duration-300 will-change-transform"
      />

      {/* ── Interactive Canvas Wave Lines, Particles & Constellation Field ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── Subtle Geometric Grid / Texture Lines ── */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Seamless Bottom Fade into Page Content ── */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />

      {/* ── Radial Edge Vignette ── */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-background/40 pointer-events-none" />
    </div>
  );
}
