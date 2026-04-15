"use client";

import React from "react";
import { Book } from "../lib/data";
import { Heart } from "lucide-react";

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isFavorite, onSelect, onAddToCart, onToggleFavorite }) => {
  return (
    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-stone-200/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-rust/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-rust">
          {book.category}
        </span>
      </div>
      {/* Cover Image */}
      <div 
        className="relative mb-6 aspect-[3/4] w-full overflow-hidden rounded-md bg-cream/70 cursor-pointer shadow-sm group-hover:shadow-xl transition-shadow duration-500"
        onClick={() => onSelect(book)}
      >
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow space-y-1">
        <h3 
          className="text-lg font-serif font-bold text-stone-900 cursor-pointer hover:text-rust transition-colors leading-tight"
          onClick={() => onSelect(book)}
        >
          {book.title}
        </h3>
        <p className="text-xs font-medium text-stone-400 font-sans tracking-wide">{book.author}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-cream/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-rust">${book.price.toFixed(2)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book);
            }}
            className="rounded-full p-2 text-stone-500 transition-colors duration-200 hover:text-rust"
            aria-label={isFavorite ? "ลบจากรายการโปรด" : "เพิ่มไปยังรายการโปรด"}
          >
            <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "text-rust" : "text-stone-400 hover:text-rust"}`} />
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(book);
          }}
          className="rounded-full bg-rust px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm shadow-rust/30 transition-all duration-200 hover:bg-rust/90"
        >
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
};
