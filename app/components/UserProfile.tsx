"use client";

import { useAuth } from "@/app/lib/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function UserProfile() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {user.photoURL && (
        <Image
          src={user.photoURL}
          alt={user.displayName || "User"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-900">
          {user.displayName || user.email}
        </p>
        <button
          onClick={handleLogout}
          className="text-xs text-red-600 hover:text-red-700 transition-colors"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
