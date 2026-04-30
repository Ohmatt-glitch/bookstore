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
        <div className="h-full w-screen max-w-sm transform transition-transform animate-in slide-in-from-right duration-500">
          <div className="flex h-full flex-col overflow-y-scroll bg-cream/95 shadow-2xl">
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="flex items-start justify-between">
                <div>
                   <h2 className="text-xl font-serif font-bold text-stone-900">ห้องสมุดของคุณ</h2>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300">หัวใจที่ได้รับการดูแล</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Menu Style */}
              <div className="mt-8 space-y-1">
                 {[
                   { icon: "/image/superman2png.png", label: "ตะกร้า", active: true, count: items.length, isImage: true },
                   { icon: "/image/superman_png.png", label: "สิ่งที่อยากได้", active: false, isImage: true },
                   { icon: Library, label: "ห้องสมุดของฉัน", active: false },
                   { icon: Settings, label: "ตั้งค่า", active: false },
                 ].map((item) => (
                   <div 
                     key={item.label}
                     className={`flex items-center justify-between rounded-md px-4 py-3 cursor-pointer transition-colors ${
                       item.active ? "bg-cream/90 text-teal-heavy" : "text-stone-400 hover:bg-cream/90"
                     }`}
                   >
                      <div className="flex items-center gap-4">
                         <item.icon className="h-4 w-4" />
                         <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] font-bold bg-teal-heavy text-white px-2 py-0.5 rounded-full">
                           {item.count}
                        </span>
                      )}
                   </div>
                 ))}
              </div>

              <div className="mt-12 border-t border-cream/70 pt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-300">เงียบสงบ...</p>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {items.map((item) => (
                      <li key={item.book.id} className="flex gap-4">
                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-cream/80 shadow-sm">
                          <img
                            src={item.book.image}
                            alt={item.book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-center">
                            <div className="flex justify-between">
                              <h3 className="line-clamp-1 text-[10px] font-bold uppercase tracking-wider text-stone-900">{item.book.title}</h3>
                              <p className="text-[10px] font-bold text-rust">${(item.book.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => onUpdateQuantity(item.book.id, -1)}
                                    className="text-stone-300 hover:text-rust transition-colors"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="text-[10px] font-bold text-stone-900">{item.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(item.book.id, 1)}
                                    className="text-stone-300 hover:text-rust transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                               </div>
                               <button 
                                  onClick={() => onRemoveItem(item.book.id)}
                                  className="text-stone-300 hover:text-red-400 transition-colors"
                               >
                                  <Trash2 className="h-3 w-3" />
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
              <div className="px-6 py-8 bg-cream/95 border-t border-cream/70">
                 <div className="mb-6 flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">รวมทั้งหมด</span>
                    <span className="text-xl font-serif font-bold text-stone-900">${total.toFixed(2)}</span>
                 </div>
                 <button
                    onClick={onCheckout}
                    className="w-full rounded-md bg-teal-heavy py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-teal-heavy/90 transition-all active:scale-[0.98]"
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
