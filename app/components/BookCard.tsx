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
    <div className="group flex flex-col justify-between overflow-hidden bg-transparent transition-all">
      {/* Cover Image */}
      <div 
        className="relative mb-6 aspect-[3/4] w-full overflow-hidden rounded-md bg-stone-100 cursor-pointer shadow-sm group-hover:shadow-xl transition-shadow duration-500"
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

      <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-rust">${book.price.toFixed(2)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book);
            }}
            className="rounded-full p-2 transition-colors duration-200"
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
          className="text-[10px] font-bold uppercase tracking-widest text-stone-900 flex items-center gap-1 hover:text-rust transition-colors"
        >
          เพิ่มลงตะกร้า <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </div>
  );
};
