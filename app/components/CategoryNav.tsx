"use client";

import React from "react";

const categories = ["หนังสือทั้งหมด", "อีบุ๊ก", "หนังสือเสียง", "นิยาย"];

interface CategoryNavProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="border-b border-stone-100 bg-stone-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center gap-1 py-1 sm:gap-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => onSelect(category)}
                className={`flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-inset ring-indigo-200"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
