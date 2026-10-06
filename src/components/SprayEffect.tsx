"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from "react";

export interface SprayEffectHandle {
  spray: (customX?: number, customY?: number, isAmbient?: boolean) => void;
  updateNozzlePosition: () => void;
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

// Configurable offset for nozzle calibration: x (fraction of bottle width), y (fraction of bottle height)
export const NOZZLE_OFFSET = { x: 0, y: 0.05 };

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
    const lastNozzlePos = useRef<{ x: number; y: number } | null>(null);
    const [isDebug, setIsDebug] = useState<boolean>(false);

    const POOL_SIZE = 360;
    // Rich visible gold tones and white sparkles
    const COLORS = ["#B8862B", "#D6B56A", "#7A5515", "#C89D3C", "#FFFFFF", "#EAD49B"];

    useEffect(() => {
      if (typeof window !== "undefined") {
        setIsDebug(window.location.search.includes("debug=1"));
      }
    }, []);

    // Initialize particle pool
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
          maxAlpha: 0.45,
          life: 0,
          maxLife: 120,
          color: COLORS[0],
          isSparkle: false,
          sparklePhase: 0,
        });
      }
      poolRef.current = pool;
    }, []);

    // Helper to fetch live nozzle coordinates
    const refreshNozzle = useCallback(() => {
      if (getNozzlePosition) {
        const pos = getNozzlePosition();
        if (pos && pos.x > 0 && pos.y > 0) {
          lastNozzlePos.current = pos;
          return pos;
        }
      }
      return lastNozzlePos.current;
    }, [getNozzlePosition]);

    // Main spray trigger function
    const triggerSpray = useCallback(
      (customX?: number, customY?: number, isAmbient: boolean = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let originX = customX;
        let originY = customY;

        if (originX === undefined || originY === undefined) {
          const pos = refreshNozzle();
          if (pos) {
            originX = pos.x;
            originY = pos.y;
          }
        }

        // Safety fallback: center horizontal, 40% vertical of hero
        if (originX === undefined || originY === undefined) {
          originX = (canvas.parentElement?.clientWidth || canvas.clientWidth) * 0.5;
          originY = (canvas.parentElement?.clientHeight || canvas.clientHeight) * 0.38;
        }

        const isMobile = window.innerWidth < 768;
        const count = isAmbient
          ? isMobile
            ? 35
            : 60
          : isMobile
          ? 55
          : 160;

        // Nozzle flash glow
        flashRef.current = {
          active: true,
          x: originX,
          y: originY,
          radius: isMobile ? 30 : 50,
          alpha: 0.85,
        };

        const pool = poolRef.current;
        let activated = 0;

        for (let i = 0; i < pool.length && activated < count; i++) {
          const p = pool[i];
          if (!p.active) {
            p.active = true;
            p.x = originX + (Math.random() - 0.5) * 6;
            p.y = originY + (Math.random() - 0.5) * 4;

            // Cone emission angle (centered upward at -PI/2, spread ~30-35 deg)
            const coneSpread = 0.58; // ~33 degrees
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * coneSpread;

            const speed = Math.random() * 5.2 + 2.8;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;

            p.radius = Math.random() * 2 + 1;
            p.targetRadius = Math.random() * 4.5 + 2.5;
            p.alpha = 0;
            // Clearly visible opacity against cream background
            p.maxAlpha = Math.random() * 0.45 + 0.2;
            p.maxLife = Math.floor(Math.random() * 80 + 85); // ~1.5 - 3 seconds
            p.life = 0;
            p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            p.isSparkle = Math.random() < 0.15;
            p.sparklePhase = Math.random() * Math.PI * 2;

            activated++;
          }
        }
      },
      [refreshNozzle]
    );

    useImperativeHandle(
      ref,
      () => ({
        spray: (customX?: number, customY?: number, isAmbient?: boolean) => {
          triggerSpray(customX, customY, isAmbient);
        },
        updateNozzlePosition: () => {
          refreshNozzle();
        },
      }),
      [triggerSpray, refreshNozzle]
    );

    // Canvas resize via ResizeObserver & render loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let dpr = Math.min(2, window.devicePixelRatio || 1);

      const updateDimensions = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      };

      updateDimensions();

      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
        refreshNozzle();
      });

      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }
      window.addEventListener("resize", updateDimensions);

      // Render Loop
      const render = () => {
        if (isVisibleRef.current && ctx && canvas) {
          const cssWidth = canvas.width / dpr;
          const cssHeight = canvas.height / dpr;

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, cssWidth, cssHeight);

          // Debug marker: red dot at nozzle position
          if (isDebug && lastNozzlePos.current) {
            ctx.beginPath();
            ctx.arc(lastNozzlePos.current.x, lastNozzlePos.current.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#FF0000";
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = 8;
            ctx.fill();
          }

          // Nozzle Flash
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
            glowGrad.addColorStop(0.4, `rgba(184, 134, 43, ${flash.alpha * 0.5})`);
            glowGrad.addColorStop(1, "rgba(248, 244, 236, 0)");

            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
            ctx.fill();

            flash.alpha *= 0.88;
            flash.radius += 0.9;
            if (flash.alpha <= 0.02) flash.active = false;
          }

          // Particles
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

            // Drag
            p.vx *= 0.965;
            p.vy *= 0.965;
            // Buoyancy drift up + curl
            p.vy -= 0.038;
            p.vx += Math.sin(p.life * 0.07 + i) * 0.045;

            p.x += p.vx;
            p.y += p.vy;

            // Expand
            p.radius += (p.targetRadius - p.radius) * 0.025;

            // Fade in & out
            if (progress < 0.12) {
              p.alpha = (progress / 0.12) * p.maxAlpha;
            } else if (progress > 0.55) {
              p.alpha = ((1 - progress) / 0.45) * p.maxAlpha;
            } else {
              p.alpha = p.maxAlpha;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.isSparkle) {
              p.sparklePhase += 0.16;
              const sparkle = Math.abs(Math.sin(p.sparklePhase));
              ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 1.6 * sparkle})`;
              ctx.shadowColor = "#D6B56A";
              ctx.shadowBlur = 8;
            } else {
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.shadowColor = "#B8862B";
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
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateDimensions);
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      };
    }, [refreshNozzle, isDebug]);

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
