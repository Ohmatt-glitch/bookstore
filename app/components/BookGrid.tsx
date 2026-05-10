"use client";

import React, { useRef, useState } from "react";
import { Book } from "../lib/data";
import { BookCard } from "./BookCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookGridProps {
  books: Book[];
  favoriteIds: number[];
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, favoriteIds, onSelect, onAddToCart, onToggleFavorite }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(books.length > 0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:shadow-xl"
          aria-label="เลื่อนซ้าย"
        >
          <ChevronLeft className="w-6 h-6 text-rust" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth px-12 md:px-0 pb-4"
        style={{
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
        }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-shrink-0 w-full sm:w-80 md:w-72 lg:w-64"
            style={{ scrollSnapAlign: "start" }}
          >
            <BookCard
              book={book}
              isFavorite={favoriteIds.includes(book.id)}
              onSelect={onSelect}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:shadow-xl"
          aria-label="เลื่อนขวา"
        >
          <ChevronRight className="w-6 h-6 text-rust" />
        </button>
      )}
    </div>
  );
};
