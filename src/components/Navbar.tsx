/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, BarChart3, Sparkles, Heart, Clock } from 'lucide-react';
import { gaService } from '../services/googleAnalytics';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAnalytics: () => void;
  activeMeasurementId: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAnalytics,
  activeMeasurementId,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E4DD] transition-all">
      {/* Top Notification Announcement Banner */}
      <div className="bg-[#2E3F30] text-[#FAF8F5] text-xs py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E8A598]/30 text-[#E8A598] text-[10px]">
              ✿
            </span>
            <span>Fresh seasonal blooms picked daily • Free local courier delivery on orders over $65</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                onOpenAnalytics();
                gaService.trackEvent('navbar_ga_badge_clicked', { source: 'top_banner' });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3D5240] hover:bg-[#4D6551] text-[#E4EAE2] transition-colors cursor-pointer border border-[#556B57]"
              title="Click to open Google Analytics Matrix & Live Data Stream"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px]">GA4: {activeMeasurementId || 'Connected'}</span>
            </button>
            <span className="hidden md:inline-block text-[#9BAEA0]">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#C5D3C8]">
              <Clock className="w-3 h-3 text-[#E8A598]" /> Same-day cut-off: 2:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-3 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              gaService.trackPageView('/', 'Petal & Stem Home');
            }}
          >
            <div className="w-11 h-11 rounded-full bg-[#F3F6F2] border border-[#D5DDD2] flex items-center justify-center text-[#2E3F30] group-hover:bg-[#E4EAE2] transition-colors shadow-xs">
              <span className="font-serif text-2xl font-bold italic text-[#C06043]">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl tracking-wide font-semibold text-[#2C2926]">
                  Petal & Stem
                </span>
                <span className="text-xs tracking-widest uppercase font-semibold text-[#C06043] bg-[#FAF1ED] px-1.5 py-0.5 rounded">
                  Studio
                </span>
              </div>
              <p className="text-[11px] tracking-widest uppercase text-[#736E67] font-medium">
                Artisan Botanical Florist
              </p>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4A4640]">
          <a
            href="#catalog"
            onClick={() => gaService.trackEvent('nav_click', { link: 'seasonal_blooms' })}
            className="hover:text-[#C06043] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C06043] hover:after:w-full after:transition-all"
          >
            Seasonal Blooms
          </a>
          <a
            href="#story"
            onClick={() => gaService.trackEvent('nav_click', { link: 'our_craft' })}
            className="hover:text-[#C06043] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C06043] hover:after:w-full after:transition-all"
          >
            Our Craft & Farm
          </a>
          <a
            href="#occasions"
            onClick={() => gaService.trackEvent('nav_click', { link: 'occasions' })}
            className="hover:text-[#C06043] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C06043] hover:after:w-full after:transition-all"
          >
            Gifting Occasions
          </a>
          <a
            href="#reviews"
            onClick={() => gaService.trackEvent('nav_click', { link: 'testimonials' })}
            className="hover:text-[#C06043] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C06043] hover:after:w-full after:transition-all"
          >
            Kind Words
          </a>
        </nav>

        {/* Right Actions: Analytics Hub Button & Cart */}
        <div className="flex items-center gap-3">
          {/* Analytics Matrix Hub Button */}
          <button
            onClick={() => {
              onOpenAnalytics();
              gaService.trackEvent('analytics_matrix_opened', { button_location: 'navbar' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F3F6F2] hover:bg-[#E4EAE2] text-[#2E3F30] border border-[#D5DDD2] text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow hover:scale-[1.02] cursor-pointer"
            title="Open Google Analytics Matrix & Realtime Metrics"
          >
            <BarChart3 className="w-4 h-4 text-[#C06043]" />
            <span className="hidden sm:inline">Analytics Matrix</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => {
              onOpenCart();
              gaService.trackEvent('view_cart', { total_items: cartCount });
            }}
            className="relative p-2.5 rounded-full bg-[#2E3F30] hover:bg-[#3D5240] text-white transition-all shadow-xs hover:shadow cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C06043] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF8F5] shadow-xs animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
