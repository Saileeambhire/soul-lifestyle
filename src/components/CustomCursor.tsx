"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Lerp smoothed spring for trailing outer ring
  const springX = useSpring(mouseX, { stiffness: 280, damping: 24, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".product-card") ||
        target.closest(".interactive") ||
        target.classList.contains("interactive") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Central Sharp Gold Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[999] rounded-full bg-[#B8862B] custom-cursor-element"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
        }}
        animate={{
          scale: isHovered ? 2 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Lerp-Smoothed Trailing Ring (using numeric rgba for valid Framer Motion interpolations) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[998] rounded-full border border-[#B8862B]/50 custom-cursor-element"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
        }}
        animate={{
          scale: isHovered ? 1.7 : 1,
          borderColor: isHovered ? "rgba(184, 134, 43, 0.85)" : "rgba(184, 134, 43, 0.4)",
          backgroundColor: isHovered ? "rgba(184, 134, 43, 0.08)" : "rgba(184, 134, 43, 0)",
        }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}
