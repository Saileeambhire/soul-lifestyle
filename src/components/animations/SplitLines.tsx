"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SplitLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

export default function SplitLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
}: SplitLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = container.querySelectorAll(".split-line-inner");

    if (prefersReducedMotion) {
      gsap.set(elements, { yPercent: 0, opacity: 1 });
      return;
    }

    const anim = gsap.fromTo(
      elements,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        delay,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [delay]);

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden leading-tight my-1">
          <div className={`split-line-inner inline-block ${lineClassName}`}>
            {line}
          </div>
        </div>
      ))}
    </div>
  );
}
