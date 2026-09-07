/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Truck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { gaService } from '../services/googleAnalytics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'confirmation'>('cart');
  const [recipientAddress, setRecipientAddress] = useState('742 Evergreen Terrace, Suite 4B');
  const [recipientPhone, setRecipientPhone] = useState('(555) 382-9910');
  const [recipientName, setRecipientName] = useState('Jessica Miller');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave in shaded porch if not home.');
  const [orderConfirmedId, setOrderConfirmedId] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 65;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const deliveryFee = isFreeShipping || subtotal === 0 ? 0 : 12;
  const estimatedTax = Math.round(subtotal * 0.0825 * 100) / 100;
  const grandTotal = Math.round((subtotal + deliveryFee + estimatedTax) * 100) / 100;

  const handleStartCheckout = () => {
    setCheckoutStep('address');
    gaService.trackEvent('begin_checkout', {
      currency: 'USD',
      value: grandTotal,
      items: items.map((i) => ({
        item_id: i.bouquet.id,
        item_name: i.bouquet.name,
        price: i.unitPrice,
        quantity: i.quantity,
      })),
    });
  };

  const handleCompleteOrder = () => {
    const orderId = `BLOOM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmedId(orderId);
    setCheckoutStep('confirmation');

    // Track standard GA4 purchase event
    gaService.trackEvent('purchase', {
      transaction_id: orderId,
      value: grandTotal,
      tax: estimatedTax,
      shipping: deliveryFee,
      currency: 'USD',
      items: items.map((i) => ({
        item_id: i.bouquet.id,
        item_name: i.bouquet.name,
        item_category: i.bouquet.categoryLabel,
        price: i.unitPrice,
        quantity: i.quantity,
      })),
    });

    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E4DD] animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E4DD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2E3F30]" />
            <h3 className="font-serif text-xl font-bold text-[#2C2926]">
              {checkoutStep === 'confirmation' ? 'Order Confirmed!' : 'Your Botanical Bag'}
            </h3>
            {checkoutStep === 'cart' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F6F2] font-semibold text-[#5A554E]">
                {items.reduce((sum, i) => sum + i.quantity, 0)} stems
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F3F6F2] text-[#5A554E] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {checkoutStep === 'cart' && items.length > 0 && (
          <div className="bg-[#FAF1ED] p-3.5 border-b border-[#EADAD2] text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-[#A24B31]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                {isFreeShipping
                  ? 'Unlocked: Complimentary Same-Day Delivery!'
                  : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Delivery!`}
              </span>
              <span>{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
            </div>
            <div className="w-full bg-[#E8D6CE] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C06043] h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutStep === 'confirmation' ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C06043]">
                  Fresh Blooms on the Way!
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#2C2926]">
                  Thank You for Supporting Local Floriculture!
                </h4>
                <p className="text-xs text-[#5A554E] leading-relaxed max-w-xs mx-auto">
                  Your order <span className="font-mono font-bold text-[#2C2926]">{orderConfirmedId}</span> has been dispatched to our floral designer. A confirmation was sent and logged in Google Analytics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8E4DD] text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#2E3F30] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#C06043]" /> Next Florist Steps:
                </div>
                <p className="text-[#736E67]">
                  • Hand-trimming stems & dipping in nutrient hydration bath.<br />
                  • Calligraphy handwritten card being prepared.<br />
                  • Same-day courier dispatch with temperature control.
                </p>
              </div>

              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full py-3 rounded-full bg-[#2E3F30] text-white text-xs font-semibold hover:bg-[#3D5240] transition-colors cursor-pointer"
              >
                Continue Browsing Stems
              </button>
            </div>
          ) : checkoutStep === 'address' ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DD]">
                <span className="font-semibold text-sm text-[#2C2926]">
                  Courier Delivery Details
                </span>
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-[#C06043] font-medium underline cursor-pointer"
                >
                  Back to Bag
                </button>
              </div>

              <div>
                <label className="font-semibold text-[#5A554E] block mb-1">
                  Recipient Full Name:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5A554E] block mb-1">
                  Street Address & Unit:
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5A554E] block mb-1">
                  Recipient Phone (For Delivery Courier):
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5A554E] block mb-1">
                  Delivery Gate / Porch Instructions:
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30]"
                />
              </div>

              <div className="p-3 bg-[#F3F6F2] rounded-xl border border-[#D5DDD2] text-[11px] text-[#4B634E] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  All flower arrangements travel in standing water transport cones to guarantee bloom freshness upon doorstep arrival.
                </span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="text-4xl">🌷</div>
              <h4 className="font-serif text-lg font-bold text-[#2C2926]">Your bag is currently empty</h4>
              <p className="text-xs text-[#736E67] max-w-xs mx-auto">
                Explore our morning harvest of fresh seasonal peonies, English garden roses, and wildflowers.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#2E3F30] text-white text-xs font-semibold hover:bg-[#3D5240] transition-colors cursor-pointer"
              >
                Discover Arrangements
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-[#E8E4DD] flex gap-3 shadow-2xs"
                >
                  <img
                    src={item.bouquet.imageUrl}
                    alt={item.bouquet.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif text-sm font-bold text-[#2C2926] truncate">
                        {item.bouquet.name}
                      </h4>
                      <button
                        onClick={() => {
                          onRemoveItem(item.id);
                          gaService.trackEvent('remove_from_cart', {
                            item_id: item.bouquet.id,
                            item_name: item.bouquet.name,
                          });
                        }}
                        className="text-[#9E988F] hover:text-rose-600 transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#736E67] flex items-center gap-2">
                      <span className="capitalize">{item.size}</span>
                      {item.includeVase && <span>• Includes Vase</span>}
                    </div>

                    {item.giftMessage && (
                      <p className="text-[10px] text-[#A24B31] italic truncate">
                        Note: &ldquo;{item.giftMessage}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-[#D5DDD2] rounded-md bg-[#FAF8F5] text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-[#736E67] hover:text-black cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-[#2C2926]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#736E67] hover:text-black cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif font-bold text-[#2E3F30] text-sm">
                        ${item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {checkoutStep !== 'confirmation' && items.length > 0 && (
          <div className="p-5 border-t border-[#E8E4DD] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#5A554E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#2C2926]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E4DD] flex justify-between text-sm font-bold text-[#2C2926]">
                <span className="font-serif text-base">Total</span>
                <span className="font-serif text-lg text-[#C06043]">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-3.5 rounded-full bg-[#2E3F30] hover:bg-[#3D5240] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Delivery & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-3.5 rounded-full bg-[#C06043] hover:bg-[#A24B31] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Flower Order • ${grandTotal.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
