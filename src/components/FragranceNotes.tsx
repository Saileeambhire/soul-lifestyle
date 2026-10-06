"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Heart, Flame, Shield, Droplets } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

interface FragranceNote {
  id: string;
  name: string;
  quote: string;
  category: "TOP" | "HEART" | "BASE";
  origin: string;
  icon: React.ReactNode;
  position: { top: string; left: string };
  color: string;
}

const NOTES: FragranceNote[] = [
  {
    id: "bergamot",
    name: "BERGAMOT",
    quote: "Bright, fresh and effortlessly uplifting.",
    category: "TOP",
    origin: "Calabria, Italy",
    icon: <Sun className="w-4 h-4" />,
    position: { top: "18%", left: "16%" },
    color: "#D6B56A",
  },
  {
    id: "rose",
    name: "ROSE",
    quote: "Soft, romantic and timeless.",
    category: "HEART",
    origin: "Grasse, France",
    icon: <Heart className="w-4 h-4" />,
    position: { top: "38%", left: "12%" },
    color: "#E29578",
  },
  {
    id: "jasmine",
    name: "JASMINE",
    quote: "Intoxicating, luminous and deeply sensual.",
    category: "HEART",
    origin: "Grasse Atelier",
    icon: <Sparkles className="w-4 h-4" />,
    position: { top: "64%", left: "16%" },
    color: "#B8862B",
  },
  {
    id: "vanilla",
    name: "VANILLA",
    quote: "Warm, sensual and comforting.",
    category: "BASE",
    origin: "Madagascar Absolute",
    icon: <Flame className="w-4 h-4" />,
    position: { top: "18%", left: "82%" },
    color: "#7A5515",
  },
  {
    id: "amber",
    name: "AMBER",
    quote: "Rich, radiant and golden.",
    category: "BASE",
    origin: "French Resin Accord",
    icon: <Shield className="w-4 h-4" />,
    position: { top: "42%", left: "84%" },
    color: "#B8862B",
  },
  {
    id: "musk",
    name: "MUSK",
    quote: "Deep, mysterious and unforgettable.",
    category: "BASE",
    origin: "Cashmere Botanical Musk",
    icon: <Droplets className="w-4 h-4" />,
    position: { top: "68%", left: "80%" },
    color: "#685E52",
  },
];

export default function FragranceNotes() {
  const [activeNote, setActiveNote] = useState<FragranceNote>(NOTES[0]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  // Central bottle floating animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bottle = bottleRef.current;
    if (!bottle) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const floatAnim = gsap.to(bottle, {
      y: -10,
      duration: 3.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      floatAnim.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="notes" className="py-28 sm:py-36 bg-[#EFE7D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal delay={0.1}>
            <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
              SECTION IV — ALCHEMY
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-[#29251F] uppercase mt-3 mb-4">
              THE NOTES OF <span className="italic font-normal text-[#B8862B]">YOUR SOUL</span>
            </h2>
          </Reveal>

          <GoldLine width="w-20" origin="center" delay={0.25} />

          <Reveal delay={0.35}>
            <p className="font-serif italic text-base sm:text-lg text-[#685E52] mt-4">
              "Explore the raw botanical accords that construct our signature fragrances."
            </p>
          </Reveal>
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Central Perfume Bottle & Orbiting Notes Container */}
          <div className="lg:col-span-8 relative min-h-[460px] sm:min-h-[560px] flex items-center justify-center bg-[#F8F4EC]/70 rounded-3xl p-6 sm:p-12 border border-[#B8862B]/20 shadow-xl overflow-hidden">
            {/* Concentric Gold Rings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
              viewBox="0 0 600 600"
            >
              <circle cx="300" cy="300" r="225" stroke="#B8862B" strokeWidth="1" strokeDasharray="5 7" />
              <circle cx="300" cy="300" r="145" stroke="#B8862B" strokeWidth="0.8" />
            </svg>

            {/* Central Floating Bottle */}
            <div
              ref={bottleRef}
              className="relative w-[190px] h-[270px] sm:w-[270px] sm:h-[370px] transition-transform duration-700 z-10"
            >
              <motion.div
                animate={{
                  boxShadow: `0 0 60px ${activeNote.color}50`,
                }}
                transition={{ duration: 0.6 }}
                className="absolute inset-4 rounded-full blur-2xl -z-10"
              />
              <Image
                src="/images/hero_perfume.jpg"
                alt="Central Perfume Bottle Notes"
                fill
                sizes="(max-width: 768px) 200px, 300px"
                className="object-contain drop-shadow-[0_25px_30px_rgba(41,37,31,0.18)]"
              />
            </div>

            {/* Interactive Note Badges Orbiting Around Bottle */}
            {NOTES.map((note, idx) => {
              const isActive = activeNote.id === note.id;
              return (
                <div
                  key={note.id}
                  style={{ top: note.position.top, left: note.position.left }}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.button
                    animate={{
                      y: [0, (idx % 2 === 0 ? -4 : 4), 0],
                    }}
                    transition={{
                      duration: 3 + (idx % 3) * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    onClick={() => setActiveNote(note)}
                    onMouseEnter={() => setActiveNote(note)}
                    className={`interactive group relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all duration-400 shadow-md ${
                      isActive
                        ? "bg-[#B8862B] text-white border-[#B8862B] scale-110 shadow-lg"
                        : "bg-[#F8F4EC]/95 text-[#29251F] border-[#B8862B]/30 hover:border-[#B8862B] hover:bg-[#F8F4EC]"
                    }`}
                  >
                    <span
                      className={`p-1 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "text-[#7A5515]"
                      }`}
                    >
                      {note.icon}
                    </span>
                    <span className="text-[10px] sm:text-xs font-sans tracking-[0.2em] font-medium uppercase">
                      {note.name}
                    </span>

                    {isActive && (
                      <span className="absolute -inset-1 rounded-full border border-[#B8862B] animate-ping opacity-40 pointer-events-none" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Right Side: Active Note Detail Card */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNote.id}
                initial={{ opacity: 0, x: 25, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="bg-[#F8F4EC] p-8 sm:p-10 rounded-3xl border border-[#B8862B]/30 shadow-2xl relative overflow-hidden"
              >
                {/* Accent Watermark */}
                <span className="absolute -right-4 -bottom-6 font-serif text-8xl italic text-[#B8862B]/10 select-none pointer-events-none font-bold">
                  {activeNote.category}
                </span>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.3em] font-medium uppercase py-1 px-3 bg-[#EFE7D8] text-[#7A5515] rounded-full border border-[#B8862B]/20">
                    {activeNote.category} NOTE
                  </span>
                  <span className="text-[11px] font-sans text-[#685E52]">
                    • {activeNote.origin}
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#29251F] uppercase tracking-widest mb-4">
                  {activeNote.name}
                </h3>

                <p className="font-serif italic text-xl text-[#B8862B] leading-relaxed mb-6">
                  "{activeNote.quote}"
                </p>

                <p className="font-sans text-xs text-[#685E52] leading-relaxed font-light border-t border-[#B8862B]/20 pt-4">
                  Distilled through traditional French cold-extraction, this key essence brings extraordinary richness and emotional resonance to the heart of the perfume blend.
                </p>

                <div className="mt-8 flex items-center gap-2 text-[10px] tracking-widest text-[#7A5515] uppercase font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8862B] animate-spin" />
                  <span>HOVER OR TAP TO EXPERIENCE ACCORDS</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
