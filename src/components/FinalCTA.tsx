"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";
import Reveal from "./animations/Reveal";
import GoldLine from "./animations/GoldLine";

interface FinalCTAProps {
  onDiscoverClick?: () => void;
}

export default function FinalCTA({ onDiscoverClick }: FinalCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasSprayed = useRef<boolean>(false);

  // Soft mist puff on viewport entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      maxAlpha: number;
    }> = [];

    const fireMist = () => {
      const originX = width / 2;
      const originY = height / 2;
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 0.8;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          r: Math.random() * 3 + 1,
          alpha: 0,
          maxAlpha: Math.random() * 0.35 + 0.15,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        if (p.alpha < p.maxAlpha) {
          p.alpha += 0.02;
        } else {
          p.alpha -= 0.005;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 181, 106, ${p.alpha})`;
        ctx.shadowColor = "#B8862B";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();

    // Trigger on scroll entrance
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        if (!hasSprayed.current) {
          hasSprayed.current = true;
          fireMist();
        }
      },
    });

    return () => {
      trigger.kill();
      cancelAnimationFrame(animId);
    };
  }, []);

  // Gold Circle Rotation Animation
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const anim = gsap.to(circle, {
      rotation: 360,
      duration: 50,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#F8F4EC] text-[#29251F] py-24 px-6 overflow-hidden border-t border-[#B8862B]/20"
    >
      {/* Canvas Mist Particle Effect */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
      />

      {/* Gold Rotating Background Circle SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          ref={circleRef}
          className="w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] md:w-[680px] md:h-[680px]"
          viewBox="0 0 700 700"
          fill="none"
        >
          <circle
            cx="350"
            cy="350"
            r="320"
            stroke="#B8862B"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="#D6B56A"
            strokeWidth="0.5"
            strokeDasharray="4 6"
            strokeOpacity="0.25"
          />
          <circle
            cx="350"
            cy="350"
            r="240"
            stroke="#B8862B"
            strokeWidth="0.4"
            strokeOpacity="0.2"
          />
        </svg>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Star Motif with Soft Pulse */}
        <Reveal delay={0.1}>
          <span className="text-[#B8862B] text-2xl sm:text-3xl mb-3 tracking-widest inline-block animate-pulse">
            ✦
          </span>
        </Reveal>

        {/* Headline with Blur to Sharp */}
        <Reveal delay={0.2} blur>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-8xl font-light tracking-[0.2em] text-[#29251F] uppercase my-4 leading-tight">
            WEAR YOUR <span className="italic font-normal text-[#B8862B]">SOUL</span>
          </h2>
        </Reveal>

        {/* Minimal Poetry */}
        <div className="space-y-2 font-serif italic text-xl sm:text-3xl text-[#685E52] my-6 font-light">
          <Reveal delay={0.3} y={20}>
            <p>"Your fragrance."</p>
          </Reveal>
          <Reveal delay={0.4} y={20}>
            <p>"Your identity."</p>
          </Reveal>
          <Reveal delay={0.5} y={20}>
            <p className="text-[#B8862B]">"Your story."</p>
          </Reveal>
        </div>

        <GoldLine width="w-20" origin="center" delay={0.55} />

        {/* Brand Monogram */}
        <Reveal delay={0.65} y={25}>
          <div className="my-8">
            <BrandLogo variant="stacked" />
          </div>
        </Reveal>

        {/* CTA Button */}
        <Reveal delay={0.8} y={25}>
          <a
            href="#collection"
            onClick={onDiscoverClick}
            className="interactive inline-flex items-center gap-3 px-10 py-5 bg-[#B8862B] hover:bg-[#7A5515] text-white text-xs tracking-[0.3em] font-medium uppercase rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>EXPLORE HAUTE COLLECTION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
