"use client";

import React from "react";
import { Book } from "../lib/data";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  favoriteIds: number[];
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, favoriteIds, onSelect, onAddToCart, onToggleFavorite }) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 p-12 text-center shadow-xl shadow-stone-200/40">
        <div className="mb-4 text-6xl opacity-20">📚</div>
        <h3 className="text-xl font-bold text-stone-900">ไม่พบหนังสือตามที่ค้นหา</h3>
        <p className="mt-2 max-w-md text-stone-500">ลองปรับคำค้นหา หรือเลือกหมวดหมู่อื่นดูค่ะ</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.includes(book.id)}
          onSelect={onSelect}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
