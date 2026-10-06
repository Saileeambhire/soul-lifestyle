"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface SprayEffectHandle {
  spray: (customX?: number, customY?: number, isAmbient?: boolean) => void;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  isSparkle: boolean;
  sparklePhase: number;
}

interface NozzleFlash {
  active: boolean;
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface SprayEffectProps {
  getNozzlePosition?: () => { x: number; y: number } | null;
}

const SprayEffect = forwardRef<SprayEffectHandle, SprayEffectProps>(
  ({ getNozzlePosition }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const poolRef = useRef<Particle[]>([]);
    const flashRef = useRef<NozzleFlash>({
      active: false,
      x: 0,
      y: 0,
      radius: 0,
      alpha: 0,
    });
    const animIdRef = useRef<number | null>(null);
    const isVisibleRef = useRef<boolean>(true);

    const POOL_SIZE = 350;
    const COLORS = ["#FFFFFF", "#F8F4EC", "#D6B56A", "#B8862B", "#F3E8D0"];

    // Initialize particle pool once
    useEffect(() => {
      const pool: Particle[] = [];
      for (let i = 0; i < POOL_SIZE; i++) {
        pool.push({
          active: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 2,
          targetRadius: 4,
          alpha: 0,
          maxAlpha: 0.3,
          life: 0,
          maxLife: 120,
          color: COLORS[0],
          isSparkle: false,
          sparklePhase: 0,
        });
      }
      poolRef.current = pool;
    }, []);

    // Main spray trigger function
    const triggerSpray = useCallback(
      (customX?: number, customY?: number, isAmbient: boolean = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let originX = customX;
        let originY = customY;

        if (originX === undefined || originY === undefined) {
          if (getNozzlePosition) {
            const pos = getNozzlePosition();
            if (pos) {
              originX = pos.x;
              originY = pos.y;
            }
          }
        }

        // Fallback default: center of screen slightly above mid-height
        if (originX === undefined || originY === undefined) {
          originX = canvas.clientWidth * 0.5;
          originY = canvas.clientHeight * 0.38;
        }

        const isMobile = window.innerWidth < 768;
        const particleCount = isAmbient
          ? isMobile
            ? 25
            : 50
          : isMobile
          ? 55
          : 150;

        // Trigger soft nozzle flash
        flashRef.current = {
          active: true,
          x: originX,
          y: originY,
          radius: isMobile ? 35 : 55,
          alpha: 0.75,
        };

        const pool = poolRef.current;
        let activated = 0;

        for (let i = 0; i < pool.length && activated < particleCount; i++) {
          const p = pool[i];
          if (!p.active) {
            p.active = true;
            p.x = originX + (Math.random() - 0.5) * 6;
            p.y = originY + (Math.random() - 0.5) * 4;

            // Cone emission angle (upward and slightly outward - cone spread ~30deg)
            const angleVariance = (Math.random() - 0.5) * 0.55; // ~32 degree spread
            const baseAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;
            const finalAngle = baseAngle + angleVariance;

            const speed = Math.random() * 5.5 + 2.8;
            p.vx = Math.cos(finalAngle) * speed + (Math.random() - 0.5) * 0.8;
            p.vy = Math.sin(finalAngle) * speed;

            p.radius = Math.random() * 2 + 1;
            p.targetRadius = Math.random() * 4.5 + 2.5;
            p.alpha = 0;
            p.maxAlpha = Math.random() * 0.35 + 0.15;
            p.maxLife = Math.floor(Math.random() * 90 + 90); // 1.5 - 3 seconds at 60fps
            p.life = 0;
            p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            p.isSparkle = Math.random() < 0.12; // 12% sparkles
            p.sparklePhase = Math.random() * Math.PI * 2;

            activated++;
          }
        }
      },
      [getNozzlePosition]
    );

    useImperativeHandle(
      ref,
      () => ({
        spray: (customX?: number, customY?: number, isAmbient?: boolean) => {
          triggerSpray(customX, customY, isAmbient);
        },
      }),
      [triggerSpray]
    );

    // Canvas render loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let dpr = Math.min(2, window.devicePixelRatio || 1);

      const resize = () => {
        if (!canvas) return;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
      };

      resize();
      window.addEventListener("resize", resize);

      // Visibility & Intersection monitoring
      const handleVisibilityChange = () => {
        isVisibleRef.current = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      });
      observer.observe(canvas);

      // Render frame
      const render = () => {
        if (isVisibleRef.current && ctx && canvas) {
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

          // Draw Nozzle Flash
          const flash = flashRef.current;
          if (flash.active && flash.alpha > 0.01) {
            const glowGrad = ctx.createRadialGradient(
              flash.x,
              flash.y,
              0,
              flash.x,
              flash.y,
              flash.radius
            );
            glowGrad.addColorStop(0, `rgba(214, 181, 106, ${flash.alpha * 0.9})`);
            glowGrad.addColorStop(0.5, `rgba(184, 134, 43, ${flash.alpha * 0.4})`);
            glowGrad.addColorStop(1, "rgba(248, 244, 236, 0)");

            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
            ctx.fill();

            flash.alpha *= 0.88;
            flash.radius += 0.8;
            if (flash.alpha <= 0.02) flash.active = false;
          }

          // Draw Spray Particles
          const pool = poolRef.current;
          for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            if (!p.active) continue;

            p.life++;
            const progress = p.life / p.maxLife;

            if (progress >= 1) {
              p.active = false;
              continue;
            }

            // Drag physics (deceleration)
            p.vx *= 0.965;
            p.vy *= 0.965;
            // Gentle upward thermal drift + noise
            p.vy -= 0.035;
            p.vx += Math.sin(p.life * 0.06 + i) * 0.04;

            p.x += p.vx;
            p.y += p.vy;

            // Growth
            p.radius += (p.targetRadius - p.radius) * 0.03;

            // Fade in and out
            if (progress < 0.15) {
              p.alpha = (progress / 0.15) * p.maxAlpha;
            } else if (progress > 0.6) {
              p.alpha = ((1 - progress) / 0.4) * p.maxAlpha;
            } else {
              p.alpha = p.maxAlpha;
            }

            // Draw particle
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.isSparkle) {
              p.sparklePhase += 0.15;
              const sparkleIntensity = Math.abs(Math.sin(p.sparklePhase));
              ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 1.5 * sparkleIntensity})`;
              ctx.shadowColor = "#D6B56A";
              ctx.shadowBlur = 6;
            } else {
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.shadowColor = "#D6B56A";
              ctx.shadowBlur = 4;
            }

            ctx.fill();
            ctx.restore();
          }

          ctx.restore();
        }

        animIdRef.current = requestAnimationFrame(render);
      };

      animIdRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        observer.disconnect();
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 w-full h-full"
      />
    );
  }
);

SprayEffect.displayName = "SprayEffect";

export default SprayEffect;
