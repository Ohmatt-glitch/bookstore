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
  const { user } = useAuth();
  const categories = ["อีบุ๊ก", "หนังสือเสียง", "นิยาย", "หนังสือทั้งหมด"];

  return (
    <nav className="w-full border-b border-stone-200 bg-cream py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onSelectCategory("หนังสือทั้งหมด")}>
          <h1 className="text-2xl font-serif font-bold italic text-rust tracking-tight">
            เดอะลิเทอรารีแซงชัวรี
          </h1>
        </div>

        {/* Search Bar - Centered */}
        <div className="mx-8 hidden flex-1 max-w-md relative lg:block">
          <input
            type="text"
            className="w-full rounded-full border border-stone-200 bg-stone-50/50 py-2 pl-4 pr-10 text-sm italic placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-rust/30"
            placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-stone-400" />
          </div>
        </div>

        {/* Categories & Actions */}
        <div className="flex items-center gap-6">
          <ul className="hidden xl:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-stone-600">
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

          <div className="flex items-center gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-stone-600 hover:text-rust transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user && (
              <Link
                href="/favorites"
                className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-rust"
              >
                รายการโปรด
              </Link>
            )}
            
            {user ? (
              <UserProfile />
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
