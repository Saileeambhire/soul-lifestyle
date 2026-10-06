"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";
import SprayEffect, { SprayEffectHandle, NOZZLE_OFFSET } from "./SprayEffect";

interface HeroProps {
  onDiscoverClick?: () => void;
}

export default function Hero({ onDiscoverClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const bottleInnerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sprayRef = useRef<SprayEffectHandle>(null);
  const hasScrolledSprayFired = useRef<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate nozzle position accurately relative to the hero container
  const getNozzlePosition = useCallback(() => {
    if (!heroRef.current || !bottleRef.current) return null;
    const heroRect = heroRef.current.getBoundingClientRect();
    const bottleRect = bottleRef.current.getBoundingClientRect();

    if (bottleRect.width === 0 || bottleRect.height === 0) return null;

    return {
      x: bottleRect.left + bottleRect.width * (0.5 + NOZZLE_OFFSET.x) - heroRect.left,
      y: bottleRect.top + bottleRect.height * (0.06 + NOZZLE_OFFSET.y) - heroRect.top,
    };
  }, []);

  // Interactive manual spray trigger (on bottle click / tap)
  const handleBottleClick = useCallback(() => {
    if (!bottleInnerRef.current || !sprayRef.current) return;

    gsap
      .timeline()
      .to(bottleInnerRef.current, {
        rotation: 5,
        y: 4,
        scale: 0.98,
        duration: 0.16,
        ease: "power2.out",
      })
      .call(() => {
        sprayRef.current?.spray();
      })
      .to(bottleInnerRef.current, {
        rotation: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(2)",
      });
  }, []);

  // Ambient mist interval every 9s
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        sprayRef.current?.spray(undefined, undefined, true);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Main GSAP Sequence & ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Circle dash setup
      if (circleRef.current) {
        const length = circleRef.current.getTotalLength() || 290;
        gsap.set(circleRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.8,
        });
      }

      // Safety fallback: if anything prevents the timeline from running, ensure visibility after 3.5s
      const fallbackTimer = setTimeout(() => {
        gsap.to(
          [
            circleRef.current,
            logoRef.current,
            starRef.current,
            bottleRef.current,
            headlineRef.current,
            tagRef.current,
            subtextRef.current,
            ctaRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
          }
        );
      }, 3500);

      // Reduced motion: immediate reveal
      if (prefersReducedMotion) {
        clearTimeout(fallbackTimer);
        gsap.to(
          [
            circleRef.current,
            logoRef.current,
            starRef.current,
            bottleRef.current,
            headlineRef.current,
            tagRef.current,
            subtextRef.current,
            ctaRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.08,
          }
        );
        return;
      }

      // 1. Cinematic Opening Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          clearTimeout(fallbackTimer);
          // Update nozzle position once bottle settles
          sprayRef.current?.updateNozzlePosition();

          // Continuous subtle float & glow pulse
          gsap.to(bottleInnerRef.current, {
            y: -8,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0.65,
              scale: 1.1,
              duration: 3.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        },
      });

      // Step 1: Gold circle draws
      tl.fromTo(
        circleRef.current,
        { strokeDashoffset: circleRef.current?.getTotalLength() || 290 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
        }
      )
        // Step 2: Logo and sparkle twinkle
        .fromTo(
          logoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=1.1"
        )
        .fromTo(
          starRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1.2, duration: 0.5 },
          "-=0.7"
        )
        // Step 3: Bottle rises from the bottom with soft easing
        .fromTo(
          bottleRef.current,
          { opacity: 0, y: 70, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.5"
        )
        // Step 4: SPRAY MOMENT - Bottle tilts 5°, cap presses down, mist bursts!
        .to(bottleInnerRef.current, {
          rotation: 5,
          y: 4,
          duration: 0.2,
          ease: "power2.in",
        })
        .call(() => {
          sprayRef.current?.spray();
        })
        .to(bottleInnerRef.current, {
          rotation: 0,
          y: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.4)",
        })
        // Step 5: "WEAR YOUR SOUL" reveals through mist
        .fromTo(
          tagRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.2"
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 20, filter: "blur(12px)", scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 15, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          "-=0.7"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        );

      // 2. Hero Scroll-Out ScrollTrigger Scrub (Acting on outer heroContentRef to prevent property collision)
      if (heroRef.current && heroContentRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress > 0.08 && !hasScrolledSprayFired.current) {
              hasScrolledSprayFired.current = true;
              sprayRef.current?.spray();
            } else if (self.progress < 0.02) {
              hasScrolledSprayFired.current = false;
            }
          },
          animation: gsap
            .timeline()
            .to(bottleRef.current, {
              scale: 1.12,
              y: -40,
              ease: "none",
            })
            .to(
              circleRef.current,
              {
                scale: 1.8,
                opacity: 0.1,
                transformOrigin: "center center",
                ease: "none",
              },
              0
            )
            .to(
              heroContentRef.current,
              {
                y: -60,
                opacity: 0.15,
                ease: "none",
              },
              0
            ),
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [handleBottleClick]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#F8F4EC] pt-20 pb-12 px-6 overflow-hidden select-none"
    >
      {/* 2D Canvas Perfume Spray Mist */}
      <SprayEffect ref={sprayRef} getNozzlePosition={getNozzlePosition} />

      {/* Decorative Warm Ivory Radial Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#EFE7D8]/60 via-[#F8F4EC]/90 to-[#F8F4EC] pointer-events-none" />

      {/* FIXED SIZE GOLD CIRCLE (min 70vh, 70vw) perfectly centered and fitting inside viewport */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          className="w-[min(68vh,68vw)] h-[min(68vh,68vw)] max-w-[580px] max-h-[580px] aspect-square"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="46"
            stroke="#B8862B"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#D6B56A"
            strokeWidth="0.3"
            strokeDasharray="2 3"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* Main Hero Container */}
      <div
        ref={heroContentRef}
        className="relative z-20 max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto"
      >
        {/* Brand Logo with mix-blend-mode */}
        <div ref={logoRef} className="mb-1">
          <BrandLogo variant="stacked" />
        </div>

        {/* Gold Star Sparkle */}
        <div ref={starRef} className="my-0.5">
          <span className="text-[#B8862B] text-lg sm:text-xl tracking-widest inline-block animate-pulse">
            ✦
          </span>
        </div>

        {/* Perfume Bottle Container with tilt and click to spray */}
        <div
          ref={bottleRef}
          onClick={handleBottleClick}
          className="interactive relative w-[210px] h-[260px] sm:w-[270px] sm:h-[330px] md:w-[320px] md:h-[390px] my-2 cursor-pointer group"
          title="Click to spray the fragrance"
        >
          {/* Subtle Glow Aura behind bottle */}
          <div
            ref={glowRef}
            className="absolute inset-x-8 bottom-2 top-8 bg-gradient-to-t from-[#B8862B]/30 via-[#D6B56A]/20 to-transparent blur-2xl rounded-full -z-10 opacity-50 transition-opacity"
          />

          {/* Inner animated wrapper for tilt, press, and float */}
          <div
            ref={bottleInnerRef}
            className="relative w-full h-full transform-gpu origin-bottom"
          >
            <Image
              src="/images/hero_perfume.jpg"
              alt="The Soul Lifestyle Luxury Perfume Bottle"
              fill
              priority
              sizes="(max-width: 768px) 240px, 320px"
              onLoad={() => {
                setImageLoaded(true);
                sprayRef.current?.updateNozzlePosition();
              }}
              className="object-contain drop-shadow-[0_20px_35px_rgba(41,37,31,0.18)] rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* Subtle hover prompt */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] sm:text-[10px] tracking-[0.2em] font-sans uppercase text-[#7A5515] bg-[#F8F4EC]/95 px-3 py-1 rounded-full border border-[#B8862B]/30 whitespace-nowrap shadow-sm pointer-events-none">
            Tap bottle to spray ✦
          </div>
        </div>

        {/* French Fragrance Collection Tag */}
        <p
          ref={tagRef}
          className="text-xs sm:text-sm font-sans tracking-[0.35em] text-[#7A5515] uppercase font-medium mt-1 mb-1"
        >
          FRENCH FRAGRANCE COLLECTION
        </p>

        {/* Hero Main Heading: WEAR YOUR SOUL */}
        <h1
          ref={headlineRef}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-[#29251F] uppercase my-1.5 leading-tight"
        >
          WEAR YOUR{" "}
          <span className="font-serif italic font-normal text-[#B8862B]">
            SOUL
          </span>
        </h1>

        {/* Supporting Quote */}
        <p
          ref={subtextRef}
          className="font-serif italic text-base sm:text-xl text-[#685E52] max-w-lg mx-auto my-1.5 font-light"
        >
          "A fragrance that becomes a part of you."
        </p>

        {/* CTA Button */}
        <div
          ref={ctaRef}
          className="mt-4"
          onMouseEnter={() => sprayRef.current?.spray(undefined, undefined, true)}
        >
          <a
            href="#collection"
            onClick={onDiscoverClick}
            className="interactive inline-flex items-center gap-3 px-8 py-3.5 border border-[#B8862B] text-[#7A5515] hover:text-white hover:bg-[#B8862B] transition-all duration-500 rounded-full tracking-[0.25em] text-xs font-medium uppercase group shadow-sm hover:shadow-md"
          >
            <span>DISCOVER THE COLLECTION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8862B] group-hover:bg-white transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
