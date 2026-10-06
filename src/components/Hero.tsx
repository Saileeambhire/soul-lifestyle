"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandLogo from "./BrandLogo";
import SprayEffect, { SprayEffectHandle } from "./SprayEffect";

interface HeroProps {
  onDiscoverClick?: () => void;
}

export default function Hero({ onDiscoverClick }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const bottleContainerRef = useRef<HTMLDivElement>(null);
  const bottleInnerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sprayRef = useRef<SprayEffectHandle>(null);
  const hasScrolledSprayFired = useRef<boolean>(false);

  // Calculate nozzle position accurately
  const getNozzlePosition = useCallback(() => {
    if (!heroRef.current || !bottleInnerRef.current) return null;
    const heroRect = heroRef.current.getBoundingClientRect();
    const bottleRect = bottleInnerRef.current.getBoundingClientRect();

    return {
      x: bottleRect.left - heroRect.left + bottleRect.width * 0.5,
      y: bottleRect.top - heroRect.top + bottleRect.height * 0.12,
    };
  }, []);

  // Interactive manual spray trigger (on bottle click)
  const handleBottleClick = useCallback(() => {
    if (!bottleInnerRef.current || !sprayRef.current) return;

    gsap
      .timeline()
      .to(bottleInnerRef.current, {
        rotation: 5,
        y: 4,
        scale: 0.98,
        duration: 0.18,
        ease: "power2.out",
      })
      .call(() => {
        sprayRef.current?.spray();
      })
      .to(bottleInnerRef.current, {
        rotation: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
      });
  }, []);

  // Ambient mist interval
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
      // 1. Initial State Setup
      if (circleRef.current) {
        const length = circleRef.current.getTotalLength() || 2073;
        gsap.set(circleRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.8,
        });
      }

      gsap.set([logoRef.current, starRef.current, tagRef.current, ctaRef.current], {
        opacity: 0,
        y: 25,
      });

      gsap.set(headlineRef.current, {
        opacity: 0,
        filter: "blur(14px)",
        scale: 0.96,
        y: 20,
      });

      gsap.set(subtextRef.current, {
        opacity: 0,
        filter: "blur(8px)",
        y: 15,
      });

      gsap.set(bottleContainerRef.current, {
        opacity: 0,
        y: 90,
        scale: 0.92,
      });

      // Simple fade for reduced motion
      if (prefersReducedMotion) {
        gsap.to(
          [
            circleRef.current,
            logoRef.current,
            starRef.current,
            bottleContainerRef.current,
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
            duration: 0.8,
            stagger: 0.1,
          }
        );
        return;
      }

      // 2. Cinematic Opening Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.3,
      });

      // Step 1: Gold circle draws
      tl.to(circleRef.current, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
      })
        // Step 2: Logo and sparkle twinkle
        .to(logoRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=1.4")
        .to(starRef.current, { opacity: 1, scale: 1.2, duration: 0.6 }, "-=0.9")
        // Step 3: Bottle rises with soft easing and slight settle
        .to(
          bottleContainerRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
          },
          "-=0.7"
        )
        // Step 4: SPRAY MOMENT - Bottle tilts, cap presses, mist bursts!
        .to(
          bottleInnerRef.current,
          {
            rotation: 5.5,
            y: 5,
            duration: 0.22,
            ease: "power2.in",
          },
          "+=0.1"
        )
        .call(() => {
          sprayRef.current?.spray();
        })
        .to(bottleInnerRef.current, {
          rotation: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1, 0.4)",
        })
        // Step 5: "WEAR YOUR SOUL" reveals through mist
        .to(
          tagRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          subtextRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
          },
          "-=0.7"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.5"
        )
        // Step 6: Start continuous subtle bottle float & glow pulse
        .call(() => {
          gsap.to(bottleInnerRef.current, {
            y: -8,
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0.65,
              scale: 1.12,
              duration: 3.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        });

      // 3. Hero ScrollTrigger Scrub (Pinned briefly)
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          onUpdate: (self) => {
            // Fire one extra spray when user begins scrolling
            if (self.progress > 0.05 && !hasScrolledSprayFired.current) {
              hasScrolledSprayFired.current = true;
              sprayRef.current?.spray();
            } else if (self.progress < 0.02) {
              hasScrolledSprayFired.current = false;
            }
          },
          animation: gsap
            .timeline()
            .to(bottleContainerRef.current, {
              scale: 1.15,
              y: -50,
              opacity: 0.85,
              ease: "none",
            })
            .to(
              circleRef.current,
              {
                scale: 2.2,
                opacity: 0.15,
                transformOrigin: "center center",
                ease: "none",
              },
              0
            )
            .to(
              [headlineRef.current, subtextRef.current, tagRef.current, ctaRef.current, logoRef.current],
              {
                y: -60,
                opacity: 0,
                filter: "blur(10px)",
                stagger: 0.03,
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
      className="relative min-h-screen w-full flex items-center justify-center bg-[#F8F4EC] pt-24 pb-16 px-6 overflow-hidden select-none"
    >
      {/* 2D Canvas Perfume Spray Mist */}
      <SprayEffect ref={sprayRef} getNozzlePosition={getNozzlePosition} />

      {/* Decorative Gold Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#EFE7D8]/60 via-[#F8F4EC]/90 to-[#F8F4EC] pointer-events-none" />

      {/* Animated SVG Gold Circular Line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] lg:w-[700px] lg:h-[700px]"
          viewBox="0 0 700 700"
          fill="none"
        >
          <circle
            ref={circleRef}
            cx="350"
            cy="350"
            r="330"
            stroke="#B8862B"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          <circle
            cx="350"
            cy="350"
            r="345"
            stroke="#D6B56A"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Brand Logo */}
        <div ref={logoRef} className="mb-2">
          <BrandLogo variant="stacked" />
        </div>

        {/* Gold Star Sparkle */}
        <div ref={starRef} className="my-1">
          <span className="text-[#B8862B] text-xl tracking-widest inline-block animate-pulse">
            ✦
          </span>
        </div>

        {/* Perfume Bottle Container with tilt and click to spray */}
        <div
          ref={bottleContainerRef}
          onClick={handleBottleClick}
          className="interactive relative w-[230px] h-[290px] sm:w-[300px] sm:h-[370px] md:w-[360px] md:h-[440px] my-3 cursor-pointer group"
          title="Click to spray the fragrance"
        >
          {/* Subtle Glow Aura behind bottle */}
          <div
            ref={glowRef}
            className="absolute inset-x-8 bottom-2 top-10 bg-gradient-to-t from-[#B8862B]/25 via-[#D6B56A]/15 to-transparent blur-2xl rounded-full -z-10 opacity-40 transition-opacity"
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
              sizes="(max-width: 768px) 260px, 360px"
              className="object-contain drop-shadow-[0_20px_35px_rgba(41,37,31,0.15)] rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* Subtle tap/click prompt on mobile/desktop */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] tracking-[0.2em] font-sans uppercase text-[#7A5515] bg-[#F8F4EC]/90 px-3 py-1 rounded-full border border-[#B8862B]/30 whitespace-nowrap shadow-sm pointer-events-none">
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
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.15em] text-[#29251F] uppercase my-2 leading-tight"
        >
          WEAR YOUR{" "}
          <span className="font-serif italic font-normal text-[#B8862B]">
            SOUL
          </span>
        </h1>

        {/* Supporting Quote */}
        <p
          ref={subtextRef}
          className="font-serif italic text-lg sm:text-2xl text-[#685E52] max-w-lg mx-auto my-2 font-light"
        >
          "A fragrance that becomes a part of you."
        </p>

        {/* CTA Button */}
        <div
          ref={ctaRef}
          className="mt-5"
          onMouseEnter={() => sprayRef.current?.spray(undefined, undefined, true)}
        >
          <a
            href="#collection"
            onClick={onDiscoverClick}
            className="interactive inline-flex items-center gap-3 px-8 py-4 border border-[#B8862B] text-[#7A5515] hover:text-white hover:bg-[#B8862B] transition-all duration-500 rounded-full tracking-[0.25em] text-xs font-medium uppercase group shadow-sm hover:shadow-md"
          >
            <span>DISCOVER THE COLLECTION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8862B] group-hover:bg-white transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
