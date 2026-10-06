"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sun, Heart, Flame } from "lucide-react";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

interface JourneyStage {
  phase: "TOP NOTES" | "HEART NOTES" | "BASE NOTES";
  time: string;
  title: string;
  subtitle: string;
  notes: string[];
  description: string;
  icon: React.ReactNode;
  bgTone: string;
}

const STAGES: JourneyStage[] = [
  {
    phase: "TOP NOTES",
    time: "First 15 Minutes",
    title: "Luminous Awakening",
    subtitle: "Bergamot & Pink Pepper Zest",
    notes: ["Calabrian Bergamot", "Pink Pepper", "Mandarin Zest"],
    description:
      "The initial radiant spark. Fresh citrus accords burst upon skin contact, captivating the senses with vibrant Parisian brightness.",
    icon: <Sun className="w-5 h-5 text-[#B8862B]" />,
    bgTone: "#F8F4EC",
  },
  {
    phase: "HEART NOTES",
    time: "2 to 4 Hours",
    title: "The Emotional Soul",
    subtitle: "Grasse Night Jasmine & Damask Rose",
    notes: ["Grasse Night Jasmine", "Damask Rose Absolute", "Orris Root"],
    description:
      "The core identity unfolds. Rich, romantic floral absolutes bloom intimately, echoing your personal warmth and presence.",
    icon: <Heart className="w-5 h-5 text-[#B8862B]" />,
    bgTone: "#EFE7D8",
  },
  {
    phase: "BASE NOTES",
    time: "4 to 12 Hours",
    title: "The Eternal Impression",
    subtitle: "Bourbon Vanilla, Amber & Velvet Musk",
    notes: ["Bourbon Vanilla", "Golden Amber Resin", "Cashmere Musk"],
    description:
      "The lingering aura. Deep, sensual accords meld with skin chemistry, leaving a memory that lingers long after you leave the room.",
    icon: <Flame className="w-5 h-5 text-[#B8862B]" />,
    bgTone: "#E8DEC8",
  },
];

export default function FragranceJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      const bottle = bottleRef.current;
      if (!track || !container || !bottle) return;

      const scrollDistance = track.scrollWidth - window.innerWidth + 240;

      // Horizontal Scroll Scrub Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      // Shift track horizontally
      tl.to(track, {
        x: -scrollDistance,
        ease: "none",
      })
        // Move bottle across
        .to(
          bottle,
          {
            x: scrollDistance * 0.45,
            rotation: 6,
            ease: "none",
          },
          0
        )
        // Background color shift Top -> Heart -> Base
        .to(
          container,
          {
            backgroundColor: "#E8DEC8",
            ease: "none",
          },
          0.5
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 lg:py-32 bg-[#EFE7D8] overflow-hidden border-t border-b border-[#B8862B]/20 transition-colors duration-700"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12 lg:mb-16 text-center">
        <Reveal delay={0.1}>
          <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
            SECTION VI — EVOLUTION
          </span>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-[#29251F] uppercase mt-3 mb-4">
            THE FRAGRANCE <span className="italic font-normal text-[#B8862B]">JOURNEY</span>
          </h2>
        </Reveal>

        <GoldLine width="w-20" origin="center" delay={0.25} />

        <Reveal delay={0.35}>
          <p className="font-serif italic text-base sm:text-lg text-[#685E52] mt-4">
            "How a haute perfumery blend transforms over time on your skin."
          </p>
        </Reveal>
      </div>

      {/* Desktop Horizontal Scroll Track */}
      <div className="hidden lg:block w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-14 px-16 items-center min-w-max pb-12"
        >
          {/* Floating Perfume Bottle Guide */}
          <div
            ref={bottleRef}
            className="relative w-32 h-48 flex-shrink-0 transition-transform"
          >
            <Image
              src="/images/hero_perfume.jpg"
              alt="Perfume Journey Bottle"
              fill
              sizes="150px"
              className="object-contain drop-shadow-xl"
            />
          </div>

          {STAGES.map((stage, idx) => (
            <div
              key={stage.phase}
              className="relative w-[500px] flex-shrink-0 bg-[#F8F4EC] rounded-3xl p-10 border border-[#B8862B]/30 shadow-xl"
            >
              {/* Connecting Gold Line */}
              {idx < STAGES.length - 1 && (
                <div className="absolute top-1/2 -right-14 w-14 h-[1px] bg-gradient-to-r from-[#B8862B] to-[#D6B56A] z-0" />
              )}

              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-sans tracking-[0.3em] font-semibold text-[#7A5515] uppercase py-1.5 px-3.5 bg-[#EFE7D8] rounded-full border border-[#B8862B]/20">
                  STAGE 0{idx + 1} — {stage.phase}
                </span>
                <span className="text-xs font-serif italic text-[#685E52]">
                  {stage.time}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {stage.icon}
                <h3 className="font-serif text-3xl font-light text-[#29251F] uppercase tracking-wider">
                  {stage.title}
                </h3>
              </div>

              <p className="font-serif italic text-lg text-[#B8862B] mb-4">
                "{stage.subtitle}"
              </p>

              <p className="font-sans text-sm text-[#685E52] leading-relaxed font-light mb-6">
                {stage.description}
              </p>

              {/* Accord Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#B8862B]/20">
                {stage.notes.map((n) => (
                  <span
                    key={n}
                    className="px-3.5 py-1 bg-[#EFE7D8] text-[#29251F] text-xs rounded-full font-sans border border-[#B8862B]/15 shadow-sm"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Vertical Stacked Journey */}
      <div className="block lg:hidden max-w-xl mx-auto px-6 space-y-8">
        {STAGES.map((stage, idx) => (
          <Reveal key={stage.phase} delay={idx * 0.15}>
            <div className="bg-[#F8F4EC] rounded-2xl p-8 border border-[#B8862B]/30 shadow-lg relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.25em] font-medium text-[#7A5515] uppercase py-1 px-3 bg-[#EFE7D8] rounded-full">
                  0{idx + 1} • {stage.phase}
                </span>
                <span className="text-xs font-serif italic text-[#685E52]">
                  {stage.time}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {stage.icon}
                <h3 className="font-serif text-2xl font-light text-[#29251F] uppercase">
                  {stage.title}
                </h3>
              </div>

              <p className="font-serif italic text-base text-[#B8862B] mb-3">
                "{stage.subtitle}"
              </p>

              <p className="font-sans text-xs text-[#685E52] leading-relaxed mb-4 font-light">
                {stage.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#B8862B]/15">
                {stage.notes.map((n) => (
                  <span
                    key={n}
                    className="px-2.5 py-1 bg-[#EFE7D8] text-[#29251F] text-[11px] rounded-full"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
