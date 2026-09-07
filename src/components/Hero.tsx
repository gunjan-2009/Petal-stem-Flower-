/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Truck, BarChart3, Heart } from 'lucide-react';
import { gaService } from '../services/googleAnalytics';

interface HeroProps {
  onExploreClick: () => void;
  onOpenAnalytics: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenAnalytics }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE8]/40 to-[#FAF8F5]">
      {/* Subtle organic background foliage glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8A598]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C5D3C8]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4EAE2] border border-[#CCD8C9] text-[#2E3F30] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C06043]" />
              <span>Autumn & Summer Harvest 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2C2926] leading-[1.12] tracking-tight">
              Bespoke Blooms Grown with Care, <br />
              <span className="italic font-normal text-[#C06043]">
                Arranged by Hand
              </span>
            </h1>

            <p className="text-lg text-[#5A554E] max-w-2xl leading-relaxed font-normal">
              Fresh seasonal bouquets celebrating nature’s fleeting poetry. Sourced directly from local organic flower farms and hand-tied each morning in our boutique studio with botanical care.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  onExploreClick();
                  gaService.trackEvent('hero_cta_clicked', { action: 'explore_catalog' });
                }}
                className="px-7 py-3.5 rounded-full bg-[#2E3F30] hover:bg-[#3D5240] text-white font-medium text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Seasonal Stems</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onOpenAnalytics();
                  gaService.trackEvent('hero_cta_clicked', { action: 'view_analytics_matrix' });
                }}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F3F6F2] text-[#2E3F30] border border-[#D5DDD2] font-medium text-sm tracking-wide transition-all shadow-xs hover:shadow flex items-center gap-2.5 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-[#C06043]" />
                <span>Open Analytics Matrix</span>
                <span className="text-[10px] bg-[#FAF1ED] text-[#C06043] font-semibold px-2 py-0.5 rounded-full">
                  GA4 Live
                </span>
              </button>
            </div>

            {/* Value Props Bar */}
            <div className="pt-8 border-t border-[#E8E4DD] grid grid-cols-3 gap-4 text-xs text-[#5A554E]">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-[#F3F6F2] text-[#2E3F30] shrink-0">
                  <Truck className="w-4 h-4 text-[#C06043]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C2926] text-xs">Same-Day Courier</h4>
                  <p className="text-[11px] text-[#736E67]">Hydrated stem boxes</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-[#F3F6F2] text-[#2E3F30] shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#4B634E]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C2926] text-xs">7-Day Freshness</h4>
                  <p className="text-[11px] text-[#736E67]">Stem guarantee & food</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-[#F3F6F2] text-[#2E3F30] shrink-0">
                  <Heart className="w-4 h-4 text-[#C06043]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2C2926] text-xs">Eco Kraft Wrap</h4>
                  <p className="text-[11px] text-[#736E67]">Zero plastic packaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisan florist arranging fresh peonies and garden roses"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                {/* Floating caption card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-bold text-[#C06043]">
                        Florist Choice of the Week
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                        Golden Hour Coral Peony
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#736E67]">From</span>
                      <div className="font-serif text-xl font-bold text-[#2E3F30]">$78</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Mini Card */}
              <div className="absolute -bottom-6 -left-6 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E4EAE2] shadow-xl hidden sm:flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=200&q=80"
                  alt="Wildflower bunch"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    ★ ★ ★ ★ ★ <span className="text-[#5A554E] font-medium ml-1">4.9/5</span>
                  </div>
                  <p className="text-xs font-semibold text-[#2C2926]">Over 2,400 bouquets delivered</p>
                </div>
              </div>

              {/* Decorative Stamp */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[#C06043] text-white flex flex-col items-center justify-center text-center p-2 shadow-lg rotate-12">
                <span className="text-[9px] uppercase tracking-widest font-medium">Harvest</span>
                <span className="text-xs font-bold font-serif">TODAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
