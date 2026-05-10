"use client";

import React from "react";
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/lib/useAuth";
import { UserProfile } from "./UserProfile";

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
  onCartClick: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onSearch, 
  onCartClick, 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { user, isAdmin, logout } = useAuth();
  const categories = ["อีบุ๊ก", "หนังสือเสียง", "นิยาย", "หนังสือทั้งหมด"];

  return (
    <nav className="w-full border-b border-cream/70 bg-cream/95 backdrop-blur-xl py-3 sm:py-4 shadow-sm shadow-stone-200/50">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onSelectCategory("หนังสือทั้งหมด")}>
          <h1 className="text-lg sm:text-2xl font-serif font-bold italic text-rust tracking-tight">
            เดอะลิเทอรารี
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:mx-4 sm:flex-1 sm:max-w-md relative">
          <input
            type="text"
            className="w-full rounded-full border border-cream/70 bg-cream/90 py-2 pl-3 pr-10 text-xs sm:text-sm italic placeholder-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-rust/20"
            placeholder="ค้นหา..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-3 w-3 sm:h-4 sm:w-4 text-stone-400" />
          </div>
        </div>

        {/* Categories & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ul className="hidden lg:flex items-center gap-3 lg:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-600">
            {categories.map((cat) => (
              <li 
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`cursor-pointer transition-colors hover:text-rust ${selectedCategory === cat ? "text-rust border-b-2 border-rust pb-0.5" : ""}`}
              >
                {cat}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 text-stone-600 hover:text-rust transition-colors"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-rust text-[6px] sm:text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user && (
              <>
                <Link
                  href="/favorites"
                  className="hidden sm:inline-block text-[8px] sm:text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-rust"
                >
                  โปรด
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-block text-[8px] sm:text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-rust"
              >
                แดชบอร์ด
              </Link>
            )}
            
            {user ? (
              <UserProfile />
            ) : isAdmin ? (
              <button
                onClick={logout}
                className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-rust"
              >
                ออกจากระบบ
              </button>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-rust">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/signup" className="rounded-full bg-rust px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-rust/90 transition-all shadow-sm">
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
