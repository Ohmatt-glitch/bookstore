"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/useAuth";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/app/components/GoogleSignInButton";

export default function LoginPage() {
  const { user, isAdmin, loading, error, signin } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if ((user || isAdmin) && !loading) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    try {
      await signin(username.trim(), password);
      router.push("/");
    } catch (err: any) {
      setLocalError(err?.message || "ไม่สามารถเข้าสู่ระบบได้ โปรดลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          เข้าสู่ระบบ
        </h1>
        <p className="text-center text-gray-600 mb-8">
          กรอกข้อมูลเพื่อเข้าสู่ระบบ หรือใช้บัญชี admin เพื่อเข้าถึงแดชบอร์ด
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล หรือ ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin123 หรือ your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          {(localError || error) && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="h-px w-10 bg-gray-300"></span>
            หรือ
            <span className="h-px w-10 bg-gray-300"></span>
          </div>
        </div>

        <GoogleSignInButton />

        <p className="text-center text-gray-600 mt-6">
          ยังไม่มีบัญชี?{" "}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            สร้างบัญชีใหม่
          </a>
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
          <p className="font-semibold">บัญชี admin:</p>
          <p>user: admin123</p>
          <p>password: 123456a</p>
        </div>
      </div>
    </div>
  );
}
