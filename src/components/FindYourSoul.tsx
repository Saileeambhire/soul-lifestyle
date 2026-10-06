"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { Product, PRODUCTS } from "./Collection";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

interface PersonalityOption {
  id: string;
  label: string;
  tagline: string;
  recommendedId: string;
  profileText: string;
}

const PERSONALITIES: PersonalityOption[] = [
  {
    id: "elegant",
    label: "ELEGANT",
    tagline: "Refined poise & effortless sophistication",
    recommendedId: "soul-03",
    profileText:
      "You move through the world with timeless grace and quiet authority. You value haute craftsmanship, rare nocturnal floral blooms, and memorable elegance.",
  },
  {
    id: "romantic",
    label: "ROMANTIC",
    tagline: "Soft warmth & intoxicating devotion",
    recommendedId: "soul-01",
    profileText:
      "You cherish emotions, beauty, and intimate memories. Your signature fragrance is luminous, feminine, and embraced by velvet rose petals and golden amber.",
  },
  {
    id: "confident",
    label: "CONFIDENT",
    tagline: "Bold charismatic presence & warmth",
    recommendedId: "soul-02",
    profileText:
      "You leave an unmistakable impression wherever you go. Your scent profile commands warm mysore sandalwood, cardamon spice, and rich cashmere.",
  },
  {
    id: "mysterious",
    label: "MYSTERIOUS",
    tagline: "Enigmatic depth & quiet intrigue",
    recommendedId: "soul-04",
    profileText:
      "You reveal yourself only to those who truly pay attention. Your fragrance signature is powdery Florentine iris enveloped in velvet cashmere musk.",
  },
];

interface FindYourSoulProps {
  onSelectProduct: (product: Product) => void;
}

export default function FindYourSoul({ onSelectProduct }: FindYourSoulProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityOption | null>(null);

  const getRecommendedProduct = (id: string): Product => {
    return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  };

  return (
    <section id="quiz" className="py-28 sm:py-36 bg-[#F8F4EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal delay={0.1}>
            <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
              SECTION V — PERSONALITY MATCH
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-[#29251F] uppercase mt-3 mb-4">
              FIND YOUR <span className="italic font-normal text-[#B8862B]">SOUL</span>
            </h2>
          </Reveal>

          <GoldLine width="w-20" origin="center" delay={0.25} />

          <Reveal delay={0.35}>
            <p className="font-serif italic text-xl sm:text-2xl text-[#29251F] mt-6">
              "What do you want your fragrance to say about you?"
            </p>
          </Reveal>
        </div>

        {/* Options Selector Grid */}
        {!selectedPersonality ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {PERSONALITIES.map((p, idx) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPersonality(p)}
                className="interactive group relative bg-[#EFE7D8]/80 hover:bg-[#B8862B] p-8 rounded-2xl border border-[#B8862B]/30 hover:border-[#B8862B] transition-all duration-500 text-left flex flex-col justify-between min-h-[230px] shadow-sm hover:shadow-2xl"
              >
                <div>
                  <span className="text-[10px] tracking-[0.3em] font-sans font-semibold text-[#7A5515] group-hover:text-white/80 uppercase block mb-3">
                    ARCHETYPE 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-3xl font-light tracking-widest text-[#29251F] group-hover:text-white uppercase transition-colors">
                    {p.label}
                  </h3>
                </div>

                <div>
                  <p className="font-sans text-xs text-[#685E52] group-hover:text-white/90 font-light mt-4 transition-colors">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#7A5515] group-hover:text-white transition-colors">
                    <span>SELECT ARCHETYPE</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* Personality Result Presentation */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPersonality.id}
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl mx-auto bg-[#EFE7D8] rounded-3xl p-8 sm:p-12 border border-[#B8862B]/30 shadow-2xl relative overflow-hidden"
            >
              {/* Expanding Gold Circle Animation behind result */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0.18 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-2 border-[#B8862B] pointer-events-none"
              />

              {/* Reset quiz button */}
              <button
                onClick={() => setSelectedPersonality(null)}
                className="interactive absolute top-6 right-6 flex items-center gap-2 text-xs font-sans tracking-widest text-[#7A5515] hover:text-[#29251F] uppercase font-medium focus:outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>CHANGE SELECTION</span>
              </button>

              {(() => {
                const prod = getRecommendedProduct(selectedPersonality.recommendedId);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 relative z-10">
                    {/* Bottle preview */}
                    <div className="md:col-span-5 relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F8F4EC] shadow-xl border border-[#B8862B]/20">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover rounded-2xl"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-[#B8862B] text-white text-[10px] tracking-widest uppercase rounded-full font-medium shadow-md">
                        PERFECT MATCH
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <span className="text-xs font-sans tracking-[0.3em] font-semibold text-[#7A5515] uppercase">
                          YOUR PERSONALITY MATCH
                        </span>
                        <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#29251F] uppercase tracking-wider mt-1">
                          YOU ARE{" "}
                          <span className="italic text-[#B8862B] font-normal">
                            {selectedPersonality.label}
                          </span>
                        </h3>
                        <p className="font-serif italic text-lg text-[#685E52] mt-1">
                          "Your signature fragrance is {prod.name}."
                        </p>
                      </div>

                      <p className="font-sans text-sm text-[#685E52] leading-relaxed font-light">
                        {selectedPersonality.profileText}
                      </p>

                      {/* Staggered Key Notes */}
                      <div className="space-y-2 pt-2 border-t border-[#B8862B]/20">
                        <span className="text-[10px] tracking-widest text-[#7A5515] uppercase font-semibold block">
                          SIGNATURE ACCORDS
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {prod.notes.top.concat(prod.notes.heart).map((n: string, i: number) => (
                            <motion.span
                              key={n}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                              className="px-3.5 py-1.5 bg-[#F8F4EC] text-[#29251F] text-xs font-sans rounded-full border border-[#B8862B]/25 shadow-sm"
                            >
                              {n}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* CTA button */}
                      <div className="pt-4">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="interactive inline-flex items-center gap-3 px-8 py-4 bg-[#B8862B] hover:bg-[#7A5515] text-white text-xs tracking-[0.25em] uppercase font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>DISCOVER YOUR FRAGRANCE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
