"use client";

import React, { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FragranceIntro from "@/components/FragranceIntro";
import Collection, { Product, PRODUCTS } from "@/components/Collection";
import FragranceNotes from "@/components/FragranceNotes";
import FindYourSoul from "@/components/FindYourSoul";
import FragranceJourney from "@/components/FragranceJourney";
import BrandStory from "@/components/BrandStory";
import Editorial from "@/components/Editorial";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Pre-loaded default sample
      quantity: 1,
      selectedSize: "50ml",
    },
  ]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: "50ml" }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <CustomCursor />

      {/* Floating Header */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        cartCount={totalItemsCount}
      />

      {/* Main Page Sections */}
      <main className="w-full relative bg-[#F8F4EC] overflow-x-clip">
        {/* Hero Section */}
        <Hero
          onDiscoverClick={() => {
            const collectionElem = document.getElementById("collection");
            collectionElem?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Section 2: The Art of Fragrance */}
        <FragranceIntro />

        {/* Section 3: The Collection */}
        <Collection onAddToCart={handleAddToCart} />

        {/* Section 4: Interactive Fragrance Notes */}
        <FragranceNotes />

        {/* Section 5: Find Your Soul (Personality Quiz) */}
        <FindYourSoul
          onSelectProduct={() => {
            const collectionElem = document.getElementById("collection");
            collectionElem?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Section 6: Fragrance Journey */}
        <FragranceJourney />

        {/* Section 7: Brand Story */}
        <BrandStory />

        {/* Section 8: Editorial Campaign */}
        <Editorial />

        {/* Section 9: Wear Your Soul Climax */}
        <FinalCTA
          onDiscoverClick={() => {
            const collectionElem = document.getElementById("collection");
            collectionElem?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}
