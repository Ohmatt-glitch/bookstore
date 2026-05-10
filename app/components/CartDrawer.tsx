"use client";

import React from "react";
import { Book } from "../lib/data";
import { X, ShoppingBag, Heart, Library, Settings, Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full pl-10">
        <div className="h-full w-screen max-w-xs sm:max-w-sm transform transition-transform animate-in slide-in-from-right duration-500">
          <div className="flex h-full flex-col overflow-y-scroll bg-cream/95 shadow-2xl">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                   <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">ห้องสมุด</h2>
                   <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-300">หัวใจของคุณ</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 rounded-full p-1.5 sm:p-2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Sidebar Menu Style */}
              <div className="mt-6 sm:mt-8 space-y-1">
                 {[
                   { icon: "/image/superman2png.png", label: "ตะกร้า", active: true, count: items.length, isImage: true },
                   { icon: "/image/superman_png.png", label: "สิ่งที่อยากได้", active: false, isImage: true },
                   { icon: Library, label: "ห้องสมุด", active: false },
                   { icon: Settings, label: "ตั้งค่า", active: false },
                 ].map((item) => (
                   <div 
                     key={item.label}
                     className={`flex items-center justify-between rounded-md px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition-colors ${
                       item.active ? "bg-cream/90 text-teal-heavy" : "text-stone-400 hover:bg-cream/90"
                     }`}
                   >
                      <div className="flex items-center gap-3 sm:gap-4">
                         <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                         <span className="text-[8px] sm:text-xs font-bold uppercase tracking-widest">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[7px] sm:text-[10px] font-bold bg-teal-heavy text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                           {item.count}
                        </span>
                      )}
                   </div>
                 ))}
              </div>

              <div className="mt-8 sm:mt-12 border-t border-cream/70 pt-6 sm:pt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-widest text-stone-300">เงียบสงบ...</p>
                  </div>
                ) : (
                  <ul className="space-y-4 sm:space-y-6">
                    {items.map((item) => (
                      <li key={item.book.id} className="flex gap-3 sm:gap-4">
                        <div className="h-14 w-10 sm:h-16 sm:w-12 flex-shrink-0 overflow-hidden rounded-sm bg-cream/80 shadow-sm">
                          <img
                            src={item.book.image}
                            alt={item.book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-center">
                            <div className="flex justify-between gap-2">
                              <h3 className="line-clamp-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-900">{item.book.title}</h3>
                              <p className="text-[8px] sm:text-[10px] font-bold text-rust flex-shrink-0">${(item.book.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="mt-1.5 sm:mt-2 flex items-center justify-between">
                               <div className="flex items-center gap-1.5 sm:gap-2">
                                  <button 
                                    onClick={() => onUpdateQuantity(item.book.id, -1)}
                                    className="text-stone-300 hover:text-rust transition-colors"
                                  >
                                    <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </button>
                                  <span className="text-[8px] sm:text-[10px] font-bold text-stone-900">{item.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(item.book.id, 1)}
                                    className="text-stone-300 hover:text-rust transition-colors"
                                  >
                                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </button>
                               </div>
                               <button 
                                  onClick={() => onRemoveItem(item.book.id)}
                                  className="text-stone-300 hover:text-red-400 transition-colors"
                               >
                                  <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                               </button>
                            </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-6 sm:py-8 bg-cream/95 border-t border-cream/70">
                 <div className="mb-4 sm:mb-6 flex justify-between items-baseline">
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-400">รวม</span>
                    <span className="text-lg sm:text-xl font-serif font-bold text-stone-900">${total.toFixed(2)}</span>
                 </div>
                 <button
                    onClick={onCheckout}
                    className="w-full rounded-md bg-teal-heavy py-3 sm:py-4 text-[8px] sm:text-xs font-bold uppercase tracking-widest text-white shadow-lg sm:shadow-xl hover:bg-teal-heavy/90 transition-all active:scale-[0.98]"
                 >
                    ชำระเงินเลย
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
