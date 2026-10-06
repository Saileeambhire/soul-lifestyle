"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

interface EditorialSlide {
  id: string;
  title: string;
  category: string;
  image: string;
  quote: string;
}

const CAMPAIGN_ITEMS: EditorialSlide[] = [
  {
    id: "edit-1",
    title: "HAUTE BOTANICA",
    category: "PARIS CAMPAIGN N°1",
    image: "/images/editorial_1.jpg",
    quote: "Captured in golden light within a Haussmannian balcony in Le Marais.",
  },
  {
    id: "edit-2",
    title: "L'ÂME DU PARFUM",
    category: "BOTANICAL ESSENCE",
    image: "/images/hero_perfume.jpg",
    quote: "Crystal facets reflecting warm champagne amber liquid.",
  },
  {
    id: "edit-3",
    title: "FLORENTINE IRIS",
    category: "GRASSE ATELIER",
    image: "/images/soul_04.jpg",
    quote: "Powdery accords of white iris and morning mist.",
  },
  {
    id: "edit-4",
    title: "SOUL DE NOIR",
    category: "NIGHT ACCORD",
    image: "/images/soul_03.jpg",
    quote: "Grasse night jasmine under starry Parisian skies.",
  },
];

export default function Editorial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAMPAIGN_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAMPAIGN_ITEMS.length) % CAMPAIGN_ITEMS.length);
  };

  return (
    <section id="editorial" className="py-28 sm:py-36 bg-[#F8F4EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Reveal delay={0.1}>
              <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
                SECTION VIII — FASHION CAMPAIGN
              </span>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-[#29251F] uppercase mt-3">
                THE SOUL <span className="italic font-normal text-[#B8862B]">EDIT</span>
              </h2>
            </Reveal>

            <GoldLine origin="left" width="w-20" delay={0.25} />
          </div>

          {/* Slider Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="interactive p-3.5 rounded-full border border-[#B8862B]/30 text-[#29251F] hover:bg-[#B8862B] hover:text-white transition-all duration-300 focus:outline-none shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-serif text-sm text-[#7A5515] font-medium tracking-widest">
              0{currentIndex + 1} / 0{CAMPAIGN_ITEMS.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="interactive p-3.5 rounded-full border border-[#B8862B]/30 text-[#29251F] hover:bg-[#B8862B] hover:text-white transition-all duration-300 focus:outline-none shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Editorial Magazine Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Visual Slide with Drag & Mask Reveal */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-[#EFE7D8] border border-[#B8862B]/20 group">
            {/* Desktop Draggable Notice Pill */}
            <div className="absolute top-4 right-4 z-20 hidden lg:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-3.5 py-1.5 rounded-full bg-[#29251F]/70 backdrop-blur-md text-white text-[10px] tracking-widest uppercase font-medium border border-white/20">
                SWIPE / DRAG ↔
              </span>
            </div>

            <motion.div
              key={CAMPAIGN_ITEMS[currentIndex].id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                if (info.offset.x < -40) handleNext();
                else if (info.offset.x > 40) handlePrev();
              }}
              initial={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Image
                src={CAMPAIGN_ITEMS[currentIndex].image}
                alt={CAMPAIGN_ITEMS[currentIndex].title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29251F]/65 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-[#D6B56A] font-medium">
                    {CAMPAIGN_ITEMS[currentIndex].category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-light tracking-widest uppercase">
                    {CAMPAIGN_ITEMS[currentIndex].title}
                  </h3>
                </div>
                <div className="hidden sm:block">
                  <span className="p-3 rounded-full bg-white/15 backdrop-blur-md inline-block border border-white/20">
                    <Expand className="w-4 h-4 text-white" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Editorial Cards */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <Reveal delay={0.2}>
              <div className="bg-[#EFE7D8]/80 p-8 rounded-3xl border border-[#B8862B]/20 shadow-md">
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#7A5515] uppercase font-semibold">
                  EDITORIAL NOTE
                </span>
                <p className="font-serif italic text-xl text-[#29251F] leading-relaxed mt-3 mb-4">
                  "{CAMPAIGN_ITEMS[currentIndex].quote}"
                </p>
                <p className="font-sans text-xs text-[#685E52] leading-relaxed font-light">
                  Photograph taken during haute couture week in Paris. Styled with pure ivory silk and gold architectural textures.
                </p>
              </div>
            </Reveal>

            {/* Thumbnail Navigation Row */}
            <div className="grid grid-cols-4 gap-3">
              {CAMPAIGN_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`interactive relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 focus:outline-none ${
                    idx === currentIndex
                      ? "border-[#B8862B] ring-2 ring-[#B8862B]/50 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
