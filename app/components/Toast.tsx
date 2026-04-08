"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl border border-stone-200 bg-white px-5 py-4 shadow-2xl shadow-stone-900/10">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {type === "success" ? "✓" : "!"}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">{message}</p>
        </div>
      </div>
    </div>
  );
};
