"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  variant?: "full" | "minimal" | "stacked" | "monogram";
  className?: string;
  light?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function BrandLogo({
  variant = "full",
  className = "",
  light = false,
}: BrandLogoProps) {
  if (variant === "monogram") {
    return (
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 ${className}`}>
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Monogram"
          fill
          priority
          className="object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`relative w-[220px] h-[130px] sm:w-[280px] sm:h-[160px] ${className}`}>
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Official Brand Logo"
          fill
          priority
          sizes="(max-width: 768px) 220px, 280px"
          className="object-contain mix-blend-multiply transition-transform duration-700 hover:scale-102"
        />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] ${className}`}>
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Logo"
          fill
          priority
          sizes="180px"
          className="object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-[160px] h-[80px] sm:w-[200px] sm:h-[100px] ${className}`}>
      <Image
        src="/images/logo.png"
        alt="The Soul Lifestyle French Fragrance Collection"
        fill
        priority
        sizes="200px"
        className="object-contain mix-blend-multiply transition-opacity duration-300 hover:opacity-90"
      />
    </div>
  );
}
