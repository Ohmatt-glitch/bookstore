"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/app/components/GoogleSignInButton";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          ยินดีต้อนรับ
        </h1>
        <p className="text-center text-gray-600 mb-8">
          เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ
        </p>

        {/* Google Sign In Button */}
        <GoogleSignInButton />

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-6">
          ยังไม่มีบัญชี?{" "}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            สร้างบัญชีใหม่
          </a>
        </p>
      </div>
    </div>
  );
}
