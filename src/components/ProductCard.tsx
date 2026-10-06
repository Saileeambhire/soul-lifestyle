"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Eye, Plus, Sparkles } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  family: string;
  description: string;
  image: string;
  price: string;
  volume: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mistPuffTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showMistPuff, setShowMistPuff] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Desktop only tiny mist puff from bottle top
    if (window.innerWidth >= 1024) {
      setShowMistPuff(true);
      if (mistPuffTimeout.current) clearTimeout(mistPuffTimeout.current);
      mistPuffTimeout.current = setTimeout(() => {
        setShowMistPuff(false);
      }, 1200);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="product-card group relative flex flex-col bg-[#F8F4EC] rounded-2xl p-6 sm:p-8 border border-[#B8862B]/15 hover:border-[#B8862B]/40 transition-all duration-700 shadow-sm hover:shadow-2xl"
    >
      {/* Visual Image Container */}
      <div
        className="interactive relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-[#EFE7D8]/60 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        {/* Hover Gold Glow Backdrop */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr from-[#B8862B]/20 via-[#D6B56A]/10 to-transparent transition-opacity duration-700 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Tiny Mist Puff (Desktop Hover) */}
        {showMistPuff && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-t from-[#B8862B]/30 via-white/40 to-transparent blur-md animate-ping" />
            <Sparkles className="w-4 h-4 text-[#D6B56A] absolute top-1 left-4 animate-bounce" />
          </div>
        )}

        {/* Product Image */}
        <div
          className={`relative w-full h-full transform transition-all duration-700 ${
            isHovered ? "scale-105 -translate-y-2" : "scale-100 translate-y-0"
          }`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover rounded-xl"
          />
        </div>

        {/* Quick View Floating Pill Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          aria-label={`Quick view ${product.name}`}
          className={`interactive absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#29251F]/90 backdrop-blur-md text-white text-xs tracking-[0.2em] font-medium uppercase rounded-full transition-all duration-500 hover:bg-[#B8862B] flex items-center gap-2 shadow-lg ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>QUICK DISCOVER</span>
        </button>
      </div>

      {/* Fragrance Family Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.3em] font-sans font-medium text-[#7A5515] uppercase">
          {product.family}
        </span>
        <span className="font-serif text-sm font-normal text-[#29251F]">
          {product.price}
        </span>
      </div>

      {/* Product Title */}
      <h3
        onClick={() => onQuickView(product)}
        className="interactive font-serif text-2xl sm:text-3xl font-light tracking-widest text-[#29251F] uppercase group-hover:text-[#B8862B] transition-colors duration-300 cursor-pointer mb-2"
      >
        {product.name}
      </h3>

      {/* Subtitle / Description */}
      <p className="font-sans text-xs text-[#685E52] leading-relaxed font-light mb-6 flex-grow">
        {product.description}
      </p>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#B8862B]/15 flex items-center justify-between mt-auto">
        <button
          onClick={() => onQuickView(product)}
          className="interactive inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#29251F] group-hover:text-[#B8862B] font-medium transition-colors"
        >
          <span>DISCOVER</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        <button
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to bag`}
          className="interactive p-2.5 rounded-full border border-[#B8862B]/30 text-[#7A5515] hover:bg-[#B8862B] hover:text-white hover:border-[#B8862B] transition-all duration-300 focus:outline-none"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
