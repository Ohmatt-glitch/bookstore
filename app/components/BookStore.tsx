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

const PILLS = ["หนังสือทั้งหมด", "มาใหม่", "ได้รับรางวัล", "ของดีแนะนำ", "หายาก", "คลาสสิก"];

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
  const [remoteBooks, setRemoteBooks] = useState<Book[]>([]);
  const [remoteBooksLoaded, setRemoteBooksLoaded] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const { db } = useFirebase();

  useEffect(() => {
    if (!db || !user) {
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
    if (!db) return;
    
    const booksRef = collection(db, "books");
    const booksQuery = query(booksRef);

    const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
      const firestoreBooks = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: Number(data.id) || Date.now(),
          title: String(data.title || ""),
          author: String(data.author || ""),
          price: Number(data.price || 0),
          category: (String(data.category || "นิยาย") as Book["category"]),
          image: String(data.image || ""),
          synopsis: String(data.synopsis || ""),
          format: String(data.format || ""),
          specs: String(data.specs || ""),
        } as Book;
      });

      setRemoteBooks(firestoreBooks);
      setRemoteBooksLoaded(true);
    });

    return () => unsubscribe();
  }, [db]);

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
  const activeBooks = useMemo(() => {
    return remoteBooksLoaded ? remoteBooks : books;
  }, [remoteBooks, remoteBooksLoaded]);

  const filteredBooks = useMemo(() => {
    return activeBooks.filter((book) => {
      const matchesCategory =
        selectedCategory === "หนังสือทั้งหมด" || book.category === selectedCategory;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, activeBooks]);

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
    <div className="relative min-h-screen bg-cream font-sans transition-colors duration-500 store-shell">
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

      <div className="pointer-events-none absolute inset-x-0 top-40 -z-10 hidden lg:block">
        <div className="absolute left-16 top-0 h-56 w-56 rounded-full bg-rust/10 blur-3xl" />
        <div className="absolute right-24 top-24 h-48 w-48 rounded-full bg-teal-heavy/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="section-surface rounded-[2rem] border border-cream/70 p-8 shadow-xl overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-rust opacity-85">
                ห้องอ่านของเรา
              </p>
              <h2 className="text-4xl font-serif font-bold tracking-tight text-stone-950 sm:text-5xl">
                ร้านหนังสือที่อบอุ่นและเต็มไปด้วยเรื่องเล่า
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                คัดสรรหนังสือดีจากทุกแนว ทั้งนิยาย เสียง และอีบุ๊ก เพื่อมอบพื้นที่พักใจให้กับคนรักการอ่านและสร้างแรงบันดาลใจในทุกหน้ากระดาษ
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-panel rounded-[1.75rem] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-heavy">คัดสรรพิเศษ</p>
                <h3 className="mt-4 text-xl font-semibold text-stone-950">อ่านสบายในทุกวิถี</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">พบหนังสือที่ตอบโจทย์ไลฟ์สไตล์ ทั้งอ่านผ่อนคลายและจุดประกายความคิด</p>
              </div>
              <div className="glass-panel rounded-[1.75rem] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-rust">บริการลูกค้า</p>
                <h3 className="mt-4 text-xl font-semibold text-stone-950">ส่งไวทั่วไทย</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">สั่งวันนี้ พรุ่งนี้รับได้ทันใจ พร้อมห่อของขวัญสวยงาม</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero Carousel Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-4">
        <AdCarousel />
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="section-surface rounded-[2rem] border border-cream/70 p-6 shadow-xl">
          <div className="mb-10 border-b border-cream/70 pb-8 flex flex-wrap items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              {PILLS.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSelectedCategory(pill)}
                  className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${selectedCategory === pill
                    ? "bg-rust/10 text-rust shadow-sm shadow-rust/10"
                    : "bg-white/80 text-stone-500 hover:bg-white"
                    }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-stone-500">
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
        </div>
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
      <footer className="mt-24 border-t border-cream/70 bg-cream/80 py-16">
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
