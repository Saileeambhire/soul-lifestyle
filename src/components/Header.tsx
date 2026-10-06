"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Menu, ArrowRight } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
}

export default function Header({ onOpenCart, cartCount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 6) {
          setIsVisible(false);
        } else if (lastScrollY.current - currentScrollY > 6) {
          setIsVisible(true);
        }
      } else {
        setIsScrolled(false);
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "COLLECTION", href: "#collection" },
    { name: "OUR STORY", href: "#story" },
    { name: "FRAGRANCE", href: "#notes" },
    { name: "JOURNAL", href: "#editorial" },
    { name: "CONTACT", href: "#footer" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "glass-header py-3.5 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="interactive inline-block focus:outline-none">
            <BrandLogo />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="interactive relative text-xs tracking-[0.25em] font-medium uppercase text-[#29251F]/85 hover:text-[#B8862B] transition-colors duration-300 group py-1.5"
              >
                {link.name}
                {/* Gold Underline Drawing on Hover */}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#B8862B] to-[#D6B56A] transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions: Shopping Bag + Mobile Menu Trigger */}
          <div className="flex items-center space-x-5">
            <button
              onClick={onOpenCart}
              aria-label="Open Shopping Bag"
              className="interactive relative p-2.5 text-[#29251F] hover:text-[#B8862B] transition-colors duration-300 focus:outline-none rounded-full hover:bg-[#EFE7D8]/50"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B8862B] text-white text-[9px] font-medium flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="interactive lg:hidden p-2 text-[#29251F] hover:text-[#B8862B] transition-colors duration-300 focus:outline-none"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#F8F4EC] flex flex-col justify-between px-8 py-10 lg:hidden overflow-y-auto"
          >
            {/* Header in Mobile Menu */}
            <div className="flex items-center justify-between border-b border-[#B8862B]/20 pb-5">
              <BrandLogo variant="minimal" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
                className="interactive p-2 text-[#29251F] hover:text-[#B8862B] transition-colors focus:outline-none"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Links with Staggered Entrance */}
            <div className="my-auto py-8 space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.07 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="interactive group flex items-center justify-between text-2xl font-serif tracking-widest text-[#29251F] hover:text-[#B8862B] transition-colors py-2 border-b border-[#B8862B]/10"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-5 h-5 text-[#B8862B] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-[#B8862B]/20 text-center space-y-2">
              <p className="font-serif italic text-sm text-[#7A5515]">"Wear Your Soul"</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#29251F]/60">
                PARIS • FRENCH FRAGRANCE COLLECTION
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
