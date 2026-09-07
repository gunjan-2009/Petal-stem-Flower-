/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Instagram, Facebook, BarChart3, Check } from 'lucide-react';
import { gaService } from '../services/googleAnalytics';

interface FooterProps {
  onOpenAnalytics: () => void;
  onExploreCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAnalytics, onExploreCategory }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    gaService.trackEvent('newsletter_subscribed', {
      source: 'footer',
      email_domain: email.split('@')[1] || 'unknown',
    });

    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="bg-[#2E3F30] text-[#FAF8F5] pt-16 pb-12 border-t border-[#3D5240]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3D5240] border border-[#556B57] flex items-center justify-center font-serif text-xl font-bold text-[#E8A598]">
                P
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide">
                Petal & Stem
              </span>
            </div>
            <p className="text-xs text-[#C5D3C8] leading-relaxed max-w-sm">
              An independent botanical floral studio dedicated to locally grown seasonal flowers, biodegradable kraft wrapping, and bespoke hand-tied arrangements that honor the poetry of nature.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenAnalytics();
                  gaService.trackEvent('footer_analytics_hub_clicked');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3D5240] hover:bg-[#4D6551] text-xs text-[#FAF8F5] transition-colors border border-[#556B57] cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#E8A598]" />
                <span>Google Analytics Matrix & Hub</span>
              </button>
            </div>
          </div>

          {/* Column 2: Floral Collections */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#E8A598] uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#C5D3C8]">
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  Seasonal Peonies
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  Wildflower Meadow
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  Romantic Roses
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  Everlasting Dried
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  Living Houseplants
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Studio Hours & Address */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#E8A598] uppercase">
              Studio & Delivery
            </h4>
            <div className="space-y-2.5 text-xs text-[#C5D3C8]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A598] shrink-0 mt-0.5" />
                <span>418 Gardenia Way, Historic Floral District</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#E8A598] shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 8:00 AM – 6:30 PM</p>
                  <p>Sunday: 9:00 AM – 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8A598] shrink-0" />
                <span>(555) 246-8891</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-[#E8A598] uppercase">
              Field Notes Newsletter
            </h4>
            <p className="text-xs text-[#C5D3C8]">
              Receive early harvest alerts, workshop invitations, and flower care guides once a month.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-20 py-2 rounded-lg bg-[#3D5240] border border-[#556B57] text-xs text-white placeholder-[#9BAEA0] focus:outline-none focus:ring-1 focus:ring-[#E8A598]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#C06043] hover:bg-[#A24B31] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              {isSubscribed && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Welcome to our botanical circle!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-[#3D5240] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BAEA0]">
          <div>
            © {new Date().getFullYear()} Petal & Stem Floral Studio Co. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Google Analytics 4 Matrix Ready</span>
            </span>
            <span>•</span>
            <span>Zero Plastic Packaging</span>
            <span>•</span>
            <span>Local Delivery Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
