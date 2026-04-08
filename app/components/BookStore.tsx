"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { books, Book } from "../lib/data";
import { Navbar } from "./Navbar";
import { BookGrid } from "./BookGrid";
import { BookModal } from "./BookModal";
import { CartDrawer } from "./CartDrawer";
import { CheckoutFlow } from "./CheckoutFlow";
import { AdCarousel } from "./AdCarousel";
import { Toast } from "./Toast";
import { useAuth } from "../lib/useAuth";
import { useFirebase } from "../lib/FirebaseContext";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  getDoc,
} from "firebase/firestore";

interface CartItem {
  book: Book;
  quantity: number;
}

const PILLS = ["มาใหม่", "ได้รับรางวัล", "ของดีแนะนำ", "หายาก", "คลาสสิก"];

export const BookStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("หนังสือทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const router = useRouter();
  const { user } = useAuth();
  const { db } = useFirebase();

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    const favoritesRef = collection(db, "users", user.uid, "favorites");
    const favoritesQuery = query(favoritesRef);

    const unsubscribe = onSnapshot(favoritesQuery, (snapshot) => {
      const ids = snapshot.docs
        .map((doc) => Number(doc.id))
        .filter((id) => !Number.isNaN(id));
      setFavoriteIds(ids);
    });

    return () => unsubscribe();
  }, [db, user]);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const cartRef = collection(db, "users", user.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          book: {
            id: Number(docSnap.id),
            title: data.title,
            author: data.author,
            image: data.image,
            price: data.price,
            category: data.category,
            synopsis: data.synopsis,
            format: data.format,
            specs: data.specs,
          } as Book,
          quantity: data.quantity ?? 1,
        };
      });

      setCart(items);
    });

    return () => unsubscribe();
  }, [db, user]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const toggleFavorite = async (book: Book) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const favoriteDoc = doc(db, "users", user.uid, "favorites", book.id.toString());

    try {
      if (favoriteIds.includes(book.id)) {
        await deleteDoc(favoriteDoc);
        showToast("ลบหนังสือออกจากรายการโปรดเรียบร้อยแล้ว", "success");
      } else {
        await setDoc(favoriteDoc, {
          bookId: book.id,
          title: book.title,
          author: book.author,
          image: book.image,
          price: book.price,
          category: book.category,
          addedAt: serverTimestamp(),
        });
        showToast("เพิ่มหนังสือลงรายการโปรดเรียบร้อยแล้ว", "success");
      }
    } catch (error) {
      console.error("ไม่สามารถอัพเดตรายการโปรดได้", error);
      showToast("เกิดข้อผิดพลาดขณะอัพเดตรายการโปรด กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

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
  const addToCart = async (book: Book) => {
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าในตะกร้า", "error");
      router.push("/login");
      return;
    }

    const cartDoc = doc(db, "users", user.uid, "cart", book.id.toString());

    try {
      const existing = await getDoc(cartDoc);
      const nextQuantity = existing.exists()
        ? (existing.data().quantity ?? 0) + 1
        : 1;

      await setDoc(
        cartDoc,
        {
          bookId: book.id,
          title: book.title,
          author: book.author,
          image: book.image,
          price: book.price,
          category: book.category,
          synopsis: book.synopsis,
          format: book.format,
          specs: book.specs,
          quantity: nextQuantity,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      showToast("เพิ่มหนังสือลงตะกร้าเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("ไม่สามารถเพิ่มหนังสือลงตะกร้าได้", error);
      showToast("เกิดข้อผิดพลาดขณะเพิ่มสินค้า กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  const updateQuantity = async (id: number, delta: number) => {
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบเพื่อจัดการตะกร้า", "error");
      router.push("/login");
      return;
    }

    const cartDoc = doc(db, "users", user.uid, "cart", id.toString());
    const existing = cart.find((item) => item.book.id === id);
    if (!existing) return;

    const nextQuantity = Math.max(0, existing.quantity + delta);

    try {
      if (nextQuantity === 0) {
        await deleteDoc(cartDoc);
      } else {
        await setDoc(
          cartDoc,
          {
            quantity: nextQuantity,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("ไม่สามารถอัปเดตจำนวนสินค้าได้", error);
      showToast("เกิดข้อผิดพลาดขณะปรับจำนวนสินค้าตะกร้า", "error");
    }
  };

  const removeFromCart = async (id: number) => {
    if (!user) {
      showToast("กรุณาเข้าสู่ระบบเพื่อจัดการตะกร้า", "error");
      router.push("/login");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", id.toString()));
    } catch (error) {
      console.error("ไม่สามารถลบสินค้าจากตะกร้าได้", error);
      showToast("เกิดข้อผิดพลาดขณะลบสินค้า กรุณาลองใหม่อีกครั้ง", "error");
    }
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
        onCartClick={() => {
          if (!user) {
            showToast("กรุณาเข้าสู่ระบบเพื่อดูตะกร้า", "error");
            router.push("/login");
            return;
          }
          setIsCartOpen(true);
        }}
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
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${pill === "มาใหม่"
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
          favoriteIds={favoriteIds}
          onSelect={handleSelectBook}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
