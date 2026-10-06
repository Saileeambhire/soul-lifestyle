"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GoldLineProps {
  className?: string;
  width?: string;
  origin?: "left" | "center" | "right";
  delay?: number;
}

export default function GoldLine({
  className = "",
  width = "w-24",
  origin = "center",
  delay = 0,
}: GoldLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = lineRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { scaleX: 1, opacity: 1 });
      return;
    }

    const transformOrigin =
      origin === "center" ? "center center" : origin === "left" ? "left center" : "right center";

    const anim = gsap.fromTo(
      el,
      { scaleX: 0, opacity: 0, transformOrigin },
      {
        scaleX: 1,
        opacity: 1,
        duration: 1.2,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [origin, delay]);

  return (
    <div
      ref={lineRef}
      className={`h-[1px] bg-gradient-to-r from-[#B8862B] via-[#D6B56A] to-[#B8862B] ${width} ${className}`}
    />
  );
}
