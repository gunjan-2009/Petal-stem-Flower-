/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { BouquetItem, FlowerCategory } from '../types';
import { FLOWER_PRODUCTS } from '../data/flowerProducts';
import { gaService } from '../services/googleAnalytics';

interface FlowerCatalogProps {
  onSelectBouquet: (bouquet: BouquetItem) => void;
  onQuickAddToCart: (bouquet: BouquetItem) => void;
}

const CATEGORIES: { id: FlowerCategory; label: string }[] = [
  { id: 'all', label: 'All Bouquets' },
  { id: 'romantic', label: 'Romantic Roses' },
  { id: 'wildflower', label: 'Wildflower Meadow' },
  { id: 'celebration', label: 'Celebration & Gifts' },
  { id: 'comfort', label: 'Comfort & Sympathy' },
  { id: 'everlasting', label: 'Everlasting Dried' },
  { id: 'plants', label: 'Living Plants' },
];

export const FlowerCatalog: React.FC<FlowerCatalogProps> = ({
  onSelectBouquet,
  onQuickAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FlowerCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return FLOWER_PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.includes.some((stem) => stem.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat: FlowerCategory) => {
    setSelectedCategory(cat);
    gaService.trackEvent('catalog_filter_changed', {
      category: cat,
      item_count: filteredProducts.length,
    });
  };

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C06043] bg-[#FAF1ED] px-3 py-1 rounded-full">
            Artisan Harvest Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2C2926]">
            Seasonal Handcrafted Bouquets
          </h2>
          <p className="text-base text-[#5A554E] leading-relaxed">
            Freshly stem-cut every sunrise. Each arrangement arrives wrapped in recyclable kraft paper with our botanical floral food sachet and custom handwritten note.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="space-y-4 mb-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === 'all'
                  ? FLOWER_PRODUCTS.length
                  : FLOWER_PRODUCTS.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2E3F30] text-white shadow-sm'
                      : 'bg-white text-[#5A554E] hover:bg-[#F3F6F2] border border-[#E8E4DD]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedCategory === cat.id
                        ? 'bg-[#3D5240] text-white'
                        : 'bg-[#F3F6F2] text-[#736E67]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#736E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 2) {
                    gaService.trackEvent('search_flowers', { search_term: e.target.value });
                  }
                }}
                placeholder="Search peonies, dahlias, roses..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30] placeholder-[#9E988F]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-[#736E67]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-medium px-3 py-2 rounded-full border border-[#D5DDD2] bg-white text-[#2C2926] focus:outline-none focus:ring-1 focus:ring-[#2E3F30] cursor-pointer"
              >
                <option value="featured">Florist Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E4DD] space-y-3">
            <div className="text-3xl">🌸</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C2926]">No bouquets matched</h3>
            <p className="text-xs text-[#736E67] max-w-sm mx-auto">
              We couldn’t find floral arrangements matching &quot;{searchQuery}&quot;. Try selecting &quot;All Bouquets&quot; or searching for another variety.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-semibold text-[#C06043] underline hover:opacity-80"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F3F6F2] cursor-pointer" onClick={() => onSelectBouquet(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#2E3F30] shadow-xs backdrop-blur-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute top-3 right-3 bg-white/90 text-[#2C2926] text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>{item.rating}</span>
                  </div>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBouquet(item);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-white/95 hover:bg-white text-[#2C2926] font-semibold text-xs shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAddToCart(item);
                      }}
                      className="p-2.5 rounded-xl bg-[#2E3F30] hover:bg-[#3D5240] text-white shadow-md transition-colors cursor-pointer"
                      title="Quick Add Classic"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C06043]">
                      {item.categoryLabel}
                    </div>
                    <h3
                      onClick={() => onSelectBouquet(item)}
                      className="font-serif text-lg font-bold text-[#2C2926] hover:text-[#C06043] transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#736E67] line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#736E67] block">Starting from</span>
                      <span className="font-serif text-xl font-bold text-[#2E3F30]">
                        ${item.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectBouquet(item)}
                      className="text-xs font-semibold text-[#2E3F30] group-hover:text-[#C06043] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Order</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
