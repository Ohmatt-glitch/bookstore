"use client";

import React from "react";
import { Book } from "../lib/data";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, onSelect, onAddToCart }) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-6xl opacity-20">📚</div>
        <h3 className="text-xl font-bold text-stone-900">No books found</h3>
        <p className="mt-2 text-stone-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={onSelect}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
