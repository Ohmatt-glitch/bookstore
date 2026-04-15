"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/lib/useAuth";
import { useFirebase } from "@/app/lib/FirebaseContext";
import { books, Book } from "@/app/lib/data";
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Navbar } from "@/app/components/Navbar";
import { BookGrid } from "@/app/components/BookGrid";
import { BookModal } from "@/app/components/BookModal";
import { Toast } from "@/app/components/Toast";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const { db } = useFirebase();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const favoritesRef = collection(db, "users", user.uid, "favorites");
    const favoritesQuery = query(favoritesRef);

    const unsubscribe = onSnapshot(
      favoritesQuery,
      (snapshot) => {
        const ids = snapshot.docs
          .map((doc) => Number(doc.id))
          .filter((id) => !Number.isNaN(id));
        setFavoriteIds(ids);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, user]);

  const favoriteBooks = useMemo(
    () =>
      books
        .filter((book) => favoriteIds.includes(book.id))
        .filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    [favoriteIds, searchQuery]
  );

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const handleToggleFavorite = async (book: Book) => {
    if (!user) return;
    const favoriteDoc = doc(db, "users", user.uid, "favorites", book.id.toString());

    try {
      await deleteDoc(favoriteDoc);
      showToast("ลบหนังสือออกจากรายการโปรดเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("ไม่สามารถลบจากรายการโปรดได้", error);
      showToast("เกิดข้อผิดพลาดขณะลบรายการโปรด กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  const handleAddToCart = () => {
    // สามารถขยายต่อได้ในอนาคต
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream font-sans text-stone-900">
        <Navbar
          cartCount={0}
          onSearch={() => {}}
          onCartClick={() => {}}
          selectedCategory="หนังสือทั้งหมด"
          onSelectCategory={() => {}}
        />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <p className="text-xl font-bold">กำลังตรวจสอบสถานะผู้ใช้...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream font-sans">
        <Navbar
          cartCount={0}
          onSearch={() => {}}
          onCartClick={() => {}}
          selectedCategory="หนังสือทั้งหมด"
          onSelectCategory={() => {}}
        />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="mb-4 text-3xl font-serif font-bold text-stone-900">รายการโปรดของคุณ</h1>
          <p className="mb-8 text-stone-500">คุณต้องเข้าสู่ระบบก่อนจึงจะดูและจัดการรายการโปรดได้</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-rust px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-rust/90 transition-all"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/"
              className="rounded-full border border-stone-300 px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-700 hover:border-rust hover:text-rust transition-all"
            >
              กลับสู่หน้าหลัก
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-sans transition-colors duration-500">
      <Navbar
        cartCount={0}
        onSearch={setSearchQuery}
        onCartClick={() => {}}
        selectedCategory="หนังสือทั้งหมด"
        onSelectCategory={() => {}}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-rust">Favorites</p>
            <h1 className="mt-4 text-4xl font-serif font-bold text-stone-900">หนังสือโปรดของฉัน</h1>
            <p className="mt-3 max-w-2xl text-sm text-stone-500">
              ดูหนังสือที่คุณเก็บไว้เป็นรายการโปรด พร้อมลบออกจากรายการได้ทันที
            </p>
          </div>
          <div className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm">
            {favoriteIds.length} รายการโปรด
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-white p-12 shadow-sm text-center text-stone-500">
            กำลังโหลดรายการโปรด...
          </div>
        ) : favoriteBooks.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <p className="text-xl font-semibold text-stone-900">
              {searchQuery ? "ไม่พบหนังสือที่ตรงกับการค้นหา" : "ยังไม่มีหนังสือโปรด"}
            </p>
            <p className="mt-2 text-stone-500">
              {searchQuery
                ? "ลองปรับคำค้นหาอีกครั้ง หรือเคลียร์ช่องค้นหาเพื่อดูหนังสือโปรดทั้งหมด"
                : "เพิ่มหนังสือโปรดจากหน้าร้านเพื่อเก็บไว้ในที่เดียว"}
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-rust px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-rust/90 transition-all"
            >
              กลับไปเลือกหนังสือ
            </Link>
          </div>
        ) : (
          <BookGrid
            books={favoriteBooks}
            favoriteIds={favoriteIds}
            onSelect={(book) => {
              setSelectedBook(book);
              setIsBookModalOpen(true);
            }}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      <BookModal
        book={selectedBook}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onAddToCart={(book) => {
          handleAddToCart();
          setIsBookModalOpen(false);
        }}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
