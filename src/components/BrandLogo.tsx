"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  variant?: "full" | "minimal" | "stacked" | "monogram";
  className?: string;
  light?: boolean;
}

export default function BrandLogo({
  variant = "full",
  className = "",
}: BrandLogoProps) {
  if (variant === "monogram") {
    return (
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 ${className}`}
        style={{ mixBlendMode: "multiply" }}
      >
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Monogram"
          fill
          priority
          sizes="80px"
          style={{ mixBlendMode: "multiply" }}
          className="object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div
        className={`relative w-[220px] h-[130px] sm:w-[260px] sm:h-[150px] ${className}`}
        style={{ mixBlendMode: "multiply" }}
      >
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Official Brand Logo"
          fill
          priority
          sizes="(max-width: 768px) 220px, 260px"
          style={{ mixBlendMode: "multiply" }}
          className="object-contain transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={`relative w-[150px] h-[75px] sm:w-[180px] sm:h-[90px] ${className}`}
        style={{ mixBlendMode: "multiply" }}
      >
        <Image
          src="/images/logo.png"
          alt="The Soul Lifestyle Logo"
          fill
          priority
          sizes="180px"
          style={{ mixBlendMode: "multiply" }}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-[150px] h-[75px] sm:w-[190px] sm:h-[95px] ${className}`}
      style={{ mixBlendMode: "multiply" }}
    >
      <Image
        src="/images/logo.png"
        alt="The Soul Lifestyle French Fragrance Collection"
        fill
        priority
        sizes="190px"
        style={{ mixBlendMode: "multiply" }}
        className="object-contain transition-opacity duration-300 hover:opacity-90"
      />
    </div>
  );
}
