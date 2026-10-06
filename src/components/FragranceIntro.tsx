"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

export default function FragranceIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating gold dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const dust: Array<{
      x: number;
      y: number;
      r: number;
      alpha: number;
      vy: number;
      vx: number;
    }> = [];

    for (let i = 0; i < 30; i++) {
      dust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.35 + 0.1,
        vy: -(Math.random() * 0.3 + 0.1),
        vx: (Math.random() - 0.5) * 0.25,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      dust.forEach((d) => {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < 0) {
          d.y = height + 5;
          d.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 134, 43, ${d.alpha})`;
        ctx.shadowColor = "#D6B56A";
        ctx.shadowBlur = 4;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // GSAP Animations: Image Clip Path reveal and scrub parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const wrapper = imageWrapperRef.current;
    const inner = imageInnerRef.current;
    if (!container || !wrapper || !inner) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(wrapper, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      // Clip Path Reveal
      gsap.fromTo(
        wrapper,
        { clipPath: "inset(15% 0% 15% 0%)", opacity: 0.8 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Scrub parallax with 1.1 -> 1 scale
      gsap.fromTo(
        inner,
        { yPercent: -10, scale: 1.12 },
        {
          yPercent: 10,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#EFE7D8] text-[#29251F] overflow-hidden border-t border-b border-[#B8862B]/15"
    >
      {/* Floating Gold Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Parallax Image with Clip Reveal */}
          <div className="lg:col-span-6 relative">
            <div
              ref={imageWrapperRef}
              className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#B8862B]/20"
            >
              <div
                ref={imageInnerRef}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                <Image
                  src="/images/editorial_1.jpg"
                  alt="The Art of Fragrance - Parisian Haute Perfumery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#29251F]/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Luxury Tag Badge */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-8 sm:-right-8 bg-[#F8F4EC] p-6 rounded-xl border border-[#B8862B]/30 shadow-xl hidden sm:block max-w-[220px]">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A5515] font-medium mb-1">
                ATELIER PARIS
              </p>
              <p className="font-serif italic text-sm text-[#29251F]">
                Hand-blended in Grasse & Paris.
              </p>
            </div>
          </div>

          {/* Right Side: Editorial Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-7">
            <div>
              <Reveal delay={0.1}>
                <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
                  SECTION II — PHILOSOPHY
                </span>
              </Reveal>

              {/* Title with Masked Line Reveal */}
              <div className="overflow-hidden mt-3 mb-4">
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide text-[#29251F] uppercase leading-tight">
                  THE ART OF <span className="italic font-normal text-[#B8862B]">FRAGRANCE</span>
                </h2>
              </div>

              {/* Self-drawing Gold Line */}
              <GoldLine origin="left" width="w-24" delay={0.2} />
            </div>

            {/* Line-by-Line Editorial Poetry with Masks */}
            <div className="space-y-4 pt-2">
              <Reveal delay={0.2} y={25}>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-[#29251F]">
                  "More than a scent."
                </p>
              </Reveal>

              <Reveal delay={0.35} y={25}>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-[#7A5515] italic">
                  "A feeling you carry."
                </p>
              </Reveal>

              <Reveal delay={0.5} y={25}>
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-[#29251F]">
                  "A memory you leave behind."
                </p>
              </Reveal>

              <Reveal delay={0.65} y={20}>
                <div className="pt-4 border-t border-[#B8862B]/20">
                  <p className="font-sans text-sm sm:text-base leading-relaxed text-[#685E52] max-w-lg font-light">
                    Each formulation within The Soul Lifestyle collection is crafted as an invisible haute-couture garment. Blended with rare botanical absolutes, warm amber, and French iris, it weaves softly into your skin code.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
