"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight, Gift } from "lucide-react";
import Image from "next/image";
import { Product } from "./Collection";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: "50ml" | "100ml";
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = item.selectedSize === "50ml" ? 180 : 260;
    return acc + numericPrice * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#29251F]/60 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F8F4EC] border-l border-[#B8862B]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#B8862B]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#B8862B]" />
                <h3 className="font-serif text-2xl font-light text-[#29251F] uppercase tracking-wider">
                  YOUR SHOPPING BAG
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="interactive p-2 text-[#29251F] hover:text-[#B8862B] transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFE7D8] flex items-center justify-center mx-auto text-[#B8862B]">
                    <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                  </div>
                  <p className="font-serif italic text-xl text-[#29251F]">
                    Your shopping bag is empty.
                  </p>
                  <p className="font-sans text-xs text-[#685E52] max-w-xs mx-auto">
                    Explore our Haute Collection and discover your signature French scent.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-4 rounded-xl bg-[#EFE7D8]/60 border border-[#B8862B]/15"
                  >
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#F8F4EC] flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-lg font-light text-[#29251F] uppercase">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="interactive text-[#685E52] hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] font-sans text-[#7A5515]">
                          {item.selectedSize} Eau de Parfum
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#B8862B]/30 rounded-lg bg-[#F8F4EC]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="interactive px-2 py-0.5 text-xs text-[#29251F]"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-sans text-[#29251F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="interactive px-2 py-0.5 text-xs text-[#29251F]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-serif text-base font-medium text-[#29251F]">
                          €{(item.selectedSize === "50ml" ? 180 : 260) * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Complimentary Gift Box Banner */}
              {cartItems.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F8F4EC] border border-[#B8862B]/30 flex items-start gap-3">
                  <Gift className="w-5 h-5 text-[#B8862B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-sans font-semibold text-[#7A5515] uppercase">
                      COMPLIMENTARY PARISIAN GIFT BOX
                    </h5>
                    <p className="text-[11px] font-sans text-[#685E52] mt-0.5">
                      Includes 2x 2ml Discovery Vials & silk ribbon packaging.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#B8862B]/20 bg-[#EFE7D8]/50 space-y-4">
                <div className="flex justify-between items-center text-sm font-sans">
                  <span className="text-[#685E52] uppercase tracking-wider text-xs">
                    ESTIMATED SUBTOTAL
                  </span>
                  <span className="font-serif text-2xl font-normal text-[#29251F]">
                    €{subtotal}
                  </span>
                </div>
                <p className="text-[10px] font-sans text-[#685E52] text-center">
                  Complimentary worldwide express shipping & luxury gift box.
                </p>

                <button
                  onClick={() => alert("Proceeding to Parisian Luxury Checkout...")}
                  className="interactive w-full py-4 bg-[#B8862B] hover:bg-[#7A5515] text-white text-xs tracking-[0.25em] uppercase font-medium rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
