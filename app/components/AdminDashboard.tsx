"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFirebase } from "@/app/lib/FirebaseContext";
import { Book } from "@/app/lib/data";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface AdminBook extends Book {
  docId: string;
}

export function AdminDashboard() {
  const { db, storage } = useFirebase();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [books, setBooks] = useState<AdminBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedBook, setSelectedBook] = useState<AdminBook | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    author: "",
    price: "0",
    category: "นิยาย",
    imageUrl: "",
    synopsis: "",
    format: "",
    specs: "",
  });

  const categories: Book["category"][] = ["อีบุ๊ก", "หนังสือเสียง", "นิยาย"];

  useEffect(() => {
    if (!isAdminLoggedIn) {
      setIsLoadingBooks(false);
      return;
    }

    const booksRef = collection(db, "books");
    const booksQuery = query(booksRef);

    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        const firestoreBooks = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            docId: docSnap.id,
            id: Number(data.id) || Date.now(),
            title: String(data.title || ""),
            author: String(data.author || ""),
            price: Number(data.price || 0),
            category: (String(data.category || "นิยาย") as Book["category"]),
            image: String(data.image || ""),
            synopsis: String(data.synopsis || ""),
            format: String(data.format || ""),
            specs: String(data.specs || ""),
          } as AdminBook;
        });

        setBooks(firestoreBooks);
        setIsLoadingBooks(false);
      },
      (error) => {
        console.error("ไม่สามารถโหลดข้อมูลหนังสือได้", error);
        setStatus({ type: "error", message: "เกิดข้อผิดพลาดขณะโหลดหนังสือ" });
        setIsLoadingBooks(false);
      }
    );

    return () => unsubscribe();
  }, [db, isAdminLoggedIn]);

  const resetForm = () => {
    setSelectedBook(null);
    setFormState({
      title: "",
      author: "",
      price: "0",
      category: "นิยาย",
      imageUrl: "",
      synopsis: "",
      format: "",
      specs: "",
    });
    setImageFile(null);
  };

  const handleSelectBook = (book: AdminBook) => {
    setSelectedBook(book);
    setFormState({
      title: book.title,
      author: book.author,
      price: String(book.price),
      category: book.category,
      imageUrl: book.image,
      synopsis: book.synopsis,
      format: book.format,
      specs: book.specs,
    });
    setImageFile(null);
    setStatus(null);
  };

  const handleFieldChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return formState.imageUrl;
    }

    const storageRef = ref(storage, `books/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdminLoggedIn) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const imageUrl = await uploadImage();
      const bookData = {
        title: formState.title.trim(),
        author: formState.author.trim(),
        price: Number(formState.price) || 0,
        category: formState.category as Book["category"],
        image: imageUrl,
        synopsis: formState.synopsis.trim(),
        format: formState.format.trim(),
        specs: formState.specs.trim(),
        id: selectedBook ? selectedBook.id : Date.now(),
      };

      if (selectedBook) {
        const bookDoc = doc(db, "books", selectedBook.docId);
        await setDoc(bookDoc, { ...bookData, updatedAt: serverTimestamp() }, { merge: true });
        setStatus({ type: "success", message: "อัปเดตหนังสือเรียบร้อยแล้ว" });
      } else {
        await addDoc(collection(db, "books"), { ...bookData, createdAt: serverTimestamp() });
        setStatus({ type: "success", message: "เพิ่มหนังสือเรียบร้อยแล้ว" });
      }

      resetForm();
    } catch (error: any) {
      console.error("ไม่สามารถบันทึกหนังสือได้", error);
      setStatus({ type: "error", message: error?.message || "เกิดข้อผิดพลาดขณะบันทึกหนังสือ" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBook || !isAdminLoggedIn) return;

    try {
      await deleteDoc(doc(db, "books", selectedBook.docId));
      setStatus({ type: "success", message: "ลบหนังสือเรียบร้อยแล้ว" });
      resetForm();
    } catch (error: any) {
      console.error("ไม่สามารถลบหนังสือได้", error);
      setStatus({ type: "error", message: error?.message || "เกิดข้อผิดพลาดขณะลบหนังสือ" });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === "admin" && loginPassword === "1234") {
      setIsAdminLoggedIn(true);
      setLoginError("");
      setIsLoadingBooks(true); // Trigger books reload
    } else {
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setLoginUsername("");
    setLoginPassword("");
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-24 text-stone-700">
        <div className="w-full max-w-md rounded-[2rem] border border-cream/70 bg-white/90 p-8 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-serif font-bold text-stone-950">เข้าสู่ระบบ Admin</h2>
          {loginError && (
            <div className="mb-4 rounded-xl bg-rose-100 p-3 text-sm text-rose-900 text-center">
              {loginError}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-stone-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700">รหัสผ่าน</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                placeholder="••••"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition hover:bg-rust/90"
            >
              เข้าสู่ระบบ
            </button>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-stone-500 hover:text-stone-700">
                กลับหน้าหลัก
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-cream/70 bg-white/90 p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-950">แดชบอร์ดผู้ดูแลระบบ</h1>
            <p className="mt-2 text-sm text-stone-600">เพิ่ม แก้ไข หรือลบหนังสือ พร้อมอัปโหลดรูปภาพผ่าน Firebase Storage</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="rounded-full border border-rust bg-rust/10 px-5 py-3 text-sm font-semibold text-rust transition hover:bg-rust/20">
              กลับหน้าหลัก
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-950"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        {status && (
          <div className={`mb-6 rounded-3xl px-6 py-4 text-sm font-medium ${status.type === "success" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
            {status.message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-cream/70 bg-white/90 p-8 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-stone-900">ฟอร์มจัดการหนังสือ</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-stone-700">
                  หัวเรื่อง
                  <input
                    value={formState.title}
                    onChange={(event) => handleFieldChange("title", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                    placeholder="ชื่อหนังสือ"
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-700">
                  ผู้แต่ง
                  <input
                    value={formState.author}
                    onChange={(event) => handleFieldChange("author", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                    placeholder="ชื่อผู้แต่ง"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block text-sm font-semibold text-stone-700">
                  ราคา
                  <input
                    type="number"
                    value={formState.price}
                    onChange={(event) => handleFieldChange("price", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-700">
                  หมวดหมู่
                  <select
                    value={formState.category}
                    onChange={(event) => handleFieldChange("category", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-stone-700">
                  รูปภาพของหนังสือ
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-stone-700">
                ลิงก์รูปภาพ
                <input
                  value={formState.imageUrl}
                  onChange={(event) => handleFieldChange("imageUrl", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                  placeholder="วาง URL รูปภาพ หรือเลือกไฟล์เพื่ออัปโหลด"
                />
              </label>

              <label className="block text-sm font-semibold text-stone-700">
                บทสรุปหนังสือ
                <textarea
                  value={formState.synopsis}
                  onChange={(event) => handleFieldChange("synopsis", event.target.value)}
                  className="mt-2 h-28 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                  placeholder="สรุปเนื้อหาสั้น ๆ"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-stone-700">
                  รูปแบบ
                  <input
                    value={formState.format}
                    onChange={(event) => handleFieldChange("format", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                    placeholder="ปกแข็ง / อีบุ๊ก / เสียง"
                  />
                </label>
                <label className="block text-sm font-semibold text-stone-700">
                  รายละเอียดเพิ่มเติม
                  <input
                    value={formState.specs}
                    onChange={(event) => handleFieldChange("specs", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
                    placeholder="จำนวนหน้า / ความยาว / ขนาดไฟล์"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition hover:bg-rust/90 disabled:cursor-not-allowed disabled:bg-rust/50"
                  >
                    {selectedBook ? "อัปเดตหนังสือ" : "เพิ่มหนังสือใหม่"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                  >
                    ล้างข้อมูล
                  </button>
                </div>
                {selectedBook && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full bg-rose-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
                  >
                    ลบหนังสือ
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-[2rem] border border-cream/70 bg-white/90 p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">รายการหนังสือทั้งหมด</h2>
                <p className="mt-1 text-sm text-stone-500">{books.length} รายการในฐานข้อมูล</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                สร้างใหม่
              </button>
            </div>

            <div className="space-y-4">
              {books.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-cream/80 p-6 text-center text-sm text-stone-600">
                  ยังไม่มีหนังสือในระบบ กรุณาเพิ่มหนังสือใหม่ด้านซ้าย
                </div>
              ) : (
                books.map((book) => (
                  <button
                    key={book.docId}
                    type="button"
                    onClick={() => handleSelectBook(book)}
                    className="w-full rounded-3xl border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-rust hover:bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 overflow-hidden rounded-xl bg-stone-100">
                        {book.image ? (
                          <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-stone-900">{book.title}</div>
                        <p className="mt-1 text-xs text-stone-500">{book.author} • {book.category}</p>
                      </div>
                      <div className="text-right text-sm font-semibold text-rust">{book.price.toFixed(2)} ฿</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
