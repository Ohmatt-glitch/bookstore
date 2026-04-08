"use client";

import React, { useState, useMemo } from "react";
import { books, Book } from "../lib/data";
import { Navbar } from "./Navbar";
import { BookGrid } from "./BookGrid";
import { BookModal } from "./BookModal";
import { CartDrawer } from "./CartDrawer";
import { CheckoutFlow } from "./CheckoutFlow";
import { AdCarousel } from "./AdCarousel";

interface CartItem {
  book: Book;
  quantity: number;
}

const PILLS = ["มาใหม่", "ได้รับรางวัล", "ทางร้านแนะนำ", "หายาก", "คลาสสิก"];

export const BookStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("หนังสือทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filtering Logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === "หนังสือทั้งหมด" || book.category === selectedCategory;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart Logic
  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.book.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.book.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  }, [cart]);

  // Modal Handlers
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-cream font-sans transition-colors duration-500">
      <Navbar 
        cartCount={totalCartItems} 
        onSearch={setSearchQuery} 
        onCartClick={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {/* Main Hero Carousel Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4">
         <AdCarousel />
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-stone-200 pb-8 flex flex-wrap items-center justify-between gap-4">
           {/* Category Pills */}
           <div className="flex flex-wrap gap-3">
              {PILLS.map((pill) => (
                <button
                  key={pill}
                  className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                    pill === "มาใหม่"
                      ? "bg-pill-cyan text-teal-heavy" 
                      : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                  }`}
                >
                  {pill}
                </button>
              ))}
           </div>
           
           <div className="text-xs font-bold uppercase tracking-widest text-stone-300">
              {selectedCategory} — แสดงผลลัพธ์ {filteredBooks.length} รายการ
           </div>
        </div>

        <BookGrid 
          books={filteredBooks} 
          onSelect={handleSelectBook} 
          onAddToCart={addToCart} 
        />
      </main>

      {/* Overlays */}
      <BookModal 
        book={selectedBook} 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        onAddToCart={(book) => {
          addToCart(book);
          setIsBookModalOpen(false);
        }}
      />

      <CartDrawer 
        items={cart} 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onUpdateQuantity={updateQuantity} 
        onRemoveItem={removeFromCart} 
        onCheckout={() => {
          if (cart.length > 0) {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }
        }}
      />

      <CheckoutFlow 
        total={totalCartPrice} 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSuccess={handleCheckoutSuccess} 
      />

      {/* Footer */}
      <footer className="mt-24 border-t border-stone-200 bg-stone-100/50 py-16">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-serif font-bold italic text-rust">เดอะลิเทอรารีแซงชัวรี</h3>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  © 2026 THE LITERARY SANCTUARY คัดสรรมาเพื่อการสัมผัสแห่งการอ่าน
                </p>
              </div>
              <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <span className="cursor-pointer hover:text-rust transition-colors">นโยบายความเป็นส่วนตัว</span>
                <span className="cursor-pointer hover:text-rust transition-colors">เงื่อนไขการให้บริการ</span>
                <span className="cursor-pointer hover:text-rust transition-colors">การจัดส่ง</span>
                <span className="cursor-pointer hover:text-rust transition-colors">เรื่องราวของเรา</span>
              </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
