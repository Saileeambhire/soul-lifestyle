"use client";

import React, { useState, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";
import { ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldLine from "./animations/GoldLine";
import Reveal from "./animations/Reveal";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const footer = footerRef.current;
    const links = linksRef.current;
    if (!footer || !links) return;

    const navItems = links.querySelectorAll(".footer-nav-item");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navItems,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: links,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="bg-[#EFE7D8] text-[#29251F] pt-20 pb-12 border-t border-[#B8862B]/20 relative"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Top Newsletter Atelier Block */}
        <Reveal delay={0.1}>
          <div className="bg-[#F8F4EC] rounded-3xl p-8 sm:p-12 border border-[#B8862B]/20 shadow-lg mb-16 max-w-4xl mx-auto text-center">
            <span className="text-[10px] tracking-[0.35em] font-sans font-semibold text-[#7A5515] uppercase">
              ATELIER JOURNAL
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-light text-[#29251F] uppercase mt-2 mb-3">
              JOIN THE <span className="italic font-normal text-[#B8862B]">PARISIAN PRIVÉ</span>
            </h3>
            <p className="font-serif italic text-sm sm:text-base text-[#685E52] max-w-md mx-auto mb-6">
              Receive exclusive fragrance invitations, bespoke formulation reveals, and complimentary sample gifts.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-auto flex-1 px-5 py-3.5 rounded-full bg-[#EFE7D8]/80 border border-[#B8862B]/30 text-xs font-sans text-[#29251F] placeholder-[#685E52]/60 focus:outline-none focus:border-[#B8862B]"
              />
              <button
                type="submit"
                className="interactive w-full sm:w-auto px-8 py-3.5 bg-[#29251F] hover:bg-[#B8862B] text-white text-xs tracking-[0.2em] font-medium uppercase rounded-full transition-colors duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>SUBSCRIBED</span>
                  </>
                ) : (
                  <>
                    <span>JOIN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </Reveal>

        {/* Center Logo & Brand Block */}
        <Reveal delay={0.2}>
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <BrandLogo variant="stacked" />
            <p className="font-serif italic text-lg text-[#7A5515]">"Wear Your Soul"</p>
          </div>
        </Reveal>

        {/* Main Navigation Links with Staggered Fade Up */}
        <nav
          ref={linksRef}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs tracking-[0.25em] font-medium uppercase text-[#29251F] mb-12"
        >
          <a href="#collection" className="footer-nav-item interactive hover:text-[#B8862B] transition-colors">
            COLLECTION
          </a>
          <a href="#story" className="footer-nav-item interactive hover:text-[#B8862B] transition-colors">
            OUR STORY
          </a>
          <a href="#notes" className="footer-nav-item interactive hover:text-[#B8862B] transition-colors">
            FRAGRANCE
          </a>
          <a href="#editorial" className="footer-nav-item interactive hover:text-[#B8862B] transition-colors">
            JOURNAL
          </a>
          <a href="#footer" className="footer-nav-item interactive hover:text-[#B8862B] transition-colors">
            CONTACT
          </a>
        </nav>

        {/* Thin Gold Divider Drawing from Center Outward */}
        <GoldLine width="w-full" origin="center" delay={0.1} className="mb-8" />

        {/* Social & Legal Links Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#685E52] font-sans font-light">
          {/* Social */}
          <div className="flex items-center space-x-6 tracking-widest uppercase text-[11px]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="interactive hover:text-[#B8862B] transition-colors">
              INSTAGRAM
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="interactive hover:text-[#B8862B] transition-colors">
              FACEBOOK
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="interactive hover:text-[#B8862B] transition-colors">
              PINTEREST
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center">
            © 2026 The Soul Lifestyle. All rights reserved.
          </p>

          {/* Legal */}
          <div className="flex items-center space-x-6 text-[11px] tracking-wider uppercase">
            <a href="#" className="interactive hover:text-[#B8862B] transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="interactive hover:text-[#B8862B] transition-colors">
              TERMS & CONDITIONS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
