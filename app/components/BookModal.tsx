"use client";

import React from "react";
import { Book } from "../lib/data";
import { X, Info, Layers, BookOpen } from "lucide-react";

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 text-stone-300 hover:text-stone-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left: Image with Soft Background */}
          <div className="w-full md:w-5/12 bg-stone-50 p-8 sm:p-12 flex items-center justify-center border-r border-stone-100">
            <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-md shadow-2xl ring-1 ring-stone-200">
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-1 flex-col p-8 sm:p-12">
            <div className="mb-4 inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-rust">
              {book.category}
            </div>
            <h2 className="mb-4 text-4xl font-serif font-bold text-stone-900 leading-tight lg:text-5xl">
              {book.title}
            </h2>
            <p className="mb-8 text-lg font-medium text-stone-400">
              โดย {book.author}
            </p>

            <div className="mb-10 space-y-8">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-900">
                  <BookOpen className="h-3 w-3 text-rust" />
                  เรื่องย่อ
                </h3>
                <p className="text-base leading-relaxed text-stone-500 font-sans">
                  {book.synopsis}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-50">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.15em] text-stone-300">
                    <Layers className="h-3 w-3" />
                    รูปแบบ
                  </h3>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">{book.format}</p>
                </div>
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.15em] text-stone-300">
                    <Info className="h-3 w-3" />
                    รายละเอียด
                  </h3>
                  <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">{book.specs}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-stone-100">
              <div className="text-4xl font-serif font-bold text-stone-950">${book.price.toFixed(2)}</div>
              <button 
                onClick={() => onAddToCart(book)}
                className="flex items-center justify-center gap-3 rounded-md bg-rust px-10 py-5 text-xs font-bold font-sans uppercase tracking-[0.2em] text-white shadow-xl shadow-rust/10 transition-all hover:bg-rust/90 hover:shadow-rust/20 active:scale-[0.98]"
              >
                เพิ่มลงตะกร้า Sanctuary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
