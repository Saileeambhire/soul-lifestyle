"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 1.1,
  y = 35,
  blur = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const anim = gsap.fromTo(
      el,
      {
        opacity: 0,
        y,
        filter: blur ? "blur(8px)" : "none",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [delay, duration, y, blur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
