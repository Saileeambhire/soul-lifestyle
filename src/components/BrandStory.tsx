"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

export default function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const bg = bgRef.current;
    const quoteEl = quoteRef.current;
    if (!container || !bg || !quoteEl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. Slow background parallax scrub
      if (!prefersReducedMotion) {
        gsap.to(bg, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Word-by-word quote reveal as user scrolls
      const words = quoteEl.querySelectorAll(".story-word");
      if (prefersReducedMotion) {
        gsap.set(words, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          words,
          {
            opacity: 0.15,
            y: 8,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: quoteEl,
              start: "top 78%",
              end: "bottom 55%",
              scrub: 1,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const quoteLines = [
    "A fragrance is more than a scent.",
    "It is a memory. It is an emotion.",
    "IT IS YOU.",
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 sm:py-44 bg-[#29251F] text-white overflow-hidden"
    >
      {/* Background Image with Dark Cinematic Overlay */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%] opacity-35"
      >
        <Image
          src="/images/editorial_1.jpg"
          alt="French Parisian Heritage - Brand Story"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#29251F]/80 via-[#29251F]/90 to-[#29251F]/95 z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <div className="space-y-8">
          {/* Official Brand Logo Card */}
          <Reveal delay={0.1}>
            <div className="flex justify-center mb-2">
              <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#B8862B]/40 shadow-2xl inline-block">
                <BrandLogo variant="stacked" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="text-xs font-sans tracking-[0.35em] text-[#D6B56A] uppercase font-medium">
              SECTION VII — OUR HERITAGE
            </span>
          </Reveal>

          <Reveal delay={0.3}>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.15em] text-white uppercase leading-tight">
              THE SOUL BEHIND <span className="italic font-normal text-[#D6B56A]">THE SCENT</span>
            </h2>
          </Reveal>

          <GoldLine origin="center" width="w-24" delay={0.35} />

          {/* Word-by-word quote reveal on scroll */}
          <div ref={quoteRef} className="space-y-4 max-w-3xl mx-auto py-6">
            {quoteLines.map((line, lIdx) => (
              <p
                key={lIdx}
                className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-light leading-snug ${
                  lIdx === 1
                    ? "italic text-[#D6B56A]"
                    : lIdx === 2
                    ? "uppercase tracking-widest text-white mt-4 font-normal"
                    : "italic text-white/95"
                }`}
              >
                {line.split(" ").map((word, wIdx) => (
                  <span
                    key={`${lIdx}-${wIdx}`}
                    className="story-word inline-block mr-2.5 transition-opacity"
                  >
                    {word}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* Supporting Text */}
          <Reveal delay={0.4}>
            <p className="font-sans text-sm sm:text-base text-[#EFE7D8]/80 leading-relaxed max-w-2xl mx-auto font-light pt-2">
              The Soul Lifestyle was created for those who believe fragrance is an extension of identity — a quiet expression of who you are and how you want to be remembered. Bottled in Paris, born in haute perfumery traditions.
            </p>
          </Reveal>

          {/* Gold Seal Stamp */}
          <Reveal delay={0.5}>
            <div className="pt-6 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-[#B8862B]/50 flex items-center justify-center text-[#D6B56A] text-sm font-serif italic shadow-inner">
                Paris
              </div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#D6B56A] font-sans mt-3">
                EST. 2026 • MAISON DE PARFUM
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
