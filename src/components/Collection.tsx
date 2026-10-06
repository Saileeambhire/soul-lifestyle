"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard, { Product } from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

export type { Product };

export const PRODUCTS: Product[] = [
  {
    id: "soul-01",
    name: "SOUL 01",
    subtitle: "L'Aura De Rose & Ambre",
    family: "Floral Amber Accord",
    description: "A luminous blend of Damask Rose and radiant French Bergamot wrapped in soft vanilla amber.",
    image: "/images/soul_01.jpg",
    price: "€180",
    volume: "50ml / 1.7 fl oz",
    notes: {
      top: ["Sicilian Bergamot", "Pink Pepper", "Mandarin"],
      heart: ["Damask Rose", "French Jasmine", "Orris Root"],
      base: ["Madagascar Vanilla", "Golden Amber", "White Musk"],
    },
  },
  {
    id: "soul-02",
    name: "SOUL 02",
    subtitle: "Santal & Cashmere",
    family: "Warm Woody & Citrus",
    description: "Deep Mysore Sandalwood infused with cardamon spice, cashmere suede and warm tonka bean.",
    image: "/images/soul_02.jpg",
    price: "€195",
    volume: "50ml / 1.7 fl oz",
    notes: {
      top: ["Italian Cardamom", "Bergamot Zest"],
      heart: ["Florentine Orris", "Cedarwood Bark"],
      base: ["Mysore Sandalwood", "Cashmere Suede", "Tonka Bean"],
    },
  },
  {
    id: "soul-03",
    name: "SOUL 03",
    subtitle: "Jasmin Imperial Noir",
    family: "Intense Floral Orientale",
    description: "Night-blooming royal jasmine from Grasse enriched with blackcurrant nectar and velvet vetiver.",
    image: "/images/soul_03.jpg",
    price: "€210",
    volume: "50ml / 1.7 fl oz",
    notes: {
      top: ["Blackcurrant Nectar", "Calabrian Bergamot"],
      heart: ["Grasse Night Jasmine", "Orange Blossom Absolute"],
      base: ["Bourbon Vanilla", "Haitian Vetiver", "Dark Amber"],
    },
  },
  {
    id: "soul-04",
    name: "SOUL 04",
    subtitle: "Musc Impérial & Iris",
    family: "Velvet Powder Musk",
    description: "Powdery French Iris enveloped in warm velvet musk, white tea essence, and sandalwood mist.",
    image: "/images/soul_04.jpg",
    price: "€190",
    volume: "50ml / 1.7 fl oz",
    notes: {
      top: ["White Tea Leaves", "Fig Leaf Essence"],
      heart: ["Florentine Iris Pallida", "White Rose"],
      base: ["Velvet Cashmere Musk", "Cedarwood", "Benzoin"],
    },
  },
];

interface CollectionProps {
  onAddToCart: (product: Product) => void;
}

export default function Collection({ onAddToCart }: CollectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<"50ml" | "100ml">("50ml");
  const [addedNotice, setAddedNotice] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Staggered Cards Entrance with Blur-to-Sharp
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll(".product-card");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, filter: "none" });
        return;
      }

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 55,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleAdd = (prod: Product) => {
    onAddToCart(prod);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <section ref={sectionRef} id="collection" className="py-28 sm:py-36 bg-[#F8F4EC] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <Reveal delay={0.1}>
            <span className="text-xs font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium">
              SECTION III — HAUTE PARFUMERIE
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-[0.15em] text-[#29251F] uppercase mt-3 mb-4">
              THE <span className="italic font-normal text-[#B8862B]">COLLECTION</span>
            </h2>
          </Reveal>

          <GoldLine width="w-20" origin="center" delay={0.25} />

          <Reveal delay={0.35}>
            <p className="font-serif italic text-lg sm:text-xl text-[#685E52] font-light mt-6">
              "Discover fragrances created to express your individuality."
            </p>
          </Reveal>
        </div>

        {/* Product Cards Grid with Staggered ScrollTrigger */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={handleAdd}
            />
          ))}
        </div>
      </div>

      {/* Quick View Modal Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#29251F]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-[#F8F4EC] w-full max-w-4xl rounded-2xl p-6 sm:p-10 border border-[#B8862B]/30 shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close modal"
                className="interactive absolute top-6 right-6 p-2 rounded-full border border-[#B8862B]/30 text-[#29251F] hover:text-[#B8862B] transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Image */}
                <div className="md:col-span-6 relative aspect-[3/4] rounded-xl overflow-hidden bg-[#EFE7D8]">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#F8F4EC]/90 backdrop-blur-sm rounded-full text-[10px] tracking-widest text-[#7A5515] font-medium uppercase border border-[#B8862B]/20">
                    PARIS ATELIER
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-6 flex flex-col space-y-6">
                  <div>
                    <span className="text-xs tracking-[0.3em] font-sans text-[#7A5515] uppercase font-medium">
                      {selectedProduct.family}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#29251F] uppercase tracking-widest mt-1">
                      {selectedProduct.name}
                    </h3>
                    <p className="font-serif italic text-base text-[#685E52] mt-1">
                      {selectedProduct.subtitle}
                    </p>
                  </div>

                  <p className="font-sans text-sm text-[#685E52] font-light leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Scent Pyramid Notes */}
                  <div className="space-y-3 pt-4 border-t border-[#B8862B]/20">
                    <h4 className="text-xs font-sans tracking-[0.25em] text-[#7A5515] uppercase font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8862B]" />
                      <span>OLFACTORY PYRAMID</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-xs font-sans">
                      <div className="bg-[#EFE7D8]/60 p-2.5 rounded-lg border border-[#B8862B]/10">
                        <span className="text-[10px] text-[#7A5515] uppercase block font-medium">TOP</span>
                        <span className="text-[#29251F]">{selectedProduct.notes.top.join(", ")}</span>
                      </div>
                      <div className="bg-[#EFE7D8]/60 p-2.5 rounded-lg border border-[#B8862B]/10">
                        <span className="text-[10px] text-[#7A5515] uppercase block font-medium">HEART</span>
                        <span className="text-[#29251F]">{selectedProduct.notes.heart.join(", ")}</span>
                      </div>
                      <div className="bg-[#EFE7D8]/60 p-2.5 rounded-lg border border-[#B8862B]/10">
                        <span className="text-[10px] text-[#7A5515] uppercase block font-medium">BASE</span>
                        <span className="text-[#29251F]">{selectedProduct.notes.base.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-2">
                    <span className="text-xs tracking-wider uppercase text-[#7A5515] font-medium">
                      SELECT BOTTLE SIZE:
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedSize("50ml")}
                        className={`interactive flex-1 py-2.5 px-4 rounded-xl border text-xs font-medium uppercase tracking-widest transition-all ${
                          selectedSize === "50ml"
                            ? "border-[#B8862B] bg-[#B8862B] text-white shadow-md"
                            : "border-[#B8862B]/30 text-[#29251F] hover:border-[#B8862B]"
                        }`}
                      >
                        50ml (€180)
                      </button>
                      <button
                        onClick={() => setSelectedSize("100ml")}
                        className={`interactive flex-1 py-2.5 px-4 rounded-xl border text-xs font-medium uppercase tracking-widest transition-all ${
                          selectedSize === "100ml"
                            ? "border-[#B8862B] bg-[#B8862B] text-white shadow-md"
                            : "border-[#B8862B]/30 text-[#29251F] hover:border-[#B8862B]"
                        }`}
                      >
                        100ml (€260)
                      </button>
                    </div>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    onClick={() => handleAdd(selectedProduct)}
                    className="interactive w-full py-4 bg-[#29251F] hover:bg-[#B8862B] text-white font-medium text-xs uppercase tracking-[0.25em] rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>ADDED TO YOUR BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO SHOPPING BAG — {selectedSize === "50ml" ? selectedProduct.price : "€260"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
