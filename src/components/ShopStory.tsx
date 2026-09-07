/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Award, Compass, HeartHandshake, Star } from 'lucide-react';
import { gaService } from '../services/googleAnalytics';

export const ShopStory: React.FC = () => {
  return (
    <section id="story" className="py-20 sm:py-28 bg-[#F3F6F2] border-y border-[#E4EAE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Floral Studio Photo Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1558350315-8aa00e8e4550?auto=format&fit=crop&w=1000&q=80"
                alt="Florist studio workbench with fresh cutting tools and peonies"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/60 text-xs">
                <span className="font-bold text-[#2E3F30] block">
                  Studio Master Florist: Clara Lindqvist
                </span>
                <span className="text-[#736E67]">
                  &ldquo;We arrange stems according to how they grew in the meadow—free, graceful, and natural.&rdquo;
                </span>
              </div>
            </div>

            {/* Decorative secondary badge */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-[#E8E4DD] max-w-[170px] text-center hidden sm:block">
              <div className="w-8 h-8 rounded-full bg-[#FAF1ED] text-[#C06043] flex items-center justify-center mx-auto mb-1 font-bold text-sm">
                ✿
              </div>
              <p className="text-[11px] font-bold text-[#2C2926]">100% Floral Foam Free</p>
              <p className="text-[10px] text-[#736E67]">Biodegradable and river-safe</p>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C06043] bg-[#FAF1ED] px-3 py-1 rounded-full">
              Our Botanical Story
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2C2926] leading-tight">
              Rooted in Seasonality, <br />
              <span className="italic font-normal text-[#4B634E]">Tied by Tradition</span>
            </h2>

            <p className="text-base text-[#5A554E] leading-relaxed">
              Founded in 2021 as a neighborhood florist cart, Petal & Stem was born from a desire to reconnect our community with the authentic, fragrant rhythms of local agriculture. Unlike industrial flowers flown across continents in cold storage, our stems are harvested within 40 miles of our studio.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE2] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3F6F2] text-[#4B634E] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-[#2C2926]">Direct Farm Ties</h4>
                <p className="text-[11px] text-[#736E67] leading-relaxed">
                  Partnering with 9 family-run heritage flower farms in the valley.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE2] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3F6F2] text-[#C06043] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-[#2C2926]">Cold-Water Transit</h4>
                <p className="text-[11px] text-[#736E67] leading-relaxed">
                  Every bouquet travels in hydration pouches, never dry stems.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4EAE2] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3F6F2] text-[#2E3F30] flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-xs text-[#2C2926]">Zero Plastic</h4>
                <p className="text-[11px] text-[#736E67] leading-relaxed">
                  Unbleached kraft paper wraps, cotton twine, and recycled boxes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials & Reviews */}
        <div id="reviews" className="space-y-8 pt-8 border-t border-[#E4EAE2]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#736E67]">
              Customer Love
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2926]">
              Words from Doorsteps & Tables
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'The Golden Hour peonies were unbelievable. They arrived perfectly guarded and bloomed for almost two full weeks in our dining room!',
                author: 'Sophia Sterling',
                role: 'Verified Recipient',
                rating: 5,
                flowers: 'Golden Hour Peony',
              },
              {
                quote:
                  'I ordered a bespoke wildflower arrangement for my sister’s anniversary. The handwritten calligraphy note made her burst into tears of joy.',
                author: 'Liam Davies',
                role: 'Regular Gifter',
                rating: 5,
                flowers: 'Provençal Wildflower Meadow',
              },
              {
                quote:
                  'Same-day delivery was prompt and effortless. The courier held the flowers carefully and sent a delivery picture right away.',
                author: 'Maya Chen',
                role: 'Local Resident',
                rating: 5,
                flowers: 'Coral Sunset Dahlia',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E4EAE2] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#5A554E] italic leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3F6F2] flex items-center justify-between text-[11px]">
                  <div>
                    <div className="font-bold text-[#2C2926]">{review.author}</div>
                    <div className="text-[#736E67]">{review.role}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#F3F6F2] text-[#4B634E] font-medium text-[10px]">
                    {review.flowers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
