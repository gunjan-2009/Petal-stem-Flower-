/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FlowerCatalog } from './components/FlowerCatalog';
import { BouquetDetailModal } from './components/BouquetDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ShopStory } from './components/ShopStory';
import { AnalyticsMatrixModal } from './components/AnalyticsMatrixModal';
import { Footer } from './components/Footer';
import { BouquetItem, BouquetSize, CartItem } from './types';
import { gaService } from './services/googleAnalytics';
import { BarChart3, Sparkles, Heart, Gift, Truck } from 'lucide-react';

const STORAGE_KEY_CART = 'petal_stem_cart_items';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedBouquet, setSelectedBouquet] = useState<BouquetItem | null>(null);
  const [activeMeasurementId, setActiveMeasurementId] = useState(gaService.getMeasurementId());

  // Save cart to local storage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Initial mount GA4 page view & active measurement ID subscription
  useEffect(() => {
    gaService.trackPageView('/', 'Petal & Stem Home - Artisan Flower Shop');

    const unsubscribe = gaService.subscribeMatrix((matrix) => {
      setActiveMeasurementId(matrix.measurementId);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (
    bouquet: BouquetItem,
    size: BouquetSize,
    unitPrice: number,
    quantity: number,
    includeVase: boolean,
    giftMessage: string,
    recipientName: string,
    deliveryDate: string
  ) => {
    const newItem: CartItem = {
      id: `${bouquet.id}-${size}-${includeVase ? 'vase' : 'novase'}-${Date.now()}`,
      bouquet,
      size,
      unitPrice,
      quantity,
      includeVase,
      giftMessage,
      recipientName,
      deliveryDate,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleQuickAddToCart = (bouquet: BouquetItem) => {
    const newItem: CartItem = {
      id: `${bouquet.id}-classic-novase-${Date.now()}`,
      bouquet,
      size: 'classic',
      unitPrice: bouquet.price,
      quantity: 1,
      includeVase: bouquet.vaseIncludedDefault,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);

    gaService.trackEvent('quick_add_to_cart', {
      item_id: bouquet.id,
      item_name: bouquet.name,
      price: bouquet.price,
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C2926] selection:bg-[#E8A598]/40 selection:text-[#2E3F30]">
      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        activeMeasurementId={activeMeasurementId}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        />

        {/* Occasions Feature Banner */}
        <section id="occasions" className="py-12 bg-white border-y border-[#E8E4DD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Birthday & Joy', icon: '🎂', desc: 'Sunny dahlias & ranunculus' },
                { title: 'Anniversary & Romance', icon: '🌹', desc: 'Garden roses & sweet peas' },
                { title: 'Sympathy & Grace', icon: '🕊️', desc: 'White lilies & olive branches' },
                { title: 'Just Because / Thank You', icon: '🌿', desc: 'Meadow bunches & wildflowers' },
              ].map((occ, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    gaService.trackEvent('occasion_card_clicked', { occasion: occ.title });
                  }}
                  className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3F6F2] border border-[#E8E4DD] hover:border-[#CCD8C9] transition-all cursor-pointer group"
                >
                  <div className="text-2xl mb-1.5">{occ.icon}</div>
                  <h4 className="font-serif font-bold text-sm text-[#2C2926] group-hover:text-[#C06043] transition-colors">
                    {occ.title}
                  </h4>
                  <p className="text-[11px] text-[#736E67] mt-0.5">{occ.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flower Catalog Grid */}
        <FlowerCatalog
          onSelectBouquet={(item) => setSelectedBouquet(item)}
          onQuickAddToCart={handleQuickAddToCart}
        />

        {/* Florist Story & Philosophy */}
        <ShopStory />
      </main>

      {/* Footer */}
      <Footer
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExploreCategory={() => {
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Bouquet Customization & Detail Modal */}
      <BouquetDetailModal
        bouquet={selectedBouquet}
        onClose={() => setSelectedBouquet(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Google Analytics Matrix Dashboard Modal */}
      <AnalyticsMatrixModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Floating Bottom Quick-Action Bar for Analytics Matrix */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => {
            setIsAnalyticsOpen(true);
            gaService.trackEvent('floating_analytics_button_clicked');
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2E3F30] hover:bg-[#3D5240] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs font-semibold tracking-wide border border-white/20 cursor-pointer"
          title="Open Google Analytics Matrix"
        >
          <BarChart3 className="w-4 h-4 text-[#E8A598]" />
          <span className="hidden sm:inline">Analytics Matrix</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      </div>
    </div>
  );
}
