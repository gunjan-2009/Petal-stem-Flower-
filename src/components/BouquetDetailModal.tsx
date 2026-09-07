/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Plus, Minus, Check, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { BouquetItem, BouquetSize } from '../types';
import { gaService } from '../services/googleAnalytics';

interface BouquetDetailModalProps {
  bouquet: BouquetItem | null;
  onClose: () => void;
  onAddToCart: (
    bouquet: BouquetItem,
    size: BouquetSize,
    unitPrice: number,
    quantity: number,
    includeVase: boolean,
    giftMessage: string,
    recipientName: string,
    deliveryDate: string
  ) => void;
}

export const BouquetDetailModal: React.FC<BouquetDetailModalProps> = ({
  bouquet,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<BouquetSize>('classic');
  const [includeVase, setIncludeVase] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [giftMessage, setGiftMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  useEffect(() => {
    if (bouquet) {
      setSelectedSize('classic');
      setIncludeVase(bouquet.vaseIncludedDefault);
      setQuantity(1);
      setIsAddedSuccess(false);

      // Track view_item GA4 event
      gaService.trackEvent('view_item', {
        currency: 'USD',
        value: bouquet.price,
        items: [
          {
            item_id: bouquet.id,
            item_name: bouquet.name,
            item_category: bouquet.categoryLabel,
            price: bouquet.price,
            quantity: 1,
          },
        ],
      });
    }
  }, [bouquet]);

  if (!bouquet) return null;

  // Calculate price based on size + vase
  let basePrice = bouquet.price;
  if (selectedSize === 'deluxe') basePrice = bouquet.deluxePrice;
  if (selectedSize === 'grandLuxe') basePrice = bouquet.grandLuxePrice;

  const vaseCost = includeVase && !bouquet.vaseIncludedDefault ? bouquet.vasePrice : 0;
  const unitPrice = basePrice + vaseCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      bouquet,
      selectedSize,
      unitPrice,
      quantity,
      includeVase,
      giftMessage,
      recipientName,
      deliveryDate
    );

    // Track add_to_cart GA4 event
    gaService.trackEvent('add_to_cart', {
      currency: 'USD',
      value: totalPrice,
      items: [
        {
          item_id: bouquet.id,
          item_name: bouquet.name,
          item_category: bouquet.categoryLabel,
          item_variant: selectedSize,
          price: unitPrice,
          quantity: quantity,
          include_vase: includeVase,
        },
      ],
    });

    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E8E4DD] overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#2C2926] flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left: Image & Stem Breakdown */}
          <div className="md:col-span-6 bg-[#F3F6F2] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E4DD]">
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/4] shadow-md border border-white/60 group">
                <img
                  src={bouquet.imageUrl}
                  alt={bouquet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF8F5]/90 text-[#2E3F30] backdrop-blur-xs">
                    {bouquet.categoryLabel}
                  </span>
                  {bouquet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#2E3F30]/80 text-[#FAF8F5] backdrop-blur-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stem Ingredients */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#736E67]">
                  Flower Varieties Included in this Harvest:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {bouquet.includes.map((stem) => (
                    <span
                      key={stem}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#D5DDD2] text-[#2E3F30] font-medium"
                    >
                      🌿 {stem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Care Instructions */}
              <div className="bg-white p-4 rounded-xl border border-[#E8E4DD] text-xs space-y-1">
                <div className="font-semibold text-[#2C2926] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C06043]" /> Florist Care Note:
                </div>
                <p className="text-[#5A554E] leading-relaxed">{bouquet.careGuide}</p>
                <p className="text-[11px] text-[#736E67] pt-1">
                  Arrangement Dimensions: {bouquet.dimensions}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Customization & Order Options */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#736E67] mb-1">
                  <span className="text-amber-500 font-bold">★ {bouquet.rating}</span>
                  <span>({bouquet.reviewCount} reviews)</span>
                  <span>•</span>
                  <span>{bouquet.seasonality}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2926]">
                  {bouquet.name}
                </h3>
                <p className="text-sm text-[#5A554E] mt-1 leading-relaxed">{bouquet.description}</p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736E67] block">
                  Select Arrangement Size:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('classic')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSize === 'classic'
                        ? 'border-[#2E3F30] bg-[#F3F6F2] ring-1 ring-[#2E3F30]'
                        : 'border-[#D5DDD2] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#2C2926]">Classic</div>
                    <div className="text-[11px] text-[#736E67]">Standard Stems</div>
                    <div className="text-sm font-serif font-bold text-[#C06043] mt-1">
                      ${bouquet.price}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSize('deluxe')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      selectedSize === 'deluxe'
                        ? 'border-[#2E3F30] bg-[#F3F6F2] ring-1 ring-[#2E3F30]'
                        : 'border-[#D5DDD2] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 text-[9px] bg-[#C06043] text-white px-1.5 py-0.2 rounded-full font-bold uppercase">
                      Popular
                    </span>
                    <div className="text-xs font-bold text-[#2C2926]">Deluxe</div>
                    <div className="text-[11px] text-[#736E67]">+35% Blooms</div>
                    <div className="text-sm font-serif font-bold text-[#C06043] mt-1">
                      ${bouquet.deluxePrice}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSize('grandLuxe')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSize === 'grandLuxe'
                        ? 'border-[#2E3F30] bg-[#F3F6F2] ring-1 ring-[#2E3F30]'
                        : 'border-[#D5DDD2] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#2C2926]">Grand Luxe</div>
                    <div className="text-[11px] text-[#736E67]">Showstopper</div>
                    <div className="text-sm font-serif font-bold text-[#C06043] mt-1">
                      ${bouquet.grandLuxePrice}
                    </div>
                  </button>
                </div>
              </div>

              {/* Vase Option */}
              {!bouquet.vaseIncludedDefault && (
                <div className="p-3.5 rounded-xl border border-[#D5DDD2] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="vase-toggle"
                      checked={includeVase}
                      onChange={(e) => setIncludeVase(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2E3F30] focus:ring-[#2E3F30] border-[#CCD8C9]"
                    />
                    <label htmlFor="vase-toggle" className="text-xs cursor-pointer">
                      <span className="font-semibold text-[#2C2926] block">
                        Add French Fluted Glass Vase (+$18)
                      </span>
                      <span className="text-[#736E67] text-[11px]">
                        Arrives arranged in water ready to display immediately
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Recipient and Card Message (Optional) */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#736E67] block mb-1">
                      Recipient Name (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#736E67] block mb-1">
                      Preferred Delivery Date:
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#736E67] flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[#C06043]" /> Handwritten Botanical Card:
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Free with order</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={160}
                    placeholder="Write a heartfelt gift note for our florist to pen with calligraphy ink..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                  />
                  <div className="text-[10px] text-right text-[#736E67]">
                    {giftMessage.length}/160 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-[#E8E4DD] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#736E67]">Total Price</div>
                  <div className="text-2xl font-serif font-bold text-[#2C2926]">
                    ${totalPrice}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-[#D5DDD2] rounded-full bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#5A554E] hover:bg-[#F3F6F2] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#2C2926]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#5A554E] hover:bg-[#F3F6F2] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isAddedSuccess}
                className={`w-full py-3.5 rounded-full font-medium text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isAddedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#2E3F30] hover:bg-[#3D5240] text-white hover:shadow-lg'
                }`}
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Botanical Bag!
                  </>
                ) : (
                  <>Add to Arrangement Bag • ${totalPrice}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
