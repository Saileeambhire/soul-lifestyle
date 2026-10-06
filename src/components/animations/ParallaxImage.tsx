"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // yPercent travel
  aspectRatio?: string;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 15,
  aspectRatio = "aspect-[4/5]",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const parallaxAnim = gsap.fromTo(
      img,
      { yPercent: -speed / 2, scale: 1.08 },
      {
        yPercent: speed / 2,
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

    return () => {
      parallaxAnim.kill();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}
    >
      <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
