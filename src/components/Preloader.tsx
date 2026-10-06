"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Elegant quick preloader under 1.8s
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#F8F4EC] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-48 h-24 sm:w-56 sm:h-28 mb-4">
              <Image
                src="/images/logo.png"
                alt="The Soul Lifestyle"
                fill
                priority
                className="object-contain mix-blend-multiply"
              />
            </div>

            {/* Gold Drawing Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
              className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#B8862B] to-transparent origin-center my-2"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif italic text-xs text-[#7A5515] tracking-[0.25em] uppercase mt-2"
            >
              PARIS • HAUTE PARFUMERIE
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
